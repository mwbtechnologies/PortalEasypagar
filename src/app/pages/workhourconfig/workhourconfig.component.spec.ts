import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkhourconfigComponent } from './workhourconfig.component';

describe('WorkhourconfigComponent', () => {
  let component: WorkhourconfigComponent;
  let fixture: ComponentFixture<WorkhourconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkhourconfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkhourconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
