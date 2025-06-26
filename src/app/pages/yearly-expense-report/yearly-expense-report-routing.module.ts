import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YearlyExpenseReportComponent } from './yearly-expense-report.component';

const routes: Routes = [  {
  path: '',
  component: YearlyExpenseReportComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YearlyExpenseReportRoutingModule { }
