import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonDialogComponent } from './common-dialog.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [CommonDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    CommonDialogComponent
  ]
})
export class CommonDialogModule { }
