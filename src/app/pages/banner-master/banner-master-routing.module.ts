import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerMasterComponent } from './banner-master.component';

const routes: Routes = [{
  path: '',
  component: BannerMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerMasterRoutingModule { }
