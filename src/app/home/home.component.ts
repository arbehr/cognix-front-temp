import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { RestService, endpoint } from '../rest.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, 
    public rest:RestService, 
    private router: Router,
    private route: ActivatedRoute) { 
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      });    
  }

  private Login: LoginService;
  private userEmail: string
  documents: any;
  searchText = "";
  documentAddRouter = "";
  page = 'none';
  token = '';
  url = endpoint;

  ngOnInit() {
    this.documents = [];
    this.rest.querySOLR("q=*:*&fq=status:REVIEWED&rows=5&sort=id desc").subscribe((data: any) => {
      var rec = data.response.docs;
      // console.log(rec);
      for (var x in rec){
        // console.log(x);
        this.documents.push({id:rec[x].id, title:rec[x].name, favorites:rec[x].favorites});
      }
      console.log(this.documents);
    });

    this.route.queryParams
      .subscribe(params => {
        this.page = params.page;
        this.token = params.token;
      }
    );

    if(this.page == "response-reset-password") {
      let navigationExtras: NavigationExtras = {
        queryParams: { 'token': this.token },
      };     
      this.router.navigate(['/response-reset-password'], navigationExtras);
    }
    
    if(!localStorage.getItem('token') || this.tokenExpired(localStorage.getItem('token_expiration'))){
      this.loginForm.setValue({
        username: "anonymous@uac.pt", 
        password: "anonymous"
      });
      this.documentAddRouter = "/signin";

      this.rest.postLogin(this.loginForm.value).subscribe((data: {}) => {
        // console.log(data);
        //window.location.reload();
      });
      
    } else {
      let tokenInfo = this.rest.decodePayloadJWT();
      if(tokenInfo.sub != 'anonymous@uac.pt') {
        (this.rest.isLogged === true) ? this.documentAddRouter = "/documents/add" : this.documentAddRouter = "/signin";
        //console.log(this.isLogged);
      } else {
        this.documentAddRouter = "/signin";
      }
    }
  }

  private tokenExpired(expiry: string) {
    return (Math.floor((new Date).getTime() / 1000)) >= +expiry;
  }

}




