import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { DialogData } from '../../leave-list/leave-list.component';
import { ShowattendancetypesComponent } from '../showattendancetypes/showattendancetypes.component';
@Component({
  selector: 'app-showreportlist',
  templateUrl: './showreportlist.component.html',
  styleUrls: ['./showreportlist.component.css']
})
export class ShowreportlistComponent {
  
  constructor(public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private _router: Router, public dialog: MatDialog) {
  
  }
  Navigate(ReportType:any)
  {
if(ReportType=="Loan")
{
  this._router.navigate(['/LoanReport']);
}
if(ReportType=="Salary")
  {
    this._router.navigate(['/SalaryReport']);
  }
  if(ReportType=="Attendance")
    {
      this.dialog.open(ShowattendancetypesComponent)
      // this._router.navigate(['/AttendanceReport']);
    }
    // if(ReportType=="Attendance")
    //   {
    //      this._router.navigate(['/AttendanceReport']);
    //   }
    if(ReportType=="Expense")
      {
        this._router.navigate(['/YearlyExpenseReport']);
      }
      if(ReportType=="Annual")
        {
          this._router.navigate(['/AnnualReports']);
        }
      if(ReportType=="Breaks")
        {
          this._router.navigate(['/Breaks-History-Reports']);
        }
        // if(ReportType=="HR")
        //   {
        //     this._router.navigate(['/HRAttendance']);
        //   }
        if(ReportType=="BonusDeduc")
          {
            this._router.navigate(['/Bonus-Deductions-Reports']);
          }
        if(ReportType=="SD")
          {
            this._router.navigate(['/SDReports']);
          }
        this.dialogRef.close();
  }

  close(){
    this.dialogRef.close();
  }
}
