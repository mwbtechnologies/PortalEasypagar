import { NgModule } from '@angular/core';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { YearlyExpenseReportComponent } from './yearly-expense-report.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { YearlyExpenseReportRoutingModule } from './yearly-expense-report-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MonthlyExpenseReportModule } from '../monthly-expense-report/monthly-expense-report.module';
import { CommonTableModule } from '../common-table/common-table.module';
import { ViewimagesComponent } from './viewimages/viewimages.component';

@NgModule({
  declarations: [YearlyExpenseReportComponent,ViewimagesComponent],
  imports: [
    CommonModule,
    YearlyExpenseReportRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    NgbCarouselModule,
    MatInputModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatTooltipModule,
    MonthlyExpenseReportModule,
    MatTooltipModule,
    CommonTableModule
  ]
})
export class YearlyExpenseReportModule { }
