import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthlyExpenseReportComponent } from './monthly-expense-report.component';

const routes: Routes = [
  {
    path: '',
    component: MonthlyExpenseReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyExpenseReportRoutingModule { }
