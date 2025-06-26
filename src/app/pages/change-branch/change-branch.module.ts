import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangeBranchRoutingModule } from './change-branch-routing.module';
import { ChangeBranchComponent } from './change-branch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonTableModule } from '../common-table/common-table.module';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
    ChangeBranchComponent
  ],
  imports: [
    CommonModule,
      ChangeBranchRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      NgMultiSelectDropDownModule,
      CommonTableModule,
      
    ],
    providers: [DatePipe]
})
export class ChangeBranchModule { }
