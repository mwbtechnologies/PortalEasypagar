import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YearlyReportsComponent } from './yearly-reports.component';

const routes: Routes = [{
  path: '',
  component: YearlyReportsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YearlyReportsRoutingModule { }
