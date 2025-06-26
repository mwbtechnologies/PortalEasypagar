import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesMasterComponent } from './roles-master.component';

describe('RolesMasterComponent', () => {
  let component: RolesMasterComponent;
  let fixture: ComponentFixture<RolesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
