import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftReportsComponent } from './shift-reports.component';

const routes: Routes = [
  {
    path: '',
    component: ShiftReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftReportsRoutingModule { }
