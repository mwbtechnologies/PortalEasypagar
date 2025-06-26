import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleMasterComponent } from './module-master.component';

const routes: Routes = [
  {
    path: '',
    component: ModuleMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleMasterRoutingModule { }
