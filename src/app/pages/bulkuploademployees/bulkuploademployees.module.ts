import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkuploademployeesRoutingModule } from './bulkuploademployees-routing.module';
import { BulkuploademployeesComponent } from './bulkuploademployees.component';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BulkuploademployeesComponent],
  imports: [
    CommonModule,
    BulkuploademployeesRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgSelectModule,
    NgMultiSelectDropDownModule,
    NgxDropzoneModule,
    NgxMaterialTimepickerModule,
    NgxSpinnerModule,
    FormsModule
  ]
})
export class BulkuploademployeesModule { }
