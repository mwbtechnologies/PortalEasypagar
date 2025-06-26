import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeexpensereportComponent } from './employeeexpensereport.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeexpensereportComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeexpensereportRoutingModule { }
