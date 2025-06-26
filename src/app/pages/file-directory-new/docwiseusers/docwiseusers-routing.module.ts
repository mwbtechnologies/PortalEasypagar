import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoclistComponent } from '../doclist/doclist.component';
import { DocwiseusersComponent } from './docwiseusers.component';

const routes: Routes = [{
  path: 'Document',
  component: DoclistComponent
},
{
  path: 'Document/Users',
  component: DocwiseusersComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocwiseusersRoutingModule { }
