import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaySlipReport, SalaryReportComponent } from './salary-report.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SalaryReportRoutingModule } from './salary-report-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { GeneratePayslipModule } from '../generate-payslip/generate-payslip.module';
import { CommonTableModule } from '../common-table/common-table.module';
import { CommonTableButtonsModule } from '../common-table-buttons/common-table-buttons.module';
import { BankPaySlipComponent } from './bank-pay-slip/bank-pay-slip.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { AddincentiveComponent } from './addincentive/addincentive.component';
import { ApprovepayslipComponent } from './approvepayslip/approvepayslip.component';
import { LoanListComponent } from './loan-list/loan-list.component';

@NgModule({
  declarations: [SalaryReportComponent,PaySlipReport, BankPaySlipComponent, AddincentiveComponent, ApprovepayslipComponent, LoanListComponent],
  imports: [
      CommonModule,
    SalaryReportRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
      MatSelectModule,
      CommonTableButtonsModule,
    MatTooltipModule,
    GeneratePayslipModule,
    CommonTableModule,
    MatSidenavModule,
      MatIconModule,
      ReactiveFormsModule
  ]
})
export class SalaryReportModule { }
