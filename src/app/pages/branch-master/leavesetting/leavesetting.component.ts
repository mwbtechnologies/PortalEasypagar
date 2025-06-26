import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../showalert/showalert.component';

@Component({
  selector: 'app-leavesetting',
  templateUrl: './leavesetting.component.html',
  styleUrls: ['./leavesetting.component.css']
})
export class LeavesettingComponent {

  LeaveTypes:any[]=[]
  AdminID:any
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,
private toastr: ToastrService,public dialogRef: MatDialogRef<LeavesettingComponent>,private dialog:MatDialog){

}

ngOnInit(){
  this.AdminID = localStorage.getItem("AdminID");
  this.getLeaveTypesList()
}

getLeaveTypesList(){
  this._commonservice.ApiUsingGetWithOneParam("LeaveMaster/GetLeaves?BranchID="+this.data.row.BranchId).subscribe((res:any)=>{
    this.LeaveTypes = res.Leaves
  },(error)=>{
    this.ShowAlert("Something Went wrong Please Try Again Later","error")
  })
}

submit(){
  let json = {
    "BranchID":this.data.row.BranchId,
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
