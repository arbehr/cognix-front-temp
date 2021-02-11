import { Component, OnInit , Input } from '@angular/core';
import { Metadata, Contribuinte } from '../metadata';
import { Mock, contrib } from '../mock-data';
import {DomSanitizer} from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { endpoint, RestService } from '../rest.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-document-tiny',
  templateUrl: './document-tiny.component.html',
  styleUrls: ['./document-tiny.component.css']
})
export class DocumentTinyComponent implements OnInit {
  @Input() documentsTiny: {id: any, title:string, selected:boolean};
  thumb: String;
  isLogged: boolean;
  constructor(private rest: RestService) { }

  ngOnInit() {
    this.rest.logged.subscribe(logged => this.isLogged = logged)
    
    this.thumb = endpoint  + "/files/" + this.documentsTiny.id + "/thumbnail";
    if(this.documentsTiny.title.length > 27)
      this.documentsTiny.title = this.documentsTiny.title.substr(0,23) + "..."
  }

}
