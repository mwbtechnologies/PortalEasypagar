import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MonthlyAttendanceReportModule } from '../monthly-attendance-report/monthly-attendance-report.module';
import { CommonTableModule } from '../common-table/common-table.module';
import { SecurityDeductionReportsRoutingModule } from './security-deduction-reports-routing.module';
import { SecurityDeductionReportsComponent } from './security-deduction-reports.component';
import { EmpwisereportComponent } from './empwisereport/empwisereport.component';


@NgModule({
  declarations: [SecurityDeductionReportsComponent, EmpwisereportComponent],
  imports: [
    CommonModule,
    SecurityDeductionReportsRoutingModule,
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
export class SecurityDeductionReportsModule { }
