import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveConfigRoutingModule } from './leave-config-routing.module';
import { LeaveConfigComponent } from './leave-config.component';
import { LeaveTypeComponent } from './leave-type/leave-type.component';
import { FormBuilder,FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonTableModule } from './../common-table/common-table.module';
import { LeaveMapComponent } from './leave-map/leave-map.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LeaveMappingListComponent } from './leave-mapping-list/leave-mapping-list.component';

@NgModule({
  declarations: [
    LeaveConfigComponent,
    LeaveTypeComponent,
    LeaveMapComponent,
    LeaveMappingListComponent
  ],
  imports: [
    CommonModule,
      LeaveConfigRoutingModule,
      NgMultiSelectDropDownModule,
      FormsModule,
      ReactiveFormsModule,
      MatCheckboxModule,
      MatButtonModule,
      MatStepperModule,
      MatFormFieldModule,
      MatInputModule,
      MatRadioModule,
      MatSlideToggleModule,
      MatDialogModule,
      MatDialogModule,
      MatTooltipModule,
      CommonTableModule
  ]
})
export class LeaveConfigModule { }
