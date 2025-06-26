import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeconfigRoutingModule } from './timeconfig-routing.module';
import { TimeconfigComponent } from './timeconfig.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddconfigComponent } from './addconfig/addconfig.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSelectModule } from '@angular/material/select';
import { DataTablesModule } from 'angular-datatables';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [TimeconfigComponent,AddconfigComponent],
  imports: [
    CommonModule,FormsModule,
    TimeconfigRoutingModule,
    MatDialogModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    HttpClientModule,
    NgxSpinnerModule,
    MatSelectModule,
    DataTablesModule,
    MatTooltipModule
  ]
})
export class TimeconfigModule { }
