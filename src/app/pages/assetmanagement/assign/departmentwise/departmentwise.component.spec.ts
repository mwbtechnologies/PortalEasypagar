import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentwiseComponent } from './departmentwise.component';

describe('DepartmentwiseComponent', () => {
  let component: DepartmentwiseComponent;
  let fixture: ComponentFixture<DepartmentwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
