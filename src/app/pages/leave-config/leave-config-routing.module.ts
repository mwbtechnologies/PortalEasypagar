import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveConfigComponent } from './leave-config.component';
import { LeaveMapComponent } from './leave-map/leave-map.component'
import { LeaveMappingListComponent } from './leave-mapping-list/leave-mapping-list.component';

const routes: Routes = [

    { path: '', component: LeaveConfigComponent },
    { path: 'map', component: LeaveMappingListComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveConfigRoutingModule { }
