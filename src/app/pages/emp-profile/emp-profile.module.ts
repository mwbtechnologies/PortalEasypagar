import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpProfileRoutingModule } from './emp-profile-routing.module';
import { EmpProfileComponent } from './emp-profile.component';


@NgModule({
  declarations: [
    EmpProfileComponent
  ],
  imports: [
    CommonModule,
    EmpProfileRoutingModule
  ]
})
export class EmpProfileModule { }
