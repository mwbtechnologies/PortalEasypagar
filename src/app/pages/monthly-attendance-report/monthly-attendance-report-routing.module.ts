import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthlyAttendanceReportComponent } from './monthly-attendance-report.component';

const routes: Routes = [{
  path: '',
  component: MonthlyAttendanceReportComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyAttendanceReportRoutingModule { }
