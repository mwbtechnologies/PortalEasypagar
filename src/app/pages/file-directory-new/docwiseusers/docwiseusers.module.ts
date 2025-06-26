import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocwiseusersRoutingModule } from './docwiseusers-routing.module';
import { DocwiseusersComponent } from './docwiseusers.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonPaginatedTableModule } from '../../common-paginated-table/common-paginated-table.module';
import { HierarchyModule } from '../../hierarchy/hierarchy.module';


@NgModule({
  declarations: [DocwiseusersComponent],
  imports: [
    CommonModule,
    DocwiseusersRoutingModule,
    CommonModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatTooltipModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    CommonPaginatedTableModule,
    MatTabsModule,
    HierarchyModule
  ]
})
export class DocwiseusersModule { }
