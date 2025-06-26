import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnualReportsComponent } from './annual-reports.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AnnualReportsRoutingModule } from './annual-reports-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [AnnualReportsComponent],
  imports: [
    CommonModule,
    AnnualReportsRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule
  ]
})
export class AnnualReportsModule { }
