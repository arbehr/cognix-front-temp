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

      for(var i = 0; i < this.simple.authors.length; i++){
         var aut_parts = this.simple.authors[i].split("=") 
         var aut_name = aut_parts[1].substring(0, aut_parts[1].lastIndexOf(","));
         var aut_institution = aut_parts[2].substring(0, aut_parts[2].lastIndexOf(","));
         var aut_role = aut_parts[3].toString().replace('[', '').replace(']', '').replace('}', '');

         var aut_roles = [];
        if(aut_role.indexOf(",") == -1) {
          aut_roles.push(aut_role);
        } else {
          aut_roles = aut_role.split(", ");
        }

        if(aut_name.trim() != "") {
        this.simple.author.push({name:aut_name, institution:aut_institution , role:aut_roles}); 
        }  
      }
    });

    

  }

  sanitize(){
    return this.sanitizer.bypassSecurityTrustUrl(endpoint + '/files/'+ this.fileId);
}

}
