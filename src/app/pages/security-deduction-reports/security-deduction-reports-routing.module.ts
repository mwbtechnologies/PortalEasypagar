import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityDeductionReportsComponent } from './security-deduction-reports.component';

const routes: Routes = [
  {
    path: '',
    component: SecurityDeductionReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityDeductionReportsRoutingModule { }
