import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainerassignmentRoutingModule } from './trainerassignment-routing.module';
import { TrainerassignmentComponent } from './trainerassignment.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DetailedviewComponent } from './detailedview/detailedview.component';
import { CommonTableModule } from '../common-table/common-table.module';
import { UpdateComponent } from './update/update.component';
import { DeatiledviewupdateComponent } from './deatiledviewupdate/deatiledviewupdate.component';


@NgModule({
  declarations: [TrainerassignmentComponent, DetailedviewComponent, UpdateComponent, DeatiledviewupdateComponent],
  imports: [
    CommonModule,
    FormsModule,
    TrainerassignmentRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatTooltipModule,
    CommonTableModule
  ]
})
export class TrainerassignmentModule { }
