import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiometricDatewisePunchesComponent } from './biometric-datewise-punches.component';

const routes: Routes = [{
  path: '',
  component: BiometricDatewisePunchesComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiometricDatewisePunchesRoutingModule { }
