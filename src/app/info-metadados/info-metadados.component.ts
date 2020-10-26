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
  simples:any;

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
        role:"",
      }],
      keywords:"",
      interactive:"",
      licence:"",
      kind: [],
      target: [],
      age: [],
      resources: [],
      bncc: "",
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
      console.log(this.documents);
      this.simples = this.documents[0];
      this.simple = {

        name:this.documents[0].name,
        language: this.documents[0].language,
        keywords:this.documents[0].keywords,
        description:this.documents[0].description,
        interaction:this.documents[0].interaction,
        interactionNumber:this.documents[0].interactionNumber,
        interactive:this.documents[0].interactive,
        licence:this.documents[0].licence,
        kind: this.documents[0].kind,
        target: this.documents[0].target,
        age: this.documents[0].age,
        resources: this.documents[0].resources[0],
        bncc: this.documents[0].bncc,
        owner:this.documents[0].owner,
        favorites:this.documents[0].favorites, //TODO: mudar campo solr para multivalorado
        free:this.documents[0].free,
        citeAuthor:this.documents[0].citeAuthor,
        alterations:this.documents[0].alterations,
        comercialUse:this.documents[0].comercialUse,
        authors:this.documents[0].author,
        author:[]
        //context: this.documents[0].context,
        //education:this.documents[0].education,
        //area:this.documents[0].area,
        //accessibility:this.documents[0].accessibility,
        //dificulty:this.documents[0].dificulty,
        //rights:this.documents[0].rights,

        
        
      }
      console.log(this.simple);
      for(var i = 0; i < this.simple.authors.length -1; i++){
         var x = this.simple.authors[i];
         var y = x.split(",")
         var z = y[0].split("=")[1];
         var k = y[1].split("=")[1];
         var l = k.substr(0, k.length - 1);
        
         this.simple.author.push({name:z, role:l});
          
         console.log("L=" + l);
         console.log("Z=" + z);
       }
    });

    

  }

  sanitize(){
    return this.sanitizer.bypassSecurityTrustUrl(endpoint + '/files/'+ this.fileId);
}

}
