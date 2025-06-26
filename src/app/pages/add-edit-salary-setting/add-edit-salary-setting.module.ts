import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonTableModule } from '../common-table/common-table.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddEditSalarySettingComponent } from './add-edit-salary-setting.component';
import { AddEditSalarySettingRoutingModule } from './add-edit-salary-setting-routing.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [AddEditSalarySettingComponent],
  imports: [
    CommonModule,
    FormsModule,
    AddEditSalarySettingRoutingModule,
    MatStepperModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonTableModule,
      MatSlideToggleModule,
      MatTooltipModule
    
  ],exports:[
    AddEditSalarySettingComponent,
  ],
})
export class AddEditSalarySettingModule { }
