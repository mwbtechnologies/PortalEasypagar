import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseMasterComponent } from './expense-master.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseMasterRoutingModule { }
