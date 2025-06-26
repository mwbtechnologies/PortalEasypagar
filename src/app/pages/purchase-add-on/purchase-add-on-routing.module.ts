import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseAddOnComponent } from './purchase-add-on.component';

const routes: Routes = [{
  path: '',
  component: PurchaseAddOnComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseAddOnRoutingModule { }
