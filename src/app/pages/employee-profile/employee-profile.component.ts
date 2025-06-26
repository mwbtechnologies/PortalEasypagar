import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';  // agm-direction
import { MapsAPILoader } from '@agm/core';
import { NgForm } from '@angular/forms';

export class FormInput{
  Address:any;
  AdminID:any;
  State:any;
  City:any;
  MapAddress:any;
  MobileNumber:any;
  Email:any;
  Organization:any;
  LastName:any;
  FirstName:any;
  Gender:any;
  Age:any;
  DOB:any;
  Education:any;
  RoleID:any;
  EmergencyNumber:any;
  EmpID:any;
  Key:any;
}

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  ShowPersonal=false;
  ShowOrg=true;
    Length:any;
    UserID:any;
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
  CurrentDate: any;
  DOB: any;
  AdminID: any;
    constructor(public mapsApiLoader: MapsAPILoader,private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,private globalToastService:ToastrService)
    { this.isSubmit=false;
      }
    ngOnInit(): void {
    this.UserID=localStorage.getItem("UserID");
    this.AdminID=localStorage.getItem("AdminID");
    this.formInput={
      EmpID:0,
    Address:'',
    AdminID:'',
    State:'',
    City:'',
    MapAddress:'',
    Email:'',
    Organization:'',
    LastName:'',
    FirstName:'',
    Gender:'',
    Age:'',
    DOB:'',
    Education:'',
    RoleID:'',
    EmergencyNumber:'',
    Key:'en'
      }
     if(this.UserID!=null && this.UserID!=0 && this.UserID!=undefined)
     {
      this.GetProfileDetails();
      this.formInput.EmpID=this.UserID;
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

CheckDOB(date:any)
{
 this.ApiURL="Admin/CheckDate?UserDate="+date;
 this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
   if(data.Status==true){
    this.spinnerService.hide();
       return true;
    }
    else{
      this.spinnerService.hide();
      this.globalToastService.warning("Date should be greater than Current Date");
      this.formInput.DOB='';
     
       return false;
    }
 
 }, (error: any) => {
  this.spinnerService.hide();
  this.globalToastService.warning(error.message);
  return false;
 }
 );
}
validategardiannumber(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.globalToastService.warning("Please Enter Valid Input")
  {
    this.formInput.EmergencyNumber.clear();
  }
  }
  else{
    if((this.formInput.EmergencyNumber==""||this.formInput.EmergencyNumber==undefined||this.formInput.EmergencyNumber==null )&& (event.key!="6"
    &&event.key!="7"&&event.key!="8"&&event.key!="9"))
    {
      this.globalToastService.warning("First digit should contain numbers between 6 to 9");
      this.formInput.EmergencyNumber.clear();
    }
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
      this.ApiURL="Employee/GetUserProfileDetails?ID="+this.UserID+"&IsEmail=false";
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => 
     { 
      if(data.Status==true)
      {
        this.ProfileDetails = data.List;
        this.formInput.EmpID=this.ProfileDetails[0].EmpID;
        this.formInput.FirstName=this.ProfileDetails[0].FirstName;
        this.formInput.LastName=this.ProfileDetails[0].LastName;
        this.formInput.MobileNumber=this.ProfileDetails[0].MobileNumber;
        this.formInput.Email=this.ProfileDetails[0].Email;
        this.formInput.Address=this.ProfileDetails[0].Address;
        this.formInput.State=this.ProfileDetails[0].State;
        this.formInput.City=this.ProfileDetails[0].City;
        this.formInput.Age=this.ProfileDetails[0].Age;
        this.formInput.Gender=this.ProfileDetails[0].Gender;
        this.formInput.DOB=this.ProfileDetails[0].DOB;
        this.formInput.Education=this.ProfileDetails[0].Education;
        this.formInput.AdminID=this.ProfileDetails[0].AdminID;
        localStorage.setItem('OrgName', data.List[0].Organization)
      }
    }, (error) => {
        this.globalToastService.error(error); console.log(error);
      });

    }
   
    CalculateAge(date:Date): void
    {
        if(date){
         this.CurrentDate=new Date();
         const dateString = date+'T10:30:00'; // Assuming the string is in ISO 8601 format

          const dateObj = new Date(dateString);
         this.DOB = dateObj;
           var timeDiff = Math.abs(this.CurrentDate - this.DOB);
           this.formInput.Age = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
       }
   }

  UpdateProfile()
  {
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
    else if (this.formInput.Address == ""||this.formInput.Address==null) {
      this.globalToastService.warning("Please Enter Address");
      this.spinnerService.hide();
      return false;
    }
    else{ 
      this.spinnerService.show();
      this.formInput.ProfileImageURl=this.ProfileImageURl;
      this._commonservice.ApiUsingPost("Employee/UpdateMyProfile",this.formInput).subscribe((data:any) => {
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

