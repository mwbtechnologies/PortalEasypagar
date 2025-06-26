import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiometricPunchesComponent } from './biometric-punches.component';

const routes: Routes = [{
  path: '',
  component: BiometricPunchesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiometricPunchesRoutingModule { }
