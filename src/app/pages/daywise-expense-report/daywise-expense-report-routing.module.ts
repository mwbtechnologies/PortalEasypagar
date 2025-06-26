import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DaywiseExpenseReportComponent } from './daywise-expense-report.component';

const routes: Routes = [
  {
    path: '',
    component: DaywiseExpenseReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DaywiseExpenseReportRoutingModule { }
