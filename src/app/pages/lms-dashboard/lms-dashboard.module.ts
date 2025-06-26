import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LmsDashboardComponent} from './lms-dashboard.component';
import { LmsDashboardRoutingModule } from './lms-dashboard-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [LmsDashboardComponent],
  imports: [
    CommonModule,
    LmsDashboardRoutingModule,
    NgApexchartsModule
  ]
})
export class LmsDashboardModule { }
