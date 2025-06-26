import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MarketingDashboardComponent} from './marketing-dashboard.component';
import { MarketingDashboardRoutingModule } from './marketing-dashboard-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [MarketingDashboardComponent],
  imports: [
    CommonModule,
    MarketingDashboardRoutingModule,
    NgApexchartsModule,
    NgxSpinnerModule
  ]
})
export class MarketingDashboardModule { }
