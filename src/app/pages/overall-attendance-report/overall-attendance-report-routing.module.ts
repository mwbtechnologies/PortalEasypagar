import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverallAttendanceReportComponent } from './overall-attendance-report.component';

const routes: Routes = [
  {
    path: '',
    component: OverallAttendanceReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverallAttendanceReportRoutingModule { }
