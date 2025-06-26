import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YtvideosComponent } from './ytvideos.component';

describe('YtvideosComponent', () => {
  let component: YtvideosComponent;
  let fixture: ComponentFixture<YtvideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YtvideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YtvideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
