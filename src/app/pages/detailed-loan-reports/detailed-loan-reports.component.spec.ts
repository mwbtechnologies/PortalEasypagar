import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedLoanReportsComponent } from './detailed-loan-reports.component';

describe('DetailedLoanReportsComponent', () => {
  let component: DetailedLoanReportsComponent;
  let fixture: ComponentFixture<DetailedLoanReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedLoanReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedLoanReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
