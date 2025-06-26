import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilesmasterRoutingModule } from './filesmaster-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';
import { ViewdetailsComponent } from './files/viewdetails/viewdetails.component';
import { FilesmasterComponent } from './filesmaster.component';
import { FilesComponent } from './files/files.component';
import { ViewfilesComponent } from './files/viewfiles/viewfiles.component';
import { UploadfilesComponent } from './files/uploadfiles/uploadfiles.component';
import { UploadedhistoryComponent } from './uploadedhistory/uploadedhistory.component';



@NgModule({
  declarations: [ViewdetailsComponent, FilesmasterComponent,FilesComponent, ViewfilesComponent, UploadfilesComponent, UploadedhistoryComponent],
  imports: [
    CommonModule,
    FilesmasterRoutingModule,NgbModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatTooltipModule,
    CommonTableModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class FilesmasterModule { }
