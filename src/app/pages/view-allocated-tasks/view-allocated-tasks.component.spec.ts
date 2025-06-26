import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllocatedTasksComponent } from './view-allocated-tasks.component';

describe('ViewAllocatedTasksComponent', () => {
  let component: ViewAllocatedTasksComponent;
  let fixture: ComponentFixture<ViewAllocatedTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllocatedTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllocatedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
