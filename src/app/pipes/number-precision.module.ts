// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPrecisionPipe } from './number-precision.pipe';

@NgModule({
  declarations: [NumberPrecisionPipe],
  imports: [],
  exports: [NumberPrecisionPipe]  // Export so other modules can use it
})
export class NumberPrecisionPipeModule {}