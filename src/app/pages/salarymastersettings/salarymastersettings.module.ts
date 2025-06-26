import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonTableModule } from '../common-table/common-table.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SalarymastersettingsRoutingModule } from './salarymastersettings-routing.module';
import { SalarymastersettingsComponent } from './salarymastersettings.component';
import { AddUpdateFieldComponent } from './add-update-field/add-update-field.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [SalarymastersettingsComponent, AddUpdateFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    SalarymastersettingsRoutingModule,
    MatStepperModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonTableModule,
    MatSlideToggleModule,
     MatDialogModule,
        CommonModule,
        MatTooltipModule,
        NgxDropzoneModule,
        NgSelectModule,
        MatInputModule,
        FormsModule,
        HttpClientModule,
        NgxSpinnerModule,
        DataTablesModule,
  ],exports:[
    SalarymastersettingsComponent,
    ],
})
export class SalarymastersettingsModule { }
