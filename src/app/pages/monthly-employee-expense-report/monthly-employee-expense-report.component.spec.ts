import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyEmployeeExpenseReportComponent } from './monthly-employee-expense-report.component';

describe('MonthlyEmployeeExpenseReportComponent', () => {
  let component: MonthlyEmployeeExpenseReportComponent;
  let fixture: ComponentFixture<MonthlyEmployeeExpenseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyEmployeeExpenseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyEmployeeExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
