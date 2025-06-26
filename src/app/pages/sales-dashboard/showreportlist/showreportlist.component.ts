import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { DialogData } from '../../leave-list/leave-list.component';
@Component({
  selector: 'app-showreportlist',
  templateUrl: './showreportlist.component.html',
  styleUrls: ['./showreportlist.component.css']
})
export class ShowreportlistComponent {
  
  constructor(public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private _router: Router) {
  
  }
  Navigate(ReportType:any)
  {
if(ReportType=="Loan")
{
  this._router.navigate(['/EmployeeLoanAdvanceReport']);
}
if(ReportType=="Salary")
  {
    this._router.navigate(['/EmployeeSalaryReport']);
  }
  if(ReportType=="Attendance")
    {
      this._router.navigate(['/EmployeeAttendanceReport']);
    }
    if(ReportType=="Expense")
      {
        this._router.navigate(['/EmployeeExpenseReport']);
      }
        this.dialogRef.close();
  }
  close(){
    this.dialogRef.close();
  }
}
