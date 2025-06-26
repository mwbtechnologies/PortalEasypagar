import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileDirectoryNewComponent } from '../file-directory-new.component';
import { GlobalsearchlistComponent } from './globalsearchlist.component';

const routes: Routes = [
  {
    path: '',
    component: FileDirectoryNewComponent,
  },
  {
    path: 'SearchByData',
    component: GlobalsearchlistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalsearchlistRoutingModule { }
