import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BonusDeductionReportsComponent } from './bonus-deduction-reports.component';

const routes: Routes = [
  {
    path: '',
    component: BonusDeductionReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonusDeductionReportsRoutingModule { }
