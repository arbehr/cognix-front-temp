import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean
  userEmail: string
  constructor(private rest: RestService) { }

  ngOnInit() {
      this.rest.logged.subscribe(logged => this.isLogged = logged)
      this.rest.email.subscribe(email => this.userEmail = email)
  }

  logoutUser(){
    this.rest.logged.emit(false)
  }

}
