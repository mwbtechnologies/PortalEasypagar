import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherDashboardComponent } from './other-dashboard.component';

const routes: Routes = [  {
  path: '',
  component: OtherDashboardComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherDashboardRoutingModule { }
