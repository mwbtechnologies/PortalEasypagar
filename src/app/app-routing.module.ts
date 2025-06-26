import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import {AuthComponent} from './layout/auth/auth.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './services/auth.guard.service';

const routes: Routes = [

  {
    path:'AppCom',
    component:AppComponent
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'auth/signin',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        loadChildren: () => import('./pages/authentication/authentication.module').then(module => module.AuthenticationModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('./pages/authentication/auth-signup/auth-signup.module').then(module => module.AuthSignupModule)
      },
      {
        path: 'signin',
        loadChildren: () => import('./pages/authentication/auth-signin/auth-signin.module').then(module => module.AuthSigninModule)
      },
      {
        path: 'ForgotPassword',
        loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(module => module.ForgotPasswordModule)
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },

      {
        path: 'appdashboard',
        loadChildren: () => import('./pages/app-dashboard/app-dashboard.module').then(module => module.AppDashboardModule)
         ,canActivate: [AuthGuard]
      },

      {
        path: 'chat',
        loadChildren: () => import('./pages/chat/chat.module').then(module => module.ChatModule)
        ,canActivate: [AuthGuard]
      },

      {
        path: 'ProfileMaster',
        loadChildren: () => import('./pages/profile/profile.module').then(module => module.ProfileModule)
        ,canActivate: [AuthGuard]
      },
      {
        path: 'lmsdashboard',
        loadChildren: () => import('./pages/lms-dashboard/lms-dashboard.module').then(module => module.LmsDashboardModule) ,canActivate: [AuthGuard]
     
      },
      {
        path: 'mydashboard',
        loadChildren: () => import('./pages/sales-dashboard/sales-dashboard.module').then(module => module.SalesDashboardModule) ,canActivate: [AuthGuard]
        },

    { path: 'DutyRoasterReports', loadChildren: () => import('./pages/emp-roaster-reports/emp-roaster-reports.module').then(m => m.EmpRoasterReportsModule) },
        
      {
        path: 'analyticsdashboard',
        loadChildren: () => import('./pages/analytics-dashboard/analytics-dashboard.module').then(module => module.AnalyticsDashboardModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'marketingdashboard',
        loadChildren: () => import('./pages/marketing-dashboard/marketing-dashboard.module').then(module => module.MarketingDashboardModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'rolesmaster',
        loadChildren: () => import('./pages/roles-master/roles-master.module').then(module => module.RolesMasterModule) ,canActivate: [AuthGuard]
      },
    
      {
        path: 'EmployeeMaster',
        loadChildren: () => import('./pages/employee-muster/employee-muster.module').then(module => module.EmployeeMusterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'salary/configuration/employee',
        loadChildren: () => import('./pages/emp-salary-config/emp-salary-config.module').then(module => module.EmpSalaryConfigModule) ,canActivate: [AuthGuard]
      },

      {
            path: 'salaryComponent',
            loadChildren: () => import('./pages/salary-components/salary-components.module').then(m => m.SalaryComponentsModule)
        },
      {
        path: 'SalaryReport',
        loadChildren: () => import('./pages/salary-report/salary-report.module').then(module => module.SalaryReportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AttendanceReport',
        loadChildren: () => import('./pages/attendance-report/attendance-report.module').then(module => module.AttendanceReportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'YearlyExpenseReport',
        loadChildren: () => import('./pages/yearly-expense-report/yearly-expense-report.module').then(module => module.YearlyExpenseReportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'MonthlyEmpExpenses',
        loadChildren: () => import('./pages/monthly-employee-expense-report/monthly-employee-expense-report.module').then(module => module.MonthlyEmployeeExpenseReportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'MonthlyDatewiseExpenses',
        loadChildren: () => import('./pages/monthly-expense-report/monthly-expense-report.module').then(module => module.MonthlyExpenseReportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'DaywiseEmpExpenses',
        loadChildren: () => import('./pages/daywise-expense-report/daywise-expense-report.module').then(module => module.DaywiseExpenseReportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'DatewiseEmpExpenses',
        loadChildren: () => import('./pages/employee-daywise-expense-report/employee-daywise-expense-report.module').then(module => module.EmployeeDaywiseExpenseReportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'DaywiseEmpAttendance',
        loadChildren: () => import('./pages/monthly-attendance-report/monthly-attendance-report.module').then(module => module.MonthlyAttendanceReportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AnnualReports',
        loadChildren: () => import('./pages/employeereports/employeereports.module').then(module => module.EmployeereportsModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'LoanReport',
        loadChildren: () => import('./pages/loan-reports/loan-reports.module').then(module => module.LoanReportsModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'DetailedLoanReport',
        loadChildren: () => import('./pages/detailed-loan-reports/detailed-loan-reports.module').then(module => module.DetailedLoanReportsModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'LeaveMaster',
        loadChildren: () => import('./pages/leave-list/leave-list.module').then(module => module.LeaveListModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'LoanMaster',
        loadChildren: () => import('./pages/loan-list/loan-list.module').then(module => module.LoanListModule) ,canActivate: [AuthGuard]
        },
        { path: 'leave_config', loadChildren: () => import('./pages/leave-config/leave-config.module').then(m => m.LeaveConfigModule) },

      {
        path: 'PdfViewer',
        loadChildren: () => import('./pages/view-pdf/view-pdf.module').then(module => module.ViewPdfModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'NavigationModules',
        loadChildren: () => import('./pages/module-master/module-master.module').then(module => module.ModuleMasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'ModuleLinks',
        loadChildren: () => import('./pages/module-link-master/module-link-master.module').then(module => module.ModuleLinkMasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'ApplyLeave',
        loadChildren: () => import('./pages/apply-leave-new/apply-leave-new.module').then(module => module.ApplyLeaveNewModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AppliedLeaves',
        loadChildren: () => import('./pages/apply-leave-new/apply-leave-new.module').then(module => module.ApplyLeaveNewModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'UpdateProfile',
        loadChildren: () => import('./pages/update-profile/update-profile.module').then(module => module.UpdateProfileModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AllocateShift',
        loadChildren: () => import('./pages/allocate-shift/allocate-shift.module').then(module => module.AllocateShiftModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'ShiftMaster',
        loadChildren: () => import('./pages/shift-master/shift-master.module').then(module => module.ShiftMasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'SalarySettings',
        loadChildren: () => import('./pages/settings-salary/settings-salary.module').then(module => module.SettingsSalaryModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'SalaryMaster',
        loadChildren: () => import('./pages/salarymaster/salarymaster.module').then(module => module.SalarymasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'applyloan',
        loadChildren: () => import('./pages/apply-loan/apply-loan.module').then(module => module.ApplyLoanModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Adminprofile',
        loadChildren: () => import('./pages/profile/profile.module').then(module => module.ProfileModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'branch',
        loadChildren: () => import('./pages/branch-master/branch-master.module').then(module => module.BranchMasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'HolidayMaster',
        loadChildren: () => import('./pages/holiday-master/holiday-master.module').then(module => module.HolidayMasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'RolesMaster',
        loadChildren: () => import('./pages/roles-master/roles-master.module').then(module => module.RolesMasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'HRAttendance',
        loadChildren: () => import('./pages/overall-attendance-report/overall-attendance-report.module').then(module => module.OverallAttendanceReportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Departmentcreate',
        loadChildren: () => import('./pages/department-master/department-master.module').then(module => module.DepartmentMasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'DesignationMaster',
        loadChildren: () => import('./pages/designation-master/designation-master.module').then(module => module.DesignationMasterModule) ,canActivate: [AuthGuard]
      },
      // {
      //   path: 'RolewiseModuleMaster',
      //   loadChildren: () => import('./pages/role-wise-module-master/role-wise-module-master.module').then(module => module.RoleWiseModuleMasterModule)
      // },
      {
        path: 'HolidayList',
        loadChildren: () => import('./pages/holiday-list/holiday-list.module').then(module => module.HolidayListModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'banner',
        loadChildren: () => import('./pages/apply-leave-new/apply-leave-new.module').then(module => module.ApplyLeaveNewModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AddAttendance',
        loadChildren: () => import('./pages/put-attendance/put-attendance.module').then(module => module.PutAttendanceModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Attendance',
        loadChildren: () => import('./pages/view-attendance/view-attendance.module').then(module => module.ViewAttendanceModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AddExpense',
        loadChildren: () => import('./pages/add-expense/add-expense.module').then(module => module.AddExpenseModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'ApproveExpense',
        loadChildren: () => import('./pages/approve-expense/approve-expense.module').then(module => module.ApproveExpenseModule) ,canActivate: [AuthGuard]
      },
      // {
      //   path: 'ExpenseMaster',
      //   loadChildren: () => import('./pages/view-employee-expense/view-employee-expense.module').then(module => module.ViewEmployeeExpenseModule)
      // },
      {
        path: 'ViewAttendance',
        loadChildren: () => import('./pages/view-attendance/view-attendance.module').then(module => module.ViewAttendanceModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AttendanceMaster',
        loadChildren: () => import('./pages/view-employee-attendance/view-employee-attendance.module').then(module => module.ViewEmployeeAttendanceModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'ChangePassword',
        loadChildren: () => import('./pages/change-password/change-password.module').then(module => module.ChangePasswordModule) ,canActivate: [AuthGuard]
      },
         {
        path: 'CreateMessage',
        loadChildren: () => import('./pages/create-message/create-message.module').then(module => module.CreateMessageModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'EmpChat',
        loadChildren: () => import('./pages/user-chats/user-chats.module').then(module => module.UserChatsModule) ,canActivate: [AuthGuard]
      },
     
      {
        path: 'Notifications',
        loadChildren: () => import('./pages/view-notifications/view-notifications.module').then(module => module.ViewNotificationsModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Taskmuster',
        loadChildren: () => import('./pages/task-management/task-management.module').then(module => module.TaskManagementModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AllocateTask',
        loadChildren: () => import('./pages/task-allocation/task-allocation.module').then(module => module.TaskAllocationModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'TaskMaster',
        loadChildren: () => import('./pages/view-allocated-tasks/view-allocated-tasks.module').then(module => module.ViewAllocatedTasksModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'ViewTask',
        loadChildren: () => import('./pages/view-tasks/view-tasks.module').then(module => module.ViewTasksModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'GeneratePayslip',
        loadChildren: () => import('./pages/generate-payslip/generate-payslip.module').then(module => module.GeneratePayslipModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'SubscriptionMaster',
        loadChildren: () => import('./pages/subscription-plans/subscription-plans.module').then(module => module.SubscriptionPlansModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'PurchasePlan',
        loadChildren: () => import('./pages/purchase-plan/purchase-plan.module').then(module => module.PurchasePlanModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'PurchaseAddOn',
        loadChildren: () => import('./pages/purchase-add-on/purchase-add-on.module').then(module => module.PurchaseAddOnModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AssignModule',
        loadChildren: () => import('./pages/role-wise-module-master/role-wise-module-master.module').then(module => module.RoleWiseModuleMasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'RoleWiseModules',
        loadChildren: () => import('./pages/allocate-modules/allocate-modules.module').then(module => module.AllocateModulesModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'RolesPermissions',
        loadChildren: () => import('./pages/role-and-permission/role-and-permission.module').then(module => module.RoleAndPermissionModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Trainer-Assignment',
        loadChildren: () => import('./pages/trainerassignment/trainerassignment.module').then(module => module.TrainerassignmentModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'RolesAssignment',
        loadChildren: () => import('./pages/rolesassignment/rolesassignment.module').then(module => module.RolesassignmentModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'OtherDashboard',
        loadChildren: () => import('./pages/other-dashboard/other-dashboard.module').then(module => module.OtherDashboardModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'timeconfig',
        loadChildren: () => import('./pages/timeconfig/timeconfig.module').then(module => module.TimeconfigModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Break-Master',
        loadChildren: () => import('./pages/adminlunchconfig/adminlunchconfig.module').then(module => module.AdminlunchconfigModule)
      },
      {
        path: 'EmployeeLunchHours',
        loadChildren: () => import('./pages/employeelunchhours/employeelunchhours.module').then(module => module.EmployeelunchhoursModule)
      },
      {
        path: 'otconfig',
        loadChildren: () => import('./pages/otconfig/otconfig.module').then(module => module.OtconfigModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'ShiftMaster',
        loadChildren: () => import('./pages/shift-master/shift-master.module').then(module => module.ShiftMasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AllocateShift',
        loadChildren: () => import('./pages/allocate-shift/allocate-shift.module').then(module => module.AllocateShiftModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'getmyshifts',
        loadChildren: () => import('./pages/view-employee-shift/view-employee-shift.module').then(module => module.ViewEmployeeShiftModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'HelpVideos',
        loadChildren: () => import('./pages/helpvideos/helpvideos.module').then(module => module.HelpvideosModule) ,canActivate: [AuthGuard]
      },
         {
        path: 'Settings',
        loadChildren: () => import('./pages/settings/settings.module').then(module => module.SettingsModule) ,canActivate: [AuthGuard]
      }
      ,
      {
        path: 'MyAttendance',
        loadChildren: () => import('./pages/employee-attendance/employee-attendance.module').then(module => module.EmployeeAttendanceModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'MyProfile',
        loadChildren: () => import('./pages/employee-profile/employee-profile.module').then(module => module.EmployeeProfileModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Biometric',
        loadChildren: () => import('./pages/biometric/biometric.module').then(module => module.BiometricModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'expense',
        loadChildren: () => import('./pages/expense-master/expense-master.module').then(module => module.ExpenseMasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'createemployee',
        loadChildren: () => import('./pages/create-employee/create-employee.module').then(module => module.CreateEmployeeModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AdminSupport',
        loadChildren: () => import('./pages/adminsupport/adminsupport.module').then(module => module.AdminsupportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'EmployeeAttendanceReport',
        loadChildren: () => import('./pages/employeeattendancereport/employeeattendancereport.module').then(module => module.EmployeeattendancereportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'EmployeeSalaryReport',
        loadChildren: () => import('./pages/employeesalaryreport/employeesalaryreport.module').then(module => module.EmployeesalaryreportModule) ,canActivate: [AuthGuard]
        },
        { path: 'emp_profile', loadChildren: () => import('./pages/emp-profile/emp-profile.module').then(m => m.EmpProfileModule) },

      {
        path: 'EmployeeLoanAdvanceReport',
        loadChildren: () => import('./pages/employeeloanadvancereport/employeeloanadvancereport.module').then(module => module.EmployeeloanadvancereportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'EmployeeExpenseReport',
        loadChildren: () => import('./pages/employeeexpensereport/employeeexpensereport.module').then(module => module.EmployeeexpensereportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Shiftreports',
        loadChildren: () => import('./pages/shift-reports/shift-reports.module').then(module => module.ShiftReportsModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'EmpShiftReports',
        loadChildren: () => import('./pages/employee-shift-reports/employee-shift-reports.module').then(module => module.EmployeeShiftReportsModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'EmployeeLunchHours',
        loadChildren: () => import('./pages/employeelunchhours/employeelunchhours.module').then(module => module.EmployeelunchhoursModule) ,canActivate: [AuthGuard]
        },
        { path: 'change-branch', loadChildren: () => import('./pages/change-branch/change-branch.module').then(m => m.ChangeBranchModule) },

      {
        path: 'AdminLunchConfig',
        loadChildren: () => import('./pages/adminlunchconfig/adminlunchconfig.module').then(module => module.AdminlunchconfigModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Bonus-Deductions',
        loadChildren: () => import('./pages/bonus-deductions/bonus-deductions.module').then(module => module.BonusDeductionsModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Deleted-Employees',
        loadChildren: () => import('./pages/deleted-employees/deleted-employees.module').then(module => module.DeletedEmployeesModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Breaks-History-Reports',
        loadChildren: () => import('./pages/breaks-report/breaks-report.module').then(module => module.BreaksReportModule)
        ,canActivate: [AuthGuard]
      },
      {
        path: 'Attendance-Rectification-Report',
        loadChildren: () => import('./pages/attendance-rectification/attendance-rectification.module').then(module => module.AttendanceRectificationModule)
        ,canActivate: [AuthGuard]
      },
      {
        path: 'Breaks-Reports',
        loadChildren: () => import('./pages/breaks-history-reports/breaks-history-reports.module').then(module => module.BreaksHistoryReportsModule)
        ,canActivate: [AuthGuard]
      },
      {
        path: 'FileDirectory',
        loadChildren: () => import('./pages/file-directory/file-directory.module').then(module => module.FileDirectoryModule)
        ,canActivate: [AuthGuard]
      },
      {
        path: 'FileMaster',
        loadChildren: () => import('./pages/filesmaster/filesmaster.module').then(module => module.FilesmasterModule)
        ,canActivate: [AuthGuard]
      },
      {
        path: 'UploadFile',
        loadChildren: () => import('./pages/file-upload/file-upload.module').then(module => module.FileUploadModule)
        ,canActivate: [AuthGuard]
      },
      {
        path: 'Bonus-Deductions-Reports',
        loadChildren: () => import('./pages/bonus-deduction-reports/bonus-deduction-reports.module').then(module => module.BonusDeductionReportsModule)
        ,canActivate: [AuthGuard]
      },
      {
        path: 'DaywiseAttendance',
        loadChildren: () => import('./pages/daywiseattendancereport/daywiseattendancereport.module').then(module => module.DaywiseattendancereportModule) ,canActivate: [AuthGuard]
      
      },
      {
        path: 'MonthlyEmpAttendance',
        loadChildren: () => import('./pages/attendance-monthly-report/attendance-monthly-report.module').then(module => module.AttendanceMonthlyReportModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'OT-Reports',
        loadChildren: () => import('./pages/otreports/otreports.module').then(module => module.OtreportsModule) ,canActivate: [AuthGuard]
      },
      
      {
        path: 'Bulk-Upload',
        loadChildren: () => import('./pages/bulkuploademployees/bulkuploademployees.module').then(module => module.BulkuploademployeesModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'AdminExpense',
        loadChildren: () => import('./pages/expense-new/expense-new.module').then(module => module.ExpenseNewModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Cashier-AdminExpense',
        loadChildren: () => import('./pages/cashier-expense/cashier-expense.module').then(module => module.CashierExpenseModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'daily-punch',
        loadChildren: () => import('./pages/biometric-datewise-punches/biometric-datewise-punches.module').then(module => module.BiometricDatewisePunchesModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'monthly-punch',
        loadChildren: () => import('./pages/biometric-punches/biometric-punches.module').then(module => module.BiometricPunchesModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'SubOrganizationMaster',
        loadChildren: () => import('./pages/suborganizationmaster/suborganizationmaster.module').then(module => module.SuborganizationmasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'LeaveConfig',
        loadChildren: () => import('./pages/leaveconfig/leaveconfig.module').then(module => module.LeaveconfigModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'ExpenseMasters',
        loadChildren: () => import('./pages/expensemaster-new/expensemaster-new.module').then(module => module.ExpensemasterNewModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'SalaryMaster',
        loadChildren: () => import('./pages/salarymaster/salarymaster.module').then(module => module.SalarymasterModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Directory',
        loadChildren: () => import('./pages/file-directory-new/file-directory-new.module').then(module => module.FileDirectoryNewModule) ,canActivate: [AuthGuard]
      },
      {
        path: 'Asset',
        loadChildren: () => import('./pages/assetmanagement/assetmanagement.module').then(module => module.AssetManagementModule) ,canActivate: [AuthGuard]
      },
       {
        path: 'SDReports',
        loadChildren: () => import('./pages/security-deduction-reports/security-deduction-reports.module').then(module => module.SecurityDeductionReportsModule) ,canActivate: [AuthGuard]
      },
 
{
  path: 'AdminExpense',
  loadChildren: () => import('./pages/expense-new/expense-new.module').then(module => module.ExpenseNewModule) ,canActivate: [AuthGuard]
},
    { path: 'salary_configuration', loadChildren: () => import('./pages/add-salary-gross/add-salary-gross.module').then(m => m.AddSalaryGrossModule) },

]
  },

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
