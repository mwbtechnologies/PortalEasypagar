import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeBranchComponent } from './change-branch.component';

const routes: Routes = [{ path: '', component: ChangeBranchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeBranchRoutingModule { }
