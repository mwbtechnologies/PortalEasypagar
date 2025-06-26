import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtconfigComponent } from './otconfig.component';

const routes: Routes = [
  {
    path: '',
    component: OtconfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtconfigRoutingModule { }
