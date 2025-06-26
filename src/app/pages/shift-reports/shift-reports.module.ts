import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftReportsRoutingModule } from './shift-reports-routing.module';
import { ShiftReportsComponent } from './shift-reports.component';
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
import { CommonTableModule } from '../common-table/common-table.module';

@NgModule({
  declarations: [ShiftReportsComponent],
  imports: [
    CommonModule,
    ShiftReportsRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatSelectModule,
    DataTablesModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    CommonTableModule
  ],
  exports:[
    ShiftReportsComponent
  ]
})
export class ShiftReportsModule { }
