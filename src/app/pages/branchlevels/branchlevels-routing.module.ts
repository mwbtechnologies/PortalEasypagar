import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchlevelsComponent } from './branchlevels.component';

const routes: Routes = [{
  path: '',
  component: BranchlevelsComponent,
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchlevelsRoutingModule { }
