import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtreportsComponent } from './otreports.component';

const routes: Routes = [
  {
    path: '',
    component: OtreportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtreportsRoutingModule { }
