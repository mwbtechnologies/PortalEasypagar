import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatedocRoutingModule } from './createdoc-routing.module';
import { CreatedocComponent } from './createdoc.component';
import { FileDirectoryModule } from '../../file-directory/file-directory.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [CreatedocComponent],
  imports: [
    CommonModule,
    CreatedocRoutingModule,
    FileDirectoryModule,
    NgSelectModule,
    FormsModule,ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatTooltipModule,
    NgSelectModule,
  ]
})
export class CreatedocModule { }
