import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanListComponent} from './loan-list.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoanListRoutingModule } from './loan-list-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ApproveLoanComponent } from './approve-loan/approve-loan.component';
import { PaymentsummaryComponent } from './paymentsummary/paymentsummary.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [LoanListComponent,ApproveLoanComponent, PaymentsummaryComponent],
  imports: [
    CommonModule,
    LoanListRoutingModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatSelectModule,
    DataTablesModule,
    NgxDropzoneModule,
    NgSelectModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    DataTablesModule,
    MatTableModule,FormsModule,
    MatDialogModule,MatCheckboxModule,ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatIconModule,
    NgbDropdownModule,
    MatChipsModule,
    MatSelectModule,MatPaginatorModule,MatTooltipModule,
    MatMenuModule,MatGridListModule,MatDividerModule,MatProgressSpinnerModule,MatButtonModule,NgMultiSelectDropDownModule.forRoot()
  
    ],
  providers:[DatePipe]
})
export class LoanListModule { }
