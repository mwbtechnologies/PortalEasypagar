import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewAllocatedTasksComponent } from './view-allocated-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: ViewAllocatedTasksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewAllocatedTasksRoutingModule { }
