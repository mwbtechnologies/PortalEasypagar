import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-addconfig',
  templateUrl: './addconfig.component.html',
  styleUrls: ['./addconfig.component.css']
})
export class AddconfigComponent {
  isEdit:any
  leaveType:any
  OrgID:any
  AdminID:any
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,
private toastr: ToastrService,public dialogRef: MatDialogRef<AddconfigComponent>,private dialog:MatDialog
){
 this.isEdit = this.data.isEdit
 this.leaveType = this.data?.row?.LeaveTypeName || ''
}

ngOnInit(){
  this.OrgID = localStorage.getItem("OrgID");
  this.AdminID = localStorage.getItem("AdminID");
}

addLeaveConfig(){
let json =  {
  "LeaveTypeName":this.leaveType,
  "OrgID":this.OrgID, 
  "UserId":this.AdminID
}
this._commonservice.ApiUsingPost("LeaveMaster/AddLeaveMasterTypes",json).subscribe(res=>{
  this.ShowToast(res.message,"success")
  this.dialogRef.close({json})
},(error)=>{
  this.ShowToast("Something went wrong!..","error")
})
}

editLeaveConfig(){
let json =  {
  "LeaveTypeName":this.leaveType,
  "Id":this.data.row.Id,
  "OrgID":this.OrgID, 
  "UserId":this.AdminID
}
this._commonservice.ApiUsingPost("LeaveMaster/UpdateLeaveMasterTypes",json).subscribe(res=>{
  this.ShowToast(res.message,"success")
  this.dialogRef.close({json})
},(error)=>{
  this.ShowToast("Something went wrong!..","error")
})
}



ShowToast(message: string, type: 'success' | 'warning' | 'error'): void {
  this.dialog.open(ShowalertComponent, {
    data: { message, type },
    panelClass: 'custom-dialog',
    disableClose: true  // Prevents closing on outside click
  }).afterClosed().subscribe((res) => {
    if (res) {
      console.log("Dialog closed");
    }
  });
}
}
