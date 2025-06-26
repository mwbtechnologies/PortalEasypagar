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
import { ViewNotificationsRoutingModule } from './view-notifications-routing.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ViewNotificationsComponent} from './view-notifications.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ViewNotificationsComponent],
  imports: [
    CommonModule,
    ViewNotificationsRoutingModule,
    NgScrollbarModule,
    MatSelectModule,
    NgxSpinnerModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    NgSelectModule,
    NgxDropzoneModule,
    DataTablesModule
  ]
})
export class ViewNotificationsModule { }
