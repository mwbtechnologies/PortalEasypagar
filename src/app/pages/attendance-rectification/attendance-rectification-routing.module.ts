import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceRectificationComponent } from './attendance-rectification.component';

const routes: Routes = [
  {
    path: '',
    component: AttendanceRectificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRectificationRoutingModule { }
