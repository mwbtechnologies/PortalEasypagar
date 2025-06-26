import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRectificationRoutingModule } from './attendance-rectification-routing.module';
import { AttendanceRectificationComponent } from './attendance-rectification.component';
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
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CheckinoutdataComponent } from './checkinoutdata/checkinoutdata.component';
import { ShowlogsComponent } from './showlogs/showlogs.component';
import { SavedailogComponent } from './savedailog/savedailog.component'

@NgModule({
  declarations: [AttendanceRectificationComponent, CheckinoutdataComponent, ShowlogsComponent, SavedailogComponent],
  imports: [
    CommonModule,
    AttendanceRectificationRoutingModule,
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
    CommonTableModule,
    NgxMaterialTimepickerModule
  ]
})
export class AttendanceRectificationModule { }
