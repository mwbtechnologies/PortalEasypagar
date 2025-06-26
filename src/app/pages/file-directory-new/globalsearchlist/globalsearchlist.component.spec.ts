import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalsearchlistComponent } from './globalsearchlist.component';

describe('GlobalsearchlistComponent', () => {
  let component: GlobalsearchlistComponent;
  let fixture: ComponentFixture<GlobalsearchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalsearchlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalsearchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
