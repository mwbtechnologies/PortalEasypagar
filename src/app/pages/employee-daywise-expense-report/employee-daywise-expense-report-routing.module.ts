import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDaywiseExpenseReportComponent } from './employee-daywise-expense-report.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeDaywiseExpenseReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeDaywiseExpenseReportRoutingModule { }
