import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditSalarySettingComponent } from './add-edit-salary-setting.component';

const routes: Routes = [{
  path: '',
  component: AddEditSalarySettingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditSalarySettingRoutingModule { }
