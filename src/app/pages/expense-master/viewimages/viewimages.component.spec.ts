import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewimagesComponent } from './viewimages.component';

describe('ViewimagesComponent', () => {
  let component: ViewimagesComponent;
  let fixture: ComponentFixture<ViewimagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewimagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewimagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
