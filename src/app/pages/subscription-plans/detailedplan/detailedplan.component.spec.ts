import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedplanComponent } from './detailedplan.component';

describe('DetailedplanComponent', () => {
  let component: DetailedplanComponent;
  let fixture: ComponentFixture<DetailedplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedplanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
