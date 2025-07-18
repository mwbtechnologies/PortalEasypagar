import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemoveModulesComponent } from './remove-modules.component';

const routes: Routes = [ {
  path: '',
  component: RemoveModulesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemoveModulesRoutingModule { }
