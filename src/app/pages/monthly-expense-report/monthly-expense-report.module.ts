import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyExpenseReportComponent } from './monthly-expense-report.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MonthlyExpenseReportRoutingModule } from './monthly-expense-report-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonTableModule } from '../common-table/common-table.module';

@NgModule({
  declarations: [MonthlyExpenseReportComponent],
  imports: [
    CommonModule,
    MonthlyExpenseReportRoutingModule,
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
  ],exports:[
    MonthlyExpenseReportComponent
  ]
})
export class MonthlyExpenseReportModule { }
