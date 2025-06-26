import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileDirectoryNewComponent } from './file-directory-new.component';
import { CreatedocComponent } from './createdoc/createdoc.component';
import { DoclistComponent } from './doclist/doclist.component';
import { UserdoclistComponent } from './userdoclist/userdoclist.component';
import { DocTimelineComponent } from './timeline/timeline.component';
import { DocwiseusersComponent } from './docwiseusers/docwiseusers.component';
import { DirAnalyticsComponent } from './analytics/analytics.component';
import { GlobalsearchlistComponent } from './globalsearchlist/globalsearchlist.component';

const routes: Routes = [
  {
    path: '',
    component: FileDirectoryNewComponent,
  },
  {
    path: 'createdoc',
    component: CreatedocComponent
  },
  {
    path: 'Document',
    component: DoclistComponent
  },
  {
    path: 'UserDoc',
    component: UserdoclistComponent
  },
  {
    path: 'Timeline',
    component: DocTimelineComponent
  },
  {
    path: 'Document/Users',
    component: DocwiseusersComponent
  },
  {
    path: 'Analytics',
    component: DirAnalyticsComponent
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
export class FileDirectoryNewRoutingModule { }
