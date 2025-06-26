import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonusDeductionsRoutingModule } from './bonus-deductions-routing.module';
import { BonusDeductionsComponent } from './bonus-deductions.component';
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
import { AddeditbonusdeductionComponent } from './addeditbonusdeduction/addeditbonusdeduction.component';
import { CommonTableModule } from '../common-table/common-table.module';
import { HistoryComponent } from './history/history.component';
import { ViewComponent } from './view/view.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [BonusDeductionsComponent, AddeditbonusdeductionComponent, HistoryComponent, ViewComponent],
  imports: [
    CommonModule,
    BonusDeductionsRoutingModule,
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
export class BonusDeductionsModule { }
