import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseradddocComponent } from './useradddoc.component';

describe('UseradddocComponent', () => {
  let component: UseradddocComponent;
  let fixture: ComponentFixture<UseradddocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseradddocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UseradddocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
