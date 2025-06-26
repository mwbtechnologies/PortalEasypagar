import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';  // agm-direction
import { MapsAPILoader } from '@agm/core';
import { NgForm } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

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
  // FacebookURL:any;
  // CompanyBio:any;
  // LinkedInURL:any;
  // WebsiteURL:any;
  // InstagramURL:any;
  // TwitterURL:any;
  // Youtube:any;
  // Designation:any;
  // Country:any;
  AllowNotification:any;
  OfficeStartTime:any;
  OfficeEndTime:any;
  Financialyearfrom:any;
  Financialyearto:any;
}
export interface  Month
{
  id: any;
  name: any;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  months: any = [];
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
    AdminName:any;selectedstartmonth:any;selectedendmonth:any;
    DateofJoining:any;MaxSalaryDay:any; ProfileImageURl:any;
    ProfileURl: any; yearSettings :IDropdownSettings = {}
  file: any;ViewPermission:any;AddPermission:any;EditPermission:any;DeletePermission:any;
  compolength: any;  latitude: any;
  longitude: any;
  curlatitude: any;
  curlongitude: any;
  geocoder:any;
  map: any;
    marker: any;
    selectedFiles: File | null = null;

    constructor(public mapsApiLoader: MapsAPILoader,private zone: NgZone,private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,private globalToastService:ToastrService,private dialog:MatDialog)
    {
       this.isSubmit=false;
      this.yearSettings = {
        singleSelection: true,
        idField: 'id',
        textField: 'name',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      }
      this.mapsApiLoader.load().then(() => {
        this.geocoder = new google.maps.Geocoder();
      });
      this.zone = zone;
      }
    ngOnInit(): void {
    this.AdminID=localStorage.getItem("AdminID");
    this.months = this.getMonths();
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
        AllowNotification:false,
        Financialyearfrom:1,
        Financialyearto:12
      }
     if(this.AdminID!=null && this.AdminID!=0 && this.AdminID!=undefined)
     {
      this.GetProfileDetails();
      this.formInput.AdminID=this.AdminID;
     }
    //  this._commonservice.ApiUsingGetWithOneParam("Admin/GetStateList").subscribe((data) => this.StateList = data.List, (error) => {
    //   this.globalToastService.error(error); console.log(error);
    // });
    //  this._commonservice.ApiUsingGetWithOneParam("Account/GetSalaryDay").subscribe((data) => this.MaxSalaryDay = data.Day, (error) => {
    //   this.globalToastService.error(error); console.log(error);
    // });
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
   this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
  //  this.MaxSalaryDay=30;
    }

//     checksalaryday(Val:any){
// if(Val>30)
// {
//   // this.globalToastService.warning("Salary Day should be less than 31");
//   this.ShowToast("Salary Day should be less than 31","warning")
//   this.formInput.SalaryDay=30;this.MaxSalaryDay=1
// }
// else if(Val<1)
//   {
//     // this.globalToastService.warning("Salary Day should be greater than 0");
//     this.ShowToast("Salary Day should be greater than 0","warning")
//     this.formInput.SalaryDay=1;this.MaxSalaryDay=30
//   }
//   else if(Val==1)
//     {
      
//       this.formInput.SalaryDay=1;this.MaxSalaryDay=30;
//     }
// else{
// var val=Val-1;
// this.MaxSalaryDay=val;
// }
// }

checkfinancialyear()
{
if(this.formInput.Financialyearfrom>12 )
{
  // this.globalToastService.warning("Starting Month should be less than 12");
  this.ShowToast("Starting Month should be less than 12","warning")
  this.formInput.Financialyearfrom=1;
}
else if(this.formInput.Financialyearto>12 )
  {
    // this.globalToastService.warning("End Month should be less than 12");
    this.ShowToast("End Month should be less than 12","warning")
    this.formInput.Financialyearto=12;
  }
 else if(this.formInput.Financialyearfrom== this.formInput.Financialyearto)
    {
      // this.globalToastService.warning("Start and End Month Cannot not be same");
      this.ShowToast("Start and End Month Cannot not be same","warning")
      this.formInput.Financialyearfrom=1;this.formInput.Financialyearto=12
    }
    else {
      // Check if there is a 12-month gap
      let gap = (this.formInput.Financialyearto - this.formInput.Financialyearfrom + 12) % 12;
  
      if (gap !== 11) { // Gap should be exactly 11 months (e.g., April-March, Jan-Dec)
        // this.globalToastService.warning("Financial Year should have a 12-month duration");
        this.ShowToast("Financial Year should have a 12-month duration","warning")
        this.formInput.Financialyearfrom = 1;
        this.formInput.Financialyearto = 12;
      }
    }
}


getMonths(): Month[] {
  return [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' }
  ];
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
      // this.globalToastService.warning("Please Select valid image File");
      this.ShowToast("Please Select valid image File","warning")
    }



    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      
        if (!allowedTypes.includes(file.type)) {
            this.selectedFiles = null;

            this.ShowToast(`File "${file.name}" is not a valid image. Only JPG, JPEG, and PNG are allowed.`, 'warning');
            return; // Stop processing further
        }

        

        this.selectedFiles = file;
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
        // this.formInput.CityID=this.ProfileDetails[0].CityID;
        // this.formInput.StateID=this.ProfileDetails[0].StateID;
        this.formInput.OfficeEndTime=this.ProfileDetails[0].OfficeEndTime;
        this.formInput.OfficeStartTime=this.ProfileDetails[0].OfficeStartTime;
        this.formInput.SalaryDay=this.ProfileDetails[0].SalaryDay;
        if (this.ProfileDetails.length > 0 && this.ProfileDetails[0].SalaryDay) {
          this.MaxSalaryDay = this.formInput.SalaryDay == 1 ? 30 : this.formInput.SalaryDay -1
      }
        this.formInput.Address=this.ProfileDetails[0].Address;
        this.formInput.ProfileImage=this.ProfileDetails[0].ProfileImageURl;
        this.ProfileImageURl=this.ProfileDetails[0].ProfileImageURl;
        this.ProfileURl=  this.ProfileImageURl;
        this.formInput.ReferralCode=this.ProfileDetails[0].ReferralCode;
        this.formInput.Organization=this.ProfileDetails[0].Organization;
        this.formInput.State=this.ProfileDetails[0].State;
        this.formInput.City=this.ProfileDetails[0].City;
        // this.formInput.Country=this.ProfileDetails[0].Country;
        // this.formInput.FacebookURL=this.ProfileDetails[0].FacebookURL;
        // this.formInput.CompanyBio=this.ProfileDetails[0].CompanyBio;
        // this.formInput.LinkedInURL=this.ProfileDetails[0].LinkedInURL;
        // this.formInput.WebsiteURL=this.ProfileDetails[0].WebsiteURL;
        //   this.formInput.InstagramURL=this.ProfileDetails[0].InstagramURL;
        //   this.formInput.TwitterURL=this.ProfileDetails[0].TwitterURL;
        //   this.formInput.Youtube=this.ProfileDetails[0].Youtube;
        //   this.formInput.PinCode=this.ProfileDetails[0].PinCode;
        //   this.formInput.Designation=this.ProfileDetails[0].Designation;
          this.OrganizationName=this.formInput.Organization;
          this.AdminName=this.formInput.FirstName + " "+ this.formInput.LastName;
          // this.formInput.AllowNotification=this.ProfileDetails[0].AllowNotification;
          // this.DateofJoining=this.ProfileDetails[0].DateOfJoining;
          // this.selectedStateId=this.ProfileDetails[0].StateID;
          // // this.OnStateSelect(this.selectedStateId);
          // this.selectedCityId=this.ProfileDetails[0].CityID;
          this.formInput.Financialyearfrom=this.ProfileDetails[0].Financialyearfrom;
          this.formInput.Financialyearto=this.ProfileDetails[0].Financialyearto;

      }
    }, (error) => {
        // this.globalToastService.error(error); 
        this.ShowToast(error,"error")
        console.log(error);
      });

    }
   


  UpdateProfile()
  {
    let gap = (this.formInput.Financialyearto - this.formInput.Financialyearfrom + 12) % 12;
  
     if (this.formInput.FirstName == ""||this.formInput.FirstName == null) {
      // this.globalToastService.warning("Please Enter First Name");
      this.ShowToast("Please Enter First Name","warning")

      return false;
    }  
    else if (this.formInput.Email == ""||this.formInput.Email == null) {
      // this.globalToastService.warning("Please Enter Email ID");
      this.ShowToast("Please Enter Email ID","warning")
  
      return false;
    }
    else if (this.formInput.MobileNumber == ""||this.formInput.MobileNumber == null) {
      // this.globalToastService.warning("Please Enter Mobile Number");
      this.ShowToast("Please Enter Mobile Number","warning")
  
      return false;
    }
    else if (this.formInput.SalaryDay == ""||this.formInput.SalaryDay == null||this.formInput.SalaryDay ==undefined ||this.formInput.SalaryDay ==0) {
      // this.globalToastService.warning("Please Enter Salary Day");
      this.ShowToast("Please Enter Salary Day","warning")
   
      return false;
    }
    else if (this.formInput.Address == ""||this.formInput.Address==null) {
      // this.globalToastService.warning("Please Enter Address");
      this.ShowToast("Please Enter Address","warning")
  
      return false;
    }
    else if (this.formInput.State =="") {
      // this.globalToastService.warning("Please Enter State");
      this.ShowToast("Please Enter State","warning")

      return false;
    }
    else if (this.formInput.City=="") {
      // this.globalToastService.warning("Please Enter City");
      this.ShowToast("Please Enter City","warning")
 
      return false;
    }
    else if (this.formInput.OfficeStartTime == ""||this.formInput.OfficeStartTime==null) {
      // this.globalToastService.warning("Please Select Office StartTime");
      this.ShowToast("Please Select Office StartTime","warning")
   
      return false;
    }
    else if (this.formInput.OfficeEndTime == ""||this.formInput.OfficeEndTime==null) {
      // this.globalToastService.warning("Please Select Office EndTime");
      this.ShowToast("Please Select Office EndTime","warning")
 
      return false;
    }
    else if (this.formInput.OfficeStartTime == this.formInput.OfficeEndTime) {
      // this.globalToastService.warning("Office Start time & End time Cannot be same");
      this.ShowToast("Office Start time & End time Cannot be same","warning")
   
      return false;
    }
    else if (this.formInput.Financialyearfrom == "" || this.formInput.Financialyearfrom==0||this.formInput.Financialyearfrom==null || this.formInput.Financialyearfrom==undefined) {
      // this.globalToastService.warning("Please select financial start month");
      this.ShowToast("Please select financial start month","warning")
     
      return false;
    }
    else if (this.formInput.Financialyearto == "" || this.formInput.Financialyearto==0||this.formInput.Financialyearto==null || this.formInput.Financialyearto==undefined) {
      // this.globalToastService.warning("Please select financial end month");
      this.ShowToast("Please select financial end month","warning")
    
      return false;
    }
    else if (this.formInput.Financialyearfrom == this.formInput.Financialyearto) {
      // this.globalToastService.warning("Start Month and End Month Cannot be same");
      this.ShowToast("Start Month and End Month Cannot be same","warning")

      return false;
    }
    else if (gap !== 11) { // Gap should be exactly 11 months (e.g., April-March, Jan-Dec)
      // this.globalToastService.warning("Financial Year should have a 12-month duration");
      this.ShowToast("Financial Year should have a 12-month duration","warning")
  
      return false;
    }
    else{  
      this.formInput.CityID=this.selectedCityId;
      this.formInput.StateID=this.selectedStateId;
      const digitCount: number = this.formInput.MobileNumber.toString().length;
      if(digitCount<10)    {
        this.globalToastService.warning("Mobile number must have at least 10 digits");
        return false;
      }
      else
      {
        // const pinCount: number = this.formInput.PinCode.toString().length;
        //   if(pinCount<6)    {
        //     this.globalToastService.warning("Pincode must have 6 digits");
        //     return false;
        //   }
          // else{
      this.spinnerService.show();
      this.formInput.ProfileImageURl=this.ProfileImageURl;
          console.log(this.formInput, "profile");
          if (this.selectedFiles == null) {
              this._commonservice.ApiUsingPost("Portal/UpdateMyProfile", this.formInput).subscribe((data: any) => {
                  if (data.Status == true) {
                      this.spinnerService.hide();
                      // this.globalToastService.success(data.Message);
                      this.ShowToast(data.Message, "success");
                      this.GetProfileDetails();
                      // window.location.reload
                      // this._router.navigate(["auth/signin"]);
                      return true;
                  }
                  else {
                      this.spinnerService.hide();
                      // this.globalToastService.warning(data.Message);
                      this.ShowToast(data.Message, "warning")
                      return false;
                  }

              }, (error: any) => {
                  this.spinnerService.hide();
                  // this.globalToastService.error(error.message);
                  this.ShowToast("Something went wrong. Please try again later..!", "error")
                  return false;
              }
              );
          }
          else {
              this.uploadFile();
          }
      
     
    }
  }
      return true;
    
  }
    uploadFile() {
     

        const reader = new FileReader();

        reader.onload = (event: any) => {
           // this.formInput.ProfileImageURl = event.target.result;
            debugger;

            const fData: FormData = new FormData();
            console.log("form data");
            console.log(fData);

            console.log("file");
            console.log(this.selectedFiles);


            fData.append('formdata', JSON.stringify(this.formInput)); // use your actual form data object
            fData.append('FileType', 'Image');
            fData.append('ImageType', 'Profile');
            fData.append('File', this.selectedFiles as File, this.selectedFiles!.name);

            this._commonservice.ApiUsingPostMultipart('Admin/FileUpload', fData).subscribe(data => {
                debugger;
                this.ProfileImageURl = data.NewUrl;
                this.formInput.ProfileImageURl = data.NewUrl;
                this._commonservice.ApiUsingPost("Portal/UpdateMyProfile", this.formInput).subscribe((data: any) => {
                    debugger;
                    if (data.Status == true) {
                        this.spinnerService.hide();
                        // this.globalToastService.success(data.Message);
                        this.ShowToast(data.Message, "success");
                        this.GetProfileDetails();
                        // window.location.reload
                        // this._router.navigate(["auth/signin"]);
                        return true;
                    }
                    else {
                        this.spinnerService.hide();
                        // this.globalToastService.warning(data.Message);
                        this.ShowToast(data.Message, "warning")
                        return false;
                    }

                }, (error: any) => {
                    this.spinnerService.hide();
                    // this.globalToastService.error(error.message);
                    this.ShowToast("Something went wrong. Please try again later..!", "error")
                    return false;
                }
                );
            }, error => {
                this.spinnerService.hide();
                this.ShowToast("Something went wrong. Please try again later..!", "error")
             
            });
        };

        reader.readAsDataURL(this.selectedFiles!);
    }


  onMonthChange(val:any)
  {
if(val==1){
  this.formInput.Financialyearto=12;
}
else if(val==2){
  this.formInput.Financialyearto=1;
}
else if(val==3){
  this.formInput.Financialyearto=2;
}
else if(val==4){
  this.formInput.Financialyearto=3;
}
else if(val==5){
  this.formInput.Financialyearto=4;
}
else if(val==6){
  this.formInput.Financialyearto=5;
}
else if(val==7){
  this.formInput.Financialyearto=6;
}
else if(val==8){
  this.formInput.Financialyearto=7;
}
else if(val==9){
  this.formInput.Financialyearto=8;
}
else if(val==10){
  this.formInput.Financialyearto=9;
}
else if(val==11){
  this.formInput.Financialyearto=10;
}
else {
  this.formInput.Financialyearto=11;
}
  }
  OnStateSelect(Val:any)
  {
    this.ApiURL="Admin/GetCityList?StateID="+Val+"&Keyword=";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.CityList = data.List, (error) => {
    });
  }

  validateSalaryDay(event: any) {
    let value = event.target.value;

    // Remove non-numeric characters
    value = value.replace(/\D/g, '');

    // Limit input to 2 digits
    if (value.length > 2) {
        value = value.slice(0, 2);
    }

    // Restrict to numbers between 1 and 30
    let numericValue = parseInt(value, 10);
    if (numericValue > 30) {
        numericValue = 30;
    } else if (numericValue < 1 && value !== '') {
        numericValue = 1;
    }

    // Update input field value
    event.target.value = numericValue;
    this.formInput.SalaryDay = numericValue;

    // Calculate End Date (Start Date + 30)
    this.MaxSalaryDay =  this.formInput.SalaryDay == 1 ? 30 : this.formInput.SalaryDay -1
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
  // this.globalToastService.warning("Please Enter Valid Input");
  this.ShowToast("Please Enter Valid Input","warning")
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

  Onselectmonth(val:any)
  {

  }
  Ondisselectmonth(val:any)
  {

  }

  // public setCurrentLocation() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.curlatitude = position.coords.latitude;
  //       this.curlongitude = position.coords.longitude;
  //       this.formInput.Latitude = position.coords.latitude;
  //       this.formInput.Longitude = position.coords.longitude;
  //       if( this.formInput.Latitude==null || this.formInput.Latitude==undefined)
  //       {
  //          this.formInput.Latitude=15.35558737035252;
  //       }
  //       if(this.formInput.Longitude==null ||this.formInput.Longitude==undefined)
  //       {
  //         this.formInput.Longitude=75.13571665276675;
  //       }        
  //      this.getAddress( this.formInput.Latitude, this.formInput.Longitude);
  //     });
  //   }
  // } getAddress(latitude:any, longitude:any) {
  //   this.geocoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.compolength=0;
  //         this.compolength=results[0].address_components.length;
  //         if(this.compolength>0)
  //           {
  //             this.formInput.State=results[0].address_components[this.compolength-3].long_name;
  //             this.formInput.City=results[0].address_components[this.compolength-4].long_name;
  
  //           }
          
  //         this.formInput.Address = results[0].formatted_address;
  //         // this.ApiURL="Admin/GetStateCity?Address="+ this.formInput.Address;
  //         // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
  //         //   this.formInput.State=sec.state;
  //         //   this.formInput.City=sec.city;
  //         // }, (error) => {
            
  //         // });
  //       } else {
  //         console.log('No results found');
  //       }
  //     } else {
  //       console.log('Geocoder failed due to: ' + status);
  //     }
  
  //   });
  // }
  ngAfterViewInit() {
    this.initializeMap();
  }
  initializeMap() {
    const defaultLocation = { lat: 15.35558737035252, lng: 75.13571665276675 };

    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, {
        center: defaultLocation,
        zoom: 8
      });
    
      this.marker = new google.maps.Marker({
        map: this.map,
        position: defaultLocation,
        draggable: true
      });
    }
    
    const input = document.getElementById('searchInput') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', this.map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        alert('No details available for input: ' + place.name);
        return;
      }

      this.setLocation(place.geometry.location.lat(), place.geometry.location.lng());
      this.formInput.Address = place.formatted_address || '';
    });

    // Listen for map clicks
    this.map.addListener('click', (event: any) => {
      this.setLocation(event.latLng.lat(), event.latLng.lng());
      this.getAddress(event.latLng.lat(), event.latLng.lng());
    });

    // Listen for marker drag
    this.marker.addListener('dragend', (event: any) => {
      this.setLocation(event.latLng.lat(), event.latLng.lng());
      this.getAddress(event.latLng.lat(), event.latLng.lng());
    });
  }

  setLocation(lat: number, lng: number) {
    this.formInput.Latitude = lat;
    this.formInput.Longitude = lng;

    const latlng = new google.maps.LatLng(lat, lng);
    this.map.setCenter(latlng);
    this.marker.setPosition(latlng);
  }

  getAddress(latitude: number, longitude: number) {
    this.geocoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.formInput.Address = results[0].formatted_address;

          const components = results[0].address_components;
          if (components.length > 0) {
            this.formInput.State = components[components.length - 3]?.long_name || '';
            this.formInput.City = components[components.length - 4]?.long_name || '';
          }
        } else {
          console.log('No address found');
        }
      } else {
        console.log('Geocoder failed: ' + status);
      }
    });
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
