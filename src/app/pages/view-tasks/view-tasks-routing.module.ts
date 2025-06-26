import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewTasksComponent } from './view-tasks.component';

const routes: Routes = [{
  path: '',
  component: ViewTasksComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewTasksRoutingModule { }
