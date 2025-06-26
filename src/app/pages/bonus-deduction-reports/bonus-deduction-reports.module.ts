import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonusDeductionReportsRoutingModule } from './bonus-deduction-reports-routing.module';
import { BonusDeductionReportsComponent } from './bonus-deduction-reports.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonTableModule } from '../common-table/common-table.module';
import { MonthwiseComponent } from './monthwise/monthwise.component';


@NgModule({
  declarations: [BonusDeductionReportsComponent, MonthwiseComponent],
  imports: [
    CommonModule,
    BonusDeductionReportsRoutingModule,
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
    CommonTableModule,
    MatTooltipModule
  ]
})
export class BonusDeductionReportsModule { }
