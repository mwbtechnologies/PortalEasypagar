import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeelunchhoursComponent } from './employeelunchhours.component';

describe('EmployeelunchhoursComponent', () => {
  let component: EmployeelunchhoursComponent;
  let fixture: ComponentFixture<EmployeelunchhoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeelunchhoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeelunchhoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
