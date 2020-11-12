import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export const endpoint = 'http://localhost:8080';
export const endpointSOLR = 'http://localhost:8983';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};



@Injectable({
  providedIn: 'root'
})

export class RestService {


  @Output() logged : EventEmitter<any> = new EventEmitter();
  @Output() email : EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getID(): Observable<any> {
    return this.http.post<any>(endpoint + '/documents/new', {login : localStorage.getItem('email')}, httpOptions).pipe(
      tap(() => console.log('getID')),
      catchError(this.handleError<any>('getID'))
    );
  }

  addDocument(product, id): Observable<any> {
    console.log("Lets begin");
    console.log(product);
    return this.http.post<any>(endpoint + '/documents/' + id, product, httpOptions).pipe(
      tap((product) => console.log("addProduct")),
      catchError(this.handleError<any>('addProduct'))
    );
  }

  addDocumentSOLR(product): Observable<any> {
    console.log("Lets add to solr");
    console.log(product);
    return this.http.post<any>(endpointSOLR + '/solr/DocumentTinyDto/update?commitWithin=1000&overwrite=true&wt=json', product, httpOptions).pipe(
      tap((product) => console.log("addProduct")),
      catchError(this.handleError<any>('addProduct'))
    );
  }

  querySOLR(id): Observable<any> {
    console.log("Lets begin");
    console.log(endpointSOLR + '/solr/DocumentTinyDto/select?_=' + id);
    return this.http.get(endpointSOLR + '/solr/DocumentTinyDto/select?' + id, httpOptions).pipe(
      tap((product) => console.log("SolrQuery")),
      catchError(this.handleError<any>('SolrQuery'))
    );
  }

  getDocument(): Observable<any> {
    console.log("Lets begin");
    return this.http.get(endpoint + '/documents/', httpOptions).pipe(
      tap((product) => console.log("getDocument")),
      catchError(this.handleError<any>('getDocument'))
    );
  }



  getThumbnail(id: string): Observable<any> {
    console.log("Lets begin thumbnail");
    return this.http.get(endpoint + '/files/' + id + '/thumbnail', httpOptions).pipe(
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
    return this.http.get(endpoint + '/documents/' + id, httpOptions).pipe(
      tap((product) => console.log("getDocument")),
      catchError(this.handleError<any>('getDocument'))
    );
  }

  isLogged() {

  }

  postLogin(body: any) {
    let emailField = body.username

    return this.http.post<AuthData>(endpoint + '/login', body)
      .pipe(
        map((body) => {
          if (body.error == undefined) {
            localStorage.setItem('token', body.token);
             let tokenInfo = JSON.parse(atob(body.token.match(/\..*\./)[0].replace(/\./g, '')));
             localStorage.setItem('token_expiration', tokenInfo.exp);
             localStorage.setItem('email', emailField);
            this.email.emit(emailField)
            this.logged.emit(true)
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

    return this.http.post<AuthData>(endpoint + '/signup', JSON.stringify(body), httpOptions)
      .pipe(
        map((body) => {
          if (body.token != undefined) {
           localStorage.setItem('token', body.token);
            let tokenInfo = JSON.parse(atob(body.token.match(/\..*\./)[0].replace(/\./g, '')));
            localStorage.setItem('token_expiration', tokenInfo.exp);
            localStorage.setItem('email', emailField);
            this.email.emit(emailField)
            this.logged.emit(true)
           return true
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
  // public getToken(): Promise<string> {
  //   return this.storage.get('token');
  // }
  // public getTokenExpiration(): Promise<number> {
  //   return this.storage.get('token_expiration');
  // }
  // public deleteToken() {
  //   this.storage.remove('token');
  //   this.storage.remove('token_expiration');
  //   console.log("Token removed")
  // }

}


export interface AuthData {
  token: string;
  error: string;
}
