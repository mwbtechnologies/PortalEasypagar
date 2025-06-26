import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileDirectoryComponent } from './file-directory.component';

const routes: Routes = [
  {
    path: '',
    component: FileDirectoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileDirectoryRoutingModule { }
