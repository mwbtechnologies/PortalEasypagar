import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverallAttendanceReportComponent } from './overall-attendance-report.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonTableModule } from '../common-table/common-table.module';
import { OverallAttendanceReportRoutingModule } from './overall-attendance-report-routing.module';


@NgModule({
  declarations: [OverallAttendanceReportComponent],
  imports: [
    CommonModule,
    OverallAttendanceReportRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatTooltipModule,
    CommonTableModule
  ]
})
export class OverallAttendanceReportModule { }
