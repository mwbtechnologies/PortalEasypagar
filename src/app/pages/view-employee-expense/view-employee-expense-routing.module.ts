import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewEmployeeExpenseComponent } from './view-employee-expense.component';

const routes: Routes = [{
  path: '',
  component: ViewEmployeeExpenseComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEmployeeExpenseRoutingModule { }
