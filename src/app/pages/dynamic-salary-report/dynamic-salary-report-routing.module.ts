import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicSalaryReportComponent } from './dynamic-salary-report.component';

const routes: Routes = [{
  'path':'',component:DynamicSalaryReportComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicSalaryReportRoutingModule { }
