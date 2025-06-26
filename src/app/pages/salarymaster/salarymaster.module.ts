import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonTableModule } from '../common-table/common-table.module';
import { SalarymasterRoutingModule } from './salarymaster-routing.module';
import { SalarymastersettingsModule } from '../salarymastersettings/salarymastersettings.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SalarymasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    CommonTableModule,
    SalarymastersettingsModule
    
  ]
})
export class SalarymasterModule { }
