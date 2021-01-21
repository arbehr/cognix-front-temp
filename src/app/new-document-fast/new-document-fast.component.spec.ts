import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDocumentFastComponent } from './new-document-fast.component';

describe('NewDocumentFastComponent', () => {
  let component: NewDocumentFastComponent;
  let fixture: ComponentFixture<NewDocumentFastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDocumentFastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDocumentFastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
