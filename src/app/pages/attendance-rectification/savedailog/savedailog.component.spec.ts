import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedailogComponent } from './savedailog.component';

describe('SavedailogComponent', () => {
  let component: SavedailogComponent;
  let fixture: ComponentFixture<SavedailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
