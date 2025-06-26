import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdoclistComponent } from './userdoclist.component';

describe('UserdoclistComponent', () => {
  let component: UserdoclistComponent;
  let fixture: ComponentFixture<UserdoclistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserdoclistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserdoclistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
