import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatedocComponent } from './createdoc.component';
import { FileDirectoryNewComponent } from '../file-directory-new.component';
import { DoclistComponent } from '../doclist/doclist.component';

const routes: Routes = [
  {
    path: 'Document',
    component: DoclistComponent
  },
  {
    path: 'createdoc',
    component: CreatedocComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatedocRoutingModule { }
