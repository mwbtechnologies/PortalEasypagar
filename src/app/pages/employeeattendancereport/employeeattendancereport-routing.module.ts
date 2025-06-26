import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeattendancereportComponent } from './employeeattendancereport.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeattendancereportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeattendancereportRoutingModule { }
