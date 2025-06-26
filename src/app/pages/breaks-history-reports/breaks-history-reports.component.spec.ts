import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreaksHistoryReportsComponent } from './breaks-history-reports.component';

describe('BreaksHistoryReportsComponent', () => {
  let component: BreaksHistoryReportsComponent;
  let fixture: ComponentFixture<BreaksHistoryReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreaksHistoryReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreaksHistoryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
