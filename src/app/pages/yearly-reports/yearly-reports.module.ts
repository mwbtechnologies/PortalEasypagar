import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YearlyReportsComponent } from './yearly-reports.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { YearlyReportsRoutingModule } from './yearly-reports-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [YearlyReportsComponent],
  imports: [
    CommonModule,
    YearlyReportsRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    PdfViewerModule,
    NgxSpinnerModule
  ]
})
export class YearlyReportsModule { }
