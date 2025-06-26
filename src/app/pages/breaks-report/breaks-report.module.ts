import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreaksReportRoutingModule } from './breaks-report-routing.module';
import { BreaksReportComponent } from './breaks-report.component';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AddlunchtimingsModule } from '../addlunchtimings/addlunchtimings.module';
import { CommonTableModule } from '../common-table/common-table.module';
import { FormsModule } from '@angular/forms';
import { DetailedBreakComponent } from './detailed-break/detailed-break.component';


@NgModule({
  declarations: [BreaksReportComponent, DetailedBreakComponent],
  imports: [
    CommonModule,FormsModule,
    BreaksReportRoutingModule,
    DataTablesModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatTooltipModule,
    NgxMaterialTimepickerModule,
    CommonTableModule,
    AddlunchtimingsModule
  ],exports:[
    BreaksReportComponent
  ]
})
export class BreaksReportModule { }
