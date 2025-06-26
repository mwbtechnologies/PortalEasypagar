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
import { MatStepperModule } from '@angular/material/stepper';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { AssetAnalyticsComponent } from './analytics.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AssetItemModule } from '../items/item.module';
import { AssetCategoryModule } from '../category/category.module';
import { AssetAssignModule } from '../assign/assign.module';

@NgModule({
  declarations: [AssetAnalyticsComponent],
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
    MatStepperModule,
    NgMultiSelectDropDownModule.forRoot(),
    CommonTableModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTabsModule,
    AssetItemModule,
    AssetCategoryModule,
    AssetAssignModule,
  ],
  exports:[
    AssetAnalyticsComponent
  ]

})
export class AssetAnalyticsModule { }
