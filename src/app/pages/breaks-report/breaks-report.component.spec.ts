import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreaksReportComponent } from './breaks-report.component';

describe('BreaksReportComponent', () => {
  let component: BreaksReportComponent;
  let fixture: ComponentFixture<BreaksReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreaksReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreaksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
