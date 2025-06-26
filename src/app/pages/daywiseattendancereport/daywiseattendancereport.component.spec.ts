import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseattendancereportComponent } from './daywiseattendancereport.component';

describe('DaywiseattendancereportComponent', () => {
  let component: DaywiseattendancereportComponent;
  let fixture: ComponentFixture<DaywiseattendancereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaywiseattendancereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaywiseattendancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
