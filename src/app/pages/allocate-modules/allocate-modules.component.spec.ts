import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateModulesComponent } from './allocate-modules.component';

describe('AllocateModulesComponent', () => {
  let component: AllocateModulesComponent;
  let fixture: ComponentFixture<AllocateModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocateModulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
