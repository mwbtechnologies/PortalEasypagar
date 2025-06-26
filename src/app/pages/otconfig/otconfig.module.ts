import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtconfigRoutingModule } from './otconfig-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OtconfigComponent } from './otconfig.component';
import { AddthreesholdsComponent } from './addthreesholds/addthreesholds.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AllocateotforemployeeComponent } from './allocateotforemployee/allocateotforemployee.component';
import { CommonTableComponent } from '../common-table/common-table.component';
import { CommonTableModule } from '../common-table/common-table.module';


@NgModule({
  declarations: [OtconfigComponent, AddthreesholdsComponent, AllocateotforemployeeComponent],
  imports: [
    CommonModule,
    OtconfigRoutingModule,
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
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    CommonTableModule
  ]
})
export class OtconfigModule { }
