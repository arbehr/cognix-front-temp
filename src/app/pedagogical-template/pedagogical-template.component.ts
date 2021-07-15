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

  @ViewChild('curriculumAreasLine') inputCurriculumAreas;
  @ViewChild('learningObjectives') inputLearningObjectives;
  @ViewChild('mainStrategies') inputMainStrategies;
  @ViewChild('relevantInfo') inputRelevantInfo;
  @ViewChild('linkOfLo') linkOfLo;

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
    let titleFontSize = 18;
    let textFontSize = 14;
    let textPageSize = 550;
    let xPos = 50;
    let yPos = 50;
    this.hideButtons();

    const doc: jsPDF = new jsPDF("p", "pt", "a4");
    doc.setFont("Helvetica");
    doc.setFontSize(titleFontSize);
    doc.text("Informação pedagógica", xPos, yPos);
    yPos +=5;
    doc.line(xPos, yPos, textPageSize, yPos);
    yPos += 3 * textFontSize;

    doc.setFontSize(textFontSize);
    let curriculumAreasText = "Área(s) Curricular(es): (identifique a ou as àreas " +
      "curriculares que podem ser potenciadas, numa perspectiva integradora, com a utilização do " +
      "objeto de aprendizagem)";
    let splittedText = doc.splitTextToSize(curriculumAreasText, textPageSize)  
    doc.text(splittedText, xPos, yPos);

    yPos += splittedText.length * textFontSize;
    yPos += 2 * textFontSize;
    
    for(let i = 0; i < this.curriculumAreas.length; i++) {
      if(this.curriculumAreas[i][0].isValid && this.curriculumAreas[i][0].name != "Outra:") {
        doc.text(this.curriculumAreas[i][0].name, xPos + 20, yPos)
        yPos += 2 * textFontSize;
      }
    }
    if(this.existOtherCurriculumArea) {
      doc.text(this.template.otherCurriculumArea, xPos + 20, yPos);
      yPos += 2 * textFontSize;
    }

    yPos += 2 * textFontSize;
    doc.text("Objetivos de Aprendizagem:", xPos, yPos);
    yPos += 2 * textFontSize;
    
    let learningObjectivesTextFromInput = this.inputLearningObjectives.nativeElement.value;
    splittedText = doc.splitTextToSize(learningObjectivesTextFromInput, textPageSize-50)  

    if(yPos + splittedText.length * textFontSize + 2 * textFontSize > 
        doc.internal.pageSize.height - 50) {
      yPos = 50;
      doc.addPage();
    } 

    doc.text(splittedText, xPos, yPos);
    yPos += splittedText.length * textFontSize;
    yPos += 2 * textFontSize;

    if(this.withFile) {
      let mainStrategiesText = "Principais estratégias: (enumere as estratégias fundamentais " + 
        "para a utilização do objeto de aprendizagem ou qualquer outra informação que considere " + 
        "relevante, por exemplo, tipo de livro ou questionário)";
      splittedText = doc.splitTextToSize(mainStrategiesText, textPageSize -50)  
  
      if(yPos + splittedText.length * textFontSize + 2 * textFontSize > 
          doc.internal.pageSize.height - 50) {
        yPos = 50;
        doc.addPage();
      } 
      
      doc.text(splittedText, xPos, yPos);
      yPos += splittedText.length * textFontSize;
      yPos += 2 * textFontSize;

      let mainStrategiesTextFromInput = this.inputMainStrategies.nativeElement.value;
      splittedText = doc.splitTextToSize(mainStrategiesTextFromInput, textPageSize -50)  
      
      if(yPos + splittedText.length * textFontSize + 2 * textFontSize > 
          doc.internal.pageSize.height - 50) {
        yPos = 50;
        doc.addPage();
      }  

      doc.text(splittedText, xPos, yPos);
      yPos += splittedText.length * textFontSize;
      yPos += 2 * textFontSize;

      let linkOfLoText = "Link de acesso ao OA se aplicável:";
      if(yPos + 1 * textFontSize + 2 * textFontSize > 
        doc.internal.pageSize.height - 50) {
        yPos = 50;
        doc.addPage();
      } 
      
      doc.text(linkOfLoText, xPos, yPos);
      yPos += 1 * textFontSize;
      yPos += 2 * textFontSize;

      let linkOfLoTextFromInput = this.linkOfLo.nativeElement.value;
      splittedText = doc.splitTextToSize(linkOfLoTextFromInput, textPageSize -50)  
      
      if(yPos + splittedText.length * textFontSize + 2 * textFontSize > 
          doc.internal.pageSize.height - 50) {
        yPos = 50;
        doc.addPage();
      }
      
      doc.text(splittedText, xPos, yPos);
      yPos += splittedText.length * textFontSize;
      yPos += 2 * textFontSize;

    } else {
      let linkOfLoText = "Link de acesso:";
      if(yPos + 1 * textFontSize + 2 * textFontSize > 
        doc.internal.pageSize.height - 50) {
        yPos = 50;
        doc.addPage();
      } 
      
      doc.text(linkOfLoText, xPos, yPos);
      yPos += 1 * textFontSize;
      yPos += 2 * textFontSize;

      let linkOfLoTextFromInput = this.linkOfLo.nativeElement.value;
      splittedText = doc.splitTextToSize(linkOfLoTextFromInput, textPageSize -50)  
      
      if(yPos + splittedText.length * textFontSize + 2 * textFontSize > 
          doc.internal.pageSize.height - 50) {
        yPos = 50;
        doc.addPage();
      }
      
      doc.text(splittedText, xPos, yPos);
      yPos += splittedText.length * textFontSize;
      yPos += 2 * textFontSize;

      let relevantInfoText = "Informação relevante a destacar:";
      
      if(yPos + 1 * textFontSize + 2 * textFontSize > 
        doc.internal.pageSize.height - 50) {
        yPos = 50;
        doc.addPage();
      } 
      
      doc.text(relevantInfoText, xPos, yPos);
      yPos += 1 * textFontSize;
      yPos += 2 * textFontSize;

      let relevantInfoTextFromInput = this.inputRelevantInfo.nativeElement.value;
      splittedText = doc.splitTextToSize(relevantInfoTextFromInput, textPageSize -50)  
      
      if(yPos + splittedText.length * textFontSize + 2 * textFontSize > 
          doc.internal.pageSize.height - 50) {
        yPos = 50;
        doc.addPage();
      }  

      doc.text(splittedText, xPos, yPos);
      yPos += splittedText.length * textFontSize;
      yPos += 2 * textFontSize;

    }

    // console.log(yPos)

    doc.save("Informação pegagógica.pdf");

    this.showButtons();
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

  public onClose() {
    this.dialogRef.close();
  }

}