import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDirectoryNewComponent } from './file-directory-new.component';

describe('FileDirectoryNewComponent', () => {
  let component: FileDirectoryNewComponent;
  let fixture: ComponentFixture<FileDirectoryNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileDirectoryNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileDirectoryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
