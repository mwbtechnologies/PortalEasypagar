import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserdoclistRoutingModule } from './userdoclist-routing.module';
import { UserdoclistComponent } from './userdoclist.component';
import {MatTabsModule} from '@angular/material/tabs';
import { UseradddocComponent } from './useradddoc/useradddoc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DirAnalyticsModule } from '../analytics/analytics.module';
import { PrintDocComponent } from './print-doc/print-doc.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { RejectremarksComponent } from './useradddoc/rejectremarks/rejectremarks.component';
import { CommonPaginatedTableModule } from '../../common-paginated-table/common-paginated-table.module';


@NgModule({
  declarations: [UserdoclistComponent, UseradddocComponent, PrintDocComponent, RejectremarksComponent],
  imports: [
    CommonModule,FormsModule,
    UserdoclistRoutingModule,
    MatTabsModule,
        NgSelectModule,
        FormsModule,ReactiveFormsModule,
        MatInputModule,
        HttpClientModule,
        NgxSpinnerModule,
        NgMultiSelectDropDownModule.forRoot(),
        MatTooltipModule,
        NgSelectModule,
        CommonPaginatedTableModule,
        MatChipsModule
  ],
  exports: [UserdoclistComponent]
})
export class UserdoclistModule { }
