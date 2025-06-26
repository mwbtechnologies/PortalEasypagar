import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpRoasterReportsComponent } from './emp-roaster-reports.component';
import { EmpMonthReportComponent } from './emp-month-report/emp-month-report.component';
const routes: Routes = [

    { path: '', component: EmpRoasterReportsComponent },
    { path: 'Monthwise', component: EmpMonthReportComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpRoasterReportsRoutingModule { }
