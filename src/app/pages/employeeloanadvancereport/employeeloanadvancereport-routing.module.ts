import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeloanadvancereportComponent } from './employeeloanadvancereport.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeloanadvancereportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeloanadvancereportRoutingModule { }
