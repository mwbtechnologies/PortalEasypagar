import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlunchtimingsComponent } from './addlunchtimings.component';

describe('AddlunchtimingsComponent', () => {
  let component: AddlunchtimingsComponent;
  let fixture: ComponentFixture<AddlunchtimingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddlunchtimingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddlunchtimingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
