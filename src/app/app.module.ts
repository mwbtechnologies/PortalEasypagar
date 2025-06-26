import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/admin/header/header.component';
import { SwitcherComponent } from './layout/admin/switcher/switcher.component';
import { SidebarComponent } from './layout/admin/sidebar/sidebar.component';
import { RightSidebarComponent } from './layout/admin/right-sidebar/right-sidebar.component';
import { FooterComponent } from './layout/admin/footer/footer.component';
import { TabToTopComponent } from './layout/admin/tab-to-top/tab-to-top.component';
import { PageHeaderComponent } from './layout/admin/page-header/page-header.component';
import { NgxColorsModule } from 'ngx-colors';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { NgIconsModule } from '@ng-icons/core';
import 'boxicons';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthComponent } from './layout/auth/auth.component';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatSelectModule} from '@angular/material/select';
import { PageHeader2Component } from './layout/admin/page-header2/page-header2.component';
import { LoaderComponent } from './layout/admin/loader/loader.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {MatInputModule} from '@angular/material/input';
import { DownloadFileService } from './services/download-file.service';
import {MatDialogModule} from '@angular/material/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SpinnerComponent } from './layout/admin/spinner/spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RemoveModulesComponent } from './pages/remove-modules/remove-modules.component';
import { GooglePlaceModule} from "ngx-google-places-autocomplete";
import { GoogleMapsAPIWrapper } from '@agm/core';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {WebcamModule} from 'ngx-webcam';
import {NgxImageCompressService} from 'ngx-image-compress';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ViewTasksComponent } from './pages/view-tasks/view-tasks.component';
import { Routes, RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'; 
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { MessagingService } from './services/messaging.service';
import { environment } from '../environments/environment';
import { initializeApp } from "firebase/app";
initializeApp(environment.firebase);
import 'firebase/messaging';
import { ViewEmployeeShiftComponent } from './pages/view-employee-shift/view-employee-shift.component';
import { MatCarouselModule } from 'ng-mat-carousel';
import { ChartsModule } from 'ng2-charts';
import { BiometricComponent } from './pages/biometric/biometric.component';
import { MatTableModule } from '@angular/material/table';
import { CommonTableModule } from './pages/common-table/common-table.module';
import { SalarySettingComponent } from './pages/salary-setting/salary-setting.component';
import { SettingsSalaryComponent } from './pages/settings-salary/settings-salary.component';
import { AppUpdatesComponent } from './pages/app-updates/app-updates.component';
import { BiometricPunchesComponent } from './pages/biometric-punches/biometric-punches.component';
import { BiometricDatewisePunchesComponent } from './pages/biometric-datewise-punches/biometric-datewise-punches.component';
import { SalarymasterreportComponent } from './pages/salarymasterreport/salarymasterreport.component';
// import { AddEditSalarySettingComponent } from './pages/add-edit-salary-setting/add-edit-salary-setting.component';
import { SalarymasterComponent } from './pages/salarymaster/salarymaster.component';
import { WorkhourconfigComponent } from './pages/workhourconfig/workhourconfig.component';
import { StoreModule } from '@ngrx/store';
import { empListReducer } from './Redux/reducer/emp_list.reducer';
import { branchListReducer } from './Redux/reducer/branch_list.reducer';
import { subOrgListReducer } from './Redux/reducer/suborg_list.reducer';
import { deptListReducer } from './Redux/reducer/department_list.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EmpListEffects } from './Redux/effects/emp_list.effects';
import { SubOrgListEffects } from './Redux/effects/subOrg_list.effects';
import { BranchListEffects } from './Redux/effects/branch_list.effects';
import { DeptListEffects } from './Redux/effects/department_list.effects';
import { CommonPaginatedTableModule } from './pages/common-paginated-table/common-paginated-table.module';
import { EmpwisereportComponent } from './pages/security-deduction-reports/empwisereport/empwisereport.component';

const routes:Routes = [];
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    HeaderComponent,
    SwitcherComponent,
    SidebarComponent,
    RightSidebarComponent,
    FooterComponent,
    TabToTopComponent,
    PageHeaderComponent,
    AdminComponent,
    AuthComponent,
    PageHeader2Component,
    LoaderComponent,
    SpinnerComponent,
    RemoveModulesComponent,
    ForgotPasswordComponent,
    ViewTasksComponent,
    ViewEmployeeShiftComponent,
    BiometricComponent,
    SalarySettingComponent,
    SettingsSalaryComponent,
    AppUpdatesComponent,
    BiometricPunchesComponent,
    BiometricDatewisePunchesComponent,
    SalarymasterreportComponent,
    // AddEditSalarySettingComponent,
    SalarymasterComponent,
    
    // SalarymastersettingsComponent
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxDropzoneModule,
    NgxColorsModule,
    NgScrollbarModule,
    NgApexchartsModule,
    FontAwesomeModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    MatCarouselModule.forRoot(),
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    PdfViewerModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    GooglePlaceModule,
    DataTablesModule,
    MatTableModule,
    CommonTableModule,
    NgbModule,
     WebcamModule,
     AgmDirectionModule, 
     NgMultiSelectDropDownModule,  
     AgmCoreModule.forRoot({ // @agm/core
       apiKey: 'AIzaSyBgvgB3O0eJQmGPOjb80gqwIt28XkB1A80',
     }),     CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    RouterModule.forRoot(routes,{useHash:true}),
   AngularFireDatabaseModule,
AngularFireAuthModule,
AngularFireModule.initializeApp(environment.firebase),
AngularFireMessagingModule,
StoreModule.forRoot({ empList: empListReducer , branchList:branchListReducer, deptList:deptListReducer,subOrgList:subOrgListReducer }),
EffectsModule.forRoot([SubOrgListEffects,BranchListEffects,DeptListEffects,EmpListEffects]),
  ],
  providers: [DownloadFileService,GoogleMapsAPIWrapper,NgxImageCompressService, MessagingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
