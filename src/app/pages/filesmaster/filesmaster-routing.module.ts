import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesmasterComponent } from './filesmaster.component';

const routes: Routes = [
  {
    path: '',
    component: FilesmasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilesmasterRoutingModule { }
