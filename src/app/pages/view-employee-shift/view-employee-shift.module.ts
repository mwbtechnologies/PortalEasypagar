import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewEmployeeShiftRoutingModule } from './view-employee-shift-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatSelectModule} from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ViewEmployeeShiftRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatSelectModule,
    DataTablesModule,
    FormsModule,
    MatDialogModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatTooltipModule
  ]
})
export class ViewEmployeeShiftModule { }
