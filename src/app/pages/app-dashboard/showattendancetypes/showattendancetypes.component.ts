import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogData } from '../../leave-list/leave-list.component';

@Component({
  selector: 'app-showattendancetypes',
  templateUrl: './showattendancetypes.component.html',
  styleUrls: ['./showattendancetypes.component.css']
})
export class ShowattendancetypesComponent {
  constructor(public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private _router: Router, public dialog: MatDialog) {
  
  }

  ngOnInit(){
    
  }
  Navigate(ReportType:any)
  {
    if(ReportType=="Custom")
{
  this._router.navigate(['/AttendanceReport']);
}
     if(ReportType=="HR")
    {
      this._router.navigate(['/HRAttendance']);
    }
if(ReportType=="Monthly")
{
  this._router.navigate(['/monthly-punch']);
}
  if(ReportType=="Daily")
    {
      this._router.navigate(['/daily-punch']);
    }
        this.dialogRef.close();
  }
  close(){
    this.dialogRef.close();
  }
}
