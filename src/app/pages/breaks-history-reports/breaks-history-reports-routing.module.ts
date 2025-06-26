import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreaksHistoryReportsComponent } from './breaks-history-reports.component';

const routes: Routes = [
  {
    path: '',
    component: BreaksHistoryReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BreaksHistoryReportsRoutingModule { }
