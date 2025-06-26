import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-user-chats',
  templateUrl: './user-chats.component.html',
  styleUrls: ['./user-chats.component.css']
})
export class UserChatsComponent implements OnInit {
  UserID:any;
  ApiURL:any;
  MessageList:any;
MessageHistory:any; ProfileList:any;
MainUserID:any;
UserName:any;
 UserProfile:any;
 Message:any;
 BranchID:any;
 DepartmentID:any;
 MessageStart:any;
ShowMessageTab=false;
AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
LoginType:any;
  constructor(private _route: Router,private toastr: ToastrService,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
  }

  ngOnInit(): void {
    this.MainUserID=localStorage.getItem("UserID");
    this.GetMessages();
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
    this.LoginType =  localStorage.getItem("LoginStatus");if(this.LoginType=="true"){this.LoginType="Email";} else{this.LoginType="Mobile";}
  
  }


  GetMessages()
  {
    this.spinnerService.show();
    this.ApiURL="Messages/GetMessages?UserID="+this.MainUserID+"&BranchId=0&DeptId=0&IsEmail=false&FromDate=&ToDate=";
    if(this.LoginType=="Email")
      {
        this.ApiURL="Messages/GetMessages?UserID="+this.MainUserID+"&BranchId=0&DeptId=0&IsEmail=true&FromDate=&ToDate=";
      }
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.MessageList = res.List;
      // if(this.UserID==null||this.UserID==0||this.UserID==undefined||this.UserID=="")
      // {
      //   this.UserID=this.MessageList[0].EmployeeID;
      //   this.GetUserProfile();
      //   this.GetMessageHistory();
      // }
      // else
      // {
      //   this.GetUserProfile();
      //   this.GetMessageHistory();
      // }
      if(this.MessageList.length>0)
      {
        this.ShowMessageTab=true;
      }
      else{
        this.ShowMessageTab=false;
      }
      this.spinnerService.hide();
    }, (error) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }

  
  GetMessageHistory()
  { this.ApiURL="Admin/GetEmployeeMessageHistory?EmployeeID="+this.UserID+"&AdminID="+this.MainUserID;
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.MessageStart=res.FirstMessageStart;
      this.MessageHistory = res.List;
      this.spinnerService.hide();
    }, (error) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }

  
  GetUserProfile()
  { this.ApiURL="Employee/GetUserProfileDetails?ID="+this.UserID;
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
if(res.Status==true)
{
  this.ProfileList = res.List;
  this.UserName=this.ProfileList[0].FirstName + " "+ this.ProfileList[0].LastName;
  this.UserProfile=this.ProfileList[0].ProfileImageURl;
  this.BranchID=this.ProfileList[0].BranchID;
  this.DepartmentID=this.ProfileList[0].DepartmentID;
  localStorage.setItem('OrgName', res.List[0].Organization)
} 
      this.spinnerService.hide();
    }, (error) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }

  ChangeUser(EmployeeID:any)
  {
    this.UserID=EmployeeID;
    localStorage.setItem("EmployeeID",this.UserID);
    this.GetMessageHistory();
    this.GetUserProfile();
  }

  ReplyMessage()
  {
    if(this.Message=="" || this.Message==null ||this.Message==undefined)
    {
      this.toastr.warning("Please Enter Message");
    }
    else
    {
      const json={
        Message:this.Message,
        FromEmployee:this.MainUserID,
        ToEmployee:this.UserID,
        BranchID:this.BranchID,
        DepartmentID:this.DepartmentID,
        Files:[]
      }
      this._commonservice.ApiUsingPost("Admin/ReplyMessageNew",json).subscribe((res:any) => {
        if(res.Status==true)
        {
          this.toastr.success(res.Message);
          this.Message="";
          this.GetMessageHistory();
        }
        else{
          this.toastr.warning(res.Message);
        }
              
              this.spinnerService.hide();
            }, (error) => {
              // this.toastr.error(error.message);
              this.spinnerService.hide();
            });
    }
   
  }
}
