import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DaywiseattendancereportComponent } from './daywiseattendancereport.component';

const routes: Routes = [
  {
    path: '',
    component: DaywiseattendancereportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DaywiseattendancereportRoutingModule { }
