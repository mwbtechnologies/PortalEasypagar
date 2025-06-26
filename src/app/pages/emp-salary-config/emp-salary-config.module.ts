import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EmpSalaryConfigComponent } from './emp-salary-config.component';
import { EmpSalaryConfigRoutingModule } from './emp-salary-config-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonTableModule } from '../common-table/common-table.module';


@NgModule({
  declarations: [EmpSalaryConfigComponent],
  imports: [
    CommonModule,
    FormsModule,
    EmpSalaryConfigRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    CommonTableModule
    ],
  exports:[
    EmpSalaryConfigComponent
  ]
})
export class EmpSalaryConfigModule { }
