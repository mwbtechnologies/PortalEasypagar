import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanReportsComponent } from './loan-reports.component';

const routes: Routes = [ {
  path: '',
  component: LoanReportsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanReportsRoutingModule { }
