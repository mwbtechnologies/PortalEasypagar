import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesassignmentComponent } from './rolesassignment.component';

const routes: Routes = [  {
  path: '',
  component: RolesassignmentComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesassignmentRoutingModule { }
