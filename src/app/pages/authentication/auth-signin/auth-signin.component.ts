import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from 'src/environments/environment.prod';

export class SignInModel{
  UserName:any;
  Password:any;
  DeviceToken:any;
  DeviceID:any;
  AppVersion:any;
  Key:any;
  SourceOfLogin:any;
}
export class token{
  username:any;
  password:any;
  grant_type:any;
}
@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.css']
})
export class AuthSigninComponent implements OnInit {
  SessionDetails: any;
  rememberMe:any;
  isVisible: boolean = false;
  ShowLoader=false;typeSelected:any;IsAdmin:any;
  dtTrigger: Subject<any> = new Subject(); passwordinput:any; isRemeber:any;
  constructor(private service: HttpCommonService,
    private _route: Router, private globalToastService: ToastrService,private spinnerService: NgxSpinnerService) {
  }
  DeviceToken:any;
  mobile: number|any; mobilelen=0;
  password: string|any;
  position = 'top-center';

  ngOnInit() {
    this.typeSelected = 'ball-fussion';
    this.passwordinput="password";
    this.mobile="";
    this.password="";
    // this.isRemeber=localStorage.getItem("IsRememberMe");
    // this.DeviceToken=localStorage.getItem("DeviceToken");
    // if(this.isRemeber=='true')
    // {
    //  this.AutoLoginuser();
    // }
    // else{
    //   this.mobile= localStorage.getItem("DefaultMobile");
    // }
  }
  getMobileNumberLength(): number {
    return this.mobile ? this.mobile.length : 0;
  }
  onSubmit(_signinData: NgForm) {
    if(this.mobile=="" || this.mobile==null)
    {
      this.globalToastService.warning("Please Enter Mobile Number");
    } 
    else{
      const digitCount: number = this.mobile.toString().length;
      
      if(digitCount>=10)
    {
        if(this.password=="" || this.password==null)
          {
            this.globalToastService.warning("Please Enter Password");
          } 
          else
          {
            this.spinnerService.show();
            // localStorage.clear();
            var tokenjson={
              username:this.mobile,
              password:this.password,
              grant_type:'password'
            }
            // this.service.postSignInData(tokenjson).subscribe(
            //   (retval: any) => {
            //     console.log(retval);
            //     if(retval.access_token!=null && retval.access_token!="")
            //     {
            //       localStorage.setItem("Token",retval.access_token);localStorage.setItem("DeviceToken",retval.access_token)
            this.service.ApiUsingGetWithOneParam("Account/GenerateRandomToken").subscribe(
              (retval: any) => {
                if(retval.Status==true)
                {
                  localStorage.setItem("Token",retval.Token);localStorage.setItem("DeviceToken",retval.Token)
                 
                  let Signinmodel: SignInModel = new SignInModel();
                  Signinmodel.UserName = this.mobile;
                  Signinmodel.Password = this.password;
                  Signinmodel.DeviceToken=retval.access_token;
                  Signinmodel.DeviceID='24A14242-7178-4830-999D-F73ED42999BD';
                  Signinmodel.AppVersion='1.0';
                  Signinmodel.Key='en';
                  Signinmodel.SourceOfLogin="Portal";
                  this.service.ApiUsingPost("Account/SignIn",Signinmodel ).subscribe(
                    (retval: any) => {
                      if (retval.Status==true) {
                        localStorage.setItem("UserName",this.mobile);
                        localStorage.setItem("Password",this.password);
                        console.log("CurrentToken",token );
                        var value=retval.list;
                        // if(value[0].IsProUser==true)
                        // {
                          
                          localStorage.setItem("ShowAttendancemodule",value[0].ShowAttendancemodule);
                          localStorage.setItem("IsAddLunchHour",value[0].IsAddLunchHour);
                          localStorage.setItem("ShowExpensemodule",value[0].ShowExpensemodule);
                          localStorage.setItem("ShowLocationTracking",value[0].ShowLocationTracking);
                          localStorage.setItem("ShowNotificationmodule",value[0].ShowNotificationmodule);
                          localStorage.setItem("ShowReportsmodule",value[0].ShowReportsmodule);
                          localStorage.setItem("ShowLoanmodule",value[0].ShowLoanmodule);
                          localStorage.setItem("ShowAnnualReport",value[0].ShowAnnualReport);
                          localStorage.setItem("ShowLeavemodule",value[0].ShowLeavemodule);
                          localStorage.setItem("ShowBannermodule",value[0].ShowBannermodule);
                          localStorage.setItem("ShowBranchModule",value[0].ShowBranchModule);
                          localStorage.setItem("ShowEmployeeModule",value[0].ShowEmployeeModule);
                          localStorage.setItem("ShowBranch",value[0].ShowBranch);
                          localStorage.setItem("LoginStatus",value[0].isEmailLogin);
                          localStorage.setItem("Mobile",this.mobile);
                          localStorage.setItem("Name",value[0].Name);
                          localStorage.setItem("UserID",value[0].UserID);
                          localStorage.setItem("IsTrackerUser",value[0].IsTrackerUser);
                          localStorage.setItem("LoggedInUserID",value[0].UserID);
                          if (value[0].IsAdmin==true) {
                            localStorage.setItem('LoggedInUserData', JSON.stringify(retval));                      
                            localStorage.setItem("AdminID",value[0].UserID);
                            localStorage.setItem("UserID",value[0].UserID);
                            localStorage.setItem("OrgID",value[0].OrgID);
                            localStorage.setItem("OrgID",value[0].OrgID);
                            localStorage.setItem("RoleID",value[0].RoleId);
                            localStorage.setItem("IsAdmin",'true');
                            // if (this.rememberMe) {
                            localStorage.setItem("IsRememberMe",'true');
                            // }
                            // else{
                            //   localStorage.setItem("IsRememberMe",'false');
                            // }
                            this._route.navigate(["appdashboard"]);
                            this.ShowLoader=false;
                            this.spinnerService.hide();
                            this.globalToastService.success(retval.Message);
                            
                          }
                          else
                            //  if (value[0].IsAdmin==false && value[0].RoleId == "7") 
                             {
                              if(value[0].isEmailLogin==true)
                              {
                                localStorage.setItem("UserName",value[0].MobileNumber);
                                localStorage.setItem("Password",this.password);
                                localStorage.setItem('LoggedInUserData', JSON.stringify(retval));
                           
                                localStorage.setItem("UserID",value[0].UserID);
                                localStorage.setItem("OrgID",value[0].OrgID);
                                localStorage.setItem("RoleID",value[0].RoleId);
                                localStorage.setItem("AdminID",value[0].AdminID);
                                localStorage.setItem("IsAdmin",'false');
                                if (this.rememberMe) {
                                  localStorage.setItem("IsRememberMe",'true');
                                  }
                                  else{
                                    localStorage.setItem("IsRememberMe",'false');
                                  }
                                  this._route.navigate(["appdashboard"]);
                                this.ShowLoader=false;
                                this.spinnerService.hide();
                                this.globalToastService.success(retval.Message);
                              }
                              else{
                                // localStorage.setItem('LoggedInUserData', JSON.stringify(retval));
                           
                                // localStorage.setItem("UserID",value[0].UserID);
                                // localStorage.setItem("OrgID",value[0].OrgID);
                                // localStorage.setItem("RoleID",value[0].RoleId);
                                // localStorage.setItem("AdminID",value[0].AdminID);
                                // localStorage.setItem("IsAdmin",'false');
                                // if (this.rememberMe) {
                                //   localStorage.setItem("IsRememberMe",'true');
                                //   }
                                //   else{
                                //     localStorage.setItem("IsRememberMe",'false');
                                //   }
                                //     this._route.navigate(["mydashboard"]);
                                //this.globalToastService.success(retval.Message);

                                this.ShowLoader=false;
                                this.spinnerService.hide();
                                this.globalToastService.warning("Sorry, You Don't Have Access To Use This Portal. Please Contact Your Admin");
                              
                              }
                           
                          }
    
                 
                        // }
                        //   else {
                        //     this.ShowLoader=false;
                        //     this.spinnerService.hide();
                        //     this.globalToastService.warning("Authorization Error: Please Upgrade to Pro Version to access this Portal");
                          
                        //   }
                      }
                      else{
                        this.ShowLoader=false;
                        this.spinnerService.hide();
                        this.globalToastService.error(retval.Message);
                      }
                    }, (error: any) => {
                      // localStorage.clear();
                      this.ShowLoader=false;
                      this.spinnerService.hide();
                      this.globalToastService.warning("Something went wrong. Please try again..");
                    });
                }
                else{
                  this.globalToastService.warning("Authorization Failed: Please try again..");
                }
           
          }, (error: any) => {
            // localStorage.clear();
            this.ShowLoader=false;
            this.spinnerService.hide();
            this.globalToastService.warning(error.error.error_description);
          });
        }
      }
      else{
        this.globalToastService.warning("Mobile number must have at least 10 digits");
      }
   
    }
 
        }

        requestPermission() {
          const messaging = getMessaging();
         var CurrentToken= getToken(messaging, 
           { vapidKey: environment.firebase.vapidKey}).then(
             (currentToken) => {
               if (currentToken) {
                //  console.log("Hurraaa!!! we got the token.....");
                //  console.log(currentToken);
                 localStorage.setItem("DeviceToken",currentToken)
               } else {
                 console.log('No registration token available. Request permission to generate one.');
               }
           }).catch((err) => {
              console.log('An error occurred while retrieving token. ', err);
          });
        }
AutoLoginuser()
{
this.IsAdmin= localStorage.getItem("IsAdmin");
if(this.IsAdmin=='true')
{
  this._route.navigate(["appdashboard"]);
}
else{
    this._route.navigate(["mydashboard"]);
}
}

        OnPassClick()
        {
          if(this.passwordinput=="text")
          {
            this.passwordinput="password";
          }
          else{
            this.passwordinput="text";
          }
          
        }
    
}

