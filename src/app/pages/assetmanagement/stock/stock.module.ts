import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../../common-table/common-table.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSelectModule } from '@angular/material/select';
import { AssetInwardComponent } from './inward/inward.component';
import { AssetInwardListComponent } from './list/list.component';
import { MatStepperModule } from '@angular/material/stepper';
import { HierarchyModule } from '../../hierarchy/hierarchy.module';
import { CommonPaginatedTableModule } from '../../common-paginated-table/common-paginated-table.module';


@NgModule({
  declarations: [ AssetInwardComponent, AssetInwardListComponent],
  imports: [
    CommonModule,
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
    MatStepperModule,
    HierarchyModule,
    CommonPaginatedTableModule,
  ]
})
export class AssetStockModule { }
