import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';

// import { SidebarRoutingModule } from './sidebar-routing.module';
// import { SideGroupComponent } from './side-group/side-group.component';
// import { SideItemComponent } from './side-item/side-item.component';
// import { SideCollapseComponent } from './side-collapse/side-collapse.component';


@NgModule({
  declarations: [ComingSoonComponent],
  imports: [
    CommonModule,
    // SidebarRoutingModule,
    NgScrollbarModule
  ]
})
export class SidebarModule { }
