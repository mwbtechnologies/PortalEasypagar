import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonPaginatedTableComponent } from './common-paginated-table.component';

const routes: Routes = [
  {
    path: '',
    component: CommonPaginatedTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonPaginatedTableRoutingModule { }
