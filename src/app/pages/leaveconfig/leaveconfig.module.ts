import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveconfigRoutingModule } from './leaveconfig-routing.module';
import { LeaveconfigComponent } from './leaveconfig.component';
import { AddconfigComponent } from './addconfig/addconfig.component';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';
import { DetailedLoanReportsModule } from '../detailed-loan-reports/detailed-loan-reports.module';


@NgModule({
  declarations: [LeaveconfigComponent, AddconfigComponent],
  imports: [
    CommonModule,
    FormsModule,
    LeaveconfigRoutingModule,
        NgxDropzoneModule,
        NgSelectModule,
        MatInputModule,
        HttpClientModule,
        NgxSpinnerModule,
        DataTablesModule,
        NgMultiSelectDropDownModule.forRoot(),
        MatSelectModule,
        MatTooltipModule,
        DetailedLoanReportsModule,
        CommonTableModule
  ]
})
export class LeaveconfigModule { }
