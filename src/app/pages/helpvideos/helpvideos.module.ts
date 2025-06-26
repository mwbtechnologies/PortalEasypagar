import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpvideosRoutingModule } from './helpvideos-routing.module';
import { HelpvideosComponent } from './helpvideos.component';
import { YtvideosComponent } from './ytvideos/ytvideos.component';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [HelpvideosComponent, YtvideosComponent],
  imports: [
    CommonModule,
    HelpvideosRoutingModule,
    MatDialogModule,
  ]
})
export class HelpvideosModule { }
