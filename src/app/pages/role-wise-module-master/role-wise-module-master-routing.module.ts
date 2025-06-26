import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleWiseModuleMasterComponent } from './role-wise-module-master.component';

const routes: Routes = [  {
  path: '',
  component: RoleWiseModuleMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleWiseModuleMasterRoutingModule { }
