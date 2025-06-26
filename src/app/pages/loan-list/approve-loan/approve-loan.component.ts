import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { PaymentsummaryComponent } from '../paymentsummary/paymentsummary.component';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { ConfirmationpopupComponent } from 'src/app/layout/admin/confirmationpopup/confirmationpopup.component';
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
  PaymentId:any
  Confirmation:boolean = false
ActualLeaveType:any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,
private _commonservice: HttpCommonService,
private spinnerService: NgxSpinnerService,
private toastr: ToastrService,private dialog: MatDialog,
public dialogRef: MatDialogRef<ApproveLoanComponent>){
  this.LoanData = this.data.IL;
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

PayNow(data:any){
  this.payloannow(data)
}
PayLater(data:any){
  // this.Approve(data)
  this.Confirmation = false
  // this.dialogRef.close()
}

payloannow(data:any){
  this.dialog.open(PaymentsummaryComponent,{
   data: { data}
   ,panelClass: 'custom-dialog',
   disableClose: true }).afterClosed().subscribe((res:any)=>{
   this.PaymentId = res.paymentid
   this.Confirmation = false
   this.dialogRef.close({res})
  })
}

Approve(IL:any){
  if(IL.ApprovedAmount==''||IL.ApprovedAmount==null||IL.ApprovedAmount==undefined||IL.ApprovedAmount==0){
    // this.toastr.warning("Please Enter Amount");
    this.ShowAlert("Please Enter Amount","warning")
  }
  else if(IL.ApprovedAmount !> IL.RequestedAmount){
    // this.toastr.warning("Approved Amount Cant be Greater than Requested Amount");
    this.ShowAlert("Approved Amount Cant be Greater than Requested Amount","warning")
  }
  else if(IL.MonthlyDeduction==''||IL.MonthlyDeduction==null||IL.MonthlyDeduction==undefined||IL.MonthlyDeduction==0){
      // this.toastr.warning("Please Enter Monthly Deduction");
      this.ShowAlert("Please Enter Monthly Deduction","warning")
    }
    else if(IL.MonthlyDeduction !> IL.ApprovedAmount){
      // this.toastr.warning("Monthly Deduction Cant be Greater than ApprovedAmount Amount");
      this.ShowAlert("Monthly Deduction Cant be Greater than Approved Amount","warning")
    }
    else if(IL.Comment==''||IL.Comment==null||IL.Comment==undefined||IL.Comment==0 ){
      this.ShowAlert("Please Enter Comment Before Approving","warning")
    }
    else {
      this.Confirmation = true
    }
}



paynow(data:any){
  this.dialog.open(PaymentsummaryComponent,{
    data: { data}
     ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
   this.PaymentId = res.paymentid
   this.Confirmation = false
   this.dialogRef.close()
  })
}

// Approved(IL:any){
//   this.spinnerService.show();
//   const json={
//     LoanID:IL.LoanID,
//     PaymentID:this.PaymentId,
//     AdminID:this.UserID,
//     MonthlyDeduction:IL.MonthlyDeduction,
//     EmpID:IL.EmpID,
//     EmployeeId:IL.EmpID,
//     ApprovedAmount:IL.ApprovedAmount,
//     Key:'en',Comment:IL.Comment
//   }
//   console.log(json);
//   this._commonservice.ApiUsingPost("Admin/ApproveLoan",json).subscribe(data => {
//     if(data.Status==true)
//       {
//      this.toastr.success(data.Message);
//      this.spinnerService.hide();
//      this.Confirmation = false
//     }
//     else{
//      this.toastr.warning(data.Message);
//      this.spinnerService.hide();
//     }
   
//    }, (error: any) => {
//      // this.toastr.error(error.message);
//      this.spinnerService.hide();
    
//    }
   
//    );
//    this.spinnerService.hide();

// }
validateInteger(event: any): void {
  const input = event.target.value;
  if (/^\d*$/.test(input)) {
    this.LoanData.MonthlyDeduction = input;
  } else {
    event.target.value = this.LoanData.MonthlyDeduction;
  }
}

Reject(row:any){
  if(row.Comment==''||row.Comment==null||row.Comment==undefined)
    {
      // this.toastr.warning("Please Enter Comment");
      this.ShowAlert("Please Enter Comment Before Rejecting","warning")
    }else{
      const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
            data: "Are You Sure Want To Reject Loan",
          });
          dialogRef.componentInstance.confirmClick.subscribe(() => {
            this.RejectLoan(row);
            dialogRef.close();
          },(error):any=>{
            // this.globalToastService.error(error.error.message)
            //this.ShowAlert(error.error.message,"error")
          });
    }
}

  RejectLoan(IL:any){
  this.spinnerService.show();
  const json={
    LoanID:IL.LoanID,
    Comment:IL.Comment,
    AdminID:this.UserID
  }
  console.log(json);
  this._commonservice.ApiUsingPost("Admin/RejectLoan",json).subscribe(data => {
    if(data.Status==true){
    //  this.toastr.success(data.Message);
    this.ShowAlert(data.Message,"success")
     this.spinnerService.hide();
       window.location.reload();
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

