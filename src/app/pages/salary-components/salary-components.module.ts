import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaryComponentsRoutingModule } from './salary-components-routing.module';
import { SalaryComponentsComponent } from './salary-components.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonTableModule } from './../common-table/common-table.module';
import { AddSalaryComponentComponent } from './add-salary-component/add-salary-component.component';


import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    SalaryComponentsComponent,
    AddSalaryComponentComponent
  ],
  imports: [
    CommonModule,
      SalaryComponentsRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      CommonTableModule,
      MatCheckboxModule,
      MatButtonModule,
      MatStepperModule,
      MatFormFieldModule,
      MatInputModule,
      MatRadioModule,
      MatSlideToggleModule,
      MatDialogModule,
      MatTooltipModule
    ],
    providers: [DatePipe]
})
export class SalaryComponentsModule { }
