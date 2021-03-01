import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',    
  })
};

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {

  name: string;
  email: string;
  message: string;
  ipAddress: string;

  public emailForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, 
    private restApi: RestService, private http:HttpClient) {
      this.emailForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        message: ['', Validators.required],
        ip: [''],
      });
  }

  ngOnInit() {
    this.getIPAddress();
  }

  getIPAddress(){
    this.http.get("https://ipapi.co/ip/", {responseType: 'text'}).subscribe((res:any)=>{
      this.ipAddress = res;
    });
  }

  processEmail() {
    if (this.emailForm.valid) {
      this.emailForm.patchValue({ip: this.ipAddress});
      let seq = this.restApi.sendEmail(this.emailForm.value);

      seq.subscribe((response) => {
          console.log(response)
          if (response == true) {
              alert("Mensagem enviada com sucesso!")
              this.router.navigate(['/']);
          }else if (response == 'e'){
              alert("Erro ao enviar mensagem.");
          }
      },err => {
        alert("Erro ao enviar mensagem.");
        console.error('ERROR', err);
  
      });
    }
  }


}
