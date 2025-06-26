import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsSalaryComponent } from './settings-salary.component';

const routes: Routes = [{
  path: '',
  component: SettingsSalaryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsSalaryRoutingModule { }
