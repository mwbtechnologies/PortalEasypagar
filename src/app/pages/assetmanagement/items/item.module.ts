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
import { AssetItemAddComponent } from './add/add.component';
import { AssetItemListComponent } from './list/list.component';
import {MatTabsModule} from '@angular/material/tabs';
import { AssetItemAnalyticsComponent } from './analytics/analytics.component';
import { CommonPaginatedTableModule } from '../../common-paginated-table/common-paginated-table.module';

@NgModule({
  declarations: [AssetItemAddComponent,AssetItemListComponent, AssetItemAnalyticsComponent],
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
    MatTabsModule,
    CommonPaginatedTableModule,
  ],
  exports:[
    AssetItemAnalyticsComponent
  ]
})
export class AssetItemModule { }
