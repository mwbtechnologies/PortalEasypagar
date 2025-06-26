import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
export class FormInput {
  OldPassword: any;
  NewPassword: any;
  ConfirmPassword: any;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  formInput: FormInput | any;
  form: any;
  public isSubmit: boolean;
  isVisible: boolean = false;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  ApiUrl: any; UserID: any;
  passwordinput: any; confirmpasswordinput: any; oldpasswordinput: any;
  ViewPermission:any;AddPermission:any;EditPermission:any;DeletePermission:any;
  constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService) {
    this.isSubmit = false;
  }
  ngOnInit(): void {
    this.UserID = localStorage.getItem("UserID");
    this.formInput = {
      OldPassword: '',
      NewPassword: '',
      ConfirmPassword: ''
    };
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };

    this.passwordinput = "password"; this.confirmpasswordinput = "password"; this.oldpasswordinput = "password";
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
   this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }

  OnPassClick() {
    if (this.passwordinput == "text") {
      this.passwordinput = "password";
    }
    else {
      this.passwordinput = "text";
    }

  }
  OnOldClick() {
    if (this.oldpasswordinput == "text") {
      this.oldpasswordinput = "password";
    }
    else {
      this.oldpasswordinput = "text";
    }

  }
  OnConfirmClick() {
    if (this.confirmpasswordinput == "text") {
      this.confirmpasswordinput = "password";
    }
    else {
      this.confirmpasswordinput = "text";
    }
  }
  submit() {
    this.spinnerService.show();
    if (this.formInput.OldPassword == "" || this.formInput.OldPassword == null || this.formInput.OldPassword == undefined) {
      this.globalToastService.warning("Please Enter Old Password...!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.NewPassword == "" || this.formInput.NewPassword == null || this.formInput.NewPassword == undefined) {
      this.globalToastService.warning("Please Enter New Password...!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.ConfirmPassword == "" || this.formInput.ConfirmPassword == null || this.formInput.ConfirmPassword == undefined) {
      this.globalToastService.warning("Please Enter Confirm Password...!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.NewPassword != this.formInput.ConfirmPassword) {
      this.globalToastService.warning("Password and Confirm Password Doesn't match...!");
      this.spinnerService.hide();
      return false;
    }
    else {
      const oldcount: number = this.formInput.OldPassword.toString().length;
      const newcount: number = this.formInput.NewPassword.toString().length;
      // if (oldcount < 6) {
      //   this.globalToastService.warning("Old Password must have at least 6 Characters");
      //   return false;
      // } else {
      const json={
        "UserID":this.UserID,
"OldPassword":this.formInput.OldPassword
      }
        this._commonservice.ApiUsingPost("Account/CheckPasswordPortal",json).subscribe(

      (data: any) => {
        if (data == "Ok") {
        if (newcount < 6) {
          this.globalToastService.warning("New Password must have at least 6 Characters");
          this.spinnerService.hide();
          return false;
        } else {
          const ujson={
            "UserID":this.UserID,
    "OldPassword":this.formInput.OldPassword,
    "NewPassword":this.formInput.NewPassword,
    "Key":"en"
          }
          this._commonservice.ApiUsingPost("Account/UpdatePasswordPortal",ujson).subscribe(

            (data: any) => {
              if (data.Status == true) {
                this.spinnerService.hide();
                this.globalToastService.success("Password Changed Successfully...!");
                this._router.navigate(["auth/signin"]);
              }
              else {
                this.spinnerService.hide();
                this.globalToastService.warning(data.Message);
                this.spinnerService.hide();
              }

            }, (error: any) => {
              localStorage.clear();
              this.spinnerService.hide();
              this.globalToastService.warning("Sorry something went wrong");
            }
          );
        // }
      }
    }
    else
    {
      if (data == "Wrong Old Password") {
        this.spinnerService.hide();
   this.globalToastService.warning("Wrong Old Password");
      }
      else if (data == "Invalid UserID") {
        this.spinnerService.hide();
        this.globalToastService.warning("User Details Not Found...!");
      }
      else {
        this.spinnerService.hide();
        this.globalToastService.warning("Failed to Validate Old Password");
      }
      return false;
    }
    return true;
  }, (error: any) => {
    localStorage.clear();
    this.spinnerService.hide();
    this.globalToastService.warning("Sorry something went wrong");
  });
  }
  return true;
  }
}



