import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnalyticsDashboardComponent} from './analytics-dashboard.component';
import { AnalyticsDashboardRoutingModule } from './analytics-dashboard-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [AnalyticsDashboardComponent],
  imports: [
    CommonModule,
    AnalyticsDashboardRoutingModule,
    NgApexchartsModule
  ]
})
export class AnalyticsDashboardModule { }
