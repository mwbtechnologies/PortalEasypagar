import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetassignmentComponent } from './assetassignment.component';
import { AssignmentComponent } from './assignment/assignment.component';

const routes: Routes = [
  {
  path: '',
  component: AssetassignmentComponent
},
  {
      path: 'Assign',
      component: AssignmentComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetassignmentRoutingModule { }
