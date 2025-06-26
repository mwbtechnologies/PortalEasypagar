import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileDirectoryNewComponent } from '../file-directory-new.component';
import { DoclistComponent } from './doclist.component';
import { CreatedocComponent } from '../createdoc/createdoc.component';

const routes: Routes = [
  {
    path: '',
    component: FileDirectoryNewComponent
  },
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
export class DoclistRoutingModule { }
