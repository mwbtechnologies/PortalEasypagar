import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolidayListComponent } from './holiday-list.component';

const routes: Routes = [  {
  path: '',
  component: HolidayListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayListRoutingModule { }
