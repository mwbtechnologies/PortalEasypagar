import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppDashboardComponent} from './app-dashboard.component';
import { AppDashboardRoutingModule } from './app-dashboard-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select'
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowreportlistComponent } from './showreportlist/showreportlist.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { CommonTableModule } from '../common-table/common-table.module';
import { ShowUpdatePopupComponent } from './show-update-popup/show-update-popup.component';

@NgModule({
  declarations: [AppDashboardComponent, ShowreportlistComponent,ShowUpdatePopupComponent ],
  imports: [
    NgbModule,
    DataTablesModule,
    CommonModule,
    AppDashboardRoutingModule,
    NgApexchartsModule,
    MatTableModule,FormsModule,
    MatDialogModule,MatCheckboxModule,ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatIconModule,
    NgbDropdownModule,
    MatChipsModule,NgxSpinnerModule,
    MatSelectModule,MatPaginatorModule,MatTooltipModule,
    MatMenuModule,MatGridListModule,MatDividerModule,MatProgressSpinnerModule,MatButtonModule,NgMultiSelectDropDownModule.forRoot(),
    CommonTableModule,
  ]
})
export class AppDashboardModule { }
