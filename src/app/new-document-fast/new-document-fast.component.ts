import { Component, OnInit, Input, Inject } from '@angular/core';
import { OBAA, OBAACreator } from '../metadata';
import { emptyMockOBAA, emptyMockOBAACreator } from '../mock-data';

import { RestService, endpoint } from '../rest.service';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { ActivatedRoute, Router } from "@angular/router"
import { parameters } from '../search/searchParameters';
import {MatStepperModule} from '@angular/material/stepper'; 
import { MatCheckboxChange, MatRadioButton, MatRadioChange,  } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface DialogData {
  documentsTiny: string;
}

@Component({
  selector: 'app-new-document-fast',
  templateUrl: './new-document-fast.component.html',
  styleUrls: ['./new-document-fast.component.css']
})

export class NewDocumentFastComponent implements OnInit {

  searchOptions: any;
  finalSearch: string;
  finalparam: string;
  finished:boolean;
  depth:number;
  path:number[];
  interactionNumber:number;
  typicalLearningTime:number;
  moreThanThreeHours:boolean;
  hours:number;
  minutes:number;
  seconds:number;
  totalMinutes:number;
  otherResource:"";
  target:any;
  age:any;
  resources:any;
  knowledgeArea:any;
  contribute:{
    role: "",
    entities: String[],
  }[];
  relation:{
    kind: "",
    resource: {identifier: {catalog: string, entry: any}[]}
  }[];
  keywords: any;
  keywords_predefined: any;
  simple: any;
  edit: string;
  currentPage: number;
  progressBarValue: number;
  numPages: number;
  documentsTiny: any;
  name: string;

  fileId: string;
  fileThumb: string;
  existRelation: boolean;
  preFillValue: string;

  OBAA: OBAACreator;
  public uploader: FileUploader = new FileUploader({url: endpoint + "/files/uploadFile", authToken: localStorage.getItem('token'), itemAlias: "file"});
  public uploader2: FileUploader = new FileUploader({url: endpoint + "/files/uploadFile", authToken: localStorage.getItem('token'), itemAlias: 'file'});
  
  control = new FormControl();
  keywords_suggestions: string[] = ['Algas', 'Alterações climáticas', 'Amostragens', 'Áreas protegidas', 'Artes', 'Aves',
    'Baixa profundidade /Subtidal', 'Biotecnologia marinha', 'Circulação oceânica', 'Correntes',
    'Ecossistemas marinhos', 'Embarcações', 'Energia', 'Entre marés /Interdital', 'Equipamentos marítimos',
    'Espécies não indigenas /invasoras', 'Fontes hidrotermais', 'Invertebrados', 'Mamíferos marinhos', 'Marés',
    'Microorganismos e marés vermelhas', 'Ondas', 'Peixes', 'Plancton', 'Plantas costeiras', 'Plataforma continental',
    'Praias arenosas', 'Produtividade', 'Química da água do mar', 'Sustentabilidade', 'Tartarugas', 'Teias tróficas',
    'Tubarões', 'Turismo, Desporto, Lazer', 'Zona costeira', 'Recursos marinhos /Pescas'];
  filteredKeywords: Observable<string[]>;

  constructor(public rest:RestService, private router:Router, 
    private route: ActivatedRoute, private dialog: MatDialog) { 
      this.edit = "";
      
      if(this.route.snapshot.paramMap.get('id') != null) {
        this.rest.getDocumentFromID(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe((data: {}) => {
          Object.assign(this.OBAA,data);
        },
        (error) => {                              
          document.body.style.cursor="initial";
          alert("Erro ao editar, token inválido. Recarregue a página novamente.");
          //this.router.navigate([router.url]);
        });
        // this.OBAA.id = parseInt(this.route.snapshot.paramMap.get('id'));
        // console.log(this.route.snapshot.paramMap.get('id'))
        this.edit = "/edit";
      } else {
        this.rest.getID().subscribe((data: {}) => {
          //console.log(data)
          Object.assign(this.OBAA,data);
          //console.log(this.OBAA);
        },
        (error) => {                              
          document.body.style.cursor="initial";
          alert("Erro ao criar novo documento, token inválido. Recarregue a página novamente.");
        });
      }
      this.uploader.onBuildItemForm = (item, form) => {
        form.append("docId", this.OBAA.id);
        form.append("filename", "Thumbnail");
      };

      this.uploader2.onBuildItemForm = (item, form) => {
        form.append("docId", this.OBAA.id);
        form.append("filename", "Material");
      };
    
    this.fileId = "";
    this.fileThumb = "";
    this.existRelation = false;
    let tokenInfo = this.rest.decodePayloadJWT();
    this.simple = {
      name:"",
      language:"",
      keywords: [],
      description:"",
      interaction:"",
      interactionNumber:"",
      author:[{
        name: "",
        institution: "",
        role:["author"],
      }],
      relationWith:[{
        kind: "haspart",
        entry: "",
      }],
      typicalLearningTime: "",
      licence:"",
      target: [],
      age: [],
      knowledgeArea: [],
      resources: [],
      owner: tokenInfo.sub,
      favorites:["admin"],
      free:"yes",
      status:"NEEDS_TECH_REVIEW",
      id:0
    };
  }

  ngOnInit() {
    this.preFillValue = "";
    this.documentsTiny = [];
    this.currentPage = 1;
    this.numPages = 8;
    this.progressBarValue = 100/this.numPages;
    this.moreThanThreeHours = false;
    this.typicalLearningTime = 0;
    this.keywords = [];
    this.target = [ 
      [{ 
        name: "Professores\\as",
        isValid: false 
      },
      { 
        name: "Formadores\\as",
        isValid: false 
      }],
      [{ 
        name: "Estudantes",
        isValid: false 
      },
      { 
        name: "Outros",
        isValid: false 
      }] 
    ];

    this.age = 
    [
      { 
        name: "Ensino pré-escolar",
        isValid: false 
      },
      { 
        name: "Básico 1º ciclo",
        isValid: false 
      },
      { 
        name: "Básico 2º ciclo",
        isValid: false 
      },
      { 
        name: "Básico 3º ciclo",
        isValid: false 
      },
      { 
        name: "Ensino secundário",
        isValid: false 
      },
      { 
        name: "Ensino superior",
        isValid: false 
      },
      { 
        name: "Ensino profissional",
        isValid: false 
      },
    ];

    this.knowledgeArea = 
    [
      { 
        name: "Ciências exatas",
        isValid: false 
      },
      { 
        name: "Ciências humanas",
        isValid: false 
      }, 
      { 
        name: "Ciências naturais",
        isValid: false 
      },
      { 
        name: "Ciências tecnológicas",
        isValid: false 
      },      
    ];

    this.keywords_predefined = [
      [{
        name: "Biodiversidade", 
        isValid: false
      },
      {
        name: "Ecologia marinha",
        isValid: false  
      },
      {
        name: "Economia do mar",
        isValid: false
      }],
      [{
        name: "Geografia",
        isValid: false
      },
      {
        name: "Geologia/Fundos/Sedimentos",
        isValid: false
      },
      {
        name: "Mar profundo",
        isValid: false
      }],
      [{
        name: "Oceanografia",
        isValid: false
      },
      {
        name: "Património/Arqueologia subaquáticos",
        isValid: false
      },
      {
        name: "Poluição/Lixo/Ruído",
        isValid: false
      }]
    ];
    
    this.resources = [
      [ { 
        name: "Questionário",
        isValid: false 
      },
      { 
        name: "Problema",
        isValid: false 
      },
      { 
        name: "Prova",
        isValid: false 
      },
      { 
        name: "Enunciado de questão",
        isValid: false 
      }  ],
      
      [{ 
        name: "Plano de aula",
        isValid: false 
      },
      { 
        name: "Saída de campo",
        isValid: false 
      },
      { 
        name: "Experiência laboratorial",
        isValid: false 
      },
      { 
        name: "Guião",
        isValid: false 
      }],
      
      [{ 
        name: "Livro",
        isValid: false 
      },
      { 
        name: "Infografia",
        isValid: false 
      },
      { 
        name: "Página web",
        isValid: false 
      },
      { 
        name: "Texto teatral/dramatizado",
        isValid: false 
      },
      { 
        name: "Texto narrado",
        isValid: false 
      }],
      [{
        name: "Documentário em vídeo",
        isValid: false
      },
      {
        name: "Demonstração filmada",
        isValid: false
      },
      {
        name: "Aula gravada ou filmada",
        isValid: false
      }
      ],
      [{
        name: "Jogo",
        isValid: false 
      },
      {
        name: "Simulação",
        isValid: false 
      }
      ],
      [
        {
          name: "Outro",
          isValid: false 
        }
      ]
      
    ];
    this.getDocument(this.route.snapshot.paramMap.get('id'), true);
    
    this.OBAA = emptyMockOBAACreator;

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader2.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      document.body.style.cursor="initial";
      this.router.navigate(['/']);
     };

     

     this.uploader2.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if(this.uploader.queue.length > 0) {
        this.uploader.uploadAll();
      }else {
        this.router.navigate(['/']);
        document.body.style.cursor="initial";
        }
      };

     this.searchOptions = Object.assign({}, parameters);
     this.finalSearch = "área do conhecimento"; 
     this.finished = false;
     this.depth = 0;
     this.path = [];

     this.filteredKeywords = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.keywords_suggestions.filter(sug_key => this._normalizeValue(sug_key).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  getDocument(id, withRelations): void {
    if(id != null) {
      if(withRelations) {
        this.fileId = endpoint  + "/files/" + id;
        this.fileThumb = endpoint  + "/files/" + id + "/thumbnail";
      
        document.getElementById("uploadFileDiv").style.display = "none";
        document.getElementById("uploadPhotoDiv").style.display = "none";
      }

      this.rest.querySOLR("q=id:" + id).subscribe((data: any) => {
        var documents = data.response.docs;
        // console.log(documents)
        
        this.otherResource = "";
        this.updateCheckBoxes(documents[0].resources, this.resources, "resources");
        this.updateCheckBoxes(documents[0].target, this.target, "target");
        this.updateCheckBoxes(documents[0].keywords, this.keywords_predefined, "keywords");
        this.updateCheckBoxes(documents[0].age, this.age, "age");
        this.updateCheckBoxes(documents[0].knowledgeArea, this.knowledgeArea, "knowledgeArea");
        
        this.updateTypicalLearningTime(documents[0].typicalLearningTime);
        let tokenInfo = this.rest.decodePayloadJWT();
        this.simple = {
          name: documents[0].name,
          language: documents[0].language,
          // keywords: documents[0].keywords,
          description: documents[0].description,
          interaction: documents[0].interaction,
          interactionNumber: documents[0].interactionNumber,
          licence: documents[0].licence,
          // target:  documents[0].target,
          // age:  documents[0].age,
          // knowledgeArea:  documents[0].knowledgeArea,
          // resources:  documents[0].resources[0],
          // typicalLearningTime: documents[0].typicalLearningTime,
          owner: documents[0].owner,
          favorites: documents[0].favorites, 
          free: documents[0].free,
          relationWith: (withRelations) ? this.updateRelations(documents[0].relationWith) : this.simple.relationWith,
          //authors: documents[0].author,
          author: this.updateAuthors(documents[0].author),
          status: this.getStatusScope(tokenInfo.roles)[2],
          reviewer: tokenInfo.sub
        }
      });
    }
  }

  // TODO: repeated function, refactor. Almost same as in profile
  getStatusScope(roles) {
    roles = roles.toString().split(',');
    for(let role of roles) {
      // console.log(role);
      switch(role) {
        case "tech_reviewer": return ["NEEDS_TECH_REVIEW", "UNDER_TECH_REVIEW", "NEEDS_PEDAG_REVIEW"];
        case "pedag_reviewer": return ["NEEDS_PEDAG_REVIEW", "UNDER_PEDAG_REVIEW", "REVIEWED"];
      }
    }
    return ['undefined','undefined', 'undefined'];
  }

  updateRelations(associatedRelations){
    // console.log(associatedRelations);
    let relation_ret = [];
    if(associatedRelations.length > 1) {
      // document.getElementById("relationDiv").style.display = "block";
      for(var i = 0; i < associatedRelations.length-1; i++) {
        let relations = associatedRelations[i];
        let rel_parts = relations.split(",")
        let rel_entry = rel_parts[0].split("=")[1];
        let rel_kind = rel_parts[1].split("=")[1];
        let rel_kind_fixed = rel_kind.substr(0, rel_kind.length - 1);
        if(rel_kind_fixed.trim() != ""){
          relation_ret.push({kind: rel_kind_fixed, entry: rel_entry});
          this.documentsTiny[i] = rel_entry;
          this.existRelation = true;
        } else {
          relation_ret.push({kind: "", entry: ""});
              this.documentsTiny[i] = "";
        }
      }
    } 
    return relation_ret;
  }

  updateTypicalLearningTime(durationTime){
    if(durationTime == "PT3H15M0S") {
      this.moreThanThreeHours = true;
      this.typicalLearningTime = 0;
    } else {
      this.moreThanThreeHours = false;
      let time = durationTime.split("H");
      let hours = time[0].replace("PT","") * 60;
      let minutes = time[1].replace("M0S","") * 1;  
      this.typicalLearningTime = hours + minutes;
    }
  }

  updateAuthors(authors_list){
    let contributors = [];
    for(var i = 0; i < authors_list.length-1; i++) {
        let aut = authors_list[i];
        let aut_parts = aut.split("=")
        let aut_name = aut_parts[1].split(",")[0];
        let aut_institution = aut_parts[2].split(",")[0];
        let aut_roles = [];
        
        if(aut_parts[3].includes(',')) {
          // console.log(aut_parts[3])
          let roles = aut_parts[3].split(",");
          for(var i = 0; i < roles.length; i++) {
            
            if(roles[i].includes('[')) {
              aut_roles.push(roles[i].substr(1, roles[i].length).trim())
            } else if(roles[i].includes(']')) {
              aut_roles.push(roles[i].substr(0, roles[i].length - 2).trim())
            } else {
              aut_roles.push(roles[i].trim());
            }
          }
        } else {
          aut_roles.push(aut_parts[3].substr(1, aut_parts[3].length - 3));
        }
        // console.log(aut_roles)
        contributors.push({name: aut_name, institution: aut_institution, role:aut_roles}); 
    }
    return contributors;
  }

  updateCheckBoxes(fields, fieldsList, varName) {
    var checkedFields = 0;
    for(var i = 0; i < fields.length; i++){
      for(var j = 0; j < fieldsList.length; j++){
        if(fieldsList[j].length > 0) {
          for(var k = 0; k < fieldsList[j].length; k++){
            if(fields[i] == fieldsList[j][k].name){
              fieldsList[j][k].isValid = true;
              checkedFields++;
            }
          }
        } else {
          if(fields[i] == fieldsList[j].name){
            fieldsList[j].isValid = true;
            checkedFields++;
          }
        }
      }
    }
    
    if(checkedFields != fields.length) {
      switch(varName) {
        case "keywords":
          for(var i = checkedFields; i < fields.length; i++){
            this.keywords.push(fields[i]);
          }
          break;
        case "resources":
          fieldsList[fieldsList.length-1][0].isValid = true;
          this.otherResource = fields[fields.length-1];
          document.getElementById("otherResourceForm").style.display = "block";
          break;
      }      
    }
  }

  // clearRelationSelection(): void {
  //   this.documentsTiny = [];
  // }

  openRelationDialog(index: number): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '800px',  height: '600px',
      data: {documentsTiny: this.documentsTiny}
    });

    dialogRef.afterClosed().subscribe(result => {
      var filteredResult = [];
      if(result){
        for(var i = 0; i < result.length; i++){
          if(result[i].selected) {
            filteredResult.push({id: result[i].id, title: result[i].title});
          }
        }
        this.documentsTiny[index] = filteredResult;
        // console.log(this.documentsTiny);
      } 
    });
  }

  changePreFillValue(event) {
    if(event.isUserInput) {
      // console.log(event.source.value, event.source.selected);
      if(event.source.value == "0") {
        if(confirm("Você deseja apagar todos os dados pré-preenchidos?")) {
          this.clearFormValues();
        }
      } else {
        this.getDocument(event.source.value, false);
      }
    }
  }

  clearCheckBoxes(fieldsList, varName) {
    for(var j = 0; j < fieldsList.length; j++){
      if(fieldsList[j].length > 0) {
        for(var k = 0; k < fieldsList[j].length; k++){
            fieldsList[j][k].isValid = false;
        }
      } else {
          fieldsList[j].isValid = false;
      }
    }
  }

  clearFormValues() {
    this.otherResource = "";
    this.keywords = [];
    this.clearCheckBoxes(this.resources, "resources");
    this.clearCheckBoxes(this.target, "target");
    this.clearCheckBoxes(this.keywords_predefined, "keywords");
    this.clearCheckBoxes(this.age, "age");
    this.clearCheckBoxes(this.knowledgeArea, "knowledgeArea");
    this.typicalLearningTime = 0;
    this.moreThanThreeHours = false;

    let tokenInfo = this.rest.decodePayloadJWT();
    this.simple = {
      name: "",
      language: "",
      // keywords: documents[0].keywords,
      description: "",
      interaction: "",
      interactionNumber: "",
      licence: "",
      owner: "",
      favorites: "", 
      free: "",
      relationWith: this.simple.relationWith,
      //authors: documents[0].author,
      author: this.updateAuthors([]),
      status: this.getStatusScope(tokenInfo.roles)[2],
      reviewer: tokenInfo.sub
    }
    this.addAuthor("","",["author"]);
  }

  radioInteractivityChange(event: MatRadioChange) {
    this.simple.interactionNumber = +event.value;
  }

  showRelationDiv(event: MatRadioChange) {
    if(+event.value) {
      document.getElementById("relationDiv").style.display = "block";
      this.existRelation = true;
    } else {
      document.getElementById("relationDiv").style.display = "none";
      this.existRelation = false;
      if(confirm("Você deseja apagar todos os dados pré-preenchidos?")) {
        this.clearFormValues();
      }
    }
  }

  setTypicalLearningTime(event: MatCheckboxChange) {
    this.moreThanThreeHours = event.checked;
    this.typicalLearningTime = 0;
  }

  finish(){

    document.body.style.cursor="wait";

    for (var propt in this.simple){
      if (Object.prototype.hasOwnProperty.call(this.simple, propt)) {
          if(this.simple[propt] == "" && !(propt == "id" || propt == "typicalLearningTime" ||
            propt == "relation")){
              alert('Preencha todos os campos necessários antes do envio.');
              return;
          }
      }
    }

    for(var i = 0; i < this.simple["author"].length; i++) {
      if(this.simple["author"][i].name.trim() == "" || 
          this.simple["author"][i].institution.trim() == "" ||
          this.simple["author"][i].role.length == 0) {
            alert('Preencha todos os campos necessários antes do envio.');
            return;
      }
    }

    if(this.existRelation) {
      for(var i = 0; i < this.simple["relationWith"].length; i++) {
        if(this.simple["relationWith"][i].entry.trim() == "") {
          alert('Preencha todos os campos necessários antes do envio.');
          return;
        }
      }
    } else {
      this.documentsTiny = [];
      this.simple.relationWith = [];
      this.addRelation("");
    }

    if(this.route.snapshot.paramMap.get('id') != null) {
      this.OBAA.id = parseInt(this.route.snapshot.paramMap.get('id'));
      console.log(this.route.snapshot.paramMap.get('id'))
      this.edit = "/edit";
    }
    
    this.OBAA.metadata.general.titles[0] = this.simple.name;
    this.OBAA.metadata.general.languages[0] = this.simple.language;
    this.OBAA.metadata.general.descriptions[0] = this.simple.description;
    this.OBAA.metadata.general.keywords[0] = this.simple.keywords.toString();

    this.updateSimple();
 
    this.addAuthor("","",["author"]); 
    this.addRelation("");

    for(var i = 0; i < this.contribute.length; i++){
      this.OBAA.metadata.lifeCycle.contribute[i] = this.contribute[i];
    }

    this.OBAA.metadata.educational.learningResourceTypes = this.simple.resources;
    this.OBAA.metadata.educational.interactivityLevel = this.simple.interaction;
    this.OBAA.metadata.educational.intendedEndUserRoles = this.simple.target;
    this.OBAA.metadata.educational.contexts = this.simple.age;
    if(this.typicalLearningTime != 0){
      this.OBAA.metadata.educational.typicalLearningTime = this.simple.typicalLearningTime;
    }
    this.OBAA.metadata.educational.knowledgeAreas = this.simple.knowledgeArea;

    this.OBAA.metadata.rights.cost = "false";
    this.OBAA.metadata.rights.copyright = "true";
    this.OBAA.metadata.rights.description = this.simple.licence;
    
    for(var i = 0; i < this.relation.length; i++){
      this.OBAA.metadata.relations.push(this.relation[i]);
    }
    
    
    this.OBAA.isVersion = "1";
    
    this.simple.id = this.OBAA.id;  
    
    // console.log( "BEFORE");
    // console.log(this.OBAA);
    // console.log(this.simple);

    this.rest.addDocument(JSON.stringify(this.OBAA), this.OBAA.id, this.edit).subscribe((data: {}) => {
      // console.log(data);
      // console.log(this.simple);
      
      this.rest.addDocumentSOLR(JSON.stringify([this.simple])).subscribe((data: {}) => {
        // console.log(data);
        

        this.uploader2.uploadAll();
      });
      alert("Documento adicionado com sucesso! Aguarde pela revisão!");
    });

    this.router.navigate(['/']);
    document.body.style.cursor="initial";
    
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
      //console.log(this.depth);
    }

    //console.log(this.finalSearch);

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

  //Pagination starts here
  page(page: number){
    this.resetPagesBoldness();

    var currentPageString = "page" + this.currentPage;
    var currentPageStep = "step" + this.currentPage;
    document.getElementById(currentPageString).style.fontWeight = "normal";
    document.getElementById(currentPageStep).style.display = "none";

    var newPageString = "page" + page;
    var newStepString = "step" + page;
    document.getElementById(newPageString).style.fontWeight = "bold";
    document.getElementById(newStepString).style.display = "block";
    
    this.currentPage = page;
    this.progressBarValue = (100/this.numPages) * page;

    if(page == this.numPages)
      this.updateSimple();
    
    window.scrollTo(0,0);

  }

  resetPagesBoldness(){
    for (var i = 1; i <= this.numPages; i++){
      var pageString = "page" + i;
      document.getElementById(pageString).style.fontWeight = "normal";

    }
  }

  nextPage(){
    // console.log('page: ' + this.currentPage);
    if (this.currentPage != this.numPages){
      this.page(this.currentPage + 1);
    }
  }

  prevPage(){
    if (this.currentPage != 1){
      this.page(this.currentPage - 1);
    }
  }

  formatLabel(value:number | null){
    switch(value){
      case 1:
        return "Nula";
      case 2:
        return "Baixa";
      case 3:
        return "Média";
      case 4:
        return "Alta";
      }
  }

  updateSimple(){
    this.simple.target = [];
    this.simple.resources = [];
    this.simple.age = [];
    this.simple.knowledgeArea = []; 
    this.simple.keywords = [];
    this.contribute = [];   
    this.relation = [];

    for(var i = 0; i < this.keywords_predefined.length; i++){
      for(var recIndex = 0; recIndex < this.keywords_predefined[i].length; recIndex++){
        if(this.keywords_predefined[i][recIndex].isValid){
          this.simple.keywords.push(this.keywords_predefined[i][recIndex].name);
        }
      }
    }

    for(var i = 0; i < this.keywords.length; i++){      
        this.simple.keywords.push(this.keywords[i]);
    }

    for(var i = 0; i < this.target.length; i++){
      for(var recIndex = 0; recIndex < this.target[i].length; recIndex++){
        if(this.target[i][recIndex].isValid){
          this.simple.target.push(this.target[i][recIndex].name);
        }
      }
    }

    for(var i = 0; i < this.age.length; i++){
      if(this.age[i].isValid){
        this.simple.age.push(this.age[i].name);
      }
    }

    for(var i = 0; i < this.knowledgeArea.length; i++){
      if(this.knowledgeArea[i].isValid){
        this.simple.knowledgeArea.push(this.knowledgeArea[i].name);
      }
    }

    
    for(var i = 0; i < this.resources.length; i++){
      for(var recIndex = 0; recIndex < this.resources[i].length; recIndex++){
        if(this.resources[i][recIndex].isValid){
          this.simple.resources.push(this.resources[i][recIndex].name);
        }
      }
    }

    for(var i = 0; i < this.simple.author.length; i++){
      for(var recIndex = 0; recIndex < this.simple.author[i].role.length; recIndex++){
        this.contribute.push({role:this.simple.author[i].role[recIndex], 
          entities:[this.simple.author[i].name , this.simple.author[i].institution]}); 
      }
    }
    
    for(var i = 0; i < this.simple.relationWith.length; i++){
      if (this.documentsTiny[i]){
        // console.log(this.documentsTiny[i])
        var entries = [];
        for(var j = 0; j < this.documentsTiny[i].length; j++) {
          entries.push(this.documentsTiny[i][j].id)
          
          // console.log(this.documentsTiny[i][j].id)
        }
        // this.documentsTiny[i].toString().split(',');
        for(var k = 0; k < entries.length; k++){
          this.relation.push({kind:this.simple.relationWith[i].kind, 
            resource:{identifier:[{catalog: "URI" , 
            entry: entries[k]}]}});
          this.simple.relationWith[i].entry = entries[k];
        }
      //TODO: group identifiers to the same kind
      }  else {
        this.relation.push({kind:this.simple.relationWith[i].kind, 
          resource:{identifier:[{catalog: "URI" , 
          entry: ""}]}});
      }
    }
    
    this.simple.interaction = this.formatLabel(this.simple.interactionNumber);

    // TypicalLearningTime must follow the rule PThHmMsS
    if(this.typicalLearningTime != 0){
      this.totalMinutes = this.typicalLearningTime;
      this.hours = ((this.totalMinutes - (this.totalMinutes % 60)) / 60);
      this.minutes = this.totalMinutes % 60;
      this.seconds = 0;

      this.simple.typicalLearningTime = "PT" + this.hours + "H" + this.minutes + "M" 
        + this.seconds + "S";
    }

    if(this.moreThanThreeHours){
      this.simple.typicalLearningTime = "PT3H15M0S";
    }
    
    if(this.otherResource!=""){
      this.simple.resources.pop();
      this.simple.resources.push(this.otherResource);
    }

    this.check();

    
  }

  addKeyword(){
    // var key = {
    //   name: this.control.value,
    //   isValid: true,
    // }
    this.keywords.push(this.control.value);
  }

  removeKeyord(i: number){
    this.keywords.splice(i,1);
  }

  removeDocTiny(i: number, k: number){
    this.documentsTiny[i].splice(k,1);
  }

  addAuthor(newName:string, newInsitution:string, newRole:string[]){
    var aut = {
      name: newName,
      institution:newInsitution,
      role:newRole,
    };
    this.simple.author.push(aut);
  }

  removeAuthor(i: number){
    this.simple.author.splice(i,1);
  }

  addRelation(newKind: string){
    var rel = {
      kind: newKind,
      entry:"",
    };
    this.simple.relationWith.push(rel);
  }

  removeRelation(i: number){
    this.documentsTiny.splice(i,1);
    this.simple.relationWith.splice(i,1);
  }

  addOtherResource(value:string, isValid:boolean){
    if(value == "Outro" && isValid){
      document.getElementById("otherResourceForm").style.display="";
    } else {
      document.getElementById("otherResourceForm").style.display="none";
      this.otherResource="";
    }
    
  }

  check() {
    var complete = true;
    document.getElementById("incomplete").style.display="block";

    for (var propt in this.simple){
      if (Object.prototype.hasOwnProperty.call(this.simple, propt)) {
          if(this.simple[propt] == "" && !(propt == "id" 
            || propt == "typicalLearningTime" || propt == "relation")){
            complete = false;
            //console.log(propt);
          }
      }
    }

    for(var i = 0; i < this.simple["author"].length; i++) {
      if(this.simple["author"][i].name.trim() == "" || 
          this.simple["author"][i].institution.trim() == "" ||
          this.simple["author"][i].role.length == 0) {
        complete = false;
      } 
    }

    if(this.existRelation) {
      for(var i = 0; i < this.simple["relationWith"].length; i++) {
        // console.log(this.simple["relationWith"][i])
        if(this.simple["relationWith"][i].entry.trim() == "") {
          complete = false;
        }
      }
    }

    if(complete)
      document.getElementById("incomplete").style.display="none";
    
    if(this.uploader2.queue.length == 0 && this.edit == ""){
      document.getElementById("uploadEmpty").style.display="block";
      return;
    }

    document.getElementById("uploadEmpty").style.display="none";
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  documentsTiny = [];
  searchText = "";
  
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    public rest: RestService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.search();
  }
  
  search(){
    this.documentsTiny = [];
    var finalString = "q=*:*"

    if(this.searchText != ""){
      finalString = "q=name:\""+ this.searchText + "\"";
    }
    
    this.rest.querySOLR(finalString).subscribe((data: any) => {
      var rec = data.response.docs;
      // console.log(rec);
      for (var x in rec){
        // console.log(x);
        this.documentsTiny.push({id:rec[x].id, title:rec[x].name, selected:false});
      }
      // console.log(this.documentsTiny);
    });

  }

}
