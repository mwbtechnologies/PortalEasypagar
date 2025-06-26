import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PutAttendanceComponent } from './put-attendance.component';

const routes: Routes = [
  {
    path: '',
    component: PutAttendanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PutAttendanceRoutingModule { }
