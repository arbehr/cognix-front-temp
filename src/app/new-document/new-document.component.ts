import { Component, OnInit } from '@angular/core';
import { Metadata } from '../metadata';
import { emptyMock } from '../mock-data';

@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.css']
})
export class NewDocumentComponent implements OnInit {

  metadata: Metadata;

  constructor() { }
  ngOnInit() {
    this.metadata = emptyMock;
  }
  saveData(): void {
    let json = JSON.stringify(this.metadata);
  }

  formatLabel(value:number | null){
    switch(value){
      case 1:
        return "Nula";
        break;
      case 2:
        return "Baixa";
        break;
      case 3:
        return "Média";
        break;
      case 4:
        return "Alta";
        break;
    
      }
  }
}
