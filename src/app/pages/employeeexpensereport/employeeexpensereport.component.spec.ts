import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeexpensereportComponent } from './employeeexpensereport.component';

describe('EmployeeexpensereportComponent', () => {
  let component: EmployeeexpensereportComponent;
  let fixture: ComponentFixture<EmployeeexpensereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeexpensereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeexpensereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
