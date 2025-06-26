import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
export class FormInput{
  FromDate:any;
  ToDate:any;
}
export class Emp{
  EmployeeID:any;
}
export class Notify{
  Type:any;
}

export class Branches
{
  BranchID:any;
}
@Component({
  selector: 'app-view-notifications',
  templateUrl: './view-notifications.component.html',
  styleUrls: ['./view-notifications.component.css']
})
export class ViewNotificationsComponent implements OnInit {
  formInput: FormInput | any;
  public isSubmit: boolean | any;
  BranchList:any;
  selectedBranchId: string[] | any;
  EmployeeList:any;
  EmpClass:Array<Emp> = [];
  BranchClass:Array<Branches> = [];
  NTypes:Array<Notify> = [];
  selectedEmployeeId: string[] | any;
  selectedNotId: string[] | any;
  NotTypes:any;
  ApiUrl:any;
  index=0;UserID:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  NotificationList:any;
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
  ApiURL:any;AdminID:any;OrgID:any;IsEmail:any;
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,
    private _commonservice: HttpCommonService, private toastr:ToastrService,private dialog:MatDialog){ this.isSubmit=false}
  ngOnInit(): void {
    this.UserID = localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
    this.AdminID = localStorage.getItem("AdminID");
    this.IsEmail = localStorage.getItem("LoginStatus");
  if(this.IsEmail==undefined || this.IsEmail==null || this.IsEmail=='')
  {
    this.IsEmail=false;
  }
    this.formInput={
      Date:'',
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = today.getDate().toString().padStart(2, '0');
    this.formInput.Date = `${year}-${month}-${day}`;
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };  this.dtOptions = {
      pagingType: 'full_numbers',
       pageLength: 10 };
 
  this.GetNotification(this.formInput.Date);
  }
  OnDateChange(Date:any)
  {
this.GetNotification(Date.target.value);
  }
  GetNotification(Date:any)
  {
  this.ApiUrl="Admin/GetNotificationHistory?UserID="+this.UserID+"&Date="+Date+"&IsEmail="+this.IsEmail;
  this.spinnerService.show();
  this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe((res:any) => {
    var table = $('#DataTables_Table_0').DataTable();
          table.destroy();
    this.NotificationList = res.List;
    
    this.dtTrigger.next(null);
    this.spinnerService.hide();
  }, (error) => {
    // this.toastr.error(error.message);
    this.spinnerService.hide();
  });
  this.spinnerService.hide();
  }

  RejectAtten(row:any)
  {  
    this.ApiUrl="Admin/ApproveAllAttendance";
    const json = {  
      "AdminID":row.ToUserID,
      "AttendanceID":0,
      "Comment":"",
      "Date":moment(row.RecordCreated).format('DD-MM-yyyy'),
      "Employees":[{"EmployeeID":row.FromUserID}],
      "Key":"en",
      "Status":"Rejected"
    } 
    
    this._commonservice.ApiUsingPost(this.ApiUrl,json).subscribe((res:any) => {
     if(res.Status==true)
     {
      // this.toastr.success(res.Message);
 
      
      this.GetNotification(row.RecordCreated)
     }
     else{
      // this.toastr.warning(res.Message);
     
      
     }

    }, (error) => {
      // this.toastr.error(error.error.message);
   
      
    });
  
  
  }
  
  ApproveAtten(row:any)
  {    
    this.ApiUrl="Admin/ApproveAllAttendance";
    const json = {
      "AdminID":row.ToUserID,
      "AttendanceID":0,
      "Comment":"",
      "Date":moment(row.RecordCreated).format('DD-MM-yyyy'),
      "Employees":[{"EmployeeID":row.FromUserID}],
      "Key":"en",
      "Status":"Approved"
    } 
    
    this._commonservice.ApiUsingPost(this.ApiUrl,json).subscribe((res:any) => {
     if(res.Status==true)
     {
      // this.toastr.success(res.Message);
           this.ShowAlert(res.Message,"success")
      this.GetNotification(row.RecordCreated)
     }
     else{
      // this.toastr.warning(res.Message);
       this.ShowAlert(res.Message,"warning")
     }

    }, (error) => {
      // this.toastr.error(error.error.message);
         this.ShowAlert(error.error.message,"error")

    });
  
  }

  OnBranchChange(event:any)
  { this.spinnerService.show();
    if(event!=null && event!=undefined && event.length!=0)
    {
      this.BranchClass=[];
      
        for(this.index=0;this.index<event.length;this.index++){
          let customObj = new Branches();
          customObj.BranchID=event[this.index].Value;    
          this.BranchClass.push(customObj);
        }
    }
if(this.BranchClass.length>0)
{
  const json={
    AdminID:this.AdminID,
    Branches:this.BranchClass
  }
  this.selectedEmployeeId=[];
  this._commonservice.ApiUsingPost("Portal/GetMultiBranchEmployees",json).subscribe((data) => this.EmployeeList = data.data, (error) => { console.log(error);
    this.spinnerService.hide();
  });
}
else{
  const json={
    AdminID:this.AdminID
  }
  this.selectedEmployeeId=[];
  this._commonservice.ApiUsingPost("Portal/GetMultiBranchEmployees",json).subscribe((data) => this.EmployeeList = data.data, (error) => { console.log(error);
    this.spinnerService.hide();
  });
}
   
    this.spinnerService.hide();
  }

  Checkdate()
  {
    if(this.formInput.FromDate=='' ||this.formInput.FromDate==null||this.formInput.FromDate=="" ||this.formInput.FromDate==undefined)
    {
      // this.toastr.warning("Please select FromDate");
               this.ShowAlert("Please select FromDate","warning")
    }
   else if(this.formInput.ToDate!='' ||this.formInput.ToDate!=null||this.formInput.ToDate!="" ||this.formInput.ToDate!=undefined)
    {
this.ApiURL="Portal/CheckDateRange?FromDate="+this.formInput.FromDate+"&ToDate="+this.formInput.ToDate;
this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
if(res.Status==false)
{
  // this.toastr.warning("ToDate should be Greater than FromDate");
  this.ShowAlert("ToDate should be Greater than FromDate","warning")
  this.formInput.EndDate='';
}
}, (error) => {});
    }
  }

  GetDetails(Type:any,RecordID:any,Date:any,UserID:any)
  {
    localStorage.setItem("RecordID",RecordID);
    localStorage.setItem("RecordDate",Date);
    if(Type=="Attendance"||Type=="AttendanceAlert")
    {
      localStorage.setItem("RecordID",UserID);
    this._router.navigate(['/AttendanceMaster']);
    }
    if(Type=="Loan")
      {
        this._router.navigate(['/LoanMaster']);
      }
      if(Type=="Leave")
        {
          this._router.navigate(['/LeaveMaster']);
        }
        if(Type=="Expense")
          {
            this._router.navigate(['/expense']);
          }
  }

  
  ApproveExpense(row:any,ID: any, Amount: any) {
    const json={
     ExpenseID:ID,
     ApprovedAmount:Amount,
     CommentByAdmin:"Approved"
    }
         this._commonservice.ApiUsingPost("Admin/ApproveExpense",json).subscribe(data => {
           if (data.Status == true) {
            //  this.toastr.success(data.Message);
            this.ShowAlert(data.Message,"success")
             this.spinnerService.hide();
             this.GetNotification(row.RecordCreated)
           }
           else {
            //  this.toastr.warning(data.Message);
            this.ShowAlert(data.Message,"warning")
             this.spinnerService.hide();
           }
         }, (error: any) => {
           //  this.toastr.error(error.message);
           this.spinnerService.hide();
   
         }
   
         );
         this.spinnerService.hide();
   
     }
   
     RejectExpense(row:any,ID: any) {
       const json={
         ExpenseID:ID,
         CommentByAdmin:"Rejected"
        }
         this._commonservice.ApiUsingPost("Admin/RejectExpense",json).subscribe(data => {
           if (data.Status == true) {
            //  this.toastr.success(data.Message);
            this.ShowAlert(data.Message,"success")
             this.spinnerService.hide();
             this.GetNotification(row.RecordCreated)
           }
           else {
            //  this.toastr.warning(data.Message);
            this.ShowAlert(data.Message,"warning")
             this.spinnerService.hide();
           }
   
         }, (error: any) => {
          // this.toastr.warning(error.error.Message);
          this.ShowAlert(error.error.Message,"warning")
           this.spinnerService.hide();
         }
   
         );
         this.spinnerService.hide();
   
     }

     ApproveLeave(row:any){
      // const json={
      //   "AdminID":this.AdminID,
      //   "ReferenceID":row.ReferenceID,
      //   "Status":"Yes",
      //   "Key":"en"
      // }
      // console.log(json);
      this._commonservice.ApiUsingGetWithOneParam("Admin/ApproveLeaveNotificationNew?AdminID="+this.AdminID+"&ReferenceID="+row.ReferenceID+"&Status=Yes").subscribe(data => {
        if (data.Status == true) {
          // this.toastr.success(data.Message);
          this.ShowAlert(data.Message,"success")
          this.spinnerService.hide();
          this.GetNotification(row.RecordCreated)
        }
        else {
          // this.toastr.warning(data.Message);
          this.ShowAlert(data.Message,"warning")
          this.spinnerService.hide();
        }
      },(error: any) => {
        // this.toastr.warning(error.error.Message);
        this.ShowAlert(error.error.Message,"warning")
         this.spinnerService.hide();
       })
     }
     RejectLeave(row:any){
      const json={
        "AdminID":this.AdminID,
        "ReferenceID":row.ReferenceID,
        "Status":"No",
        "Key":"en"
      }
      console.log(json);
      this._commonservice.ApiUsingPost("Admin/ApproveLeaveNotificationNew",json).subscribe(data => { 
        if (data.Status == true) {
        // this.toastr.success(data.Message);
        this.ShowAlert(data.Message,"success")
        this.spinnerService.hide();
        this.GetNotification(row.RecordCreated)
      }
      else {
        // this.toastr.warning(data.Message);
        this.ShowAlert(data.Message,"warning")
        this.spinnerService.hide();
      }
    },(error: any) => {
      // this.toastr.warning(error.error.Message);
      this.ShowAlert(error.error.Message,"warning")
       this.spinnerService.hide();
     })
     }

     viewLoanDetails(row:any){
       const navigationExtras: NavigationExtras = {
         state: { data: row.RecordCreated }
        };
      this._router.navigate(['/LoanMaster'], navigationExtras);
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
