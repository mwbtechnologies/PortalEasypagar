import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DaywiseattendancereportRoutingModule } from './daywiseattendancereport-routing.module';
import { DaywiseattendancereportComponent } from './daywiseattendancereport.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';


@NgModule({
  declarations: [DaywiseattendancereportComponent],
  imports: [
    CommonModule,
    DaywiseattendancereportRoutingModule,
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
    CommonTableModule,
    NgxMaterialTimepickerModule
  ]
})
export class DaywiseattendancereportModule { }
