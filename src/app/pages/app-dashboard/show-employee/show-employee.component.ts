import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { DialogData } from '../../leave-list/leave-list.component';
@Component({
  selector: 'app-show-employee',
  templateUrl: './show-employee.component.html',
  styleUrls: ['./show-employee.component.css']
})
export class ShowEmployeeComponent {
  
  constructor(public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private _router: Router) {
  
  }
  close(){
    this.dialogRef.close();
  }
  Navigate(ReportType:any)
  {
if(ReportType=="Create"){
  this._router.navigate(['/createemployee']);
}
if(ReportType=="Employee"){
    this._router.navigate(['/EmployeeMaster']);
  }
if(ReportType=="Deleted"){
    this._router.navigate(['/Deleted-Employees']);
  }
  if(ReportType=="Bulk"){
    this._router.navigate(['/Bulk-Upload']);
  }
        this.dialogRef.close();
}
  }
