import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService, endpoint } from '../rest.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-response-reset-password',
  templateUrl: './response-reset-password.component.html',
  styleUrls: ['./response-reset-password.component.css']
})
export class ResponseResetPasswordComponent implements OnInit {

  ResponseResetForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  resetToken: null;
  CurrentState: any;
  IsResetFormValid = true;
  
  constructor(
    private rest: RestService, 
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { 
    this.CurrentState = 'Wait';
    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      if(this.resetToken != null) {
        this.verifyToken();
      } else {
        alert("Token não encontrado.");
        this.router.navigate(['/']);
      }
      
    });
  }

  ngOnInit(): void {
    this.init();
  }

  verifyToken() {
    this.rest.validPasswordToken(this.resetToken).subscribe(
      response => {
        if (response == true) {
          this.CurrentState = 'Verified';
        }else {
            alert(response);
            this.CurrentState = 'NotVerified';
        }
      },
      err => {
        this.CurrentState = 'NotVerified';
      }
    );
  }

  init() {
    this.ResponseResetForm = this.fb.group(
      {
        resettoken: [this.resetToken],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(4)]]
      }
    );
  }

  validate(passwordFormGroup: FormGroup) {
    const new_password = passwordFormGroup.controls.password.value;
    const confirm_password = passwordFormGroup.controls.confirmPassword.value;

    if (confirm_password.length <= 0) {
      return null;
    }

    if (confirm_password !== new_password) {
      return {
        doesNotMatch: true
      };
    }

    return null;
  }


  resetPassword(form) {
    console.log(form.get('confirmPassword'));
    if (form.valid) {
      this.IsResetFormValid = true;
      this.rest.setNewPassword(this.ResponseResetForm.value, this.resetToken).subscribe(
        response => {
          if (response == true) {
            this.ResponseResetForm.reset();
            alert("Palavra-passe definida com sucesso!");
            this.router.navigate(['signin']);
          }else {
              alert(response);
              this.CurrentState = 'NotVerified';
          }
        },
        err => {
          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    } else { this.IsResetFormValid = false; }
  }
}
