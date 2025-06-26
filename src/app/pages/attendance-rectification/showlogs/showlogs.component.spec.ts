import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowlogsComponent } from './showlogs.component';

describe('ShowlogsComponent', () => {
  let component: ShowlogsComponent;
  let fixture: ComponentFixture<ShowlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowlogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
