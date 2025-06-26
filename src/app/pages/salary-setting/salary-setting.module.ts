import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonTableModule } from '../common-table/common-table.module';
import { AddEditSalarySettingModule } from '../add-edit-salary-setting/add-edit-salary-setting.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonTableModule,
    NgMultiSelectDropDownModule,
    AddEditSalarySettingModule,
  ]
})
export class SalarySettingModule { }
