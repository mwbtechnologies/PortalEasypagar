import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasePlanComponent } from './purchase-plan.component';

const routes: Routes = [{
  path: '',
  component: PurchasePlanComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasePlanRoutingModule { }
