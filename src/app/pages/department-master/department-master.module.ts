import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DepartmentMasterComponent} from './department-master.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { DepartmentMasterRoutingModule } from './department-master-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ShowpopupComponent } from './showpopup/showpopup.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonTableModule } from '../common-table/common-table.module';

@NgModule({
  declarations: [DepartmentMasterComponent, ShowpopupComponent],
  imports: [
    MatTooltipModule,
    CommonModule,
    DepartmentMasterRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgMultiSelectDropDownModule,
    CommonTableModule
  ]
})
export class DepartmentMasterModule { }
