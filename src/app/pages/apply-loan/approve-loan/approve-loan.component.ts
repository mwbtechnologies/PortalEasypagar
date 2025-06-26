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
  selector: 'app-approve-loan',
  templateUrl: './approve-loan.component.html',
  styleUrls: ['./approve-loan.component.css']
})
export class ApproveLoanComponent {
  LoanData:any;listtypesettings:IDropdownSettings={};
  ApiURL: any;LoginTypes:any=["Paid Leave","UnPaid Leave","Sick Leave","POW"];UserID:any;
  
ActualLeaveType:any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ApproveLoanComponent>){this.LoanData = this.data.IL;
  this.listtypesettings = {
    singleSelection: true,
    idField: 'Value',
    textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };}
ngOnInit(){
  console.log(this.LoanData);
  // this.GetLoginTypes();
  this.LoanData.ApprovedLeaveType=[this.LoanData.ApprovedLeaveType];
  this.ActualLeaveType=this.LoanData.ApprovedLeaveType;
  if(this.LoanData.ApprovedLeaveType==null ||this.LoanData.ApprovedLeaveType==0||this.LoanData.ApprovedLeaveType==''||this.LoanData.ApprovedLeaveType==undefined)
  {
    this.LoanData.ApprovedLeaveType=[this.LoanData.LeaveType];
    this.ActualLeaveType=this.LoanData.LeaveType;
  }
  this.UserID=localStorage.getItem("UserID");
}
OnChange(event:any)
{
  if(event==null||event==undefined)
  {
    this.LoanData.ApprovedLeaveType=[this.LoanData.LeaveType];
    this.ActualLeaveType=this.LoanData.LeaveType;
  }
  else{
    this.LoanData.ApprovedLeaveType=[event];
    this.ActualLeaveType=event;
  }
 
}
close(){
  this.dialogRef.close();
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
  if(IL.ApprovedAmount==''||IL.ApprovedAmount==null||IL.ApprovedAmount==undefined||IL.ApprovedAmount==0)
  {
    this.toastr.warning("Please Enter Amount");
  }
  else if(IL.MonthlyDeduction==''||IL.MonthlyDeduction==null||IL.MonthlyDeduction==undefined||IL.MonthlyDeduction==0)
    {
      this.toastr.warning("Please Enter Monthly Deduction");
    }
  else
  {
  this.spinnerService.show();
  const json={
    LoanID:IL.LoanID,
    PaymentID:IL.PaymentID,
    AdminID:this.UserID,
    MonthlyDeduction:IL.MonthlyDeduction,
    EmpID:IL.EmpID,
    EmployeeId:IL.EmpID,
    ApprovedAmount:IL.ApprovedAmount,
    Key:'en',Comment:IL.Comment
  }
  console.log(json);
  this._commonservice.ApiUsingPost("Admin/ApproveLoan",json).subscribe(data => {
    if(data.Status==true)
      {
     this.toastr.success(data.Message);
     this.spinnerService.hide();
       window.location.reload();
    }
    else{
     this.toastr.warning(data.Message);
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
validateInteger(event: any): void {
  const input = event.target.value;
  if (/^\d*$/.test(input)) {
    this.LoanData.MonthlyDeduction = input;
  } else {
    event.target.value = this.LoanData.MonthlyDeduction;
  }
}
Reject(IL:any){
  if(IL.Comment==''||IL.Comment==null||IL.Comment==undefined)
    {
      this.toastr.success("Please Enter Comment");
    }
    else
    {
  this.spinnerService.show();
  const json={
    LoanID:IL.LoanID,
    Comment:IL.Comment,
    AdminID:this.UserID
  }
  console.log(json);
  this._commonservice.ApiUsingPost("Admin/RejectLoan",json).subscribe(data => {
    if(data.Status==true){
     this.toastr.success(data.Message);
     this.spinnerService.hide();
       window.location.reload();
    }
    else{
     this.toastr.warning(data.Message);
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
}

