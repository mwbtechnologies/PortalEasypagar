import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceMonthlyReportComponent } from './attendance-monthly-report.component';

const routes: Routes = [
  {
    path: '',
    component: AttendanceMonthlyReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceMonthlyReportRoutingModule { }
