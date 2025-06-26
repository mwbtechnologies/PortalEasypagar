import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { NgxDropzoneModule } from 'ngx-dropzone';
// import { NgxSpinnerModule } from 'ngx-spinner';
// import { MatMenuModule } from '@angular/material/menu';
import { ColumnSelection, CommonPaginatedTableComponent, DownloadReport } from './common-paginated-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { CommonPaginatedTableRoutingModule } from './common-paginated-table-routing.module';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import {CdkMenuModule} from '@angular/cdk/menu'
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NumberPrecisionPipeModule } from 'src/app/pipes/number-precision.module';

@NgModule({
  declarations: [CommonPaginatedTableComponent,DownloadReport, ColumnSelection],
  imports: [
    CommonModule,
    MatTableModule,
    // NgxDropzoneModule,
    // NgSelectModule,
    // MatInputModule,
    FormsModule,
    // BrowserModule,
    // HttpClientModule,
    // MatDialogModule, 
    // NgxSpinnerModule,
    // MatSelectModule,
    // DataTablesModule,
    // FormsModule,
    // MatDialogModule,
    // NgMultiSelectDropDownModule.forRoot(),
    MatTooltipModule,
    // MatMenuModule,
    // CommonTableRoutingModule,
    MatMenuModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    CdkDropList, CdkDrag,
    MatSlideToggleModule,
    NumberPrecisionPipeModule,
    CdkMenuModule,
    ],
  exports:[
    CommonPaginatedTableComponent,
    CdkMenuModule,
  ]
})
export class CommonPaginatedTableModule { }
