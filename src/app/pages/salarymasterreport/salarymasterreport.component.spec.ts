import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarymasterreportComponent } from './salarymasterreport.component';

describe('SalarymasterreportComponent', () => {
  let component: SalarymasterreportComponent;
  let fixture: ComponentFixture<SalarymasterreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalarymasterreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarymasterreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
