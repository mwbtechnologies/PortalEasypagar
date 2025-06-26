import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComingSoonComponent } from 'src/app/pages/settings/coming-soon/coming-soon.component';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  AdminID:any;RoleID:any;NewApiURL:any;
  navigation:any;
  isSubMenuVisible: boolean = false;
  expanddata:any[] = []
  UserID: any;
  ShowAdminNav=true;
  ShowAttendancemodule:any;IsAddLunchHour:any
  ShowExpensemodule:any;ShowLocationTracking:any;ShowNotificationmodule:any;
  ShowReportsmodule:any;ShowLoanmodule:any;ShowAnnualReport:any;
  ShowLeavemodule:any;ShowBannermodule:any;ShowBranchModule:any;
  ShowEmployeeModule:any;ShowBranch:any;LoginType:any;
UpgradeMessage:any;
PlanExpiryStatus=false;ApiURL:any;
@Input() visible: boolean = false;
  dialog: any;


  constructor(private spinnerService: NgxSpinnerService,private globalToastService: ToastrService,private _router: Router,private _commonservice: HttpCommonService){}
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.RoleID = localStorage.getItem("RoleID");
    this.ShowAttendancemodule =localStorage.getItem("ShowAttendancemodule"); if(this.ShowAttendancemodule=="true"){this.ShowAttendancemodule=true;} else{this.ShowAttendancemodule=false;}
    this.IsAddLunchHour =localStorage.getItem("IsAddLunchHour"); if(this.IsAddLunchHour=="true"){this.IsAddLunchHour=true;} else{this.IsAddLunchHour=false;}
     this.ShowExpensemodule = localStorage.getItem("ShowExpensemodule");if(this.ShowExpensemodule=="true"){this.ShowExpensemodule=true;} else{this.ShowExpensemodule=false;}
    this.ShowLocationTracking = localStorage.getItem("ShowLocationTracking"); if(this.ShowLocationTracking=="true"){this.ShowLocationTracking=true;} else{this.ShowLocationTracking=false;}
      this.ShowNotificationmodule =  localStorage.getItem("ShowNotificationmodule");if(this.ShowNotificationmodule=="true"){this.ShowNotificationmodule=true;} else{this.ShowNotificationmodule=false;}
    this.ShowReportsmodule = localStorage.getItem("ShowReportsmodule"); if(this.ShowReportsmodule=="true"){this.ShowReportsmodule=true;} else{this.ShowReportsmodule=false;}
       this.ShowLoanmodule = localStorage.getItem("ShowLoanmodule");if(this.ShowLoanmodule=="true"){this.ShowLoanmodule=true;} else{this.ShowLoanmodule=false;}
    this.ShowAnnualReport =localStorage.getItem("ShowAnnualReport");  if(this.ShowAnnualReport=="true"){this.ShowAnnualReport=true;} else{this.ShowAnnualReport=false;}
      this.ShowLeavemodule = localStorage.getItem("ShowLeavemodule");if(this.ShowLeavemodule=="true"){this.ShowLeavemodule=true;} else{this.ShowLeavemodule=false;}
    this.ShowBannermodule =localStorage.getItem("ShowBannermodule");  if(this.ShowBannermodule=="true"){this.ShowBannermodule=true;} else{this.ShowBannermodule=false;}
     this.ShowBranchModule =  localStorage.getItem("ShowBranchModule");if(this.ShowBranchModule=="true"){this.ShowBranchModule=true;} else{this.ShowBranchModule=false;}
    this.ShowEmployeeModule = localStorage.getItem("ShowEmployeeModule");  if(this.ShowEmployeeModule=="true"){this.ShowEmployeeModule=true;} else{this.ShowEmployeeModule=false;}
     this.ShowBranch =  localStorage.getItem("ShowBranch");if(this.ShowBranch=="true"){this.ShowBranch=true;} else{this.ShowBranch=false;}
     this.LoginType =  localStorage.getItem("LoginStatus");if(this.LoginType=="true"){this.LoginType="Email";} else{this.LoginType="Mobile";}
    //  this._commonservice.ApiUsingGetWithOneParam(this.NewApiURL).subscribe((data) => this.navigation = data.List, (error) => {
    //  console.log(error);
  // });
  // if(this.UserID==this.AdminID)
  // {
    this.getnavitemsfromapi();
    this.GetUserProfile();
  // }
  // else{
  //   this.getUsernavitemsfromapi();
  // }

  // if(this.RoleID!="2")
  // {
  //   this.ShowAdminNav=false;
  // }

  }

  async GetUserProfile() {
    this.NewApiURL="Employee/GetUserProfileDetails?ID="+this.UserID+"&IsEmail=true";
    if(this.LoginType!="Email"){
      this.NewApiURL="Employee/GetUserProfileDetails?ID="+this.UserID+"&IsEmail=false";
    }
        await this._commonservice.ApiUsingGetWithOneParam(this.NewApiURL).toPromise().then(
          response => {
            if(response.Status==true)
            {
              this.UpgradeMessage = response.List[0].PlanMessage;
              this.PlanExpiryStatus=response.List[0].IsPlanExpired;
              localStorage.setItem("TimeFormat",response.List[0].TimeFormat)
            }
            
          })
        }

  async getnavitemsfromapi() {

  this.NewApiURL="SuperAdmin/getNavItemsNew?UserID="+this.UserID+"&LoginType="+this.LoginType;
    // console.log({NewApiURL:this.NewApiURL});

    await this._commonservice.ApiUsingGetWithOneParam(this.NewApiURL).toPromise().then(
      response => {
        this.navigation = response.List;
        // console.log({navigation:this.navigation});
      })
    }

    async getUsernavitemsfromapi() {
      this.NewApiURL="SuperAdmin/getUserNavItemsNew?Roleid="+this.RoleID;
          await this._commonservice.ApiUsingGetWithOneParam(this.NewApiURL).toPromise().then(
            response => {
              this.navigation = response.List;
            })
          }
    Navigate(path:any,IsAdd:any,IsDelete:any,IsEdit:any,IsView:any,IsDownload:any)
    {
      // if(path=="Bonus-Deductions" ||path=="DesignationMaster" || path=="/salary/configuration/employee")
      // {
      //   this.openDialog(path);
      // }
      // else{
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = today.getDate().toString().padStart(2, '0');
        var date = `${year}-${month}-${day}`;
        localStorage.setItem("Date",date);
        localStorage.removeItem("RecordID");
        localStorage.removeItem("RecordDate");
        localStorage.removeItem("BranchID");
        localStorage.removeItem("BranchName");
      
      // if(path=='messages'|| path=='branch'|| path=='EmployeeMaster' || path=='banner')
      // {
      //   this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.AdminID+"&feature="+path+"&editType=view";
      //   this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      //    if(data.Status==true){
         localStorage.setItem("AddPermission",'true');
          localStorage.setItem("EditPermission",'true');
          localStorage.setItem("ViewPermission",'true');
          localStorage.setItem("DeletePermission",'true');
          localStorage.setItem("DownloadPermission",'true');
        this._router.navigate([path]); 
        // this._router.navigate(['/ComingSoon'])
   
      
//   }
//   else
//   {
// this.globalToastService.warning(data.Message);
//   }
// }, (error: any) => {
//     this.spinnerService.hide();
//     this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");
   
//   });  
// }
// else{
//   this._router.navigate([path]); 
// }  
      //  }

    }
    openDialog(Module:any): void {
      this.dialog.open(ComingSoonComponent,{
        data: {Module:Module}
         ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
        if(res){
        }
      })
    }
    toggleSubMenu(text:any) {
      let index = this.expanddata.indexOf(text)
      if (index > -1) {
        this.expanddata.splice(index,1)
      }else
      {
        this.expanddata.push(text)
      }
      console.log(this.expanddata)
  
      this.isSubMenuVisible = !this.isSubMenuVisible;
    }
 
    upgrade(module:any)
    {
      var message="Please Upgrade the plan to enable "+ module+ " module";

      if(this.UpgradeMessage!=null && this.UpgradeMessage!=""&& this.UpgradeMessage!=undefined)
      {
        window.alert(this.UpgradeMessage);  
      }
      else{
        window.alert(message);
      }
      
    }

    clearSubMenu(){
      this.expanddata = []
    }
}
