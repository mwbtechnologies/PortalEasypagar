import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyLeaveNewComponent } from './apply-leave-new.component';

describe('ApplyLeaveNewComponent', () => {
  let component: ApplyLeaveNewComponent;
  let fixture: ComponentFixture<ApplyLeaveNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyLeaveNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyLeaveNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
