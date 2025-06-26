import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AllocateModulesComponent} from './allocate-modules.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { AllocateModulesRoutingModule } from './allocate-modules-routing.module';


@NgModule({
  declarations: [AllocateModulesComponent],
  imports: [
    CommonModule,
    AllocateModulesRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class AllocateModulesModule { }
