import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeereportsComponent } from './employeereports.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeereportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeereportsRoutingModule { }
