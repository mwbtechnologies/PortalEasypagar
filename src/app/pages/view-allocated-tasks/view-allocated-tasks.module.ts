import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ViewAllocatedTasksComponent} from './view-allocated-tasks.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { ViewAllocatedTasksRoutingModule } from './view-allocated-tasks-routing.module';


@NgModule({
  declarations: [ViewAllocatedTasksComponent],
  imports: [
    CommonModule,
    ViewAllocatedTasksRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class ViewAllocatedTasksModule { }
