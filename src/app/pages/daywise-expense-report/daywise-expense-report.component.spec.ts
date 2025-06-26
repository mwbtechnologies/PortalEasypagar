import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseExpenseReportComponent } from './daywise-expense-report.component';

describe('DaywiseExpenseReportComponent', () => {
  let component: DaywiseExpenseReportComponent;
  let fixture: ComponentFixture<DaywiseExpenseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaywiseExpenseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaywiseExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
