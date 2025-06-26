import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeconfigComponent } from './timeconfig.component';

describe('TimeconfigComponent', () => {
  let component: TimeconfigComponent;
  let fixture: ComponentFixture<TimeconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeconfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
