import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
export class SignInModel{
  UserName:any;
  Password:any;
  DeviceToken:any;
  DeviceID:any;
  AppVersion:any;
}
export class token{
  username:any;
  password:any;
  grant_type:any;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChildren('inputEl') inputEls!: QueryList<ElementRef<HTMLInputElement>>;#scheduledFocus: any = null;
  SessionDetails: any;
  isVisible: boolean = false;
  ShowLoader=false;typeSelected:any;
showotp=false; APIUrl:any;OTP:any;showmobile=true;showpassword=false;
password:any;confirmpassword:any;
userOTP:any;UserID:any;passwordinput:any;confirmpasswordinput:any;
  dtTrigger: Subject<any> = new Subject();
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
  #size: any;
  inputs: any;
  onChange: any;onTouched:any;
  o1:any;o2:any;o3:any;o4:any;


  constructor(private service: HttpCommonService,
    private _route: Router, private globalToastService: ToastrService,private spinnerService: NgxSpinnerService) {
  }
  mobile: string|any;
  position = 'top-center';

  ngOnInit() {
    this.typeSelected = 'ball-fussion';
    // localStorage.clear();
    // localStorage.clear();
    this.passwordinput="password";this.confirmpasswordinput="password";
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }
  onOtpChange(event:any)
  {

  }
  GetOTP() {
    this.showmobile=false;
    this.showotp=true;
    if(this.mobile=="" || this.mobile==null)
    {
      this.globalToastService.warning("Please Enter MobileNumber");
    } 
    else{
      var len=this.mobile.length;
    if(len<10)
    {
      this.globalToastService.warning("Mobile number must have at least 10 digits");
    }
    else
    {
      this.spinnerService.show();
      localStorage.clear();
      this.APIUrl="Account/ValidateUser?MobileNumber="+this.mobile;
            this.service.ApiUsingGetWithOneParam(this.APIUrl).subscribe(
              (retval: any) => {
                if (retval.Status==true) {
                  this.UserID=retval.UserID;
                  
                  this.APIUrl="Account/SendOTP?MobileNumber="+this.mobile;
                  this.service.ApiUsingGetWithOneParam(this.APIUrl).subscribe(
                    (retval: any) => {
                     this.OTP=retval;                        
      this.showotp=true;   this.showpassword=false;
      this.showmobile=false;
      this.spinnerService.hide();
                    }, (error: any) => {
                      localStorage.clear();
                      this.ShowLoader=false;
                      this.spinnerService.hide();
                      this.globalToastService.error(error);
                    });
                    }
                    else {
                      this.ShowLoader=false;
                      this.spinnerService.hide();
                      this.globalToastService.warning(retval.Message);
                    
                    }

              }, (error: any) => {
                localStorage.clear();
                this.ShowLoader=false;
                this.spinnerService.hide();
                this.globalToastService.error(error);
              });
            }
    }
    this.spinnerService.hide();
 
        }

        validateotpval(event:any,type:any)
        {
if(type=='o1')
{
  this.o1=event.key;
}
if(type=='o2')
  {
    this.o2=event.key;
  }
  if(type=='o3')
    {
      this.o3=event.key;
    }
    if(type=='o4')
      {
        this.o4=event.key;
      }
        }
        SubmitOTP()
        {
          if(this.o1!=''&&this.o1!=null&&this.o1!='undefined'&&this.o2!=''&&this.o2!=null&&this.o2!='undefined'&&this.o3!=''&&this.o3!=null&&this.o3!='undefined'&&this.o4!=''&&this.o4!=null&&this.o4!='undefined')
          {
            var userotp=this.o1+''+this.o2+''+this.o3+''+this.o4;
            console.log(userotp);
            if(this.OTP==userotp)
            {
              this.showpassword=true;
              this.showmobile=false;
              this.showotp=false;
            }
            else{
              this.globalToastService.warning("You Entered wrong OTP");
            }
           
          } 
          else{
            this.globalToastService.warning("Please Enter OTP");
           
          }
        }
    
        ChangePassword()
        {
          if(this.password=="" || this.password==null)
    {
      this.globalToastService.warning("Please Enter password");
    }
    else  if(this.confirmpassword=="" || this.confirmpassword==null)
    {
      this.globalToastService.warning("Please Enter Confirm Password");
    } 
    else  if(this.confirmpassword!=this.password)
    {
      this.globalToastService.warning("Password & Confirm Password Doesn't Match");
    }  
    else{
      var len=this.password.toString().length;
      if(len<6 || len>8)
      {
        this.globalToastService.warning("Password should have 6 to 8 characters");
      }
      else{
        this.spinnerService.show();
        this.APIUrl="Account/ChangePassword?UserName="+this.mobile+"&Password="+this.password;
        this.service.ApiUsingGetWithOneParam(this.APIUrl).subscribe(
          (retval: any) => {
            if(retval=="Success")
            {
this.globalToastService.success("Password Changed Successfully");
this._route.navigate(['auth/signin']);
this.spinnerService.hide();
            }
            else{
              this.spinnerService.hide();
              this.globalToastService.warning("Sorry Failed to Update Password.. Try Again Later..")
            }
            this.spinnerService.hide();
          }, (error: any) => {
            localStorage.clear();
            this.ShowLoader=false;
            this.spinnerService.hide();
            this.globalToastService.error(error);
          });
      }
  
        
          }
        }

        validatemobilenumber(event:any)
        {
          const inputChar = String.fromCharCode(event.keyCode || event.charCode);
          if (!/^\d+$/.test(inputChar)) {
          this.globalToastService.warning("Please Enter Valid Input");
          this.mobile='';
          this.mobile.clear();
          }
          else{
            if((this.mobile==""||this.mobile==undefined||this.mobile==null )&& (event.key!="6"
            &&event.key!="7"&&event.key!="8"&&event.key!="9"))
            {
              this.globalToastService.warning("First digit should contain numbers between 6 to 9");
              this.mobile='';
          this.mobile.clear();
            }
          }
        }


        
validateotp(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.globalToastService.warning("Please Enter Valid Input")
  this.userOTP.clear();
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
OnConfirmClick()
{
  if(this.confirmpasswordinput=="text")
  {
    this.confirmpasswordinput="password";
  }
  else{
    this.confirmpasswordinput="text";
  }
}

handleInput() {
  this.#updateWiredValue();

  if (this.#scheduledFocus != null) {
    this.#focusInput(this.#scheduledFocus);
    this.#scheduledFocus = null;
  }
}
handleKeyDown(e: KeyboardEvent, idx: number) {
  if (e.key === 'Backspace' || e.key === 'Delete') {
    if (idx > 0) {
      this.#scheduledFocus = idx - 1;
    }
  }
}
handleKeyPress(e: KeyboardEvent, idx: number) {
  const isDigit = /\d/.test(e.key);

  // Safari fires Cmd + V through keyPress event as well
  // so we need to handle it here and let it through
  if (e.key === 'v' && e.metaKey) {
    return true;
  }

  if (isDigit && idx + 1 < this.#size) {
    // If user inputs digits & we are not on the last input we want
    // to advance the focus
    this.#scheduledFocus = idx + 1;
  }

  if (isDigit && this.inputs.controls[idx].value) {
    // If user deselects an input which already has a value
    // we want to clear it so that it doesn't have more than 1 digit
    this.inputs.controls[idx].setValue('');
  }

  return isDigit;
}

handleFocus(e: FocusEvent) {
  // Select previously entered value to replace with a new input
  (e.target as HTMLInputElement).select();
}

#focusInput(idx: number) {
  // In order not to interfere with the input we setTimeout
  // before advancing the focus
  setTimeout(() => this.inputEls.get(idx)?.nativeElement.focus());
}

#updateWiredValue() {
  // We want to expose the value as a plain string
  //
  // In order not to interfere with the input we setTimeout
  // before advancing the focus
  setTimeout(() => this.onChange?.(this.inputs.value.join('')));
}
}


