import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationconfigRoutingModule } from './locationconfig-routing.module';
import { LocationconfigComponent } from './locationconfig.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';


@NgModule({
  declarations: [LocationconfigComponent],
  imports: [
    CommonModule,
    LocationconfigRoutingModule,
      NgxDropzoneModule,
        NgSelectModule,
        MatInputModule,
        FormsModule,
        HttpClientModule,
        NgxSpinnerModule,
        NgMultiSelectDropDownModule.forRoot(),
        MatSelectModule,CommonTableModule
  ], exports:[
    LocationconfigComponent
    ]
})
export class LocationconfigModule { }
