import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminsupportRoutingModule } from './adminsupport-routing.module';
import { AdminsupportComponent } from './adminsupport.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [AdminsupportComponent],
  imports: [
    CommonModule,
    AdminsupportRoutingModule,
    NgxDropzoneModule,
    MatInputModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatTooltipModule
  ]
})
export class AdminsupportModule { }
