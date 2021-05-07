import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean;
  userEmail: string;
  userName: string;
  totalPendencies: number;
  constructor(private rest: RestService) { }

  ngOnInit() {
      this.rest.logged.subscribe(logged => this.isLogged = logged)
      this.rest.email.subscribe(email => this.userEmail = email)
      this.rest.name.subscribe(name => this.userName = name)
      this.rest.pendencies.subscribe(pendencies => this.totalPendencies = pendencies)

      // if(localStorage.getItem('token') != null) {
      //   let tokenInfo = JSON.parse(atob(localStorage.getItem('token').match(/\..*\./)[0].replace(/\./g, '')));
      //   this.userName = tokenInfo.name;
      // }
  }

  logoutUser(){
    this.rest.logged.emit(false)
  }

}
