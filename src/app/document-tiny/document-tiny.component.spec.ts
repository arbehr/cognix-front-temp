import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTinyComponent } from './document-tiny.component';

describe('DocumentTinyComponent', () => {
  let component: DocumentTinyComponent;
  let fixture: ComponentFixture<DocumentTinyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentTinyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTinyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
