import { Component, OnInit, Input } from '@angular/core';
import { Metadata, Contribuinte } from '../metadata';
import { Mock, contrib } from '../mock-data';
import {DomSanitizer} from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { endpoint, RestService } from '../rest.service';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  @Input() document: {id: any, title:string};
  thumb: String;
  isLogged: boolean;
  constructor(private rest: RestService) { }

  ngOnInit() {
    this.rest.logged.subscribe(logged => this.isLogged = logged)
    console.log("Login " + this.isLogged);
    this.thumb = endpoint  + "/files/" + this.document.id + "/thumbnail";
    if(this.document.title.length > 27)
      this.document.title = this.document.title.substr(0,23) + "..."
  }
}