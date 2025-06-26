import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveconfigComponent } from './leaveconfig.component';

describe('LeaveconfigComponent', () => {
  let component: LeaveconfigComponent;
  let fixture: ComponentFixture<LeaveconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveconfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
