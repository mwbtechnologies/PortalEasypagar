import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesassignmentRoutingModule } from './rolesassignment-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RolesassignmentComponent } from './rolesassignment.component';
import { CommonTableModule } from '../common-table/common-table.module';
import { AssignComponent } from './assign/assign.component';
import { TrainerwiseComponent } from './trainerwise/trainerwise.component';
import { UpdateComponent } from './update/update.component';
import { TrainerwiseupdateComponent } from './trainerwiseupdate/trainerwiseupdate.component';
import { AddtrainerComponent } from './addtrainer/addtrainer.component';
import { RoleAndPermissionModule } from '../role-and-permission/role-and-permission.module';


@NgModule({
  declarations: [RolesassignmentComponent, AssignComponent, TrainerwiseComponent, UpdateComponent, TrainerwiseupdateComponent, AddtrainerComponent],
  imports: [
    CommonModule,
    RolesassignmentRoutingModule,
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
        CommonTableModule,RoleAndPermissionModule
  ]
})
export class RolesassignmentModule { }
