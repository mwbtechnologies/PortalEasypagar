import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminsupportComponent } from './adminsupport.component';

const routes: Routes = [{
  path: '',
  component: AdminsupportComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminsupportRoutingModule { }
