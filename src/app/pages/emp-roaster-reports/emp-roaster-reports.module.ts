import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { EmpRoasterReportsRoutingModule } from './emp-roaster-reports-routing.module';
import { EmpRoasterReportsComponent } from './emp-roaster-reports.component';
import { CommonTableModule } from '../../pages/common-table/common-table.module';
import { CommonTableButtonsModule } from '../../pages/common-table-buttons/common-table-buttons.module';
import { DatePipe } from '@angular/common';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpMonthReportComponent } from './emp-month-report/emp-month-report.component';
import { DutyRosterDateEditComponent } from './duty-roster-date-edit/duty-roster-date-edit.component';


import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchBarComponent } from './search-bar/search-bar.component';


@NgModule({
  declarations: [
    EmpRoasterReportsComponent,
    EmpMonthReportComponent,
    DutyRosterDateEditComponent,
    SearchBarComponent
  ],
  imports: [
      CommonModule,
      EmpRoasterReportsRoutingModule,
      CommonTableModule,
      CommonTableButtonsModule,
      ReactiveFormsModule,
      FormsModule,
      NgMultiSelectDropDownModule,
      MatDialogModule,
      MatCheckboxModule,
      MatFormFieldModule,
      MatInputModule,
      NgxMaterialTimepickerModule
     
    ],
    exports:[SearchBarComponent],
    providers: [DatePipe]
})
export class EmpRoasterReportsModule { }
