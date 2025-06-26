import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedocComponent } from './createdoc.component';

describe('CreatedocComponent', () => {
  let component: CreatedocComponent;
  let fixture: ComponentFixture<CreatedocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatedocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
