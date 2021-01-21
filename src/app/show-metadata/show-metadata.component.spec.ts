import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMetadataComponent } from './show-metadata.component';

describe('ShowMetadataComponent', () => {
  let component: ShowMetadataComponent;
  let fixture: ComponentFixture<ShowMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
