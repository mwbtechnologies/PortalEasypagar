import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SalesDashboardComponent} from './sales-dashboard.component';
import { SalesDashboardRoutingModule } from './sales-dashboard-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SalesDashboardComponent],
  imports: [
    CommonModule,
    SalesDashboardRoutingModule,
    NgApexchartsModule,
    NgxSpinnerModule,
    NgbModule
  ]
})
export class SalesDashboardModule { }
