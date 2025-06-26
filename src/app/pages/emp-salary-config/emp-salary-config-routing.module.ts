import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpSalaryConfigComponent } from './emp-salary-config.component';

const routes: Routes = [
  {
    path: '',
    component: EmpSalaryConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class     EmpSalaryConfigRoutingModule { }
