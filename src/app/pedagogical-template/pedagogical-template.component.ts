import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { RestService, endpoint } from '../rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-pedagogical-template',
  templateUrl: './pedagogical-template.component.html',
  styleUrls: ['./pedagogical-template.component.css']
})
export class PedagogicalTemplateComponent implements OnInit {

  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  @ViewChild('curriculumAreasLine') inputCurriculumAreas;
  @ViewChild('learningObjectives') inputLearningObjectives;
  @ViewChild('mainStrategies') inputMainStrategies;
  @ViewChild('relevantInfo') inputRelevantInfo;

  curriculumAreas: any;
  withFile: boolean;
  existOtherCurriculumArea: boolean;
  template: any;
  isReadOnly: boolean;

  constructor(
    public dialogRef: MatDialogRef<PedagogicalTemplateComponent>,
    public rest: RestService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.withFile = this.data[1];
      this.template = {
        curriculumAreas: this.data[0].curriculumAreas,
        otherCurriculumArea: "",
        learningObjectives: this.data[0].learningObjectives,
        mainStrategies: this.data[0].mainStrategies,
        linkOfLo: this.data[0].linkOfLo,
        duration: this.data[0].duration,
        relevantInfo: this.data[0].relevantInfo,
      }
    }

  ngOnInit(): void {

    this.existOtherCurriculumArea = false;

    this.curriculumAreas = [
      [{ name: "Matemática", isValid: false }],
      [{ name: "Português", isValid: false }],
      [{ name: "Estudo do Meio", isValid: false }],
      [{ name: "Expressões (Plástica, Musical, Dramática/Teatro)", isValid: false }],
      [{ name: "Educação Física", isValid: false }],
      [{ name: "Cidadania", isValid: false }],
      [{ name: "Ciências Naturais", isValid: false }],
      [{ name: "Inglês", isValid: false }],
      [{ name: "TIC", isValid: false }],
      [{ name: "História", isValid: false }],
      [{ name: "Educação Visual", isValid: false }],
      [{ name: "Educação Tecnológica", isValid: false }],
      [{ name: "Educação Musical", isValid: false }],
      [{ name: "Biologia", isValid: false }],
      [{ name: "Geografia", isValid: false }],
      [{ name: "Físico-Química", isValid: false }],
      [{ name: "Outra:", isValid: false }],
    ]

    // console.log(this.template.curriculumAreas)

    let curriculumAreasCount = 0;
    for(let i=0; i < this.data[0].curriculumAreas.length; i++) {
      for(let j=0; j < this.curriculumAreas.length; j++){
        if(this.data[0].curriculumAreas[i] == this.curriculumAreas[j][0].name) {
          this.curriculumAreas[j][0].isValid = true;
          curriculumAreasCount++;
        }
      }
    }
    if(curriculumAreasCount < this.data[0].curriculumAreas.length) {
      this.existOtherCurriculumArea = true;
      this.curriculumAreas[this.curriculumAreas.length-1][0].isValid = true;
      this.template.otherCurriculumArea = this.data[0].curriculumAreas[curriculumAreasCount];
    }

    // Readonly
    // console.log(this.data[2])
    this.isReadOnly = false;
    if(this.data[2]) {
      this.isReadOnly = true;
    }
  }

  onSave() {
    this.updateTemplate();
    this.dialogRef.close(this.template);
  }

  updateTemplate() {
    this.template.curriculumAreas = [];
    for(let i = 0; i < this.curriculumAreas.length-1; i++){
      if(this.curriculumAreas[i][0].isValid){
        this.template.curriculumAreas.push(this.curriculumAreas[i][0].name);
      }
    }
    if(this.existOtherCurriculumArea) {
      this.template.curriculumAreas.push(this.template.otherCurriculumArea);
    }
  }

  addOtherCurriculumArea(name: string, active: boolean): void {
    if(name == 'Outra:' && active) {
      this.existOtherCurriculumArea = true;
    }
    if(name == 'Outra:' && !active) {
      this.existOtherCurriculumArea = false;
      this.template.otherCurriculumArea = "";
    }
  }

  async onDownload() {
    this.hideButtons();
    let hidedAllCheckboxes = this.hideNotSelectedCheckBoxes();
    this.copyTextAreaToDiv();
    const DATA = this.pdfTable.nativeElement;
    const doc: jsPDF = new jsPDF("p", "pt", "a4");
    
    await doc.html(DATA, {
       callback: (doc) => {
         doc.output("dataurlnewwindow");
       }
    });

    this.showCheckBoxes(hidedAllCheckboxes);
    this.showButtons();
  }

  showCheckBoxes(hidedAllCheckboxes) {
    const checkbox = Array.from(document.getElementsByClassName('mat-checkbox-inner-container'));
    let i = 0;
    checkbox.forEach((element) => {
      element.innerHTML = hidedAllCheckboxes[i];
      i++;
    });
  }

  showButtons() {
    document.getElementById("closebutton").style.display="block";
    if(!this.isReadOnly) {
      document.getElementById("savebutton").style.display="block";
    }
    document.getElementById("downloadbutton").style.display="block";
  }

  hideButtons() {
    document.getElementById("closebutton").style.display="none";
    if(!this.isReadOnly) {
      document.getElementById("savebutton").style.display="none";
    }
    document.getElementById("downloadbutton").style.display="none";
  }

  hideInputs() {
    this.inputLearningObjectives.nativeElement.style.display="none";
    if(document.getElementById("mainStrategies") != undefined) {
      this.inputMainStrategies.nativeElement.style.display="none";
    }
    if(document.getElementById("relevantInfo") != undefined) {
      this.inputRelevantInfo.nativeElement.style.display="none";
    }
  }

  copyTextAreaToDiv() {
    let inputValues = [];
    this.inputCurriculumAreas.nativeElement.style.display="block";
    inputValues.push(this.inputLearningObjectives.nativeElement.value);
    if(document.getElementById("mainStrategies") != undefined) {
      inputValues.push(this.inputMainStrategies.nativeElement.value);
    }    
    if(document.getElementById("relevantInfo") != undefined) {
      inputValues.push(this.inputRelevantInfo.nativeElement.value);
    }    
    
    this.hideInputs();

    const printLearningObjectives = Array.from(document.getElementsByClassName('printToDiv'));
    let i = 0;
    printLearningObjectives.forEach((element) => {
      if(i < inputValues.length) {
        element.innerHTML = inputValues[i];
      }
      i++;
    });
  }

  hideNotSelectedCheckBoxes() {
    
    //NOTE: checkboxes and textareas are not displaying well with jspdf
    const checkbox = Array.from(document.getElementsByClassName('mat-checkbox-inner-container'));
    let hidedAllCheckboxes = [];
    checkbox.forEach((element) => {
      hidedAllCheckboxes.push(element.innerHTML);
      element.innerHTML = '<div></div>';
    });

    for(let i = 0; i < this.curriculumAreas.length; i++){
      if(!this.curriculumAreas[i][0].isValid){       
        document.getElementById("curriculumAreasLine"+i).style.display="none";
      } 
      if(this.curriculumAreas[i][0].name == "Outra:" && this.template.otherCurriculumArea.trim() == "") {
        document.getElementById("curriculumAreasLine"+i).style.display="none";
        this.existOtherCurriculumArea = false;
      } 
    }

    return hidedAllCheckboxes;
  }

  public onClose() {
    this.dialogRef.close();
  }

}