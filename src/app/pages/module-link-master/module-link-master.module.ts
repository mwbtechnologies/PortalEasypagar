import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleLinkMasterComponent } from './module-link-master.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { ModuleLinkMasterRoutingModule } from './module-link-master-routing.module';

@NgModule({
  declarations: [ModuleLinkMasterComponent],
  imports: [
    CommonModule,
    ModuleLinkMasterRoutingModule,
    DataTablesModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class ModuleLinkMasterModule { }
