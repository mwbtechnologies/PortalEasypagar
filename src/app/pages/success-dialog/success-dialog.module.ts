import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuccessDialogComponent } from './success-dialog.component';

@NgModule({
  declarations: [SuccessDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class SuccessDialogModule { }
