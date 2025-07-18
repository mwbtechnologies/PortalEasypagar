import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddconfigComponent } from './addconfig.component';

describe('AddconfigComponent', () => {
  let component: AddconfigComponent;
  let fixture: ComponentFixture<AddconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddconfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
