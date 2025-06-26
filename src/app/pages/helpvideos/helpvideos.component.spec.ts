import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpvideosComponent } from './helpvideos.component';

describe('HelpvideosComponent', () => {
  let component: HelpvideosComponent;
  let fixture: ComponentFixture<HelpvideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpvideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpvideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
