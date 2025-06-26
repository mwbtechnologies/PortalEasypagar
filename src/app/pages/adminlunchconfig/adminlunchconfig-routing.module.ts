import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminlunchconfigComponent } from './adminlunchconfig.component';

const routes: Routes = [
  {
    path: '',
    component: AdminlunchconfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminlunchconfigRoutingModule { }
