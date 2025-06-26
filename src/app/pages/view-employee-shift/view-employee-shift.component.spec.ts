import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeShiftComponent } from './view-employee-shift.component';

describe('ViewEmployeeShiftComponent', () => {
  let component: ViewEmployeeShiftComponent;
  let fixture: ComponentFixture<ViewEmployeeShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEmployeeShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmployeeShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
