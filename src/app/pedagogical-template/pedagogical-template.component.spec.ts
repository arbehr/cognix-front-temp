import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedagogicalTemplateComponent } from './pedagogical-template.component';

describe('PedagogicalTemplateComponent', () => {
  let component: PedagogicalTemplateComponent;
  let fixture: ComponentFixture<PedagogicalTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedagogicalTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedagogicalTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
