import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeletedEmployeesComponent } from './deleted-employees.component';

const routes: Routes = [
  {
    path: '',
    component: DeletedEmployeesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeletedEmployeesRoutingModule { }
