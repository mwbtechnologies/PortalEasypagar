import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkhourconfigRoutingModule } from './workhourconfig-routing.module';
import { WorkhourconfigComponent } from './workhourconfig.component';
import { ConfigComponent } from './config/config.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';


@NgModule({
  declarations: [WorkhourconfigComponent, ConfigComponent],
  imports: [
    CommonModule,
    WorkhourconfigRoutingModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    MatTooltipModule,
    MatDialogModule,
    CommonTableModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatButtonToggleModule,
    MatTabsModule,
  ],
    exports:[
      WorkhourconfigComponent
    ]
})
export class WorkhourconfigModule { }
