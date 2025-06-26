import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWiseModuleMasterComponent } from './role-wise-module-master.component';

describe('RoleWiseModuleMasterComponent', () => {
  let component: RoleWiseModuleMasterComponent;
  let fixture: ComponentFixture<RoleWiseModuleMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleWiseModuleMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleWiseModuleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
