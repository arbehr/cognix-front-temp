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
  @Input() document: {id: any, title:string, favorites: string[]};
  thumb: String;
  isLogged: boolean;
  like: boolean;
  showShareButtons: boolean;

  constructor(private rest: RestService) { }

  ngOnInit() {
    this.rest.logged.subscribe(logged => this.isLogged = logged)
    this.isLogged = this.rest.isLogged;
    this.like = false;
    this.showShareButtons = false;
    
    this.thumb = endpoint  + "/files/" + this.document.id + "/thumbnail";
    if(this.document.title.length > 27)
      this.document.title = this.document.title.substr(0,23) + "..."
    
    let tokenInfo = this.rest.decodePayloadJWT();
    for(var i = 0; i < this.document.favorites.length; i++) {
      if(this.document.favorites[i] == tokenInfo.sub) {
        this.like = true;
      }
    }
    
  }

  updateLike(value, id) {
    let json = (value ? this.buildJsonToAdd(id) : this.buildJsonToRemove(id))
    this.rest.addDocumentSOLR(json).subscribe((data: {}) => {
      console.log(data);
    });
  }

  buildJsonToAdd(id:string)  {
    let tokenInfo = this.rest.decodePayloadJWT();
    var updateDoc =
    [
      { 
        id: id,
        favorites: {"add": tokenInfo.sub} 
      },    
    ];
    return JSON.stringify(updateDoc);
   }

   buildJsonToRemove(id:string)  {
    let tokenInfo = this.rest.decodePayloadJWT();
    var updateDoc =
    [
      { 
        id: id,
        favorites: {"remove": tokenInfo.sub} 
      },    
    ];
    return JSON.stringify(updateDoc);
   }
}