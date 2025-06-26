import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftalertComponent } from './shiftalert.component';

describe('ShiftalertComponent', () => {
  let component: ShiftalertComponent;
  let fixture: ComponentFixture<ShiftalertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftalertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
