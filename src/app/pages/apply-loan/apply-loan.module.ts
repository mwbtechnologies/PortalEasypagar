import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatSelectModule} from '@angular/material/select';
import { ApplyLoanRoutingModule } from './apply-loan-routing.module';
import { ApplyLoanComponent} from './apply-loan.component';
import { DataTablesModule } from 'angular-datatables';
import { ApproveLoanComponent } from './approve-loan/approve-loan.component';
import { CommonTableModule } from '../common-table/common-table.module';

@NgModule({
  declarations: [ApplyLoanComponent, ApproveLoanComponent],
  imports: [
    CommonModule,
    ApplyLoanRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatSelectModule,
    DataTablesModule,CommonTableModule
  ]
})
export class ApplyLoanModule { }
