import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeMusterComponent } from './employee-muster.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeMusterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeMusterRoutingModule { }
