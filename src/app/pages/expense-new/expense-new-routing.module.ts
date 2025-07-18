import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DatewiseComponent } from './datewise/datewise.component';

const routes: Routes = [  {
   path: '',
   pathMatch: 'full',
   redirectTo:'List'
  },
  {
   path: 'List',
   component: ListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseNewRoutingModule { }
