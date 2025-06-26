import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { HttpCommonService } from "src/app/services/httpcommon.service";
import {environment} from "src/environments/environment";
import { Router } from "@angular/router";
import { ShowreportlistComponent } from "./showreportlist/showreportlist.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})
export class SalesDashboardComponent implements OnInit{
  LoggedInUserID: any;
  ApiURL:any;
  BannerList:any;
  ProfileDetails:any;
UserName:any;
DashboardCounts:any;DashboardData:any; NotificationHistory:any; Overview:any; AttendanceAlerts:any;
OrganizationName:any;TotalUsers:any;AdminID:any;index:any;
  responsedata: any;

  constructor(public dialog: MatDialog,private _router: Router,private toastr: ToastrService,private _commonservice: HttpCommonService) {
  }

  ngOnInit(): void {
    this.LoggedInUserID=localStorage.getItem("UserID");
    this.AdminID=localStorage.getItem("AdminID");
    this.GetBanners();
    this.GetUserProfile();
    this.GetCounts();
  }
  GetAccessStatus(value:any)
  {
    if(value=='Attendance')
      {
        this._router.navigate(["/MyAttendance"]);
      }
  else if(value=='Leave')
    {
      this._router.navigate(["/ApplyLeave"]);
    }
      else  if(value=='Message')
          {
            this._router.navigate(["/chat"]);
          }
          else{
            this.ApiURL="Admin/GetAccesscontrol?UserID="+this.LoggedInUserID;
            this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
              if(data.Status==true)
                {
                  this.responsedata=data.List;
        if(value=='Loan' && this.responsedata[0].isLoanAdvance==true)
        {
          this._router.navigate(["/applyloan"]);
        }
        if(value=='Expense' && this.responsedata[0].isExpenses==true)
          {
            this._router.navigate(["/AddExpense"]);
          }
      
              }
              else
              {
            this.toastr.warning(data.Message);
              }
            }, (error: any) => {
                this.toastr.error("Failed to Validate the Access. Please Refresh page and try again");
               
              }); 
          }
  
  
  }


  openDialog(modulename:any): void 
  {
      this.dialog.open(ShowreportlistComponent,{
        data: {}
         ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
        if(res){
        }
      })
  }

  GetBanners() {
    this.ApiURL = "https://wbtechindia.com/apis/masterportallin/promotions/get/banner";
    const json={"SoftwareID":8,"UserId":this.AdminID,"Version":""}
    this._commonservice.MasterApiUsingPost(this.ApiURL,json).subscribe(
      (res: any) => {
        console.log(res);
        if(res.status==200)
        {
          this.BannerList = res.data;
          if(this.BannerList.length>0)
          {
            for(this.index=0;this.index<this.BannerList.length;this.index++)
            {
this.BannerList[this.index].BannerImage=environment.MasterUrl+this.BannerList[this.index].BannerImage;
            }
          }
        }
      

    }, (error) => {
      // this.toastr.error(error.message);

    });

  }
  GetUserProfile()
  {    this.ApiURL="Employee/GetUserProfileDetails?ID="+this.LoggedInUserID+"&IsEmail=false";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.ProfileDetails=res.List;
      this.UserName=this.ProfileDetails[0].FirstName+" "+this.ProfileDetails[0].LastName;
      this.TotalUsers=this.ProfileDetails[0].Users;
      this.OrganizationName=this.ProfileDetails[0].Organization;
      localStorage.setItem('OrgName', res.List[0].Organization)
      if(this.OrganizationName!=null && this.OrganizationName!=undefined && this.OrganizationName!="")
      {
        this.OrganizationName= this.OrganizationName.toUpperCase();
      }

    }, (error) => {
      // this.toastr.error(error.message);

    });
  
  }

  GetCounts()
  {    this.ApiURL="Portal/GetUserDashboard?UserID="+this.LoggedInUserID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
    if(res.Status==true)
    {
      this.DashboardData=res.List;
      this.DashboardCounts=this.DashboardData[0].Counts;
      this.NotificationHistory=this.DashboardData[0].Notifications;
      this.Overview=this.DashboardData[0].Overviews;
    }

    }, (error) => {
      // this.toastr.error(error.message);

    });
  
  }

  UpdateNotificationStatus(ID:any)
  {    this.ApiURL="Portal/UpdateNotificationStatus?NotificationID="+ID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      window.location.reload();

    }, (error) => {
      // this.toastr.error(error.message);

    });
  
  }
  
  ApproveAtten(ID:any)
  {    this.ApiURL="Admin/ApproveAttendanceNew?AttendanceID="+ID+"&Status='Yes'";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
     if(res.Status==true)
     {
      this.toastr.success(res.Message);
      window.location.reload();
     }
     else{
      this.toastr.warning(res.Message);
     }

    }, (error) => {
      // this.toastr.error(error.message);

    });
  
  }
}
