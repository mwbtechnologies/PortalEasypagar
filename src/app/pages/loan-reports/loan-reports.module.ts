import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanReportsComponent } from './loan-reports.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoanReportsRoutingModule } from './loan-reports-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DetailedLoanReportsModule } from '../detailed-loan-reports/detailed-loan-reports.module';
import { CommonTableModule } from '../common-table/common-table.module';

@NgModule({
  declarations: [LoanReportsComponent],
  imports: [
    CommonModule,
    LoanReportsRoutingModule,
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
    DetailedLoanReportsModule,
    CommonTableModule
  ]
})
export class LoanReportsModule { }
