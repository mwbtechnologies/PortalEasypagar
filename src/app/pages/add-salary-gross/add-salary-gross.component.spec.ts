import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalaryGrossComponent } from './add-salary-gross.component';

describe('AddSalaryGrossComponent', () => {
  let component: AddSalaryGrossComponent;
  let fixture: ComponentFixture<AddSalaryGrossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSalaryGrossComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSalaryGrossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
