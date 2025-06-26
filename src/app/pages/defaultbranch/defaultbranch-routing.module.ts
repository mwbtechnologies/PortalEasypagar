import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultbranchComponent } from './defaultbranch.component';

const routes: Routes = [{
  path: '',
  component: DefaultbranchComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultbranchRoutingModule { }
