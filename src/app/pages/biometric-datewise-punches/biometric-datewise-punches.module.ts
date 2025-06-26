import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiometricDatewisePunchesRoutingModule } from './biometric-datewise-punches-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonTableModule } from '../common-table/common-table.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ShowalertComponent } from './showalert/showalert.component';

@NgModule({
  declarations: [ShowalertComponent],
  imports: [
    CommonModule,
    BiometricDatewisePunchesRoutingModule,
     NgxDropzoneModule,
       NgSelectModule,
       MatInputModule,
       FormsModule,
       HttpClientModule,
       NgxSpinnerModule,
       DataTablesModule,
       FormsModule,
       MatDialogModule,
       NgMultiSelectDropDownModule.forRoot(),
       NgxDropzoneModule,
       NgSelectModule,
       MatInputModule,
       HttpClientModule,
       NgxSpinnerModule,
       MatSelectModule,
       DataTablesModule,
       MatTooltipModule,
       CommonTableModule
  ]
})
export class BiometricDatewisePunchesModule { }
