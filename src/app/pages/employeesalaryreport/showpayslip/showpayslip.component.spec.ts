import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowpayslipComponent } from './showpayslip.component';

describe('ShowpayslipComponent', () => {
  let component: ShowpayslipComponent;
  let fixture: ComponentFixture<ShowpayslipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowpayslipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowpayslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
