import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatewiseComponent } from './datewise/datewise.component';
import { ExpensewiseComponent } from './datewise/expensewise/expensewise.component';
import { BillimagesComponent } from './datewise/billimages/billimages.component';
import { BillComponent } from './datewise/expensewise/bill/bill.component';
import { CommonTableModule } from '../../common-table/common-table.module';

@NgModule({
    declarations: [DatewiseComponent, ExpensewiseComponent, BillimagesComponent, BillComponent],
    imports: [
        CommonModule,
        NgxDropzoneModule,
        NgSelectModule,
        MatInputModule,
        FormsModule,
        HttpClientModule,
        NgxSpinnerModule,
        DataTablesModule,
        MatTableModule, FormsModule,
        MatDialogModule, MatCheckboxModule, ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSidenavModule,
        MatIconModule,
        NgbDropdownModule,
        MatChipsModule,
        MatSelectModule, 
        MatPaginatorModule,
        MatTooltipModule, 
        MatProgressSpinnerModule,
        MatButtonModule, 
        NgMultiSelectDropDownModule.forRoot(),
        NgbModule,
        CommonTableModule
    ]
})
export class EmployeeWiseModule { }