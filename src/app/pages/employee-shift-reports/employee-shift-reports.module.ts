import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeShiftReportsComponent } from './employee-shift-reports.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { EmployeeShiftReportsRoutingModule } from './employee-shift-reports-routing.module';
import { CommonTableModule } from '../common-table/common-table.module';
import { ShiftReportsModule } from '../shift-reports/shift-reports.module';


@NgModule({
  declarations: [EmployeeShiftReportsComponent],
  imports: [
    CommonModule,
    EmployeeShiftReportsRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    NgScrollbarModule,
    HttpClientModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatSelectModule,
    DataTablesModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    CommonTableModule,ShiftReportsModule
  ]
})
export class EmployeeShiftReportsModule { }
