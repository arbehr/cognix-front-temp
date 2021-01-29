import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { RestService } from '../rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public rest:RestService) { 
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
     });    
  }

  private Login: LoginService;
  private userEmail: string
  private documents: object;
  searchText = "";
  documentAddRouter = ""

  ngOnInit() {
    
    this.rest.getDocument().subscribe((data: {}) => {
      this.documents = data;
      console.log(this.documents);
    });
    
    if(!localStorage.getItem('token')){
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



}




