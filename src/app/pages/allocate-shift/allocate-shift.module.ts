import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllocateShiftComponent} from './allocate-shift.component';
import { DataTablesModule } from 'angular-datatables';
import { AllocateShiftRoutingModule } from './allocate-shift-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatSelectModule} from '@angular/material/select';
import { AddeditComponent } from './addedit/addedit.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditallocateComponent } from './editallocate/editallocate.component';


@NgModule({
  declarations: [AllocateShiftComponent, AddeditComponent,EditallocateComponent],
  imports: [
    CommonModule,
    AllocateShiftRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatSelectModule,
    DataTablesModule,
    FormsModule,
    MatDialogModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatTooltipModule
  ]
})
export class AllocateShiftModule { }
