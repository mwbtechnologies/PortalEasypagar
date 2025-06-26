import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveconfigComponent } from './leaveconfig.component';

const routes: Routes = [{
  path: '',
  component: LeaveconfigComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveconfigRoutingModule { }
