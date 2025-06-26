import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSalaryGrossComponent } from './add-salary-gross.component';

const routes: Routes = [{ path: '', component: AddSalaryGrossComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSalaryGrossRoutingModule { }
