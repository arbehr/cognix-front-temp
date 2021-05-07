import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-show-metadata',
  templateUrl: './show-metadata.component.html',
  styleUrls: ['./show-metadata.component.css']
})
export class ShowMetadataComponent implements OnInit {

  @Input() simple:any;

  constructor() { }

  ngOnInit() {
  }

  showTranslatedAuthorRole(roles) {
    var roles_translated = "";
    // console.log(roles)
    for(var i = 0; i < roles.length; i++) {
      if (i > 0) {
        roles_translated += ", " + this.translateRole(roles[i]);
      } else {
        roles_translated += this.translateRole(roles[i]);
      }
    }    
    return roles_translated;
  }

  translateRole(role) {
    // console.log(role)
    switch(role.toString().trimLeft()) {
      case "author": return "Autor\\a";
      case "content production": return "Produção de conteúdo";
      case "lesson plan production": return "Produção do plano de aula";
      case "graphical designer": return "Designer Gráfico";
      case "script writer": return "Guionista";
      case "pedagogical reviewer": return "Revisor\\a pedagógico";
      case "content reviewer about the sea": return "Revisor\\a do conteúdo";
      case "programmer": return "Programador\\a";
      case "other": return "Outra";
      default: return "tradução não encontrada";
    }
  }

}
