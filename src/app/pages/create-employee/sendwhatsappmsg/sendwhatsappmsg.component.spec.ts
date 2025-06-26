import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendwhatsappmsgComponent } from './sendwhatsappmsg.component';

describe('SendwhatsappmsgComponent', () => {
  let component: SendwhatsappmsgComponent;
  let fixture: ComponentFixture<SendwhatsappmsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendwhatsappmsgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendwhatsappmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
