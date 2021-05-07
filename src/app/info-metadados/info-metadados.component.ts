import { Component, OnInit } from '@angular/core';
import { Metadata, OBAA } from '../metadata';
import { Mock, emptyMockOBAA } from '../mock-data';
import { RestService, endpoint } from '../rest.service';
import { ActivatedRoute } from "@angular/router";
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-info-metadados',
  templateUrl: './info-metadados.component.html',
  styleUrls: ['./info-metadados.component.css']
})


export class InfoMetadadosComponent implements OnInit {


  info: OBAA;
  id = "init";
  documents:any;
  simple:any;
  // simples:any;

  thumb: string;
  fileId: string;


  constructor(private route: ActivatedRoute, private rest: RestService, private sanitizer:DomSanitizer) { }


  ngOnInit() {
    
    this.simple = {
      name:"",
      accessibilitylanguage:"",
      public: "",
      description:"",
      accessibility:"",
      context: "",
      education:"",
      area:"",
      interaction:"",
      interactionNumber:"",
      dificulty:"",
      rights:"",
      author:[{
        name: "",
        institution: "",
        role:"",
      }],
      keywords:"",
      licence:"",
      target: [],
      age: [],
      knowledgeArea: [],
      typicalLearningTime:"",
      resources: [],
      owner:"admin",
      favorites:"",
      id:0
    };

    this.info = emptyMockOBAA;
    this.id = this.route.snapshot.paramMap.get('id');
    
    this.rest.getDocumentFromID(this.id).subscribe((data: any) => {
      Object.assign(this.info,data);
      this.fileId = data.files[0].id;
      this.thumb = endpoint  + "/files/" + this.id + "/thumbnail";
    });

    var finalString = "q=id:\""+ this.id + "\"";
    
    this.rest.querySOLR(finalString).subscribe((data: any) => {
      this.documents = data.response.docs;
      // console.log(this.documents);
      // this.simples = this.documents[0];
      this.simple = {

        name:this.documents[0].name,
        language: this.documents[0].language,
        keywords:this.documents[0].keywords,
        description:this.documents[0].description,
        interaction:this.documents[0].interaction,
        interactionNumber:this.documents[0].interactionNumber,
        licence:this.documents[0].licence,
        target: this.documents[0].target,
        age: this.documents[0].age,
        knowledgeArea: this.documents[0].knowledgeArea,
        resources: this.documents[0].resources,
        typicalLearningTime:this.documents[0].typicalLearningTime,
        owner:this.documents[0].owner,
        favorites:this.documents[0].favorites,
        free:this.documents[0].free,
        authors:this.documents[0].author,
        author:[]
      }
      // console.log(this.simple.authors);
      for(var i = 0; i < this.simple.authors.length -1; i++){
         var aut = this.simple.authors[i];
         var aut_parts = this.simple.authors[i].split(",")       
         var aut_name = aut_parts[0].split("=")[1];
         var aut_institution = aut_parts[1].split("=")[1];
         var aut_role = aut_parts[2].split("=")[1];
         aut_role = aut_role.toString().replace('[', '');
         aut_role = aut_role.toString().replace(']', '').replace('}', '');
         for(var i=3; i < aut_parts.length; i++){
          aut_role += ',' + aut_parts[i].toString().replace(']', '').replace('}', '').trimLeft()
         }
         console.log(aut_role)
         this.simple.author.push({name:aut_name, institution:aut_institution , role:aut_role}); 
      }
    });

    

  }

  sanitize(){
    return this.sanitizer.bypassSecurityTrustUrl(endpoint + '/files/'+ this.fileId);
}

}
