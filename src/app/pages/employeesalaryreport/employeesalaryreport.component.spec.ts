import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesalaryreportComponent } from './employeesalaryreport.component';

describe('EmployeesalaryreportComponent', () => {
  let component: EmployeesalaryreportComponent;
  let fixture: ComponentFixture<EmployeesalaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesalaryreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesalaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
