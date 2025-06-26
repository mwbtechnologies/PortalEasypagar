import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensemasterNewRoutingModule } from './expensemaster-new-routing.module';
import { ExpensemasterNewComponent } from './expensemaster-new.component';
import { AddlimitComponent } from './addlimit/addlimit.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';


@NgModule({
  declarations: [ExpensemasterNewComponent, AddlimitComponent],
  imports: [
    CommonModule,
    ExpensemasterNewRoutingModule,
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
            CommonTableModule
  ]
})
export class ExpensemasterNewModule { }
