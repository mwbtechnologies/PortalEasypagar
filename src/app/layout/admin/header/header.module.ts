import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderRoutingModule } from './header-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmpRoasterReportsModule } from '../../../pages/emp-roaster-reports/emp-roaster-reports.module';
import { HeaderComponent } from './header.component';

@NgModule({
    declarations: [HeaderComponent],
  imports: [
    CommonModule,
    HeaderRoutingModule,
      MatTooltipModule,
      EmpRoasterReportsModule
  ]
})
export class HeaderModule { }
