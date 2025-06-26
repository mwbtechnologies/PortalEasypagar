import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleMasterComponent } from './module-master.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { ModuleMasterRoutingModule } from './module-master-routing.module';


@NgModule({
  declarations: [ModuleMasterComponent],
  imports: [
    CommonModule,
    ModuleMasterRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class ModuleMasterModule { }
