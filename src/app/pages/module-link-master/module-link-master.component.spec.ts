import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleLinkMasterComponent } from './module-link-master.component';

describe('ModuleLinkMasterComponent', () => {
  let component: ModuleLinkMasterComponent;
  let fixture: ComponentFixture<ModuleLinkMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleLinkMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleLinkMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
