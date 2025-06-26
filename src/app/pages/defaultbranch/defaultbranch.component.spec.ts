import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultbranchComponent } from './defaultbranch.component';

describe('DefaultbranchComponent', () => {
  let component: DefaultbranchComponent;
  let fixture: ComponentFixture<DefaultbranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultbranchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultbranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
