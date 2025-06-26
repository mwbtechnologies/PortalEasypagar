import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
export class FormInput {
  ApprovedSessionID:any;
  Comment:any;
}
@Component({
  selector: 'app-approve-leave',
  templateUrl: './approve-leave.component.html',
  styleUrls: ['./approve-leave.component.css']
})
export class ApproveLeaveComponent {
LeaveData:any;listtypesettings:IDropdownSettings={};
  ApiURL: any;LoginTypes:any=["Paid Leave","UnPaid Leave","Sick Leave"];UserID:any;
  
ActualLeaveType:any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,
private toastr: ToastrService,public dialogRef: MatDialogRef<ApproveLeaveComponent>,private dialog:MatDialog
){this.LeaveData = this.data.IL;
  this.listtypesettings = {
    singleSelection: true,
    idField: 'Value',
    textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };}
ngOnInit(){
  console.log(this.LeaveData);
  // this.GetLoginTypes();
  this.LeaveData.ApprovedLeaveType=[this.LeaveData.ApprovedLeaveType];
  this.ActualLeaveType=this.LeaveData.ApprovedLeaveType;
  if(this.LeaveData.ApprovedLeaveType==null ||this.LeaveData.ApprovedLeaveType==0||this.LeaveData.ApprovedLeaveType==''||this.LeaveData.ApprovedLeaveType==undefined)
  {
    this.LeaveData.ApprovedLeaveType=[this.LeaveData.LeaveType];
    this.ActualLeaveType=this.LeaveData.LeaveType;
  }
  this.UserID=localStorage.getItem("UserID");
}
OnChange(event:any)
{
  if(event==null||event==undefined)
  {
    this.LeaveData.ApprovedLeaveType=[this.LeaveData.LeaveType];
    this.ActualLeaveType=this.LeaveData.LeaveType;
  }
  else{
    this.LeaveData.ApprovedLeaveType=[event];
    this.ActualLeaveType=event;
  }
 
}
private GetLoginTypes()
{
  https://easypagar.com/easypagar/api/Admin/GetCheckInTypes/Session/0/en
  this.spinnerService.show();
  this._commonservice.ApiUsingGetWithOneParam("Admin/GetLoginTypes/Leave/en").subscribe((res:any) => {
    this.LoginTypes = res.List;
    this.spinnerService.hide();
  }, (error) => {
    // this.toastr.error(error.message);
    this.spinnerService.hide();
  });
  this.spinnerService.hide();
  
}
Approve(IL:any){
  if(IL.ApprovedLeaveType==''||IL.ApprovedLeaveType==null||IL.ApprovedLeaveType==undefined)
  {
    // this.toastr.warning("Please Select Leave Type");
    this.ShowAlert("Please Select Leave Type","warning")
  }
  else if(IL.ApprovedLeaveType[0]==''||IL.ApprovedLeaveType[0]==null||IL.ApprovedLeaveType[0]==undefined)
    {
      // this.toastr.warning("Please Select Leave Type");
      this.ShowAlert("Please Select Leave Type","warning")
    }
    else if(IL.ApprovedDays<=0 && IL.IsHalfDay==false){
      // this.toastr.warning("Approved Days Should be Greater 0");
      this.ShowAlert("Approved Days Should be Greater 0","warning")
    }
    else if(IL.ApprovedDays !> IL.NoOfDays){
      // this.toastr.warning("Approved Days Cant Be Greater Than Requested Days");
      this.ShowAlert("Approved Days Cant Be Greater Than Requested Days","warning")
    }
  else if(IL.AdminComment==''||IL.AdminComment==null||IL.AdminComment==undefined|| IL.AdminComment==" ")
    {
      // this.toastr.warning("Please Enter Comment");
      this.ShowAlert("Please Enter Comment","warning")
    }
  else
  {
  this.spinnerService.show();
  const json={
    RequestID:IL.RequestID,
    Comment:IL.AdminComment,
    AdminID:this.UserID,
    ApprovedLeaveType:IL.ApprovedLeaveType[0],
    ApprovedDays:IL.ApprovedDays
  }
  console.log(json);
  this._commonservice.ApiUsingPost("Admin/ApproveLeave",json).subscribe(data => {
    if(data.Status==true){
    //  this.toastr.success("Leave Approved Successfully");
    this.ShowAlert("Leave Approved Successfully","success")
     this.spinnerService.hide();
     this.CloseTab();
    }
    else{
    //  this.toastr.warning(data.Message);
    this.ShowAlert(data.Message,"warning")
     this.spinnerService.hide();
    }
   
   }, (error: any) => {
     // this.toastr.error(error.message);
     this.spinnerService.hide();
    
   }
   
   );
   this.spinnerService.hide();
  }
}

Reject(IL:any){
  if(IL.AdminComment==''||IL.AdminComment==null||IL.AdminComment==undefined)
    {
      // this.toastr.success("Please Enter Comment");
      this.ShowAlert("Please Enter Comment","success")
    }
    else
    {
  this.spinnerService.show();
  const json={
    RequestID:IL.RequestID,
    Comment:IL.AdminComment,
    AdminID:this.UserID
  }
  console.log(json);
  this._commonservice.ApiUsingPost("Admin/RejectLeave",json).subscribe(data => {
    if(data.Status==true){
    //  this.toastr.success("Leave Has Been Rejected");
    this.ShowAlert("Leave Has Been Rejected","success")
     this.spinnerService.hide();
      this.CloseTab();
    }
    else{
    //  this.toastr.warning(data.Message);
    this.ShowAlert(data.Message,"warning")
     this.spinnerService.hide();
    }
   
   }, (error: any) => {
     // this.toastr.error(error.message);
     this.spinnerService.hide();
    
   }
   
   );
   this.spinnerService.hide();
  }
}

CloseTab()
{
  this.dialogRef.close({})
}
    ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
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
