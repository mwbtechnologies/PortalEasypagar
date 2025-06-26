import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpRoasterReportsComponent } from './emp-roaster-reports.component';

describe('EmpRoasterReportsComponent', () => {
  let component: EmpRoasterReportsComponent;
  let fixture: ComponentFixture<EmpRoasterReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpRoasterReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpRoasterReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
