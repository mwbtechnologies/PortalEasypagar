import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceReportComponent } from './attendance-report.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AttendanceReportRoutingModule } from './attendance-report-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MonthlyAttendanceReportModule } from '../monthly-attendance-report/monthly-attendance-report.module';
import { CommonTableModule } from '../common-table/common-table.module';

@NgModule({
  declarations: [AttendanceReportComponent],
  imports: [
    CommonModule,
    AttendanceReportRoutingModule,
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
    MonthlyAttendanceReportModule,
    CommonTableModule
  ]
})
export class AttendanceReportModule { }
