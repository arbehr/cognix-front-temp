import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../rest.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  hide = true;
  page = 'none';
  
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute,
     private restApi: RestService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      //email: ['', Validators.required],
      password: ['', Validators.required],
      //confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('entrou na página de login')
    this.route.queryParams
      .subscribe(params => {
        this.page = params.page;
        console.log(this.page);
      }
    );
  }

  doLogin(){
    if (this.loginForm.valid) {
      let seq = this.restApi.postLogin(this.loginForm.value);
      // console.log(this.loginForm.value);
      seq.subscribe((response) => {
        console.log(response)
          if (response == 'ok') {
              alert("Seja bem-vindo\\a ao Re-Mar!")
              switch(this.page){
                case 'add': this.router.navigate(['/documents/add']); break;
                default: this.router.navigate(['/']);
              }
              
          }else if (response == undefined){
            alert("Erro ao realizar login");
          }
      },err => {
          alert("Erro ao cadastrar utilizador. Envie mensagem de contacto.");
          console.error('ERROR', err);
    
        });
    } else {
      alert("Preencha todos os campos.");
      return;
  }
  }
}
