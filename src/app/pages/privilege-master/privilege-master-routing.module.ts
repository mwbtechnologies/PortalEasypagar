import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PrivilegeMasterComponent} from './privilege-master.component';

const routes: Routes = [
  {
    path: '',
    component: PrivilegeMasterComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivilegeMasterRoutingModule { }
