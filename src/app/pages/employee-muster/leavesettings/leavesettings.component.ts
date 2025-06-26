import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-leavesettings',
  templateUrl: './leavesettings.component.html',
  styleUrls: ['./leavesettings.component.css']
})
export class LeavesettingsComponent {
 LeaveTypes:any[]=[]
  AdminID:any
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,
private toastr: ToastrService,public dialogRef: MatDialogRef<LeavesettingsComponent>,private dialog:MatDialog){

}

ngOnInit(){
  this.AdminID = localStorage.getItem("AdminID");
  this.getLeaveTypesList()
}

getLeaveTypesList(){
  this._commonservice.ApiUsingGetWithOneParam("LeaveMaster/GetLeavesEmp?EmployeeID="+this.data.empid).subscribe((res:any)=>{
    this.LeaveTypes = res.Leaves
  },(error)=>{
  })
}

submit(){
  let json = {
    "EmployeeID":this.data.empid,
    "LoggedInUserID":parseInt(this.AdminID),
    "LeaveDetails":this.LeaveTypes.map(res=>{
      return {
        "LeaveType":res.LeaveType,
        "Value":res.Value,
        "IsMonthwise":res.IsMonthwise
      }
    })
  }
  this._commonservice.ApiUsingPost("LeaveMaster/UpdateLeaves",json).subscribe((res:any)=>{
    this.ShowAlert(res.Message,"success")
  },(error)=>{
    this.ShowAlert("Something Went wrong Please Try Again Later","error")
  })
}

  ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
    this.dialog.open(ShowalertComponent, {
      data: { message, type },
      panelClass: 'custom-dialog',
      disableClose: true
    }).afterClosed().subscribe((res) => {
      if (res) {
        console.log("Dialog closed");
      }
    });
  }

}

