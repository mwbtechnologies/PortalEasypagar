import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsSalaryRoutingModule } from './settings-salary-routing.module';
import { CommonTableModule } from '../common-table/common-table.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SettingsSalaryRoutingModule,
    CommonTableModule
  ]
})
export class SettingsSalaryModule { }
