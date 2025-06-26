import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppDashboardComponent} from './app-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AppDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppDashboardRoutingModule { }
