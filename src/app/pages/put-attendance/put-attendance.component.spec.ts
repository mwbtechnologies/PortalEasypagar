import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutAttendanceComponent } from './put-attendance.component';

describe('PutAttendanceComponent', () => {
  let component: PutAttendanceComponent;
  let fixture: ComponentFixture<PutAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PutAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PutAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
