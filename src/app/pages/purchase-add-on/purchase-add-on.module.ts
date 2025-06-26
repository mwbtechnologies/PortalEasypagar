import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseAddOnComponent } from './purchase-add-on.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { PurchaseAddOnRoutingModule } from './purchase-add-on-routing.module';


@NgModule({
  declarations: [PurchaseAddOnComponent],
  imports: [
    CommonModule,
    PurchaseAddOnRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class PurchaseAddOnModule { }
