import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaywiseExpenseReportComponent } from './daywise-expense-report.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DaywiseExpenseReportRoutingModule } from './daywise-expense-report-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [DaywiseExpenseReportComponent],
  imports: [
    CommonModule,
    DaywiseExpenseReportRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class DaywiseExpenseReportModule { }
