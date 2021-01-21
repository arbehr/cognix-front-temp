import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    public signUpForm: FormGroup;

    hide = true;

    constructor(private formBuilder: FormBuilder, private router: Router, private restApi: RestService) {
        this.signUpForm = this.formBuilder.group({
            name: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    ngOnInit() {
    }
    
    onSignUp() {
        if (this.signUpForm.valid) {
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
        }

    }

}
