import { Component, OnInit } from '@angular/core';
import { parameters } from './searchParameters'
import { RestService } from '../rest.service';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  searchOptions : any;
  finalSearch : string;
  finalparam : string;
  finished : boolean;
  depth : number;
  path : number[];
  searchText = "";
  initSearch = "";
  breakpoint : number;
  documents = [];
  ipAddress: string;
  learningCycles = new FormControl();
  learningCyclesList: string[] = ["Educação pré-escolar", "Básico 1º ciclo", "Básico 2º ciclo", "Básico 3º ciclo",
    "Ensino secundário", "Ensino superior", "Ensino profissional"];
  knowledgeAreas = new FormControl();
  knowledgeAreasList: string[] = ["Ciências exatas", "Ciências humanas", 
    "Ciências naturais", "Ciências tecnológicas"];
  curricularAreas = new FormControl();
  curricularAreasList: string[] = ["Matemática", "Português", "Estudo do Meio", "Expressões (Plástica, Musical, Dramática/Teatro)",
    "Educação Física", "Cidadania", "Ciências Naturais", "Inglês", "TIC", "História", "Educação Visual",
    "Educação Tecnológica", "Educação Musical", "Biologia", "Geografia", "Físico-Química"]
  filterQuery = "";
  searchFavorites = false;
  isLogged: boolean;

  constructor(
    private route: ActivatedRoute, 
    public rest:RestService,
    private http:HttpClient) { 

  }

  ngOnInit() {
    this.rest.logged.subscribe(logged => this.isLogged = logged)
    this.isLogged = this.rest.isLogged;
    this.ipAddress="";
    this.initSearch = this.route.snapshot.paramMap.get('search');
    if(this.initSearch != null)
      this.searchText=this.initSearch;
      
    this.searchOptions = Object.assign({}, parameters);
    this.finalSearch = "área do conhecimento"; 
    this.finished = false;
    this.depth = 0;
    this.path = [];
    if(this.initSearch != ""){
      this.search();
    }
    this.filterQuery = "";
    if (window.innerWidth >= 1500) {
      this.breakpoint = 4
    } else {
      if(window.innerWidth >= 1200) {
        this.breakpoint = 3
      } else {
        this.breakpoint = (window.innerWidth <= 900) ? 1 : 2;
      }
    } 
  }

  onResize(event) {
    if (window.innerWidth >= 1500) {
      this.breakpoint = 4
    } else {
      if(window.innerWidth >= 1200) {
        this.breakpoint = 3
      } else {
        this.breakpoint = (window.innerWidth <= 900) ? 1 : 2;
      }
    } 
  }

  onSelect(index:number, selected:string){
    
    if (this.finished) {
      this.finalSearch = this.finalSearch.substring(0, this.finalSearch.length - this.finalparam.length - 1);  
    }
    
    this.finalparam = selected;

    if(this.searchOptions.next[index].hasOwnProperty("next")){

      this.finalSearch += "-" + selected;
      this.searchOptions = this.searchOptions.next[index];
      this.depth++;
      this.path.push(index);
      
      this.finished = false;
      

    }
    else{
      this.finalSearch += "-"+ selected;
      this.finished = true;
      console.log(this.depth);
    }

    console.log(this.finalSearch);

  }

  onSelectPrevious(){
    if(this.depth > 0){

      
      var x:any = Object.assign({}, parameters);
      this.finalSearch ="área do conhecimento";


      this.depth--;
      for(var i = 0; i < this.depth; i++){
        x = x.next[this.path[i]];
        this.finalSearch += "-" + x.name;
        
      }
      this.path.pop();
      this.searchOptions = x; 
      
      
      
      
      this.finalparam = this.searchOptions.name;
      this.finished = false;
    }


  }

  async getIPAddress(){
    let response = await this.http.get("https://ipapi.co/ip/", {responseType: 'text'}).toPromise();
    this.ipAddress = response;
    // console.log(this.ipAddress)
  }

  getSolrStringFromFormValues(fieldName: string, fieldValues: string[]) {
    this.filterQuery += fieldName + ":(";
    for(let i = 0; i < fieldValues.length; i++) {
      this.filterQuery += "\"" + fieldValues[i] + "\"" + " OR "
    }
    this.filterQuery = this.filterQuery.substring(0, this.filterQuery.length-4);
    this.filterQuery += ")"
    this.filterQuery += " AND "
  }

  getFilterQuery() {
    this.filterQuery = "";
    if(this.learningCycles.value && this.learningCycles.value.length > 0) {
      this.getSolrStringFromFormValues("age",this.learningCycles.value)
    }
    if(this.knowledgeAreas.value && this.knowledgeAreas.value.length > 0) {
      this.getSolrStringFromFormValues("knowledgeArea",this.knowledgeAreas.value)
    }
    if(this.curricularAreas.value && this.curricularAreas.value.length > 0) {
      this.getSolrStringFromFormValues("curriculumAreas",this.curricularAreas.value)
    }
    this.filterQuery = this.filterQuery.substring(0, this.filterQuery.length-4);
  }

  async search(){
    //this.rest.getSearchText(this.searchText).subscribe((data: any) => {
    //  console.log(data);
    //});

    this.getFilterQuery();

    await this.getIPAddress();
    let tokenInfo = this.rest.decodePayloadJWT();

    let search = {
      search_query: this.searchText,
      user:tokenInfo.sub,
      ip:this.ipAddress,
    };

    this.rest.saveSearchText(JSON.stringify([search])).subscribe((data: any) => {
      console.log(data);
    });
   
    this.documents = [];
    var finalString = "q=*:*&fq=status:REVIEWED"

    // TODO: optimize search
    if(this.searchText != ""){
      finalString = "q=name:\*" + this.searchText.substr(0,1).toUpperCase() + this.searchText.substr(1) + "\*" +
        " OR name:\*"+ this.searchText.toLocaleLowerCase() + "\*" + 
        " OR keywords:" + this.searchText + "\~" +
        " OR keywords:\*" + this.searchText.substr(0,1).toUpperCase() + this.searchText.substr(1) + "\*" +
        " OR keywords:\*"+ this.searchText.toLocaleLowerCase() + "\*" + 
        " OR description:\*" + this.searchText.substr(0,1).toUpperCase() + this.searchText.substr(1) + "\*" + 
        " OR description:\*"+ this.searchText.toLocaleLowerCase() + "\*" + 
        "&fq=status:REVIEWED";
    }
    if(this.filterQuery) {
      finalString += "&fq=" + this.filterQuery;
    }
    if(this.searchFavorites) {
      let tokenInfo = this.rest.decodePayloadJWT();
      finalString += "&fq=favorites:" + tokenInfo.sub;
    }
    // console.log(finalString)
    this.rest.querySOLR(finalString).subscribe((data: any) => {
      var rec = data.response.docs;
      // console.log(rec);
      for (var x in rec){
        // console.log(x);
        this.documents.push({id:rec[x].id, title:rec[x].name, favorites:rec[x].favorites});
      }
      // console.log(this.documents);
    });

  }


}
