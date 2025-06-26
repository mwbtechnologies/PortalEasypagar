import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RolesMasterComponent} from './roles-master.component';

const routes: Routes = [
  {
    path: '',
    component: RolesMasterComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesMasterRoutingModule { }
