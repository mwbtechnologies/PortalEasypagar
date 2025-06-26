import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinoutdataComponent } from './checkinoutdata.component';

describe('CheckinoutdataComponent', () => {
  let component: CheckinoutdataComponent;
  let fixture: ComponentFixture<CheckinoutdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinoutdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckinoutdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
