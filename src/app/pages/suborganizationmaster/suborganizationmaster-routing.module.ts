import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuborganizationmasterComponent } from './suborganizationmaster.component';

const routes: Routes = [
  {
    path: '',
    component: SuborganizationmasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuborganizationmasterRoutingModule { }
