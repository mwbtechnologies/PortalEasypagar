import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveModulesComponent } from './remove-modules.component';

describe('RemoveModulesComponent', () => {
  let component: RemoveModulesComponent;
  let fixture: ComponentFixture<RemoveModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveModulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
