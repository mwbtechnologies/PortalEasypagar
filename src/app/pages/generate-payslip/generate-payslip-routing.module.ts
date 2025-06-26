import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratePayslipComponent } from './generate-payslip.component';

const routes: Routes = [
  {
    path: '',
    component: GeneratePayslipComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneratePayslipRoutingModule { }
