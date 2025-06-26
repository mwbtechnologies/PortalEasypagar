import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchMasterComponent } from './branch-master.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { BranchMasterRoutingModule } from './branch-master-routing.module';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CommonTableModule } from '../common-table/common-table.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ShowalertComponent } from './showalert/showalert.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LeavesettingComponent } from './leavesetting/leavesetting.component';

@NgModule({
  declarations: [BranchMasterComponent, ShowalertComponent, LeavesettingComponent],
  imports: [
    MatDialogModule,
    CommonModule,
    MatTooltipModule,
    BranchMasterRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    AgmDirectionModule,    
        NgMultiSelectDropDownModule.forRoot(),
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: 'AIzaSyBgvgB3O0eJQmGPOjb80gqwIt28XkB1A80',
    }),
    NgxMaterialTimepickerModule,
    CommonTableModule
  ]
})
export class BranchMasterModule { }
