import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailedLoanReportsComponent } from './detailed-loan-reports.component';

const routes: Routes = [
  {
    path: '',
    component: DetailedLoanReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailedLoanReportsRoutingModule { }
