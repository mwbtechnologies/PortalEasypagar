import { Component, OnInit,Inject, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { DatePipe } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { EmpRoasterReportsModule } from '../../../pages/emp-roaster-reports/emp-roaster-reports.module';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  UserID:any;ApiURL:any;CurrentDate:any;
NotificationList:any;
MessageList:any;
pipe = new DatePipe('en-US');
elem: any;Fullscreen=false;
Mobile:any;isRemeber:any;LoginType:any;
ProfileImage:any; ProfileDetails:any;RoleID:any;AdminID:any
feedback:any;NotificationCount:any;LoginUserName:any;

 @Input() visible: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  stars = [1, 2, 3, 4, 5];
  rating = 5;

  constructor( @Inject(DOCUMENT) private document: any,private _route: Router,private toastr: ToastrService,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
  }
  ngOnInit() {
    this.LoginUserName=localStorage.getItem("Name");
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID=localStorage.getItem("UserID");
    this.elem = document.documentElement;
    this.CurrentDate = new Date();
    let ChangedFormat = this.pipe.transform(this.CurrentDate, 'dd/MM/YYYY');
    this.CurrentDate=ChangedFormat;
    this.UserID=localStorage.getItem("UserID");
    this.LoginType =  localStorage.getItem("LoginStatus");if(this.LoginType=="true"){this.LoginType="Email";} else{this.LoginType="Mobile";}
  this.NotificationCount=0;
    // this.ApiURL="Admin/GetNotificationHistoryNew?UserID="+this.UserID+"&Date="+this.CurrentDate+"&Type="+"Read"+"&Status="+"";
   
    // this.GetNotifications();
    this.GetMessages();
   this.GetProfile();

  }


  VisibleClick() {
    this.toggleSidebar.emit();
  }
  GetProfile()
  {
    this.ApiURL="Employee/GetUserProfileDetails?ID="+this.UserID+"&IsEmail=true";
    if(this.LoginType!="Email"){
      this.ApiURL="Employee/GetUserProfileDetails?ID="+this.UserID+"&IsEmail=false";
    }
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.ProfileDetails = res.List[0];
      this.ProfileImage=this.ProfileDetails.ProfileImageURl;
      this.RoleID=this.ProfileDetails.RoleID;
      this.NotificationCount=this.ProfileDetails.NotificationCount;
      localStorage.setItem('TimeFormat',this.ProfileDetails.TimeFormat)
      localStorage.setItem('Organization',this.ProfileDetails.Organization)
      localStorage.setItem('EmpId',this.ProfileDetails.EmpID)
      localStorage.setItem('PayButton',this.ProfileDetails.isshowpaybutton)
      this.spinnerService.hide();
    }, (error) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }
  GetNotifications()
  {
    this.ApiURL="Admin/GetNotificationHistoryNew?UserID="+this.UserID+"&Date=&Type="+""+"&Status="+"";
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.NotificationList = res.List;
      this.spinnerService.hide();
    }, (error) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }

  GetMessages()
  { this.ApiURL="Admin/GetMessages?UserID="+this.UserID+"&BranchId=0&DeptId=0&IsEmail=false";
    if(this.LoginType=="Email")
      {
        this.ApiURL="Admin/GetMessages?UserID="+this.UserID+"&BranchId=0&DeptId=0&IsEmail=true";
      }
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.MessageList = res.List;
      this.spinnerService.hide();
    }, (error) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }
  logout()
  {
    localStorage.clear();
    this.isRemeber=localStorage.getItem("IsRememberMe");
    this.Mobile='';
    if(this.isRemeber=='true')
    {
      this.Mobile= localStorage.getItem("Mobile");
    }  
    localStorage.clear();
    localStorage.setItem("DefaultMobile",this.Mobile);
    this._route.navigate(['auth/signin']);
    this.toastr.success('SignOut Successful..!');

  }

  chat(EmployeeID:any)
  {
    localStorage.setItem("EmployeeID",EmployeeID);
    this._route.navigate(['chat']);
  }

  openFullscreen() {
    this.Fullscreen=true;
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }
/* Close fullscreen */
  closeFullscreen() {
    this.Fullscreen=false;
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  rate(star:number): void{
    this.rating = star;
  }
  rateUs() {
    this._commonservice.ApiUsingGetWithOneParam("Common/AddUserRatings?UserID="+this.AdminID+"&StartCount="+this.rating+"&Comment="+this.feedback+"").subscribe((res:any)=>{
      this.toastr.success(res.message)
      console.log(res,"rate us");
    })
  }

}
