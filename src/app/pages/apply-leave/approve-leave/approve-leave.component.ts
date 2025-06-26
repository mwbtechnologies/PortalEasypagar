import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
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
  ApiURL: any;LoginTypes:any=["Paid Leave","UnPaid Leave","Sick Leave","POW"];UserID:any;
  
ActualLeaveType:any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ApproveLeaveComponent>){this.LeaveData = this.data.IL;
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

CloseTab()
{
  this.dialogRef.close({})
}
close(){
  this.dialogRef.close();
}
}
