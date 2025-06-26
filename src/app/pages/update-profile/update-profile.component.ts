import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';  // agm-direction
import { MapsAPILoader } from '@agm/core';
import { NgForm } from '@angular/forms';

export class FormInput{
  PinCode:any;
  LogoPath:any;
  SalaryDay:any;
  Address:any;
  AdminID:any;
  State:any;
  City:any;
  StateID:any;
  CityID:any;
  MapAddress:any;
  MobileNumber:any;
  Email:any;
  Organization:any;
  LastName:any;
  FirstName:any;
  ProfileImage:any;
  AllowNotification:any;
  OfficeStartTime:any;
  OfficeEndTime:any;
}

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  ShowPersonal=false;
  ShowOrg=true;
    Length:any;
  AdminID:any;
    formInput: FormInput | any;
    public isSubmit: boolean | any;StateList:any;
    selectedStateId: string[] | any;
    CityList:any;ApiURL:any;selectedCityId:string[] | any;
    ProfileDetails:any;
    OrganizationName:any;
    AdminName:any;
    DateofJoining:any;MaxSalaryDay:any; ProfileImageURl:any;
    ProfileURl: any;
  file: any;ViewPermission:any;AddPermission:any;EditPermission:any;DeletePermission:any;
    constructor(public mapsApiLoader: MapsAPILoader,private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,private globalToastService:ToastrService)
    { this.isSubmit=false;
      }
    ngOnInit(): void {
    this.AdminID=localStorage.getItem("AdminID");
      this.formInput = {  
        PinCode:'',
        LogoPath:'',
        SalaryDay:'',
        Address:'',
        AdminID:0,
        State:'',
        City:'',
        StateID:0,
        CityID:0,
        MapAddress:'',
        MobileNumber:'',
        Email:'',
        Organization:'',
        LastName:'',
        FirstName:'',
        ProfileImage:'',
        // FacebookURL:'',
        // CompanyBio:'',
        // LinkedInURL:'',
        // WebsiteURL:'',
        // InstagramURL:'',
        // TwitterURL:'',
        // Youtube:'',
        // Designation:'',
        // Country:'',
        AllowNotification:false
      }
     if(this.AdminID!=null && this.AdminID!=0 && this.AdminID!=undefined)
     {
      this.GetProfileDetails();
      this.formInput.AdminID=this.AdminID;
     }
     this._commonservice.ApiUsingGetWithOneParam("Admin/GetStateList").subscribe((data) => this.StateList = data.List, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
    //  this._commonservice.ApiUsingGetWithOneParam("Account/GetSalaryDay").subscribe((data) => this.MaxSalaryDay = data.Day, (error) => {
    //   this.globalToastService.error(error); console.log(error);
    // });
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
   this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   this.MaxSalaryDay=30;
    }

    checksalaryday(Val:any)
{
if(Val>30)
{
  this.globalToastService.warning("Salary Day should be less than 31");
  this.formInput.SalaryDay=30;this.MaxSalaryDay=1
}
else if(Val<1)
  {
    this.globalToastService.warning("Salary Day should be greater than 0");
    this.formInput.SalaryDay=1;this.MaxSalaryDay=30
  }
else{
var val=Val-1;
this.MaxSalaryDay=val;
}
}

UploadProof1Image1(event:any,form: NgForm) {
    const target = event.target as HTMLInputElement;
    var img=(target.files as FileList)[0];
    if (img && img.type.startsWith('image/'))
    {
    this.file = (target.files as FileList)[0];
   
      var reader = new FileReader();
      reader.onload = (event: any) => {
      this, this.ProfileURl = event.target.result;
      }
      reader.readAsDataURL(this.file);
      const fData: FormData = new FormData();
      fData.append('formdata', JSON.stringify(form.value));
      fData.append('FileType', "IDProof");
      if (this.file != undefined) { fData.append('File', this.file, this.file.name);
      this._commonservice.ApiUsingPost("Admin/FileUpload",fData).subscribe(data => { this.ProfileImageURl=data.URL;});
      }
    } else {
      this.globalToastService.warning("Please Select valid image File");
    }
 
}
    GetProfileDetails()
    {
      this.ApiURL="Portal/GetAdminProfile?AdminID="+this.AdminID;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => 
     { 
      if(data.Status==true)
      {
        this.ProfileDetails = data.List;
        this.formInput.FirstName=this.ProfileDetails[0].FirstName;
        this.formInput.LastName=this.ProfileDetails[0].LastName;
        this.formInput.MobileNumber=this.ProfileDetails[0].MobileNumber;
        this.formInput.Email=this.ProfileDetails[0].Email;
        this.formInput.LogoPath=this.ProfileDetails[0].Logo;
        this.formInput.CityID=this.ProfileDetails[0].CityID;
        this.formInput.StateID=this.ProfileDetails[0].StateID;
        this.formInput.OfficeEndTime=this.ProfileDetails[0].OfficeEndTime;
        this.formInput.OfficeStartTime=this.ProfileDetails[0].OfficeStartTime;
        this.formInput.SalaryDay=this.ProfileDetails[0].SalaryDay;
        this.formInput.Address=this.ProfileDetails[0].Address;
        this.formInput.ProfileImage=this.ProfileDetails[0].ProfileImageURl;
        this.ProfileImageURl=this.ProfileDetails[0].ProfileImageURl;
        this.ProfileURl=  this.ProfileImageURl;
        this.formInput.ReferralCode=this.ProfileDetails[0].ReferralCode;
        this.formInput.Organization=this.ProfileDetails[0].Organization;
        this.formInput.State=this.ProfileDetails[0].State;
        this.formInput.City=this.ProfileDetails[0].City;
        this.formInput.Country=this.ProfileDetails[0].Country;
        this.formInput.FacebookURL=this.ProfileDetails[0].FacebookURL;
        this.formInput.CompanyBio=this.ProfileDetails[0].CompanyBio;
        this.formInput.LinkedInURL=this.ProfileDetails[0].LinkedInURL;
        this.formInput.WebsiteURL=this.ProfileDetails[0].WebsiteURL;
          this.formInput.InstagramURL=this.ProfileDetails[0].InstagramURL;
          this.formInput.TwitterURL=this.ProfileDetails[0].TwitterURL;
          this.formInput.Youtube=this.ProfileDetails[0].Youtube;
          this.formInput.PinCode=this.ProfileDetails[0].PinCode;
          this.formInput.Designation=this.ProfileDetails[0].Designation;
          this.OrganizationName=this.formInput.Organization;
          this.AdminName=this.formInput.FirstName + " "+ this.formInput.LastName;
          this.formInput.AllowNotification=this.ProfileDetails[0].AllowNotification;
          this.DateofJoining=this.ProfileDetails[0].DateOfJoining;
          this.selectedStateId=this.ProfileDetails[0].StateID;
          this.OnStateSelect(this.selectedStateId);
          this.selectedCityId=this.ProfileDetails[0].CityID;

      }
    }, (error) => {
        this.globalToastService.error(error); console.log(error);
      });

    }
   


  UpdateProfile()
  {
    // if (this.formInput.Organization == "") {
    //   this.globalToastService.warning("Please Enter Organization Name");
    //   this.spinnerService.hide();
    //   return false;
    // }  
    // else
     if (this.formInput.FirstName == ""||this.formInput.FirstName == null) {
      this.globalToastService.warning("Please Enter First Name");
      this.spinnerService.hide();
      return false;
    }  
    else if (this.formInput.Email == ""||this.formInput.Email == null) {
      this.globalToastService.warning("Please Enter Email ID");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.MobileNumber == ""||this.formInput.MobileNumber == null) {
      this.globalToastService.warning("Please Enter Mobile Number");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.SalaryDay == ""||this.formInput.SalaryDay == null||this.formInput.SalaryDay ==undefined ||this.formInput.SalaryDay ==0) {
      this.globalToastService.warning("Please Enter Salary Day");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.Address == ""||this.formInput.Address==null) {
      this.globalToastService.warning("Please Enter Address");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.State =="") {
      this.globalToastService.warning("Please Enter State");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.City=="") {
      this.globalToastService.warning("Please Enter City");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.OfficeStartTime == ""||this.formInput.OfficeStartTime==null) {
      this.globalToastService.warning("Please Select Office StartTime");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.OfficeEndTime == ""||this.formInput.OfficeEndTime==null) {
      this.globalToastService.warning("Please Select Office EndTime");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.OfficeStartTime == this.formInput.OfficeEndTime) {
      this.globalToastService.warning("Office Start time & End time Cannot be same");
      this.spinnerService.hide();
      return false;
    }
    else{
      this.formInput.CityID=this.selectedCityId;
      this.formInput.StateID=this.selectedStateId;
      // const digitCount: number = this.formInput.MobileNumber.toString().length;
      // if(digitCount<10)    {
      //   this.globalToastService.warning("Mobile number must have at least 10 digits");
      //   return false;
      // }
      // else{
        // const pinCount: number = this.formInput.PinCode.toString().length;
        //   if(pinCount<6)    {
        //     this.globalToastService.warning("Pincode must have 6 digits");
        //     return false;
        //   }else{
      this.spinnerService.show();
      this.formInput.ProfileImageURl=this.ProfileImageURl;
      this._commonservice.ApiUsingPost("Portal/UpdateMyProfile",this.formInput).subscribe((data:any) => {
        if(data.Status==true){
          this.spinnerService.hide();
          this.globalToastService.success(data.Message);
            this._router.navigate(['/appdashboard']);
            return true;
         }
         else{
          this.spinnerService.hide();
          this.globalToastService.warning(data.Message);
            return false;
         }
      
      }, (error: any) => {this.spinnerService.hide();
        this.globalToastService.error(error.message);
       return false;
      }
      );
    // }
  // }
      return true;
    }
  }

  OnStateSelect(Val:any)
  {
    this.ApiURL="Admin/GetCityList?StateID="+Val+"&Keyword=";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.CityList = data.List, (error) => {
    });
  }

  OnStateChange(event:any)
  {
    if(event!=undefined&&event!=null)
    {
      this.spinnerService.show();
      this.selectedStateId=event.Value;
      this.formInput.State=event.Text;
      this.ApiURL="Admin/GetCityList?StateID="+event.Value+"&Keyword=";
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.CityList = data.List, (error) => {
         console.log(error);this.spinnerService.hide();
      });
      this.spinnerService.hide();
    }
    else{
      this.selectedCityId='';
    }
   
  }
  OnCityChange(event:any)
  {
    if(event!=undefined&&event!=null)
    {
    this.selectedCityId=event.Value;
    this.formInput.City=event.Text;
    }
  }
  validatepincode(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.globalToastService.warning("Please Enter Valid Input");
  // this.formInput.PinCode='';
  this.formInput.PinCode.clear();
  }
}
  validateEmail(inputval:any) {
    const input = inputval;
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input);
  
    if (!isValidEmail ) {
     return "Fail";
    }
  
    return "Ok";;
  }
  }
