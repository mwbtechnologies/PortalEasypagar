import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalarymastersettingsComponent } from './salarymastersettings.component';

const routes: Routes = [{
  path: '',
  component: SalarymastersettingsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalarymastersettingsRoutingModule { }
