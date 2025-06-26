import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeShiftReportsComponent } from './employee-shift-reports.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeShiftReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeShiftReportsRoutingModule { }
