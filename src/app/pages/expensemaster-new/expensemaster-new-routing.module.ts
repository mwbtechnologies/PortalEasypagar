import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensemasterNewComponent } from './expensemaster-new.component';

const routes: Routes = [
  {
    path: '',
    component: ExpensemasterNewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensemasterNewRoutingModule { }
