import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';
import { RecaptchaErrorParameters } from "ng-recaptcha";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    public signUpForm: FormGroup;

    hide = true;
    hideConfirm = true;

    constructor(private formBuilder: FormBuilder, private router: Router, private restApi: RestService) {
        this.signUpForm = this.formBuilder.group({
            name: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            captcha: ['', Validators.required],
        });
    }

    public resolved(captchaResponse: string): void {
        console.log(`Resolved captcha with response: ${captchaResponse}`);
    }

    public onError(errorDetails: RecaptchaErrorParameters): void {
        console.log(`reCAPTCHA error encountered; details:`, errorDetails);
    }

    ngOnInit() {
    }
    
    onSignUp() {        
        if (this.signUpForm.valid) {
            if(this.signUpForm.controls['password'].value != this.signUpForm.controls['confirmPassword'].value) {
                alert("As senhas devem ser iguais.");
                return;
            }
            let seq = this.restApi.postSignup(this.signUpForm.value);

            seq.subscribe((response) => {
                console.log(response)
                if (response == true) {
                    alert("Usuario criado com sucesso")
                    this.router.navigate(['/']);
                }else if (response=='e'){
                    alert("Erro ao cadastrar usuario.");
                }
            });
        } else {
            alert("Preencha todos os campos.");
            return;
        }

    }

}
