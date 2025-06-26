import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnualReportsComponent } from './annual-reports.component';

const routes: Routes = [
  {
    path: '',
    component: AnnualReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnualReportsRoutingModule { }
