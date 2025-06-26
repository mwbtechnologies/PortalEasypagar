import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAddOnComponent } from './purchase-add-on.component';

describe('PurchaseAddOnComponent', () => {
  let component: PurchaseAddOnComponent;
  let fixture: ComponentFixture<PurchaseAddOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseAddOnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseAddOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
