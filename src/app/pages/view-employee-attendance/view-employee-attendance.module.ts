import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ViewEmployeeAttendanceComponent } from './view-employee-attendance.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatSelectModule} from '@angular/material/select';
import { DataTablesModule } from 'angular-datatables';
import { ViewEmployeeAttendanceRoutingModule } from './view-employee-attendance-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ApproveattendanceComponent } from './approveattendance/approveattendance.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CustomDatePipe } from 'src/app/pipes/custom-date-pipe.pipe';
import { CommonTableModule } from '../common-table/common-table.module';
import { InouthistoryComponent } from './inouthistory/inouthistory.component';
import { ShiftwisedataComponent } from './shiftwisedata/shiftwisedata.component';
import { ShowapprovallistComponent } from './showapprovallist/showapprovallist.component';
import { ChecklocationComponent } from './approveattendance/checklocation/checklocation.component';

@NgModule({
  declarations: [ShowapprovallistComponent, ViewEmployeeAttendanceComponent,ApproveattendanceComponent, CustomDatePipe, InouthistoryComponent, ShiftwisedataComponent,ChecklocationComponent],
  imports: [
    CommonModule,
    NgbModule,
    ViewEmployeeAttendanceRoutingModule,
     NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatSelectModule,
    DataTablesModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    MatTableModule,FormsModule,
    MatDialogModule,MatCheckboxModule,ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatIconModule,
    NgbDropdownModule,
    MatChipsModule,
    MatSelectModule,MatPaginatorModule,MatTooltipModule,
    MatMenuModule,MatGridListModule,MatDividerModule,MatProgressSpinnerModule,MatButtonModule,NgMultiSelectDropDownModule.forRoot(),
    NgxMaterialTimepickerModule,
    CommonTableModule
 
  ]
})
export class ViewEmployeeAttendanceModule { }
