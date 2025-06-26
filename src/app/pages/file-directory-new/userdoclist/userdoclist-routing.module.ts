import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileDirectoryNewComponent } from '../file-directory-new.component';
import { UserdoclistComponent } from './userdoclist.component';

const routes: Routes = [
  {
    path: '',
    component: FileDirectoryNewComponent
  },
   {
      path: 'UserDoc',
      component: UserdoclistComponent
    }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserdoclistRoutingModule { }
