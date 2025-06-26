import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesalaryreportComponent } from './employeesalaryreport.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesalaryreportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesalaryreportRoutingModule { }
