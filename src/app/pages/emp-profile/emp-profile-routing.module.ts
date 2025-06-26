import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpProfileComponent } from './emp-profile.component';

const routes: Routes = [{ path: ':id', component: EmpProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpProfileRoutingModule { }
