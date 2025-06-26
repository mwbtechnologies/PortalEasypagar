import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeloanadvancereportRoutingModule } from './employeeloanadvancereport-routing.module';
import { EmployeeloanadvancereportComponent } from './employeeloanadvancereport.component';
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
import { HistoryComponent } from './history/history.component';
import { CommonTableModule } from '../common-table/common-table.module';


@NgModule({
  declarations: [EmployeeloanadvancereportComponent, HistoryComponent],
  imports: [
    CommonModule,
    EmployeeloanadvancereportRoutingModule,
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
export class EmployeeloanadvancereportModule { }
