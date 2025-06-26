import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeloanadvancereportComponent } from './employeeloanadvancereport.component';

describe('EmployeeloanadvancereportComponent', () => {
  let component: EmployeeloanadvancereportComponent;
  let fixture: ComponentFixture<EmployeeloanadvancereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeloanadvancereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeloanadvancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
