import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddlunchtimingsComponent } from './addlunchtimings.component';

const routes: Routes = [
  {
    path: '',
    component: AddlunchtimingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddlunchtimingsRoutingModule { }
