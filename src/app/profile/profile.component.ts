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
  documentsToReview: any;
  documentsToComplete: any;
  isReviewer: boolean;
  hideRevisionsDiv: boolean;
  hideIncompletesDiv: boolean;

  ngOnInit() {
    this.documentsToReview = [];
    this.documentsToComplete = [];
    this.hideRevisionsDiv = true;
    this.hideIncompletesDiv = true;
    let tokenInfo = this.rest.decodePayloadJWT();
    let status = this.getStatusScope(tokenInfo.roles);
    tokenInfo.roles.toString().includes('reviewer') ? this.isReviewer = true : this.isReviewer = false;
    if(status.length > 0) {
      this.getDocumentsToReview(status[0], "");
      this.getDocumentsToReview(status[1], tokenInfo.sub);
      this.getDocumentsToComplete(tokenInfo.sub);
      // console.log(status);
    }
  }

  showRevisions() {
    this.hideRevisionsDiv = false;
    document.getElementById("revisionsDiv").style.display = "block";
  }

  hideRevisions() {
    this.hideRevisionsDiv = true;
    document.getElementById("revisionsDiv").style.display = "none";
  }

  showIncompletes() {
    this.hideIncompletesDiv = false;
    document.getElementById("incompletesDiv").style.display = "block";
  }

  hideIncompletes() {
    this.hideIncompletesDiv = true;
    document.getElementById("incompletesDiv").style.display = "none";
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

  getDocumentsToComplete(owner) {
    let query = "q=*:*&fq=status:INCOMPLETE&fq=owner:" + owner;
    this.rest.querySOLR(query).subscribe((data: any) => {
      var rec = data.response.docs;
      // console.log(rec);
      for (var x in rec){
        // console.log(x);
        this.documentsToComplete.push({id:rec[x].id, title:rec[x].name});
      }
      // console.log(this.documents);
    });
  }

  getDocumentsToReview(status, reviewer) {
    let query = "q=*:*&fq=status:" + status;
    if(reviewer != "") {
      query+="&fq=reviewer:" + reviewer;
    }
    this.rest.querySOLR(query).subscribe((data: any) => {
      var rec = data.response.docs;
      // console.log(rec);
      for (var x in rec){
        // console.log(x);
        this.documentsToReview.push({id:rec[x].id, title:rec[x].name, isValid:false, status:status, owner:rec[x].owner});
      }
      // console.log(this.documents);
    });
  }

  reviewDocuments(){
    document.body.style.cursor="wait";
    let tokenInfo = this.rest.decodePayloadJWT();
    for(var i = 0; i < this.documentsToReview.length; i++){
      let status = this.getStatusScope(tokenInfo.roles);
      if(this.documentsToReview[i].isValid) {
        // console.log(i)
        this.rest.addDocumentSOLR(this.buildJson(this.documentsToReview[i].id, status[1])).subscribe((data: {}) => {
          console.log(data);
        });
      }
    }

    for(var i = 0; i < this.documentsToReview.length; i++){
      if(this.documentsToReview[i].isValid) {
        if(tokenInfo.roles.toString().includes('tech_reviewer')){
          this.documentsToReview[i].status = "UNDER_TECH_REVIEW";
        }
        if(tokenInfo.roles.toString().includes('pedag_reviewer')){
          this.documentsToReview[i].status = "UNDER_PEDAG_REVIEW";
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
