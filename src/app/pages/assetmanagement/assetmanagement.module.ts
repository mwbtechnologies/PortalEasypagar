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
import { CommonTableModule } from '../common-table/common-table.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSelectModule } from '@angular/material/select';
import { AssetItemModule } from './items/item.module';
import { AssetStockModule } from './stock/stock.module';
import { AssetAssignModule } from './assign/assign.module';
import { AssetManagementRoutingModule } from './assetmanagement-routing.module';

import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { AssetCategoryModule } from './category/category.module';
import { AssetAnalyticsModule } from './analytics/analytics.module';
@NgModule({
  declarations: [
  ],
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
    AssetItemModule,
    AssetStockModule,
    AssetAssignModule,
    AssetManagementRoutingModule,
    MatButtonToggleModule,
    AssetCategoryModule,
    AssetAnalyticsModule
  ]
})
export class AssetManagementModule { }
