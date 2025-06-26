import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeader2Component } from './page-header2.component';

describe('PageHeader2Component', () => {
  let component: PageHeader2Component;
  let fixture: ComponentFixture<PageHeader2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageHeader2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageHeader2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
