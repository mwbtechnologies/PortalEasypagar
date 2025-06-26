import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeattendancereportComponent } from './employeeattendancereport.component';

describe('EmployeeattendancereportComponent', () => {
  let component: EmployeeattendancereportComponent;
  let fixture: ComponentFixture<EmployeeattendancereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeattendancereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeattendancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
