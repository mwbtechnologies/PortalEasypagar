import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetAssignModule } from './assign/assign.module';
import { AssignListComponent } from './assign/list/list.component';
import { AssetInwardComponent } from './stock/inward/inward.component';
import { AssignComponent } from './assign/assign/assign.component';
import { AssetInwardListComponent } from './stock/list/list.component';
import { AssetItemAddComponent } from './items/add/add.component';
import { AssetItemListComponent } from './items/list/list.component';
import { UserlistComponent } from './assign/userlist/userlist.component';
import { CategorywiseComponent } from './category/categorywise/categorywise.component';
import { AssetAnalyticsComponent } from './analytics/analytics.component';

const routes: Routes = [
  {
   path: '',
   pathMatch: 'full',
   redirectTo:'assign/list'
  },
  {
   path: 'assign/list',
   component: AssignListComponent
  },
  // {
  //  path: 'assign/list/user',
  //  component: UserlistComponent
  // },
  // {
  //  path: 'assign/add',
  //  component: AssignComponent
  // },
  // {
  //  path: 'assign/edit',
  //  component: AssignComponent
  // },
  {
   path: 'stock/inward/add',
   component: AssetInwardComponent
  },
  {
   path: 'stock/inward/edit',
   component: AssetInwardComponent
  },
  {
   path: 'stock/inward/list',
   component: AssetInwardListComponent
  },
  {
   path: 'item/list',
   component: AssetItemListComponent
  },
  {
   path: 'item/add',
   component: AssetItemAddComponent
  },
  {
   path: 'category/list',
   component: CategorywiseComponent
  },
  {
   path: 'analytics',
   component: AssetAnalyticsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetManagementRoutingModule { }
