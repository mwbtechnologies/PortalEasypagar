import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetassignmentRoutingModule } from './assetassignment-routing.module';
import { AssetassignmentComponent } from './assetassignment.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';


@NgModule({
  declarations: [AssetassignmentComponent, AssignmentComponent],
  imports: [
    CommonModule,
    AssetassignmentRoutingModule,
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
  ]
})
export class AssetassignmentModule { }
