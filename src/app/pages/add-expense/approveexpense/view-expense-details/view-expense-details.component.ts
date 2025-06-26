import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
export class FormInput {
  Date: any;
}

@Component({
  selector: 'app-view-expense-details',
  templateUrl: './view-expense-details.component.html',
  styleUrls: ['./view-expense-details.component.css']
})
export class ViewExpenseDetailsComponent implements OnInit {
  ExpenseData:any;
  formInput: FormInput | any;
  ApiURL: any;LoginTypes:any;SingleSelectionSettings:any;emparray:any;
  ExpenseList: any;Count:any;BillImages:any;TotalApproved:any;TotalRequested:any;
  Iindex=0;Jindex=0;

constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ViewExpenseDetailsComponent>)
{
  this.ExpenseData = this.data.IL;
  this.SingleSelectionSettings = {
    singleSelection: true,
    idField: 'Value',
      textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
}
ngOnInit(){
  this.TotalApproved=0;this.TotalRequested=0;
  this.formInput={Date:''}
  this.Count=0;
  console.log(this.ExpenseData,"View Expense Data");
}

Approve(ID: any, Amount: any, Comment: any) {
  const json={
   ExpenseID:ID,ApprovedAmount:Amount,CommentByAdmin:Comment
  }
       this._commonservice.ApiUsingPost("Admin/ApproveExpense",json).subscribe(data => {
         if (data.Status == true) {
           this.toastr.success(data.Message);
           this.spinnerService.hide();
         }
         else {
           this.toastr.warning(data.Message);
           this.spinnerService.hide();
         }
 
       }, (error: any) => {
         //  // this.toastr.error(error.message);
         this.spinnerService.hide();
 
       }
 
       );
       this.spinnerService.hide();
 
   }
 
   Reject(ID: any, Comment: any) {
     const json={
       ExpenseID:ID,CommentByAdmin:Comment
      }
       this._commonservice.ApiUsingPost("Admin/RejectExpense",json).subscribe(data => {
         if (data.Status == true) {
           this.toastr.success(data.Message);
           this.spinnerService.hide();
         }
         else {
           this.toastr.warning(data.Message);
           this.spinnerService.hide();
         }
 
       }, (error: any) => {
         //  // this.toastr.error(error.message);
         this.spinnerService.hide();
 
       }
 
       );
       this.spinnerService.hide();
 
   }
CloseTab()
{
  this.dialogRef.close({})
}
CalculateTotal()
{
  if(this.ExpenseList!=null &&this.ExpenseList!='' &&this.ExpenseList!=undefined)
  {
    for(this.Iindex=0;this.Iindex<this.ExpenseList.length;this.Iindex++)
      {
        for(this.Jindex=0;this.Jindex<this.ExpenseList[this.Iindex].Details.length;this.Jindex++)
          {
            this.TotalApproved=this.TotalApproved+ parseInt(this.ExpenseList[this.Iindex].Details[this.Jindex].ApprovedAmount);
            this.TotalRequested=this.TotalRequested+ parseInt(this.ExpenseList[this.Iindex].Details[this.Jindex].Amount);
          }
      }
  }

}
close(){
  this.dialogRef.close();
}
}

