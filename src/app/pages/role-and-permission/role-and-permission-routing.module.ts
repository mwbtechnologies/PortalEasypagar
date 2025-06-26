import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleAndPermissionComponent } from './role-and-permission.component';

const routes: Routes = [  {
  path: '',
  component: RoleAndPermissionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleAndPermissionRoutingModule { }
