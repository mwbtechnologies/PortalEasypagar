import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TaskManagementComponent} from './task-management.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { TaskManagementRoutingModule } from './task-management-routing.module';


@NgModule({
  declarations: [TaskManagementComponent],
  imports: [
    CommonModule,
    TaskManagementRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class TaskManagementModule { }
