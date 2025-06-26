import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoclistRoutingModule } from './doclist-routing.module';
import { DoclistComponent } from './doclist.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DocgrouporderComponent } from './docgrouporder/docgrouporder.component';
import { DocorderComponent } from './docorder/docorder.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [DoclistComponent, DocgrouporderComponent, DocorderComponent],
  imports: [
   CommonModule,
   FormsModule,
   DoclistRoutingModule,
   MatTabsModule,
   NgSelectModule,
   FormsModule,
   ReactiveFormsModule,
   MatInputModule,
   HttpClientModule,
   NgxSpinnerModule,
   NgMultiSelectDropDownModule.forRoot(),
   MatTooltipModule,
   NgSelectModule,
   DragDropModule
  ]
})
export class DoclistModule { }
