import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDashboardComponent } from './other-dashboard.component';

describe('OtherDashboardComponent', () => {
  let component: OtherDashboardComponent;
  let fixture: ComponentFixture<OtherDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
