import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddExpenseComponent } from './add-expense.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { AddExpenseRoutingModule } from './add-expense-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApproveexpenseComponent } from './approveexpense/approveexpense.component';
import { ViewExpenseDetailsComponent } from './approveexpense/view-expense-details/view-expense-details.component';
import { CommonTableModule } from '../common-table/common-table.module';

@NgModule({
  declarations: [AddExpenseComponent,ApproveexpenseComponent,ViewExpenseDetailsComponent],
  imports: [
    NgbModule,
    CommonModule,
    AddExpenseRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,CommonTableModule
  ]
})
export class AddExpenseModule { }
