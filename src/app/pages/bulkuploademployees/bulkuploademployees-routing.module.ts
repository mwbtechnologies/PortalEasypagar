import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkuploademployeesComponent } from './bulkuploademployees.component';

const routes: Routes = [
  {
    path: '',
    component: BulkuploademployeesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkuploademployeesRoutingModule { }
