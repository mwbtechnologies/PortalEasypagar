import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreaksReportComponent } from './breaks-report.component';

const routes: Routes = [
  {
    path: '',
    component: BreaksReportComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BreaksReportRoutingModule { }
