import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateotforemployeeComponent } from './allocateotforemployee.component';

describe('AllocateotforemployeeComponent', () => {
  let component: AllocateotforemployeeComponent;
  let fixture: ComponentFixture<AllocateotforemployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocateotforemployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateotforemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
