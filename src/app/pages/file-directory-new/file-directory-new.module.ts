import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileDirectoryNewRoutingModule } from './file-directory-new-routing.module';
import { FileDirectoryNewComponent } from './file-directory-new.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';
import { DoclistComponent } from './doclist/doclist.component';
import { UserdoclistComponent } from './userdoclist/userdoclist.component';
import { UserdoclistModule } from './userdoclist/userdoclist.module';
import { MatTabsModule } from '@angular/material/tabs';
import { DocTimelineComponent } from './timeline/timeline.component';
// import { DocwiseusersComponent } from './docwiseusers/docwiseusers.component';
import { HierarchyModule } from '../hierarchy/hierarchy.module';
import { DocwiseusersModule } from './docwiseusers/docwiseusers.module';
import { DirAnalyticsModule } from './analytics/analytics.module';
import { CreatedocModule } from './createdoc/createdoc.module';
import { DoclistModule } from './doclist/doclist.module';
import { GlobalsearchlistComponent } from './globalsearchlist/globalsearchlist.component';
import { CommonPaginatedTableModule } from '../common-paginated-table/common-paginated-table.module';


@NgModule({
  declarations: [FileDirectoryNewComponent, DocTimelineComponent, GlobalsearchlistComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    

    FileDirectoryNewRoutingModule,
    CommonTableModule,
    CommonPaginatedTableModule,
    UserdoclistModule,
    DoclistModule,
    HierarchyModule,
    DocwiseusersModule,
    DirAnalyticsModule,
    DirAnalyticsModule,
    CreatedocModule,
    
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
  ]
})
export class FileDirectoryNewModule { }
