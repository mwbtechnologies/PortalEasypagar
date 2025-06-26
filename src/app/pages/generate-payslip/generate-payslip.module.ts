import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeductionHistory, GeneratePayslipComponent,LoanDetails, OtSummary, PaymentSummary, ShiftSummary } from './generate-payslip.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GeneratePayslipRoutingModule } from './generate-payslip-routing.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { FlatpickrModule } from 'angularx-flatpickr';
import {MatDialogModule} from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NumberPrecisionPipeModule } from 'src/app/pipes/number-precision.module';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [GeneratePayslipComponent,LoanDetails,PaymentSummary,ShiftSummary,OtSummary,DeductionHistory],
  imports: [
    CommonModule,
    GeneratePayslipRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    CalendarModule,
    FlatpickrModule,
    MatDialogModule,
    NgMultiSelectDropDownModule.forRoot(),
    NumberPrecisionPipeModule,
    MatTooltipModule
  ],exports:[
    GeneratePayslipComponent
  ]
})
export class GeneratePayslipModule { }
