import { Component, OnInit } from '@angular/core';
import { parameters } from './searchParameters'
import { RestService } from '../rest.service';
import { ActivatedRoute } from "@angular/router";
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

  constructor(private route: ActivatedRoute, public rest:RestService) { 

  }

  ngOnInit() {
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

  search(){
    // console.log(this.searchText);
    this.documents = [];
    var finalString = "q=*:*&fq=status:REVIEWED"

    if(this.searchText != ""){
      finalString = "q=name:\""+ this.searchText + "\"" + 
        " OR keywords:\"" + this.searchText + "\"" + 
        "&fq=status:REVIEWED";
    }

    this.rest.querySOLR(finalString).subscribe((data: any) => {
      var rec = data.response.docs;
      // console.log(rec);
      for (var x in rec){
        // console.log(x);
        this.documents.push({id:rec[x].id, title:rec[x].name});
      }
      console.log(this.documents);
    });

  }


}
