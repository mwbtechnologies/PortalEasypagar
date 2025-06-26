import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllocateShiftComponent } from './allocate-shift.component';

const routes: Routes = [{
  path: '',
  component: AllocateShiftComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllocateShiftRoutingModule { }
