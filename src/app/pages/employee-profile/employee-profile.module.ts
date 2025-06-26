import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeProfileComponent } from './employee-profile.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EmployeeProfileRoutingModule } from './employee-profile-routing.module';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [EmployeeProfileComponent],
  imports: [
    CommonModule,
    EmployeeProfileRoutingModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    MatRadioModule
  ]
})
export class EmployeeProfileModule { }
