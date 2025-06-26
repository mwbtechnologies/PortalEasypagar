import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminlunchconfigComponent } from './adminlunchconfig.component';

describe('AdminlunchconfigComponent', () => {
  let component: AdminlunchconfigComponent;
  let fixture: ComponentFixture<AdminlunchconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminlunchconfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminlunchconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
