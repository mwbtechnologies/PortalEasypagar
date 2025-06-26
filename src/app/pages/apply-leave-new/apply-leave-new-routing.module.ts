import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplyLeaveNewComponent } from './apply-leave-new.component';

const routes: Routes = [{
  path: '',
  component:ApplyLeaveNewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplyLeaveNewRoutingModule { }
