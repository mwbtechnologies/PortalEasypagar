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
  ShowApproveButton:any=false;showexpense:any=false;
  StartDate:any;EndDate:any;ListType:any;
  selectall=false;

constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ApproveexpenseComponent>)
{
  this.ExpenseData = this.data.IL;
  this.StartDate=this.data.StartDate;
  this.EndDate=this.data.EndDate;
  //  this.formInput.StartDate=this.data.StartDate;
  // this.formInput.EndDate=this.data.EndDate;
  this.ListType=this.data.ListType;
  this.SingleSelectionSettings = {
    singleSelection: true,
    idField: 'Value',
      textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
}
ngOnInit(){
  this.showexpense=false;
  this.TotalApproved=0;this.TotalRequested=0;
  this.Count=0;
  console.log(this.ExpenseData);
  this.formInput = {
    StartDate: '',EndDate:''
  }
  // if(this.ExpenseData.CreatedDateTime!=null &&this.ExpenseData.CreatedDateTime!='undefined' && this.ExpenseData.CreatedDateTime!=undefined && this.ExpenseData.ExpenseDateTime!='')
  // {
  //   try{
  //     var datePipe = new DatePipe('en-US');
  //     this.formInput.Date= datePipe.transform(this.ExpenseData.CreatedDateTime, 'dd-MM-yyyy');
  //   }catch{}
  // }
  // else{
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  //   const day = today.getDate().toString().padStart(2, '0');
  //   this.formInput.Date = `${year}-${month}-${day}`;
  // }

  if(this.StartDate==null ||this.StartDate=='undefined' || this.StartDate==undefined || this.StartDate=='')
    {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = today.getDate().toString().padStart(2, '0');
      this.formInput.StartDate = `${year}-${month}-${day}`;
    }
    else
    { this.formInput.StartDate=this.StartDate;
    }
    if(this.EndDate==null ||this.EndDate=='undefined' || this.EndDate==undefined || this.EndDate=='')
      {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = today.getDate().toString().padStart(2, '0');
        this.formInput.EndDate = `${year}-${month}-${day}`;
      }
      else
      {
        this.formInput.EndDate=this.EndDate;
      }
  this.GetLoginTypes();
}
parseDateStringnew(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(part => parseInt(part, 10));
  const parsedDate = new Date(year, month - 1,day);
  return parsedDate;
}
GetData()
{
  var dat=this.parseDateStringnew(this.formInput.StartDate);
  const year = dat.getFullYear();
  const month = (dat.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = dat.getDate().toString().padStart(2, '0');
  this.formInput.StartDate = `${year}-${month}-${day}`;

    var dat=this.parseDateStringnew(this.formInput.EndDate);
  const eyear = dat.getFullYear();
  const emonth = (dat.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const eday = dat.getDate().toString().padStart(2, '0');
  this.formInput.EndDate = `${eyear}-${emonth}-${eday}`;
  this.GetLoginTypes();
}
private GetLoginTypes()
{
  if(this.ListType==null || this.ListType==''||this.ListType==undefined)
  {
    this.ListType="All";
  }
  this.spinnerService.show();
  this._commonservice.ApiUsingGetWithOneParam("Admin/GetDatewiseExpenseDetailsReport?FromDate="+this.formInput.StartDate+"&ToDate="+this.formInput.EndDate+"&EmployeeID="+this.ExpenseData.EmployeeID+"&Key=en&ListType="+this.ListType).subscribe(
    (res:any) => {
      this.spinnerService.show();
      console.log(res);
      if(res.Status==true)
      {
        this.ExpenseList = res.Data;
        if(this.ExpenseList.length>0)
        {
          this.BillImages=  res.Images;
          this.CalculateTotal(0,'X');
          this.showexpense=true;
        }
        else{
          this.showexpense=false;
        }
  
      }

    this.spinnerService.hide();
  }, (error) => {
    this.toastr.error(error.message);
    this.spinnerService.hide();
  });
  this.spinnerService.hide();
}
Approve(ID: any, Amount: any, Comment: any) {
  const json={
   ExpenseID:ID,
   ApprovedAmount:Amount,
   CommentByAdmin:Comment
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
         //  this.toastr.error(error.message);
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
         //  this.toastr.error(error.message);
         this.spinnerService.hide();
 
       }
 
       );
       this.spinnerService.hide();
 
   }
CloseTab()
{
  this.dialogRef.close({})
}
CalculateTotal(i:any,Type:any)
{
  if(this.ExpenseList!=null &&this.ExpenseList!='' &&this.ExpenseList!=undefined)
  {
    this.TotalApproved=0;this.TotalRequested=0;
    for(let i=0;i<this.ExpenseList.length;i++)
      {
        for(let j=0;j<this.ExpenseList[i].Details.length;j++)
          {
            this.TotalApproved=this.TotalApproved+ parseInt(this.ExpenseList[i].Details[j].ApprovedAmount);
            this.TotalRequested=this.TotalRequested+ parseInt(this.ExpenseList[i].Details[j].Amount);
          }
      }
  }
  if(Type='List')
  {
    this.ExpenseList[i].TotalApproved=0;this.ExpenseList[i].TotalRequested=0;
    for(let j=0;j<this.ExpenseList[i].Details.length;j++)
      {
        this.ExpenseList[i].TotalApproved=this.ExpenseList[i].TotalApproved+ parseInt(this.ExpenseList[i].Details[j].ApprovedAmount);
        this.ExpenseList[i].TotalRequested=this.ExpenseList[i].TotalRequested+ parseInt(this.ExpenseList[i].Details[j].Amount);
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


OnChange(i: number, j: number) {
 if(this.ExpenseList[i].Details[j].IsChecked ==true)
 {
  this.ExpenseList[i].Details[j].IsChecked =true;
 }
 else{
  this.ExpenseList[i].Details[j].IsChecked =false
 }
}

allCheck() {
  for(let i=0;i<this.ExpenseList.length;i++)
  {
    for(let j=0;j<this.ExpenseList[i].Details.length;j++)
    {
      if(this.ExpenseList[i].Details[j].IsPayslipExist!=true)
      {
        if(this.selectall ==true)
          {
           this.ExpenseList[i].Details[j].IsChecked =true;
          }
          else{
           this.ExpenseList[i].Details[j].IsChecked =false
          }
      }
     
    }
  }
  if(this.selectall==true){this.selectall =false;}else{this.selectall =true;}
}
TypeallCheck(i:any) {
    for(let j=0;j<this.ExpenseList[i].Details.length;j++)
    {
      if(this.ExpenseList[i].Details[j].IsPayslipExist!=true)
        {
      if(this.ExpenseList[i].Details[j].IsChecked ==true)
        {
         this.ExpenseList[i].Details[j].IsChecked =false;
        }
        else{
         this.ExpenseList[i].Details[j].IsChecked =true
        }
      }
    }
}


ApproveAll(Status:any) {
  var tmp=[];
  for(let i=0;i<this.ExpenseList.length;i++)
    {
      for(let j=0;j<this.ExpenseList[i].Details.length;j++)
      {
         if(this.ExpenseList[i].Details[j].ApprovedAmount > this.ExpenseList[i].Details[j].Amount){
          this.toastr.warning("Approved Amount Cant be Greater than Requested Amount");
        }
       else if(this.ExpenseList[i].Details[j].IsChecked ==true)
          {
          tmp.push({"AdminID":this.ExpenseList[i].Details[j].AdminID,"ApproveStatus":Status,"ApprovedAmount":this.ExpenseList[i].Details[j].ApprovedAmount,"CommentByAdmin":"","ExpenseID":this.ExpenseList[i].Details[j].ExpenseID,"Key":"en"})
          }
      }
    }
    if(tmp.length>0)
    {
      console.log(tmp,"json for approve");
      
      this._commonservice.ApiUsingPost("Admin/ApproveExpenseNew",tmp).subscribe(data => {
        if (data.Status == true) {
          this.toastr.success(data.Message);
          this.spinnerService.hide();
         this.CloseTab();
        }
        else {
          this.toastr.warning(data.Message);
          this.spinnerService.hide();
        }

      }, (error: any) => {
        //  this.toastr.error(error.message);
        this.spinnerService.hide();

      }

      );
    }
    else{
      this.toastr.warning("Please select atleast one record");
    }
    
       this.spinnerService.hide();
 
   }

   validateDate(date:any){
    if(date < this.formInput.StartDate){
      this.toastr.error("To Date Cannot Be Smaller Than From Date")
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = today.getDate().toString().padStart(2, '0');
      this.formInput.EndDate = `${year}-${month}-${day}`
    }
    else {
      return
    }
   }
}
