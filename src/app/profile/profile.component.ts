import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private rest: RestService, private router: Router) { }
  documents: any;

  ngOnInit() {
    this.documents = [];
    let tokenInfo = this.rest.decodePayloadJWT();
    let status = this.getStatusScope(tokenInfo.roles);
    if(status.length > 0) {
      this.getDocuments(status[0], "");
      this.getDocuments(status[1], tokenInfo.sub);
      // console.log(status);
    }
  }

  getStatusScope(roles) {
    roles = roles.toString().split(',');
    for(let role of roles) {
      // console.log(role);
      switch(role) {
        case "tech_reviewer": return ["NEEDS_TECH_REVIEW", "UNDER_TECH_REVIEW"];
        case "pedag_reviewer": return ["NEEDS_PEDAG_REVIEW", "UNDER_PEDAG_REVIEW"];
      }
    }
    return ['undefined','undefined'];
  }

  getDocuments(status, reviewer) {
    let query = "q=*:*&fq=status:" + status;
    if(reviewer != "") {
      query+="&fq=reviewer:" + reviewer;
    }
    this.rest.querySOLR(query).subscribe((data: any) => {
      var rec = data.response.docs;
      // console.log(rec);
      for (var x in rec){
        // console.log(x);
        this.documents.push({id:rec[x].id, title:rec[x].name, isValid:false, status:status, owner:rec[x].owner});
      }
      // console.log(this.documents);
    });
  }

  reviewDocuments(){
    document.body.style.cursor="wait";
    let tokenInfo = this.rest.decodePayloadJWT();
    for(var i = 0; i < this.documents.length; i++){
      let status = this.getStatusScope(tokenInfo.roles);
      if(this.documents[i].isValid) {
        // console.log(i)
        this.rest.addDocumentSOLR(this.buildJson(this.documents[i].id, status[1])).subscribe((data: {}) => {
          console.log(data);
        });
      }
    }

    for(var i = 0; i < this.documents.length; i++){
      if(this.documents[i].isValid) {
        if(tokenInfo.roles.toString().includes('tech_reviewer')){
          this.documents[i].status = "UNDER_TECH_REVIEW";
        }
        if(tokenInfo.roles.toString().includes('pedag_reviewer')){
          this.documents[i].status = "UNDER_PEDAG_REVIEW";
        }
      }
    }
    document.body.style.cursor="initial";
  }

  buildJson(id:string, status:string)  {
    let tokenInfo = this.rest.decodePayloadJWT();
    var updateDoc =
    [
      { 
        id: id,
        status: {"set":status},
        reviewer: {"set": tokenInfo.sub} 
      },    
    ];
    return JSON.stringify(updateDoc);
   }

  logoutUser(){
    if (confirm("Tens certeza de realizar o logout?")) {
      this.rest.logged.emit(false)
      this.rest.isLogged = false;
      this.router.navigate([''])
    }
  }

}
