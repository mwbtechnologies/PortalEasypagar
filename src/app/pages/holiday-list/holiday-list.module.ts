import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HolidayListComponent} from './holiday-list.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { HolidayListRoutingModule } from './holiday-list-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [HolidayListComponent],
  imports: [
    CommonModule,
    HolidayListRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
  NgMultiSelectDropDownModule
  ]
})
export class HolidayListModule { }
