import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeelunchhoursRoutingModule } from './employeelunchhours-routing.module';
import { EmployeelunchhoursComponent } from './employeelunchhours.component';
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
  declarations: [EmployeelunchhoursComponent],
  imports: [
    CommonModule,FormsModule,
    EmployeelunchhoursRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatTooltipModule,
    NgxMaterialTimepickerModule,
  ]
})
export class EmployeelunchhoursModule { }
