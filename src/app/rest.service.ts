import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export const endpoint = 'http://localhost:8080';
export const endpointSOLR = 'http://localhost:8983';

const httpOptionsReading = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',    
  })
};

@Directive()
@Injectable({
  providedIn: 'root'
})

export class RestService {


  @Output() logged : EventEmitter<any> = new EventEmitter();
  @Output() email : EventEmitter<any> = new EventEmitter();
  @Output() name : EventEmitter<any> = new EventEmitter();
  @Output() pendencies: EventEmitter<any> = new EventEmitter();

  isLogged: boolean;
  hasPendencies: boolean;

  constructor(private http: HttpClient) { 
    this.isLogged = false;
    this.hasPendencies = false;
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getHttpOptionsWithToken() {
    return {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json',    
      })
    };
  }

  getHttpOptionsSolr() { 
    return {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + localStorage.getItem('token'),
        'Content-Type': 'application/json',    
      })
    };
  }

  getID(): Observable<any> {
    return this.http.post<any>(endpoint + '/documents/new', "{\"id\":\"any\"}", this.getHttpOptionsWithToken()).pipe(
      tap(() => console.log('getID')),
      catchError((err) => {
        return throwError(err);    //Rethrow it back to component
      })
    );
  }
  
  getSearchText(searchText): Observable<any> {
    return this.http.post<any>(endpoint + '/search', "{\"searchText\":\"" + searchText + "\"}", this.getHttpOptionsWithToken()).pipe(
      tap(() => console.log('getSearchText')),
      catchError((err) => {
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  saveSearchText(product): Observable<any> {
    console.log(product)
    return this.http.post<any>(endpointSOLR + '/solr/Search/update?commitWithin=1000&overwrite=true&wt=json', product, this.getHttpOptionsSolr()).pipe(
      tap(() => console.log('saveSearchText')),
      catchError((err) => {
        return throwError(err);    //Rethrow it back to component
      })
    );
  }


  addDocument(product, id, edit): Observable<any> {
    // console.log("Lets begin");
    // console.log(product);
    return this.http.post<any>(endpoint + '/documents/' + id + edit, product, this.getHttpOptionsWithToken()).pipe(
      tap((product) => console.log("addProduct")),
      catchError(this.handleError<any>('addProduct'))
    );
  }

  addDocumentSOLR(product): Observable<any> {
    // console.log("Lets add to solr");
    // console.log(product);
    return this.http.post<any>(endpointSOLR + '/solr/DocumentTinyDto/update?commitWithin=1000&overwrite=true&wt=json', product, this.getHttpOptionsSolr()).pipe(
      tap((product) => console.log("addProduct")),
      catchError((err) => {
        return throwError(err);    //Rethrow it back to component
      })
    );
  }

  querySOLR(query): Observable<any> {
    // console.log("Lets begin");
    // console.log(endpointSOLR + '/solr/DocumentTinyDto/select?_=' + id);
    return this.http.get(endpointSOLR + '/solr/DocumentTinyDto/select?' + query + "&rows=100&start=0", this.getHttpOptionsSolr()).pipe(
      tap((product) => console.log("SolrQuery")),
      catchError(this.handleError<any>('SolrQuery'))
    );
  }

  getDocument(): Observable<any> {
    // console.log("Lets begin");
    return this.http.get(endpoint + '/documents/', httpOptionsReading).pipe(
      tap((product) => console.log("getDocument")),
      catchError(this.handleError<any>('getDocument'))
    );
  }

  getThumbnail(id: string): Observable<any> {
    // console.log("Lets begin thumbnail");
    return this.http.get(endpoint + '/files/' + id + '/thumbnail', this.getHttpOptionsWithToken()).pipe(
      tap((product) => console.log("getThumbnail done")),
      catchError(this.handleError<any>('getThumbnail'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getDocumentFromID(id): Observable<any> {
    return this.http.get(endpoint + '/documents/' + id, this.getHttpOptionsWithToken()).pipe(
      tap((product) => console.log("getDocument")),
      catchError(this.handleError<any>('getDocument'))
    );
  }

  postLogin(body: any) {
    let emailField = body.username
    localStorage.clear();
    return this.http.post<AuthData>(endpoint + '/login', body)
      .pipe(
        map((body) => {
          if (body.error == undefined) {
            localStorage.setItem('token', body.token);
             let tokenInfo = JSON.parse(atob(body.token.match(/\..*\./)[0].replace(/\./g, '')));
            //  localStorage.setItem('roles', tokenInfo.roles);
             localStorage.setItem('token_expiration', tokenInfo.exp);
             //localStorage.setItem('email', emailField);
             if(emailField != "anonymous@uac.pt"){
              this.email.emit(emailField);
              this.name.emit(decodeURIComponent(escape(tokenInfo.name)))
              let totalPendencies = 0;
              //NOTE: It is expected user have one review role!
              let roles = tokenInfo.roles.toString().split(",");
              let matched_role = "";
              for(var i=0; i < roles.length; i++) {
                if(roles[i].includes("reviewer")){
                  matched_role = roles[i].substring(0, roles[i].length -2).toUpperCase();
                }
              }

              let queryPendencies = "q=(owner:\"" + emailField + "\" AND status:INCOMPLETE)";
              if(matched_role != "") {
                queryPendencies += " OR (status:NEEDS_" + matched_role;
                queryPendencies += ") OR (reviewer:\"" + emailField + "\"";
                queryPendencies += " AND status:UNDER_" + matched_role + ")&rows=0";
              }

              this.querySOLR(queryPendencies).subscribe((data: any) => {
                if(data.response.numFound > 0) {
                  this.hasPendencies = true;
                  this.pendencies.emit(true);
                  //console.log(data.response.numFound)
                }
              });
              this.logged.emit(true);
              this.isLogged = true;
             }
            return 'ok'
          }
        }

        ),
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          return this.handleError2(err);
        })
      );
  }

  postSignup(body: any) {
    let emailField = body.username

    return this.http.post<AuthData>(endpoint + '/signup', JSON.stringify(body), httpOptionsReading)
      .pipe(
        map((body) => {
          if (body.token != undefined) {
           localStorage.setItem('token', body.token);
            let tokenInfo = this.decodePayloadJWT();
            localStorage.setItem('token_expiration', tokenInfo.exp);
            // localStorage.setItem('email', emailField);
            this.email.emit(emailField);
            this.name.emit(decodeURIComponent(escape(tokenInfo.name)));
            this.logged.emit(true);
            this.isLogged = true;
           return true
          } else {
            return body.error;
          }
        }
        ),
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          return 'e'
        })
      );
  }

  private handleError2(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}`);
      console.error(error.error);
    }

    return (error.error.error);
  }

  validPasswordToken(token): Observable<any> {
    return this.http.get<MsgData>(endpoint + '/users/validByToken/' + token, httpOptionsReading).pipe(
      map((body) => {
        console.log(body.msg);
        if (body.msg == "Utilizador validado com sucesso!") {
          return true;
        } else {
          return body.msg;
        }
      }
      ),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return 'e'
      })
    );
  }

  setNewPassword(body: any, token): Observable<any> {
    return this.http.post<MsgData>(endpoint + '/users/editPassByToken/' + token, JSON.stringify(body), httpOptionsReading).pipe(
      map((body) => {
        if (body.msg == "Palavra-passe atualizada com sucesso!") {
          return true;
        } else {
          return body.msg;
        }
      }
      ),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return 'e'
      })
    );
  }

  requestResetPassword(body: any): Observable<any> {
    return this.http.post<MsgData>(endpoint + '/email-reset-password', JSON.stringify(body), httpOptionsReading).pipe(
      map((body) => {
        if (body.msg == "Email enviado com sucesso!") {
          return true;
        } else {
          return body.msg;
        }
      }
      ),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return 'e'
      })
    );
  }
  
  sendEmail(body: any): Observable<any> {
    // console.log("Sending email...!");
    // console.log(body);
    return this.http.post<MsgData>(endpoint + '/email-send', JSON.stringify(body), httpOptionsReading).pipe(
      map((body) => {
        if (body.msg == "Email enviado com sucesso!") {
          return true;
        } else {
          return 'e';
        }
      }
      ),
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        return 'e';
      })
    );
  }

  public decodePayloadJWT(): any {
    try {
      return JSON.parse(atob(localStorage.getItem('token').match(/\..*\./)[0].replace(/\./g, '')));
    } catch (Error) {
      return null;
    }
  }
}


export interface AuthData {
  token: string;
  error: string;
}

export interface MsgData {
  msg: string;
}
