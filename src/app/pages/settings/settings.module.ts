import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatInputModule } from '@angular/material/input';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DataTablesModule } from 'angular-datatables';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SalarySettingModule } from '../salary-setting/salary-setting.module';
import { AdminlunchconfigModule } from '../adminlunchconfig/adminlunchconfig.module';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { EasytrackermappingModule } from '../easytrackermapping/easytrackermapping.module';
import { BranchlevelsModule } from '../branchlevels/branchlevels.module';
import { DefaultbranchModule } from '../defaultbranch/defaultbranch.module';
import { LocationconfigModule } from '../locationconfig/locationconfig.module';
import { CommonTableModule } from '../common-table/common-table.module';
import { CheckintypesModule } from '../checkintypes/checkintypes.module';
import { WorkhourconfigModule } from '../workhourconfig/workhourconfig.module';


@NgModule({
  declarations: [SettingsComponent,ComingSoonComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule,
    MatSelectModule,
    MatTooltipModule,
    SalarySettingModule,
    AdminlunchconfigModule,
    EasytrackermappingModule,
    BranchlevelsModule,
    DefaultbranchModule,
    LocationconfigModule,
    CommonTableModule,
    CheckintypesModule,
    WorkhourconfigModule
  ]
})
export class SettingsModule { }
