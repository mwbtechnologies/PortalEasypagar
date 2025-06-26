import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchlevelsRoutingModule } from './branchlevels-routing.module';
import { BranchlevelsComponent } from './branchlevels.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [BranchlevelsComponent],
  imports: [
    CommonModule,
    BranchlevelsRoutingModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
  ],
  exports:[
    BranchlevelsComponent
  ]
})
export class BranchlevelsModule { }
