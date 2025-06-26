import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskAllocationComponent } from './task-allocation.component';

const routes: Routes = [{
  path: '',
  component: TaskAllocationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskAllocationRoutingModule { }
