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
import { AssignListComponent } from './list/list.component';
import { AssignComponent } from './assign/assign.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { UserlistComponent } from './userlist/userlist.component';
import { AssetBranchAnalyticsComponent } from './branchwise/branchwise.component';
import { AssetDepartmentAnalyticsComponent } from './departmentwise/departmentwise.component';
import { ReturnComponent } from './userlist/return/return.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { HierarchyModule } from '../../hierarchy/hierarchy.module';

@NgModule({
  declarations: [AssignComponent,AssignListComponent,UserlistComponent, AssetBranchAnalyticsComponent, AssetDepartmentAnalyticsComponent, ReturnComponent],
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
    HierarchyModule
  ],
  exports:[
    AssignListComponent,
    UserlistComponent,
    AssetBranchAnalyticsComponent,
    AssetDepartmentAnalyticsComponent
  ]
})
export class AssetAssignModule { }
