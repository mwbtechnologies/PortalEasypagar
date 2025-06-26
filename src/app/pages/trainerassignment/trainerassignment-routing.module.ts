import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainerassignmentComponent } from './trainerassignment.component';

const routes: Routes = [  {
  path: '',
  component: TrainerassignmentComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainerassignmentRoutingModule { }
