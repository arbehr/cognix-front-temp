import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  hide = true;
  
  constructor(private formBuilder: FormBuilder, private router: Router, private restApi: RestService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      //email: ['', Validators.required],
      password: ['', Validators.required],
      //confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('entrou na página de login')
  }

  doLogin(){
    if (this.loginForm.valid) {
      let seq = this.restApi.postLogin(this.loginForm.value);
      // console.log(this.loginForm.value);
      seq.subscribe((response) => {
        console.log(response)
          if (response == 'ok') {
              alert("Seja bem-vindo\\a ao Re-Mar!")
              this.router.navigate(['/documents/add']);
          }else if (response == undefined){
            alert("Erro ao realizar login");
          }
      },err => {
          alert("Erro ao cadastrar usuario");
          console.error('ERROR', err);
    
        });
    } else {
      alert("Preencha todos os campos.");
      return;
  }
  }
}
