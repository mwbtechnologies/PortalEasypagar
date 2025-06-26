import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesalaryreportRoutingModule } from './employeesalaryreport-routing.module';
import { EmployeesalaryreportComponent } from './employeesalaryreport.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ShowpayslipComponent } from './showpayslip/showpayslip.component';
import { CommonTableModule } from '../common-table/common-table.module';


@NgModule({
  declarations: [EmployeesalaryreportComponent, ShowpayslipComponent],
  imports: [
    CommonModule,
    EmployeesalaryreportRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatSelectModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),CommonTableModule
  ]
})
export class EmployeesalaryreportModule { }
