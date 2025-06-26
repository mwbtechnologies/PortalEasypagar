import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationconfigComponent } from './locationconfig.component';

const routes: Routes = [ {
  path: '',
  component: LocationconfigComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationconfigRoutingModule { }
