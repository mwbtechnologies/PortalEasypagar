import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatSelectModule} from '@angular/material/select';
import { ApplyLeaveNewRoutingModule } from './apply-leave-new-routing.module';
import { ApplyLeaveNewComponent} from './apply-leave-new.component';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [ApplyLeaveNewComponent],
  imports: [
    CommonModule,
    ApplyLeaveNewRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatSelectModule,
    DataTablesModule
  ]
})
export class ApplyLeaveNewModule { }
