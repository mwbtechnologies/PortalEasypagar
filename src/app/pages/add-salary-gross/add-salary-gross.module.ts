import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSalaryGrossRoutingModule } from './add-salary-gross-routing.module';
import { AddSalaryGrossComponent } from './add-salary-gross.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonTableModule } from '../common-table/common-table.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditFormulaComponent } from './edit-formula/edit-formula.component';


import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AddSalaryGrossComponent,
    EditFormulaComponent
  ],
  imports: [
    CommonModule,
      AddSalaryGrossRoutingModule,
      MatRadioModule,
      MatSlideToggleModule,
      FormsModule,
      ReactiveFormsModule,
      NgMultiSelectDropDownModule,
      CommonTableModule,
      MatCheckboxModule,
      MatButtonModule,
      MatStepperModule,
      MatFormFieldModule,
      MatInputModule,
      MatDialogModule,
      MatTooltipModule
      


    ],
  providers: [DatePipe]
})
export class AddSalaryGrossModule { }
