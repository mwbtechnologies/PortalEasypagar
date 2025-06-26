import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftMasterComponent } from './shift-master.component';

const routes: Routes = [{
  path: '',
  component: ShiftMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftMasterRoutingModule { }
