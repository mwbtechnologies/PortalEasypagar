import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionPlansComponent } from './subscription-plans.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { SubscriptionPlansRoutingModule } from './subscription-plans-routing.module';
import { DetailedplanComponent } from './detailedplan/detailedplan.component';
import { AddonpacksComponent } from './addonpacks/addonpacks.component';
import { RenewplansComponent } from './renewplans/renewplans.component';


@NgModule({
  declarations: [SubscriptionPlansComponent, DetailedplanComponent, AddonpacksComponent, RenewplansComponent],
  imports: [
    CommonModule,
    SubscriptionPlansRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule
  ]
})
export class SubscriptionPlansModule { }
