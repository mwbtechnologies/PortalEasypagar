import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetassignmentComponent } from './assetassignment.component';

describe('AssetassignmentComponent', () => {
  let component: AssetassignmentComponent;
  let fixture: ComponentFixture<AssetassignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetassignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
