import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocwiseusersComponent } from './docwiseusers.component';

describe('DocwiseusersComponent', () => {
  let component: DocwiseusersComponent;
  let fixture: ComponentFixture<DocwiseusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocwiseusersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocwiseusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
