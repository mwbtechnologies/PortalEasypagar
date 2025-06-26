import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleAndPermissionComponent} from './role-and-permission.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatSelectModule} from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoleAndPermissionRoutingModule } from './role-and-permission-routing.module';
import { CommonTableModule } from '../common-table/common-table.module';
import { SendwhatsappmsgComponent } from './sendwhatsappmsg/sendwhatsappmsg.component';

@NgModule({
  declarations: [RoleAndPermissionComponent, SendwhatsappmsgComponent],
  imports: [
    CommonModule,
    RoleAndPermissionRoutingModule,
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
    MatTooltipModule,
    CommonTableModule
  ],
  exports:[
    RoleAndPermissionComponent
  ]
})
export class RoleAndPermissionModule { }
