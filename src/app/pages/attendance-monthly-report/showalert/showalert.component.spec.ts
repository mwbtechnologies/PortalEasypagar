import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowalertComponent } from './showalert.component';

describe('ShowalertComponent', () => {
  let component: ShowalertComponent;
  let fixture: ComponentFixture<ShowalertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowalertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
