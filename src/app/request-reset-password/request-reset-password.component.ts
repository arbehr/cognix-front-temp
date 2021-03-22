import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { RestService, endpoint } from '../rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.css']
})
export class RequestResetPasswordComponent implements OnInit {

  RequestResetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;

  constructor(private rest: RestService, private router: Router) { }

  ngOnInit(): void {
    this.RequestResetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
    });
  }

  RequestResetUser(form) {
    console.log(form)
    if (form.valid) {
      this.IsvalidForm = true;
      this.rest.requestResetPassword(this.RequestResetForm.value).subscribe(
        response => {
          if (response == true) {
            alert("E-mail para redefinição de palavra-passe enviado com sucesso.");
            this.router.navigate(['/']);
          }else {
              alert(response);
          }      
        },
        err => {
          alert("Erro ao enviar e-mail para redefinição de palavra-passe.");
          if (err.error.message) {
            this.errorMessage = err.error.message;
            console.error('ERROR', this.errorMessage);
          }
        }
      );
    } else {
      this.IsvalidForm = false;
    }
  }

}
