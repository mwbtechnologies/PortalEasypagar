import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ChecklocationComponent } from './checklocation/checklocation.component';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
// import { ChecklocationComponent } from './checklocation/checklocation.component';
export class FormInput {
  ApprovedSessionID:any;
  Comment:any;
}
@Component({
  selector: 'app-approveattendance',
  templateUrl: './approveattendance.component.html',
  styleUrls: ['./approveattendance.component.css']
})
export class ApproveattendanceComponent {
AttendanceData:any;ShowShift=false;
  ApiURL: any;LoginTypes:any;SingleSelectionSettings:any;emparray:any;ShiftTypes:any[]=[];ShiftSelectionSettings:IDropdownSettings = {}
  timeFormat:any;UserID:any;EmployeeID:any
  tmpselectedFileType: any;

constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ApproveattendanceComponent>){
  this.AttendanceData = this.data.IL;
  this.EmployeeID = this.data.IL.EmployeeID;
  this.SingleSelectionSettings = {
    singleSelection: true,
    idField: 'Value',
      textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
  this.ShiftSelectionSettings = {
    singleSelection: true,
    idField: 'ShiftID',
      textField: 'ShiftName',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };
}
ngOnInit(){
  console.log(this.AttendanceData);
  this.UserID=localStorage.getItem("UserID");
  this.GetLoginTypes();
  this.GetShiftTypes(this.AttendanceData[0].CheckInDate)
  this.getTimeFormat()
}

getTimeFormat(){
  //12 hours is the default time format
  this.timeFormat = 12;
  let LoggedInUserData:any  = localStorage.getItem("LoggedInUserData")
  if(LoggedInUserData?.TimeFormat == true){
    this.timeFormat = 24
  }
}
private GetLoginTypes()
{
  https://easypagar.com/easypagar/api/Admin/GetCheckInTypes/Session/0/en
  this.spinnerService.show();
  this._commonservice.ApiUsingGetWithOneParam("Admin/GetCheckInTypes/Session/0/en").subscribe((res:any) => {
    this.LoginTypes = res.List;
    this.spinnerService.hide();
  }, (error) => {
    // this.toastr.error(error.message);
    this.ShowToast(error.message,"error")
    this.spinnerService.hide();
  });
  this.spinnerService.hide();
}
//  GetShiftTypes(Date:any){
//   this.spinnerService.show();
//   this._commonservice.ApiUsingGetWithOneParam("Employee/GetEmployeeShiftsNew?EmployeeID="+this.EmployeeID+"&Date="+Date).subscribe((res:any) => {
//     this.ShiftTypes = res.Shifts;
//     if(this.ShiftTypes.length>0){this.ShowShift=true;}else {this.ShowShift=false;}
//     console.log(this.ShiftTypes);
//     this.spinnerService.hide();
//   }, (error) => {
//     this.toastr.error(error.message);
//     this.spinnerService.hide();
//   });
//   this.spinnerService.hide();
// }

GetShiftTypes(Date:any){
  this.spinnerService.show();
  this._commonservice.ApiUsingGetWithOneParam("Employee/GetEmployeeShifts?EmployeeID="+this.EmployeeID).subscribe((res:any) => {
    this.ShiftTypes = res.Shifts;
    if(this.ShiftTypes.length>0){this.ShowShift=true;}else {this.ShowShift=false;}
    console.log(this.ShiftTypes);
    this.spinnerService.hide();
  }, (error) => {
    // this.toastr.error(error.message);
    this.ShowToast(error.message,"error")
    this.spinnerService.hide();
  });
  this.spinnerService.hide();
}
Approve(IL:any,Status:any,name:any, empid:any) {

  if ((IL.ApprovedSessionID == "" || IL.ApprovedSessionID == null || IL.ApprovedSessionID == undefined) && Status=='Approved') {
    // this.toastr.warning("Please Select Approved Session Type");
    this.ShowToast("Please Select Approved Session Type","warning")
  }
  else if (IL.Admin_Comments == "" || IL.Admin_Comments == null || IL.Admin_Comments == 0) {
    // this.toastr.warning("Please Enter Comment");
    this.ShowToast("Please Enter Comment","warning")
  }
  else {
    this.approveAttendance(IL,Status)
  // this._commonservice.ApiUsingGetWithOneParam("Admin/isShowLocationPopup?ID="+IL.ID+"").subscribe((res:any)=>{
  //   if(res.list.isshowpopup === true){
  //     let Address = res.list.Address
  //      this.dialog.open(ChecklocationComponent,{
  //            data: { Address,name,empid }
  //          }).afterClosed().subscribe(res =>{
  //           this.approveAttendance(IL,Status)
  //          })
  //   }
  //   else if(res.list.isshowpopup === false){
  //   this.approveAttendance(IL,Status)
  //   }
  //   else{
  //     this.toastr.error(res.message);
  //   }
  // },(error)=>{
  //   this.toastr.error(error.error.Message);
  // })
  }
}



approveAttendance(IL:any,Status:any){

    if(IL.CheckOutDate==null ||IL.CheckOutDate==undefined ||IL.CheckOutDate=="" ||IL.CheckOutDate==0 || IL.CheckOutDate==" ")
    {
      IL.CheckOutDate=IL.CheckInDate;
    }
    var sessionID=IL.ApprovedSessionID;
    if(IL.ApprovedSessionID!=null && IL.ApprovedSessionID!=undefined && IL.ApprovedSessionID!='' && IL.ApprovedSessionID!=4 && IL.ApprovedSessionID!=5 && IL.ApprovedSessionID!=6)
    {
      if(IL.ApprovedSessionID.length>0){sessionID=IL.ApprovedSessionID[0].Value;}
    }
 let tmp=[];
 tmp.push({"CheckOutDatetime":IL.CheckOutDateTime,"AttendanceID":IL.ID,  "Comment":IL.Admin_Comments,  "SessionTypeID":sessionID, "CheckInDate":IL.CheckInDate, 
   "CheckInTime":IL.CheckInTime,  "CheckOutDate":IL.CheckOutDate,  "CheckOutTime":IL.CheckOutTime,"ShiftID":IL.ShiftID});
  const json={
    Key:"en",
    AdminID:this.UserID,
    ApprovalList:tmp,
    Status:Status,
     }
    this.spinnerService.show();
    console.log(json);
    this.ApiURL = "Admin/ApproveAttendanceportal";

    this._commonservice.ApiUsingPost(this.ApiURL,json).subscribe(data => {
      if (data.Status == true) {
        // this.toastr.success(data.Message);        
        this.ShowToast(data.Message,"success")
        this.spinnerService.hide();
        
        this.CloseTab();
      }
      else {
        // this.toastr.warning(data.Message);
        this.ShowToast(data.Message,"warning")
        this.spinnerService.hide();
      }

    }, (error: any) => {
      //  this.toastr.error(error.message);
      this.spinnerService.hide();

    }

    );
    this.spinnerService.hide();

  
}
// checkLocation(attid:any,name:any){
// this._commonservice.ApiUsingGetWithOneParam("Admin/isShowLocationPopup?ID="+attid+"").subscribe((res:any)=>{
//   if(res.list.isshowpopup === true){
//     let Address = res.list.Address
//      this.dialog.open(ChecklocationComponent,{
//            data: { Address,name }
//          })
//   }
// })
// }

// parseDate(dateStr: string, timeStr: string): Date {
//   const [day, month, year] = dateStr.split('-').map(Number);
//   const [hour, minute] = timeStr.split(':').map(Number);
//   const period = timeStr.split(' ')[1];

//   const adjustedHour = period === 'PM' ? hour + 12 : hour;
//   return new Date(year, month - 1, day, adjustedHour, minute);
// }
// replaceTime(originalDate: Date, newTime: string): Date {
//   // Extract date parts from the original Date object
//   const year = originalDate.getFullYear();
//   const month =parseInt((originalDate.getMonth() + 1).toString().padStart(2, '0')); // Months are 0-based
//   const day =parseInt(originalDate.getDate().toString().padStart(2, '0'));
//   // const [hour, minute] = newTime.split(':').map(Number);
//   const timearray=newTime.split(':');
//   const hour =parseInt(timearray[0]);
//   const minute =parseInt(timearray[1]);
//   const period = newTime.split(' ')[1];
//   const adjustedHour = period === 'PM' ? hour + 12 : hour;


//   // Create a date string in the format YYYY-MM-DD
//   const dateString = `${year}-${month}-${day}`;

//   // Combine the date string with the new time string
//   const dateTimeString = `${dateString}T${newTime}`;

//   // Create a new Date object from the combined string
//   const newDateTime = new Date(dateTimeString);

//   return new Date(year, month - 1, day, adjustedHour, minute);
// }

// parseDateString(dateString: string): Date {
//   // Split the date and time parts
//   const [datePart, timePart] = dateString.split(' ');

//   // Split the date part into day, month, and year
//   const [day, month, year] = datePart.split('/').map(part => parseInt(part, 10));

//   // Split the time part into hours and minutes
//   const [hours, minutes] = timePart.split(':').map(part => parseInt(part, 10));

//   // Create a new Date object using the parsed components
//   const parsedDate = new Date(year, month - 1, day, hours, minutes);

//   return parsedDate;
// }
// formatDate(date: Date): string {
//   // Extract the date components
//   const day = date.getDate().toString().padStart(2, '0');
//   const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
//   const year = date.getFullYear().toString().slice(-4); // Get last two digits of the year

//   // Extract the time components
//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');
//   const seconds = date.getSeconds().toString().padStart(2, '0');
//   const miliseconds = date.getMilliseconds().toString().padStart(3, '0');

//   // Format the date and time into the desired format yyyy-mm-dd HH:mm:ss.fff
//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${miliseconds}`;
// }
// UpdateCheckout(CheckOutDate:any,CheckOut:any,ID: any, ApprovedType: any) { 
//   var date=this.parseDateString(CheckOutDate);   
//   var datetime=this.replaceTime(date,CheckOut);
//   var finaldate=this.formatDate(datetime);
//     this.ApiURL = "Admin/EditCheckoutTime?AttId=" + ID + "&CheckoutTime="+finaldate+"&Approvedsessiontype="+ ApprovedType;
// console.log(this.ApiURL);
//     this._commonservice.ApiUsingPostWithOneParam(this.ApiURL).subscribe(data =>
      
//        {
//       console.log(data); 
//         this.CloseTab();

//        }, (error: any) => {  console.log(error);  this.CloseTab();});

// }


Action(Status:any) {
  var tmp=[];
  for(let i=0;i<this.AttendanceData.length;i++)
  {
    tmp.push({"CheckOutDatetime":this.AttendanceData[i].CheckOutDateTime, "AttendanceID":this.AttendanceData[i].ID,  "Comment":this.AttendanceData[i].Admin_Comments,  "SessionTypeID":this.AttendanceData[i].SessionTypeID, "CheckInDate":this.AttendanceData[i].CheckInDate, 
      "CheckInTime":this.AttendanceData[i].CheckInTime,  "CheckOutDate":this.AttendanceData[i].CheckOutDate,  "CheckOutTime":this.AttendanceData[i].CheckOutTime,"ShiftID":0});
  }
  const json={
    Key:"en",
    AdminID:this.UserID,
    ApprovalList:tmp,
    Status:Status
     }
     console.log(json);
  this.spinnerService.show();
    this._commonservice.ApiUsingPost("Admin/ApproveAttendanceportal",json).subscribe(data => {
      if (data.Status == true) {
        // this.toastr.success(data.Message);
        this.ShowToast(data.Message,"success")
        this.spinnerService.hide();
        this.CloseTab();
      }
      else {
        // this.toastr.warning(data.Message);
        this.ShowToast(data.Message,"warning")
        this.spinnerService.hide();
      }

    }, (error: any) => {
      //  this.toastr.error(error.message);
      this.spinnerService.hide();

    }

    );
    this.spinnerService.hide();
}
ValidateCheckOut(In:any,Out:any,index:any)
{
  this.spinnerService.show();
  if(this.AttendanceData.count==1)
  {
    this._commonservice.ApiUsingGetWithOneParam("Helper/CheckDateRange?FromDate="+In+"&ToDate="+Out+"&SecondIn=").subscribe(data => {
      if (data.Status == false) {
        // this.toastr.warning(data.Message);
        this.ShowToast(data.Message,"warning")
  this.AttendanceData.LoginData[index].CheckOutDateTime="";
        this.spinnerService.hide();
     
      }
  
    }, (error: any) => {
      //  this.toastr.error(error.message);
      this.spinnerService.hide();
  
    }
  
    );
  }
  if(this.AttendanceData.count==2){
    if(index==0)
    {
      var secondin=this.AttendanceData.LoginData[1].CheckInDateTime;
      this._commonservice.ApiUsingGetWithOneParam("Helper/CheckDateRange?FromDate="+In+"&ToDate="+Out+"&SecondIn="+secondin).subscribe(data => {
        if (data.Status == false) {
          // this.toastr.warning(data.Message);
          this.ShowToast(data.Message,"warning")
    this.AttendanceData.LoginData[index].CheckOutDateTime="";
          this.spinnerService.hide();       
        }    
      }, (error: any) => {
        //  this.toastr.error(error.message);
        this.spinnerService.hide();
    
      }
    
      );
    }
    else{
      var secondin=this.AttendanceData.LoginData[1].CheckInDateTime;
      this._commonservice.ApiUsingGetWithOneParam("Helper/CheckDateRange?FromDate="+In+"&ToDate="+Out+"&SecondIn=").subscribe(data => {
        if (data.Status == false) {
          // this.toastr.warning(data.Message);
          this.ShowToast(data.Message,"warning")
    this.AttendanceData.LoginData[index].CheckOutDateTime="";
          this.spinnerService.hide();
       
        }
    
      }, (error: any) => {
        //  this.toastr.error(error.message);
        this.spinnerService.hide();
    
      }
    
      );
    }
 
  }

  this.spinnerService.hide();
}


CloseTab()
{
  this.dialogRef.close({})
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
