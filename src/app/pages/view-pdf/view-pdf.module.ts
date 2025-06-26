import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPdfComponent } from './view-pdf.component';
import { ViewPdfRoutingModule } from './view-pdf-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [ViewPdfComponent],
  imports: [
    CommonModule,
    ViewPdfRoutingModule,
    PdfViewerModule
  ]
})
export class ViewPdfModule { }
