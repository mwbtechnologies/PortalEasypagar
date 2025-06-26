import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewEmployeeAttendanceComponent } from './view-employee-attendance.component';

const routes: Routes = [{
  'path':'',component:ViewEmployeeAttendanceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEmployeeAttendanceRoutingModule { }
