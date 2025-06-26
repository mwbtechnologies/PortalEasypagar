import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckintypesRoutingModule } from './checkintypes-routing.module';
import { CheckintypesComponent } from './checkintypes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { AddcheckinComponent } from './addcheckin/addcheckin.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [CheckintypesComponent, AddcheckinComponent],
  imports: [
    CommonModule,
    CheckintypesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
   DataTablesModule,
    MatDialogModule,
      NgxSpinnerModule,
       MatSelectModule,
       NgbModule,
       NgMultiSelectDropDownModule.forRoot(),
  ],
  exports:[
    CheckintypesComponent
  ]
})
export class CheckintypesModule { }
