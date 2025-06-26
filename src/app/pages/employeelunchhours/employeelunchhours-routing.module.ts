import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeelunchhoursComponent } from './employeelunchhours.component';
const routes: Routes = [
  {
    path: '',
    component: EmployeelunchhoursComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeelunchhoursRoutingModule { }
