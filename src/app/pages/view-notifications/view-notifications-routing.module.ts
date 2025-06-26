import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewNotificationsComponent } from './view-notifications.component';

const routes: Routes = [{
  path: '',
  component: ViewNotificationsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewNotificationsRoutingModule { }
