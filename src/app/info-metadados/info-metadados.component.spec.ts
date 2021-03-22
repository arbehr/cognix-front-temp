import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMetadadosComponent } from './info-metadados.component';

describe('InfoMetadadosComponent', () => {
  let component: InfoMetadadosComponent;
  let fixture: ComponentFixture<InfoMetadadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoMetadadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMetadadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
