import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllocateModulesComponent } from './allocate-modules.component';

const routes: Routes = [  {
  path: '',
  component: AllocateModulesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllocateModulesRoutingModule { }
