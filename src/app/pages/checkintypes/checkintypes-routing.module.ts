import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckintypesComponent } from './checkintypes.component';

const routes: Routes = [{
  path: '',
  component: CheckintypesComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckintypesRoutingModule { }
