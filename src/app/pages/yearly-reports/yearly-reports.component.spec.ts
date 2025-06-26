import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyReportsComponent } from './yearly-reports.component';

describe('YearlyReportsComponent', () => {
  let component: YearlyReportsComponent;
  let fixture: ComponentFixture<YearlyReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
