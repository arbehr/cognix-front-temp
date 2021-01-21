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

}
