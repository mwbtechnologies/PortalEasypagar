import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonpacksComponent } from './addonpacks.component';

describe('AddonpacksComponent', () => {
  let component: AddonpacksComponent;
  let fixture: ComponentFixture<AddonpacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddonpacksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonpacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
