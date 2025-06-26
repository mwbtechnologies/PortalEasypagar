import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDaywiseExpenseReportComponent } from './employee-daywise-expense-report.component';

describe('EmployeeDaywiseExpenseReportComponent', () => {
  let component: EmployeeDaywiseExpenseReportComponent;
  let fixture: ComponentFixture<EmployeeDaywiseExpenseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeDaywiseExpenseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDaywiseExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
