import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyEmployeeExpenseReportComponent } from './monthly-employee-expense-report.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MonthlyEmployeeExpenseReportRoutingModule } from './monthly-employee-expense-report-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [MonthlyEmployeeExpenseReportComponent],
  imports: [
    CommonModule,
    MonthlyEmployeeExpenseReportRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class MonthlyEmployeeExpenseReportModule { }
