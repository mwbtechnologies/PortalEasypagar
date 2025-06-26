import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolidayMasterComponent } from './holiday-master.component';

const routes: Routes = [ {
  path: '',
  component: HolidayMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayMasterRoutingModule { }
