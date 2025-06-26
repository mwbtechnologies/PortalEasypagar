import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleLinkMasterComponent } from './module-link-master.component';

const routes: Routes = [
  {
    path: '',
    component: ModuleLinkMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleLinkMasterRoutingModule { }
