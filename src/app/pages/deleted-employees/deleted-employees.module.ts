import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeletedEmployeesRoutingModule } from './deleted-employees-routing.module';
import { DeletedEmployeesComponent } from './deleted-employees.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';


@NgModule({
  declarations: [DeletedEmployeesComponent],
  imports: [
    CommonModule,
    DeletedEmployeesRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    NgScrollbarModule,
    HttpClientModule,
   MatDialogModule,
   NgxSpinnerModule,
    MatSelectModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    CommonTableModule
  ]
})
export class DeletedEmployeesModule { }
