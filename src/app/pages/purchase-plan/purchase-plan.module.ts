import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasePlanComponent } from './purchase-plan.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { PurchasePlanRoutingModule } from './purchase-plan-routing.module';


@NgModule({
  declarations: [PurchasePlanComponent],
  imports: [
    CommonModule,
    PurchasePlanRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class PurchasePlanModule { }
