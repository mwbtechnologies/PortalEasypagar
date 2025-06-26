import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalarymasterComponent } from './salarymaster.component';

const routes: Routes = [{
  path: '',
  component: SalarymasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalarymasterRoutingModule { }
