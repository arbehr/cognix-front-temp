import { Component, OnInit, Input, Inject } from '@angular/core';
import { OBAA, OBAACreator } from '../metadata';
import { emptyMockOBAA, emptyMockOBAACreator } from '../mock-data';

import { RestService, endpoint } from '../rest.service';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { ActivatedRoute, Router } from "@angular/router"
import { parameters } from '../search/searchParameters';
import { MatStepperModule } from '@angular/material/stepper'; 
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PedagogicalTemplateComponent } from '../pedagogical-template/pedagogical-template.component';
import { HttpClient } from '@angular/common/http';

export interface DialogData {
  documentsTiny: string;
}

@Component({
  selector: 'app-new-document-fast',
  templateUrl: './new-document-fast.component.html',
  styleUrls: ['./new-document-fast.component.css']
})

export class NewDocumentFastComponent implements OnInit {
  public async_titles;
  searchOptions: any;
  finalSearch: string;
  finalparam: string;
  finished:boolean;
  depth:number;
  path:number[];
  interactionNumber:number;
  typicalLearningTime:number;
  moreThanThreeHours:boolean;
  doNotApply:boolean;
  fortyFiveMin:boolean;
  NinetyMin:boolean;
  hours:number;
  minutes:number;
  seconds:number;
  totalMinutes:number;
  otherResource:"";
  target:any;
  age:any;
  resources:any;
  resources_predefined:any;
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
  preName: string;
  preDescription: string;
  fileId: string;
  fileThumb: string;
  existRelation: boolean;
  preFillValue: string;
  reviewerMainRole: string;
  withFile: boolean;

  OBAA: OBAACreator;
  public uploader: FileUploader = new FileUploader({url: endpoint + "/files/uploadFile", authToken: localStorage.getItem('token'), itemAlias: "file"});
  public uploader2: FileUploader = new FileUploader({url: endpoint + "/files/uploadFile", authToken: localStorage.getItem('token'), itemAlias: 'file'});
  
  controlKeyword = new FormControl();
  controlType = new FormControl();
  keywords_suggestions: string[] = ['Algas', 'Alterações climáticas', 'Amostragens', 'Áreas protegidas', 'Artes', 'Aves',
    'Baixa profundidade / Subtidal', 'Biotecnologia marinha', 'Circulação oceânica', 'Correntes',
    'Ecossistemas marinhos', 'Embarcações', 'Energia', 'Entre marés / Interdital', 'Equipamentos marítimos',
    'Espécies não indigenas / invasoras', 'Fontes hidrotermais', 'Invertebrados', 'Mamíferos marinhos', 'Marés',
    'Microorganismos e marés vermelhas', 'Ondas', 'Peixes', 'Plancton', 'Plantas costeiras', 'Plataforma continental',
    'Praias arenosas', 'Produtividade', 'Química da água do mar', 'Sustentabilidade', 'Tartarugas', 'Teias tróficas',
    'Tubarões', 'Turismo, Desporto, Lazer', 'Zona costeira', 'Recursos marinhos / Pescas'];
  filteredKeywords: Observable<string[]>;
  panelOpenState = false;
  keywords_suggestions_from_dbpedia: string[][];

  constructor(public rest:RestService, private router:Router, 
    private route: ActivatedRoute, private dialog: MatDialog,
    private http:HttpClient) { 
      this.edit = "";
      this.async_titles = [];
      this.withFile = true;
      
      if(this.route.snapshot.paramMap.get('id') != null) {
        this.rest.getDocumentFromID(parseInt(this.route.snapshot.paramMap.get('id'))).subscribe((data: any) => {
          Object.assign(this.OBAA,data);
          //get last updated files
          let maxIdFile = 0;
          for(let i = data.files.length-1; i >= 0 ; i--){
            if(data.files[i].name != "thumbnail") {
              if(data.files[i].id > maxIdFile) {
                this.fileId = endpoint  + "/files/" + data.files[i].id; 
                maxIdFile = data.files[i].id;
              } 
            }
          }
          this.fileThumb = endpoint  + "/files/" + this.route.snapshot.paramMap.get('id') + "/thumbnail";
        },
        (error) => {                              
          document.body.style.cursor="initial";
          alert("Erro ao editar, token inválido. Recarregue a página novamente.");
          //this.router.navigate([router.url]);
        });
        // this.OBAA.id = parseInt(this.route.snapshot.paramMap.get('id'));
        // console.log(this.route.snapshot.paramMap.get('id'))
        this.edit = "/edit";
        if(this.route.snapshot.paramMap.get('workflow_step') != null) {
          this.edit += "/?workflow_step=" + this.reviewerMainRole;
        } else {
          this.edit += "/?workflow_step=author";
        }
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
    this.keywords_suggestions_from_dbpedia = [];
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
      status:"INCOMPLETE",
      id:0,
      curriculumAreas: [],
      learningObjectives: "",
      linkOfLo: "",
      mainStrategies: "",
      relevantInfo: "",
    };
  }

  ngOnInit() {
    this.preFillValue = "";
    this.documentsTiny = [];
    this.currentPage = 1;
    this.numPages = 8;
    this.progressBarValue = 100/this.numPages;
    this.moreThanThreeHours = false;
    this.doNotApply = false;
    this.fortyFiveMin = false;
    this.NinetyMin=false;
    this.typicalLearningTime = 0;
    this.keywords = [];
    this.resources = [];
    this.preName = "";
    this.preDescription = "";

    this.age = [
      {col_1: {name: "Educação pré-escolar", isValid: false}}, 
      {col_1: {name: "Básico 1º ciclo", isValid: false}}, 
      {col_1: {name: "Básico 2º ciclo", isValid: false}},
      {col_1: {name: "Básico 3º ciclo", isValid: false}},
      {col_1: {name: "Ensino secundário", isValid: false}},
      {col_1: {name: "Ensino superior", isValid: false}},
      {col_1: {name: "Ensino profissional", isValid: false}},
    ]

    this.knowledgeArea = [
      {col_1: {name: "Ciências exatas", isValid: false}}, 
      {col_1: {name: "Ciências humanas", isValid: false}}, 
      {col_1: {name: "Ciências naturais", isValid: false}},
      {col_1: {name: "Ciências tecnológicas", isValid: false}},
    ]

    this.target = [
      {col_1: {name: "Professores/as", isValid: false}, 
       col_2: {name: "Formadores/as", isValid: false}},
      {col_1: {name: "Estudantes", isValid: false}, 
       col_2: {name: "Outros", isValid: false}}
    ]

    this.keywords_predefined = [
        {col_1: {name: "Biodiversidade", isValid: false}, 
         col_2: {name: "Ecologia marinha", isValid: false},
         col_3: {name: "Economia do mar", isValid: false}},
        {col_1: {name: "Geografia", isValid: false}, 
         col_2: {name: "Geologia / Fundos / Sedimentos", isValid: false},
         col_3: {name: "Mar profundo", isValid: false}},
        {col_1: {name: "Oceanografia", isValid: false}, 
         col_2: {name: "Património / Arqueologia subaquáticos", isValid: false},
         col_3: {name: "Poluição / Lixo / Ruído", isValid: false}},
    ]

    this.resources_predefined = [
      {col_1: {name: "Questionário", isValid: false}, 
       col_2: {name: "Problema", isValid: false},
       col_3: {name: "Prova", isValid: false},
       col_4: {name: "Enunciado de questão", isValid: false},
       col_5: {name: "", isValid: false}},
      {col_1: {name: "Plano de aula", isValid: false}, 
       col_2: {name: "Saída de campo", isValid: false},
       col_3: {name: "Experiência laboratorial", isValid: false},
       col_4: {name: "Guião", isValid: false},
       col_5: {name: "", isValid: false}},
      {col_1: {name: "Livro", isValid: false}, 
       col_2: {name: "Infografia", isValid: false},
       col_3: {name: "Página web", isValid: false},
       col_4: {name: "Texto teatral / dramatizado", isValid: false},
       col_5: {name: "Texto narrado", isValid: false}},
      {col_1: {name: "Documentário em vídeo", isValid: false}, 
       col_2: {name: "Demonstração filmada", isValid: false},
       col_3: {name: "Aula gravada ou filmada", isValid: false},
       col_4: {name: "", isValid: false},
       col_5: {name: "", isValid: false}},
      {col_1: {name: "Jogo", isValid: false}, 
       col_2: {name: "Simulação", isValid: false},
       col_3: {name: "", isValid: false},
       col_4: {name: "", isValid: false},
       col_5: {name: "", isValid: false}},
      // {col_1: {name: "Outro", isValid: false},
      //  col_2: {name: "", isValid: false},
      //  col_3: {name: "", isValid: false},
      //  col_4: {name: "", isValid: false},
      //  col_5: {name: "", isValid: false}}, 
    ]

    this.getDocument(this.route.snapshot.paramMap.get('id'), true, false);

    let tokenInfo = this.rest.decodePayloadJWT();
    this.reviewerMainRole = this.getReviewRole(tokenInfo.roles);
    
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

     this.filteredKeywords = this.controlKeyword.valueChanges.pipe(
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

  getReviewRole(roles) {
    roles = roles.toString().split(',');
    for(let role of roles) {
      // console.log(role);
      switch(role) {
        case "tech_reviewer": return "tech_reviewer";
        case "pedag_reviewer": return "pedag_reviewer";
      }
    }
    return "undefined";
  }

  getDocument(id, withRelations, checkNameAndDescription): void {
    if(id != null) {

      this.rest.querySOLR("q=id:" + id).subscribe((data: any) => {
        var documents = data.response.docs;
        // console.log(documents)
        
        this.otherResource = "";
        (documents[0].resources) ? this.updateCheckBoxes(documents[0].resources, this.resources_predefined, "resources", 5) : "";
        (documents[0].target) ? this.updateCheckBoxes(documents[0].target, this.target, "target", 2) : "";
        (documents[0].keywords) ? this.updateCheckBoxes(documents[0].keywords, this.keywords_predefined, "keywords", 3) : "";
        (documents[0].age) ? this.updateCheckBoxes(documents[0].age, this.age, "age", 1) : "";
        (documents[0].knowledgeArea) ? this.updateCheckBoxes(documents[0].knowledgeArea, this.knowledgeArea, "knowledgeArea", 1) : "";
        
        (documents[0].typicalLearningTime) ? this.updateTypicalLearningTime(documents[0].typicalLearningTime) : "";
        
        let tokenInfo = this.rest.decodePayloadJWT();
        this.simple = {
          name: documents[0].name,
          language: documents[0].language,
          // keywords: documents[0].keywords,
          description: documents[0].description,
          interaction: documents[0].interaction,
          interactionNumber: documents[0].interactionNumber,
          licence: documents[0].licence,
          owner: (withRelations) ? documents[0].owner : tokenInfo.sub,
          favorites: (withRelations) ? documents[0].favorites : [], 
          free: documents[0].free,
          relationWith: (withRelations) ? this.updateRelations(documents[0].relationWith) : this.simple.relationWith,
          author: this.updateAuthors(documents[0].author),
          status: (withRelations) ? documents[0].status : "INCOMPLETE",
          reviewer: tokenInfo.sub,
          curriculumAreas: documents[0].curriculumAreas,
          learningObjectives: documents[0].learningObjectives,
          linkOfLo: documents[0].linkOfLo,
          mainStrategies: documents[0].mainStrategies,
          relevantInfo: documents[0].relevantInfo,
        }
        if(checkNameAndDescription) {
          this.preName = documents[0].name;
          this.preDescription = documents[0].description;
        } else {
          this.preName = "";
          this.preDescription = "";
        }       
     
        if(this.simple.status != "INCOMPLETE") {
          // this.fileId = endpoint  + "/files/" + id;
          // this.fileThumb = endpoint  + "/files/" + id + "/thumbnail";
        
          document.getElementById("uploadFileDiv").style.display = "none";
          document.getElementById("uploadPhotoDiv").style.display = "none";
        }
      });
    }
  }

  nextStatusScope(status) {
    switch(status) {
      case "INCOMPLETE": return "NEEDS_TECH_REVIEW";
      case "UNDER_TECH_REVIEW": return "NEEDS_PEDAG_REVIEW";
      case "UNDER_PEDAG_REVIEW": return "REVIEWED";
      default: return "ERROR_STATUS";
    }
  }

  async getDocumentTitle(rel_entry,i,z){
    if (this.async_titles[i][z]) return;
    let response = await this.rest.querySOLR("q=id:" + rel_entry).toPromise();
    // console.log(response.response.docs[0].name);
    this.async_titles[i][z] = response.response.docs[0].name;
  }

  updateRelations(associatedRelations){
    let relation_ret = [];
    this.documentsTiny = new Array(associatedRelations.length);
    this.async_titles = new Array(associatedRelations.length);  
    
    if(associatedRelations.length > 1) {
      for(var i = 0; i < associatedRelations.length; i++) {
        let relations = associatedRelations[i];
        
        let rel_parts = relations.split("=");
        let rel_entries = rel_parts[1].substring(0, rel_parts[1].lastIndexOf(","));
        let rel_kind = rel_parts[2].toString().replace('}', '')
        
        if(rel_kind.trim() != "" || rel_entries.trim() != ""){
          var rel = {
            kind: rel_kind,
            entry:rel_entries,
          };
          this.simple.relationWith.push(rel);
          relation_ret.push(rel)
          var entries = [];
          
          if(rel_entries.indexOf(",") != -1) {
            entries = rel_entries.split(",");
          } else if (rel_entries.trim() != ""){
            entries.push(rel_entries);
          }

          this.documentsTiny[i] = [];
          this.async_titles[i] = [];
          for (let z = 0; z < entries.length; z++) {
            // console.log(entries[z])
            this.documentsTiny[i].push({id: entries[z], title: ""})
            this.getDocumentTitle(entries[z], i, z);
            this.existRelation = true;
          }       
        } else {
          this.documentsTiny.pop()
        }
      }
    } 
    return relation_ret;
  }

  updateTypicalLearningTime(durationTime){
    if(durationTime == "PT3H15M0S") {
      this.moreThanThreeHours = true;
      this.typicalLearningTime = 0;
      this.doNotApply = false;
    } else {
      this.moreThanThreeHours = false;
      let time = durationTime.split("H");
      let hours = time[0].replace("PT","") * 60;
      let minutes = time[1].replace("M0S","") * 1;  
      this.typicalLearningTime = hours + minutes;
      this.typicalLearningTime === 90 ? this.NinetyMin = true : this.NinetyMin = false;
      this.typicalLearningTime === 45 ? this.fortyFiveMin = true : this.fortyFiveMin = false; 
    }
  }

  updateAuthors(authors_list){
    let contributors = [];
    for(var i = 0; i < authors_list.length; i++) {
        // console.log(authors_list[i])
        var aut_parts = authors_list[i].split("=") 
        var aut_name = aut_parts[1].substring(0, aut_parts[1].lastIndexOf(","));
        var aut_institution = aut_parts[2].substring(0, aut_parts[2].lastIndexOf(","));
        var aut_role = aut_parts[3].toString().replace('[', '').replace(']', '').replace('}', '');

        var aut_roles = [];
        if(aut_role.indexOf(",") == -1) {
          aut_roles.push(aut_role);
        } else {
          aut_roles = aut_role.split(", ");
        }
        if(aut_name.trim() != "" || i == 0) {
          contributors.push({name: aut_name, institution: aut_institution, role:aut_roles}); 
        }        
    }
    return contributors;
  }

  updateCheckBoxes(fields, fieldsList, varName, colummns) {
    
    var checkedFields = 0;
    for(var i = 0; i < fields.length; i++){
      for(var j = 0; j < fieldsList.length; j++){
        for(var k = 1; k <= colummns; k++){
          if(fields[i] == fieldsList[j]["col_"+ k].name){
            fieldsList[j]["col_" + k].isValid = true;
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
          // fieldsList[fieldsList.length-1]["col_1"].isValid = true;
          // this.otherResource = fields[fields.length-1];
          // document.getElementById("otherResourceForm").style.display = "block";
          for(var i = checkedFields; i < fields.length; i++){
            this.resources.push(fields[i]);
          }
          break;
      }      
    }
  }

  async setSuggestions(ret_keywords) {
    console.log(ret_keywords.length)
    console.log(ret_keywords)
    for(let i=0; i < ret_keywords.length; i++){
      console.log(ret_keywords[i])
      this.keywords.push(ret_keywords[i]);
    }
  }

  getAnnotatedTextFromDbpediaSpotlight(text : string) {
    if(!text || text.trim() == "") {
      return;
    }
    //let keywords = [];
    //text = "Biodiversidade e Música que reflete aspetos do ciclo de vida do cagarro. Um cagarro juvenil (DJ Cagarro), ao sair do ninho pela primeira vez, enfrenta uma série de perigos, um dos quais as luzes de um camião que o desorientam, necessitando, assim, que alguém o salve.";
    this.http.get('https://api.dbpedia-spotlight.org/pt/annotate?text=' + text + '&confidence=0.2', {responseType: 'json'}).toPromise().then(data => {
      //console.log(`promise result: ${data}`);
      if(data["Resources"]) {
        for(let i=0; i < data["Resources"].length; i++) {
          let new_key = data["Resources"][i]["@surfaceForm"].substr(0,1).toUpperCase() + 
              data["Resources"][i]["@surfaceForm"].substr(1);
          
            let isPredefined = false;
            for(let k=0; k < this.keywords_predefined.length; k++) {
              if(this.keywords_predefined[k].col_1.name == new_key) {
                this.keywords_predefined[k].col_1.isValid = true;
                isPredefined = true;
              }
              if(this.keywords_predefined[k].col_2.name == new_key) {
                this.keywords_predefined[k].col_2.isValid = true;
                isPredefined = true;
              }
              if(this.keywords_predefined[k].col_3.name == new_key) {
                this.keywords_predefined[k].col_3.isValid = true;
                isPredefined = true;
              }
            }
            if(!isPredefined && this.keywords.indexOf(new_key) == -1) {
              this.keywords.push(new_key);
            }
            this.keywords_suggestions_from_dbpedia.push(new_key)  
        }
      }
    });
  }

  getSuggestions() {  
    this.getAnnotatedTextFromDbpediaSpotlight(this.simple.title);
    this.getAnnotatedTextFromDbpediaSpotlight(this.simple.description);
  }

  removeSuggestions() {
    for(let i = 0; i < this.keywords_suggestions_from_dbpedia.length; i++) {
      let index = this.keywords.indexOf(this.keywords_suggestions_from_dbpedia[i]);
      if (index > -1) {
        this.keywords.splice(this.keywords.indexOf(this.keywords_suggestions_from_dbpedia[i]),1);
      }
      for(let k=0; k < this.keywords_predefined.length; k++) {
        if(this.keywords_predefined[k].col_1.name == this.keywords_suggestions_from_dbpedia[i]) {
          this.keywords_predefined[k].col_1.isValid = false;
        }
        if(this.keywords_predefined[k].col_2.name == this.keywords_suggestions_from_dbpedia[i]) {
          this.keywords_predefined[k].col_2.isValid = false;
        }
        if(this.keywords_predefined[k].col_3.name == this.keywords_suggestions_from_dbpedia[i]) {
          this.keywords_predefined[k].col_3.isValid = false;
        }
      }     
    }
  }

  resetTemplateFields(withFile: boolean) {
    (withFile) ? this.simple.relevantInfo = "" : this.simple.mainStrategies = "";
  }

  openPedagogicalTemplateDialog(withFile: boolean) : void {
    this.withFile = withFile;
    this.resetTemplateFields(withFile);
    let dialogRef = this.dialog.open(PedagogicalTemplateComponent, {
      width: '800px',  height: '600px',
      data: [this.simple, withFile, false]
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.simple.curriculumAreas = result.curriculumAreas;
        this.simple.learningObjectives = result.learningObjectives;
        this.simple.linkOfLo = result.linkOfLo;
        this.simple.mainStrategies = result.mainStrategies;
        this.simple.relevantInfo = result.relevantInfo;
      }
    });
  }

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
        this.getDocument(event.source.value, false, true);
        for(var i = 2; i <= this.numPages; i++){      
          document.getElementById("page"+i).style.fontWeight = "normal";
          document.getElementById("page"+i).style.color = "#000000";
        }
      }
    }
  }

  clearCheckBoxes(fieldsList, varName, colummns) {
    for(var i = 0; i < fieldsList.length; i++){
      for(var j = 0; j < fieldsList.length; j++){
        for(var k = 1; k <= colummns; k++){
            fieldsList[j]["col_" + k].isValid = false;
        }
      }
    }
  }

  clearFormValues() {
    this.otherResource = "";
    this.keywords = [];
    this.resources = [];
    this.clearCheckBoxes(this.resources_predefined, "resources", 5);
    this.clearCheckBoxes(this.target, "target", 2);
    this.clearCheckBoxes(this.keywords_predefined, "keywords", 3);
    this.clearCheckBoxes(this.age, "age", 1);
    this.clearCheckBoxes(this.knowledgeArea, "knowledgeArea", 1);
    this.typicalLearningTime = 0;
    this.moreThanThreeHours = false;
    this.doNotApply = false;
    this.fortyFiveMin = false;
    this.NinetyMin = false;

    let tokenInfo = this.rest.decodePayloadJWT();
    this.simple = {
      name: "",
      language: "",
      // keywords: documents[0].keywords,
      description: "",
      interaction: "",
      interactionNumber: "",
      licence: "",
      owner: tokenInfo.sub,
      favorites:["admin"],
      free:"yes",
      relationWith: this.simple.relationWith,
      //authors: documents[0].author,
      author: this.updateAuthors([]),
      status: "INCOMPLETE",
      reviewer: tokenInfo.sub
    }
    this.addAuthor("","",["author"]);
  }

  radioInteractivityChange(event: MatRadioChange) {
    this.simple.interactionNumber = +event.value;
  }

  showRelationDiv(event: MatRadioChange) {
    if(+event.value) {
      this.existRelation = true;
    } else {
      this.existRelation = false;
      if(this.preFillValue != "" && confirm("Você deseja apagar todos os dados pré-preenchidos?")) {
        this.clearFormValues();
      }
    }
  }

  setTypicalLearningTime(checkboxName, event: MatCheckboxChange) {
    switch(checkboxName) {
      case "fortyFiveMin":
        this.fortyFiveMin = event.checked;
        this.typicalLearningTime = 45;  
        this.moreThanThreeHours = false;
        this.doNotApply = false;
        this.NinetyMin = false;
        break;
      case "NinetyMin":
        this.NinetyMin = event.checked;
        this.typicalLearningTime = 90; 
        this.fortyFiveMin = false; 
        this.moreThanThreeHours = false;
        this.doNotApply = false;
        break;      
      case "moreThanThreeHours": 
        this.typicalLearningTime = 0;  
        this.moreThanThreeHours = event.checked;
        this.doNotApply = false;
        this.fortyFiveMin = false; 
        this.NinetyMin = false;
        break;
      case "doNotApply": 
        this.typicalLearningTime = 0;
        this.moreThanThreeHours = false;
        this.doNotApply = event.checked;
        this.fortyFiveMin = false; 
        this.NinetyMin = false;
        break;
      default:
        checkboxName === 90 ? this.NinetyMin = true : this.NinetyMin = false;
        checkboxName === 45 ? this.fortyFiveMin = true : this.fortyFiveMin = false; 
        this.moreThanThreeHours = false;
        this.doNotApply = false;
        break;      
    }
  }

  save(){
    document.body.style.cursor="wait";
    let removeExtraAuthor = false;
    let removeExtraRelation = false;

    this.updateSimple();

    if(this.simple.author.length == 1) {
      this.addAuthor("","",["author"]);
      removeExtraAuthor = true;
    }
    
    if(this.simple.relationWith.length == 1) {
      this.addRelation("");
      removeExtraRelation = true;
    }    

    this.simple.id = this.OBAA.id;  
  
    // console.log(this.simple)
    this.rest.addDocumentSOLR(JSON.stringify([this.simple])).subscribe(
      result => {
        alert("Objeto salvo com sucesso!")
      },
      error => {
          alert("Erro ao salvar objeto!")
          console.log(error);
      }
  ); 
    if(removeExtraAuthor) {
      this.simple.author.pop();
    }
    if(removeExtraRelation) {
      this.simple.relationWith.pop();
    }
    document.body.style.cursor="initial";
  }

  finish(){

    document.body.style.cursor="wait";

    for (var propt in this.simple){
      if (Object.prototype.hasOwnProperty.call(this.simple, propt)) {
          if(this.simple[propt] == "" && !(propt == "id" 
            || propt == "typicalLearningTime" || propt == "relation"
            || propt == "favorites" || propt == "relevantInfo" 
            || propt == "mainStrategies")){
              document.body.style.cursor="initial";
              alert('Preencha todos os campos necessários antes do envio.');
              return;
          }
          // Aditional info check
          if(this.simple[propt] == "" && !this.withFile && (propt == "relevantInfo")) {
              alert('Preencha todos os campos necessários antes do envio.');
              return;
          }
          if(this.simple[propt] == "" && this.withFile && (propt == "linkOfLo"
            || propt == "mainStrategies")) {
              alert('Preencha todos os campos necessários antes do envio.');
              return;
          }
      }
    }

    if(this.preName.trim() == this.simple.name.trim() ||
      this.preDescription.trim() == this.simple.description.trim()) {
      document.body.style.cursor="initial";
      alert('Título e descrição do objeto não podem ser iguais ao do objeto relacionado.');
            return;
    } 

    for(var i = 0; i < this.simple["author"].length; i++) {
      if(this.simple["author"][i].name.trim() == "" || 
          //this.simple["author"][i].institution.trim() == "" ||
          this.simple["author"][i].role.length == 0) {
            document.body.style.cursor="initial";
            alert('Preencha todos os campos necessários antes do envio.');
            return;
      }
    }

    if(this.existRelation) {
      for(var i = 0; i < this.simple["relationWith"].length; i++) {
        if(this.simple["relationWith"][i].entry.trim() == "") {
          document.body.style.cursor="initial";
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
      if(this.route.snapshot.paramMap.get('workflow_step') != null) {
        this.edit += "/?workflow_step=" + this.reviewerMainRole;
      } else {
        this.edit += "/?workflow_step=author";
      }
    }

    this.OBAA.metadata.general.titles[0] = this.simple.name;
    this.OBAA.metadata.general.languages[0] = this.simple.language;
    this.OBAA.metadata.general.descriptions[0] = this.simple.description;
    this.OBAA.metadata.general.keywords[0] = this.simple.keywords.toString();

    // this.updateSimple();
 
    this.addAuthor("","",["author"]); 
    this.addRelation("");
    console.log(this.simple.status)
    this.simple.status = this.nextStatusScope(this.simple.status);
    console.log(this.simple.status)
    this.save();

    for(var i = 0; i < this.contribute.length; i++){
      if(this.contribute[i].entities[0] != "") {
        this.OBAA.metadata.lifeCycle.contribute[i] = this.contribute[i];
      }
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
      if(this.relation[i].kind != "") {
        this.relation[i].resource.identifier[0].entry =  "http://re-mar.uac.pt/repositorio/documents/" + 
          this.relation[i].resource.identifier[0].entry;
        this.OBAA.metadata.relations.push(this.relation[i]);
      }
    }
    
    this.OBAA.isVersion = "1";
    
    // this.simple.id = this.OBAA.id;  
    
    // console.log( "BEFORE");
    // console.log(this.OBAA);
    // console.log(this.simple);

    this.rest.addDocument(JSON.stringify(this.OBAA), this.OBAA.id, this.edit).subscribe((data: {}) => {
      this.uploader2.uploadAll();
      if(this.fileId != ""){
        this.uploader.uploadAll();
      }
      alert("Objeto adicionado com sucesso! Aguarde pela revisão!");
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
    if(page == 8) console.log(this.simple)
    var currentPageString = "page" + this.currentPage;
    var currentPageStep = "step" + this.currentPage;
    document.getElementById(currentPageString).style.fontWeight = "normal";
    document.getElementById(currentPageStep).style.display = "none";
    document.getElementById(currentPageString).style.color = "#000000";

    var newPageString = "page" + page;
    var newStepString = "step" + page;
    document.getElementById(newPageString).style.fontWeight = "bold";
    document.getElementById(newStepString).style.display = "block";
    document.getElementById(newPageString).style.color = "#81D6FF";
    
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
      for(var recIndex = 1; recIndex <= this.keywords_predefined.length; recIndex++){
        if(this.keywords_predefined[i]["col_" + recIndex].isValid){
          this.simple.keywords.push(this.keywords_predefined[i]["col_" + recIndex].name);
        }
      }
    }

    for(var i = 0; i < this.keywords.length; i++){      
        this.simple.keywords.push(this.keywords[i]);
    }

    for(var i = 0; i < this.target.length; i++){
      for(var recIndex = 1; recIndex <= this.target.length; recIndex++){
        if(this.target[i]["col_" + recIndex].isValid){
          this.simple.target.push(this.target[i]["col_" + recIndex].name);
        }
      }
    }

    for(var i = 0; i < this.age.length; i++){
      if(this.age[i]["col_1"].isValid){
        this.simple.age.push(this.age[i]["col_1"].name);
      }
    }

    for(var i = 0; i < this.knowledgeArea.length; i++){
      if(this.knowledgeArea[i]["col_1"].isValid){
        this.simple.knowledgeArea.push(this.knowledgeArea[i]["col_1"].name);
      }
    }

    

    for(var i = 0; i < this.resources_predefined.length; i++){
      for(var recIndex = 1; recIndex < this.resources_predefined.length; recIndex++){
        if(this.resources_predefined[i]["col_" + recIndex].isValid){
          this.simple.resources.push(this.resources_predefined[i]["col_" + recIndex].name);
        }
      }
    }

    for(var i = 0; i < this.resources.length; i++){      
      this.simple.resources.push(this.resources[i]);
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
        // console.log(entries)
        // this.documentsTiny[i].toString().split(',');
        for(var k = 0; k < entries.length; k++){
          this.relation.push({kind:this.simple.relationWith[i].kind, 
            resource:{identifier:[{catalog: "URI" , 
            entry: entries[k]}]}});
          
        }
        this.simple.relationWith[i].entry = entries.toString();
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
    } else {
      this.simple.typicalLearningTime = "";
    }

    if(this.moreThanThreeHours){
      this.simple.typicalLearningTime = "PT3H15M0S";
    }

    if(this.otherResource){
      this.simple.resources.pop();
      this.simple.resources.push(this.otherResource);
    }

    this.check();
  }

  addType() {
    if(this.resources.indexOf(this.controlType.value) == -1) {
      this.resources.push(this.controlType.value);
    }
  }

  removeType(i: number){
    this.resources.splice(i,1);
  }

  addKeyword(){
    if(this.keywords.indexOf(this.controlKeyword.value) == -1) {
      this.keywords.push(this.controlKeyword.value);
    }
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

  check() {
    var complete = true;
    var fieldsMissing = [];
    document.getElementById("incomplete").style.display="block";
    document.getElementById("finishbutton").style.display="none";

    // TODO: analisar melhor como controlar campos do template!
    for (var propt in this.simple){
      if (Object.prototype.hasOwnProperty.call(this.simple, propt)) {
          if(this.simple[propt] == "" && !(propt == "id" 
            || propt == "typicalLearningTime" || propt == "relation"
            || propt == "favorites" || propt == "relevantInfo" 
            || propt == "mainStrategies")){
            complete = false;
            fieldsMissing.push(propt);
          }
          // Aditional info check
          if(this.simple[propt] == "" && !this.withFile && (propt == "relevantInfo")) {
              complete = false;
              fieldsMissing.push(propt);
          }
          if(this.simple[propt] == "" && this.withFile && (propt == "linkOfLo"
            || propt == "mainStrategies")) {
              complete = false;
              fieldsMissing.push(propt);
          }
      }
    }

    for(var i = 0; i < this.simple["author"].length; i++) {
      if(this.simple["author"][i].name.trim() == "" || 
          //this.simple["author"][i].institution.trim() == "" ||
          this.simple["author"][i].role.length == 0) {
        complete = false;
        fieldsMissing.push("author");
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

    if(complete) {
      document.getElementById("incomplete").style.display="none";
      document.getElementById("sameLO").style.display="none";
      if(this.existRelation) {
        if(this.preName.trim() == this.simple.name.trim() ||
         this.preDescription.trim() == this.simple.description.trim()) {
            document.getElementById("sameLO").style.display="block";
        }
      }
    }
    
    for(var i = 0; i < fieldsMissing.length; i++){      
      let page = this.fieldPage(fieldsMissing[i]);
      document.getElementById("page"+page).style.fontWeight = "bold";
      document.getElementById("page"+page).style.color = "#ff0000";
    }

    if(this.uploader2.queue.length == 0 && this.withFile &&
      this.simple.status == "INCOMPLETE" && this.fileId == ""){
        document.getElementById("uploadEmpty").style.display="block";
        document.getElementById("page1").style.fontWeight = "bold";
        document.getElementById("page1").style.color = "#ff0000";
        return;
    }

    document.getElementById("uploadEmpty").style.display="none";
    if(complete) {
      document.getElementById("finishbutton").style.display="";
    }    
  }

  displayedTableColumms(size: number) {
    let colummns = [];

    for(var i=1; i <= size; i++) {
      colummns.push("col_" + i);
    }

    return colummns;
  }

  fieldPage(field) {
    switch(field) {
      case "curriculumAreas":
      case "learningObjectives":
      case "linkOfLo":
      case "mainStrategies":
      case "relevantInfo": return 1;
      case "name":
      case "language":
      case "keywords":
      case "description":
      case "resources": return 3;
      case "interactionNumber": return 4;
      case "target":
      case "age": 
      case "knowledgeArea": return 5;
      case "licence": return 6;
      case "author": return 7;
    }
  }
}

@Component({
  selector: 'dialog-search-documents',
  templateUrl: 'dialog-search-documents.html',
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
      finalString = "q=name:\""+ this.searchText + "*\"";
    }
    finalString += "&fq=status:REVIEWED";

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
