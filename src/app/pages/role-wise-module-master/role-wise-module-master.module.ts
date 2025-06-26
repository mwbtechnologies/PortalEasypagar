import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoleWiseModuleMasterComponent} from './role-wise-module-master.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { RoleWiseModuleMasterRoutingModule } from './role-wise-module-master-routing.module';


@NgModule({
  declarations: [RoleWiseModuleMasterComponent],
  imports: [
    CommonModule,
    RoleWiseModuleMasterRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class RoleWiseModuleMasterModule { }
