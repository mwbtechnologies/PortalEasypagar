import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminlunchconfigRoutingModule } from './adminlunchconfig-routing.module';
import { AdminlunchconfigComponent } from './adminlunchconfig.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonTableModule } from '../common-table/common-table.module';
import { AddlunchtimingsModule } from '../addlunchtimings/addlunchtimings.module';


@NgModule({
  declarations: [AdminlunchconfigComponent],
  imports: [
    CommonModule,FormsModule,
    AdminlunchconfigRoutingModule,
    DataTablesModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatTooltipModule,
    NgxMaterialTimepickerModule,
    CommonTableModule,
    AddlunchtimingsModule
  ],
  exports:[
    AdminlunchconfigComponent
  ]
})
export class AdminlunchconfigModule { }
