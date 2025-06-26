import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultbranchRoutingModule } from './defaultbranch-routing.module';
import { DefaultbranchComponent } from './defaultbranch.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [DefaultbranchComponent],
  imports: [
    CommonModule,
    DefaultbranchRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
  ],
  exports:[
    DefaultbranchComponent
  ]
})
export class DefaultbranchModule { }
