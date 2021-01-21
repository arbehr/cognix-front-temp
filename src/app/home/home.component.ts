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
  private isLogged: boolean;
  private documents: object;
  searchText = "";

  ngOnInit() {


    this.rest.getDocument().subscribe((data: {}) => {
      this.documents = data;
      console.log(this.documents);
    });

    if(!localStorage.getItem('email')){
      this.loginForm.setValue({
        username: "anonymous@uac.pt", 
        password: "anonymous"
      });

      this.rest.postLogin(this.loginForm.value).subscribe((data: {}) => {
        console.log(data);
        window.location.reload();
      });
      
    }

  }



}




