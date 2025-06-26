import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EasytrackermappingComponent } from './easytrackermapping.component';

const routes: Routes = [
  {
    path: '',
    component: EasytrackermappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EasytrackermappingRoutingModule { }
