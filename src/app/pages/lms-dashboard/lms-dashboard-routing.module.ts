import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LmsDashboardComponent} from './lms-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LmsDashboardComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsDashboardRoutingModule { }
