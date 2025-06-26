import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PrivilegeMasterComponent} from './privilege-master.component';
import { PrivilegeMasterRoutingModule } from './privilege-master-routing.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [PrivilegeMasterComponent],
  imports: [
    CommonModule,
    PrivilegeMasterRoutingModule,
    MatCheckboxModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class PrivilegeMasterModule { }
