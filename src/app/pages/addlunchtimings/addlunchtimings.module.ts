import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddlunchtimingsRoutingModule } from './addlunchtimings-routing.module';
import { AddlunchtimingsComponent } from './addlunchtimings.component';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  declarations: [AddlunchtimingsComponent],
  imports: [
    CommonModule,FormsModule,
    AddlunchtimingsRoutingModule,
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
    MatButtonModule,
    MatSlideToggleModule
  ],
    exports:[
      AddlunchtimingsComponent
    ]
})
export class AddlunchtimingsModule { }
