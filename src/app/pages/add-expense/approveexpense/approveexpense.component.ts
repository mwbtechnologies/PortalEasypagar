import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ViewExpenseDetailsComponent } from './view-expense-details/view-expense-details.component';
export class FormInput {
  Date: any;
}

@Component({
  selector: 'app-approveexpense',
  templateUrl: './approveexpense.component.html',
  styleUrls: ['./approveexpense.component.css']
})
export class ApproveexpenseComponent implements OnInit {
  ExpenseData:any;
  formInput: FormInput | any;
  ApiURL: any;LoginTypes:any;SingleSelectionSettings:any;emparray:any;
  ExpenseList: any;Count:any;BillImages:any;TotalApproved:any;TotalRequested:any;
  Iindex=0;Jindex=0;

constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ApproveexpenseComponent>)
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
  console.log(this.ExpenseData);
  if(this.ExpenseData.CreatedDateTime!=null &&this.ExpenseData.CreatedDateTime!='undefined' && this.ExpenseData.CreatedDateTime!=undefined && this.ExpenseData.ExpenseDateTime!='')
  {
    try{
      var datePipe = new DatePipe('en-US');
      this.formInput.Date= datePipe.transform(this.ExpenseData.CreatedDateTime, 'dd-MM-yyyy');
    }catch{}
  }
  else{
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = today.getDate().toString().padStart(2, '0');
    this.formInput.Date = `${year}-${month}-${day}`;
  }
  this.GetLoginTypes();
}

private GetLoginTypes()
{
  this.spinnerService.show();
  this._commonservice.ApiUsingGetWithOneParam("Admin/GetExpenseDetailsReport?Date="+this.formInput.Date+"&EmployeeID="+this.ExpenseData.EmployeeID+"&Key=en").subscribe(
    (res:any) => {
      console.log(res);
      if(res.Status==true)
      {
        this.ExpenseList = res.Data;
        this.Count=res.Count;
        console.log(this.ExpenseList[0].Details);
      this.BillImages=  res.Images;
      this.CalculateTotal();
      }

    this.spinnerService.hide();
  }, (error) => {
    // this.toastr.error(error.message);
    this.spinnerService.hide();
  });
  this.spinnerService.hide();
}
Approve(ID: any, Amount: any, Comment: any) {
  const json={
   ExpenseID:ID,ApprovedAmount:Amount,CommentByAdmin:Comment
  }
       this._commonservice.ApiUsingPost("Admin/ApproveExpense",json).subscribe(data => {
         if (data.Status == true) {
           this.toastr.success(data.Message);
           this.spinnerService.hide();
          this.GetLoginTypes();
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
           this.GetLoginTypes();
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

openDialog(IL: any): void {
  this.dialog.open(ViewExpenseDetailsComponent,{
    data: { IL, fulldata: this.ExpenseList }
     ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
    if(res){
      this.GetLoginTypes();
    }
  })
}
}
