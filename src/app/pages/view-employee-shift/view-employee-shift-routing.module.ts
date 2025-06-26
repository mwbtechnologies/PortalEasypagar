import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewEmployeeShiftComponent } from './view-employee-shift.component';

const routes: Routes = [{
  path: '',
  component: ViewEmployeeShiftComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEmployeeShiftRoutingModule { }
