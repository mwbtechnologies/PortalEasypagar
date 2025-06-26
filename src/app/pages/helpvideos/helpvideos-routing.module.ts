import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpvideosComponent } from './helpvideos.component';

const routes: Routes = [  {
  path: '',
  component: HelpvideosComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpvideosRoutingModule { }
