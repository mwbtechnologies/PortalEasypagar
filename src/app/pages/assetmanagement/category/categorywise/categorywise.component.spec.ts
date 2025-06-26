import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorywiseComponent } from './categorywise.component';

describe('CategorywiseComponent', () => {
  let component: CategorywiseComponent;
  let fixture: ComponentFixture<CategorywiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorywiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
