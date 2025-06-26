import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseNewRoutingModule } from './expense-new-routing.module';
import { MonthwiseComponent } from './monthwise/monthwise.component';
import { ListComponent } from './list/list.component';
import { DatewiseComponent } from './datewise/datewise.component';
import { EmployeewiseComponent } from './employeewise/employeewise.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';
import { MatTabsModule } from '@angular/material/tabs';
import { EmployeeComponent } from './datewise/employee/employee.component';
import { EmployeeWiseModule } from './employeewise/employeewise.module';
import { ExpenseComponent } from './datewise/employee/expense/expense.component';
import { BillComponent } from './datewise/employee/expense/bill/bill.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ConfirmationexpensewiseComponent } from './confirmationexpensewise/confirmationexpensewise.component';
import { PaymentsummaryComponent } from './paymentsummary/paymentsummary.component';

@NgModule({
  declarations: [DatewiseComponent,ListComponent,MonthwiseComponent,EmployeewiseComponent, EmployeeComponent, ExpenseComponent, BillComponent, ConfirmationComponent, ConfirmationexpensewiseComponent, PaymentsummaryComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    MatTooltipModule,
    MatDialogModule,
    CommonTableModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatButtonToggleModule,
    MatTabsModule,
    EmployeeWiseModule,
    ExpenseNewRoutingModule,

  ]
})
export class ExpenseNewModule { }
