import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeMusterRoutingModule } from './employee-muster-routing.module';
import { EmployeeMusterComponent } from './employee-muster.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select'
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigShiftComponent } from './config-shift/config-shift.component';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { CommonTableModule } from '../common-table/common-table.module';
import { ConfirmpasswordComponent } from './confirmpassword/confirmpassword.component';
import { CommonDialogModule } from '../common-dialog/common-dialog.module';
import { LeavesettingsComponent } from './leavesettings/leavesettings.component';


@NgModule({
  declarations: [EmployeeMusterComponent,ConfigShiftComponent, DeleteconfirmationComponent, ConfirmpasswordComponent, LeavesettingsComponent],
  imports: [
    CommonModule,
    EmployeeMusterRoutingModule,
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
    MatSelectModule,MatPaginatorModule,MatTooltipModule,CommonTableModule,
    MatMenuModule,MatGridListModule,MatDividerModule,MatProgressSpinnerModule,MatButtonModule,NgMultiSelectDropDownModule.forRoot(),
    CommonDialogModule
  ]
})
export class EmployeeMusterModule { }
