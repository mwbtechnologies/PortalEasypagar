import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerMasterComponent } from './banner-master.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { BannerMasterRoutingModule } from './banner-master-routing.module';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [BannerMasterComponent],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule,
    BannerMasterRoutingModule,
    DataTablesModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatTooltipModule,
  ]
})
export class BannerMasterModule { }
