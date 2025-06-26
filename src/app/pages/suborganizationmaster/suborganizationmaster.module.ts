import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuborganizationmasterRoutingModule } from './suborganizationmaster-routing.module';
import { SuborganizationmasterComponent } from './suborganizationmaster.component';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgmDirectionModule } from 'agm-direction';
import { DataTablesModule } from 'angular-datatables';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';
import { MapbranchesComponent } from './mapbranches/mapbranches.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [SuborganizationmasterComponent, MapbranchesComponent],
  imports: [
     MatDialogModule,
     CommonModule,
     MatTooltipModule,
    SuborganizationmasterRoutingModule,
        NgxDropzoneModule,
        NgSelectModule,
        MatInputModule,
        FormsModule,
        HttpClientModule,
        NgxSpinnerModule,
        DataTablesModule,
        AgmDirectionModule,    
        AgmCoreModule.forRoot({ // @agm/core
          apiKey: 'AIzaSyBgvgB3O0eJQmGPOjb80gqwIt28XkB1A80',
        }),
        NgxMaterialTimepickerModule,
          NgMultiSelectDropDownModule.forRoot(),
        CommonTableModule
  ]
})
export class SuborganizationmasterModule { }
