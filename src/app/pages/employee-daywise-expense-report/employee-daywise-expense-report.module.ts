import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDaywiseExpenseReportComponent } from './employee-daywise-expense-report.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeDaywiseExpenseReportRoutingModule } from './employee-daywise-expense-report-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [EmployeeDaywiseExpenseReportComponent],
  imports: [
    CommonModule,
    EmployeeDaywiseExpenseReportRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class EmployeeDaywiseExpenseReportModule { }
