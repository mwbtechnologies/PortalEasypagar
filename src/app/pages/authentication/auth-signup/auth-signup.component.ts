import { Component, ViewChild, EventEmitter, NgZone,Output, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MapsAPILoader } from '@agm/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';



declare var google: any;
export class FormInput{
  LogoPath:any;
  PlanType:any;
  OfficeEndTime:any;
  OfficeStartTime:any;
  AppVersion:any;
  SalaryDay:any;
  Address:any;
  AdminID:any;
  State:any;
  City:any;
  StateID:any;
  CityID:any;
  ConfirmPassword:any;
  Password:any;
  MapAddress:any;
  MobileNumber:any;
  Email:any;
  Organization:any;
  LastName:any;
  FirstName:any;
  ReferralCode:any;
  ProfileImage:any;
 
}
@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.css']
})
export class AuthSignupComponent implements OnInit {

  @Input() adressType: string|any;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;

  autocompleteInput: string|any;
  queryWait: boolean|any;



  public lat = 15.3583616;
  public lng = 75.1403008;
  // private geoCoder:any;
  geocoder:any;
  public origin: any;
  latitude: any;
  longitude: any;
  curlatitude: any;
  curlongitude: any;
  GetLocations:any;zoom:any
  source: any;destination:any;
  destiny: any;
  Length:any;
  searchAddress: any;


  options: any = {
    componentRestrictions: { country: 'IN' }
  } 
  @ViewChild('placesRef', { static: false }) placesRef!: GooglePlaceDirective;
  @ViewChild('search')   public searchElementRef: ElementRef | any;
  formInput: FormInput | any;
  public isSubmit: boolean | any;StateList:any;
  selectedStateId: string[] | any;
  CityList:any;ApiURL:any;selectedCityId:string[] | any;
  passwordinput:any;confirmpasswordinput:any;MaxSalaryDay:any;

  constructor(public mapsApiLoader: MapsAPILoader, private zone: NgZone,private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,private globalToastService:ToastrService)
  { this.isSubmit=false;
    this.zone = zone;
    this.zoom = 15;
    //this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });}
    formattedAddress = '';
    formattedAddress1 = '';
    formattedAddress2 = '';
  ngOnInit(): void {
  //  this._router.navigate(['auth/signin']);
    this.setCurrentLocation();
  
    this.formInput = {  
      LogoPath:'',
      OfficeEndTime:'',
      OfficeStartTime:'',
      AppVersion:'1.0.0',
      SalaryDay:'',
      Address:'',
      AdminID:'0',
      State:'',
      City:'',
      StateID:0,
      CityID:0,
      ConfirmPassword:'',
      Password:'',
      MapAddress:'',
      MobileNumber:'',
      Email:'',
      Organization:'',
      LastName:'',
      FirstName:'',
      ReferralCode:'',
      ProfileImage:'',
      PlanType:'Standard'
    }
    this.passwordinput="password";this.confirmpasswordinput="password";
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetStateList").subscribe((data) => this.StateList = data.List, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
    this._commonservice.ApiUsingGetWithOneParam("Account/GetSalaryDay").subscribe((data) => this.MaxSalaryDay = data.Day, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
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

  searchAddressOnMap() {
    this.mapsApiLoader.load().then(() => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: this.searchAddress }, (results:any, status:any) => {
        if (status === google.maps.GeocoderStatus.OK) {
          // Update map center coordinates and set the origin and destination
          this.lat = results[0].geometry.location.lat(); // + .0000721
          this.lng = results[0].geometry.location.lng(); //- .0025
          this.origin = { lat: this.lat, lng: this.lng };
          this.destination = { lat: this.lat, lng: this.lng };
       
          this.getAddress(this.lat, this.lng);
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    });
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.curlatitude = position.coords.latitude;
        this.curlongitude = position.coords.longitude;
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        if(this.lat==null ||this.lat==undefined)
        {
          this.lat=15.3583616;
        }
        if(this.lng==null ||this.lng==undefined)
        {
          this.lng=75.1403008;
        }
        
       this.getAddress(this.lat, this.lng);
      });
    }
  }
  getAddress(latitude:any, longitude:any) {
    this.geocoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      if (status === 'OK') {
        if (results[0]) {
          // this.formInput.Address = results[0].formatted_address;
          this.Length=results[0].address_components.length;
          this.formInput.State=results[0].address_components[this.Length-3].long_name;
          this.formInput.City=results[0].address_components[this.Length-6].long_name;
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
  
    });
  }
  getDirection() {
    this.origin = { lat: this.latitude, lng: this.longitude };
    // this.destination = { lat: this.curlatitude, lng: this.curlongitude };
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
submit()
{

  if (this.formInput.Organization == "") {
    this.globalToastService.warning("Please Enter Organization Name");
    this.spinnerService.hide();
    return false;
  }  
  else if (this.formInput.FirstName == ""||this.formInput.FirstName == null) {
    this.globalToastService.warning("Please Enter FirstName");
    this.spinnerService.hide();
    return false;
  }  
  else if (this.formInput.Email == ""||this.formInput.Email == null) {
    this.globalToastService.warning("Please Enter EmailID");
    this.spinnerService.hide();
    return false;
  }
  else if (this.formInput.MobileNumber == ""||this.formInput.MobileNumber == null) {
    this.globalToastService.warning("Please Enter MobileNumber");
    this.spinnerService.hide();
    return false;
  }
  else if (this.formInput.Address == ""||this.formInput.Address==null) {
    this.globalToastService.warning("Please Enter Address");
    this.spinnerService.hide();
    return false;
  }
  else if (this.selectedStateId==""||this.selectedStateId==null ||this.selectedStateId==undefined ||this.selectedStateId==0) {
    this.globalToastService.warning("Please Select State");
    this.spinnerService.hide();
    return false;
  }
  else if (this.selectedCityId==""||this.selectedCityId==null ||this.selectedCityId==undefined ||this.selectedCityId==0) {
    this.globalToastService.warning("Please Select City");
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
    this.globalToastService.warning("Office Start and End Time Cannot be Same");
    this.spinnerService.hide();
    return false;
  }
  else if (this.formInput.SalaryDay == ""||this.formInput.SalaryDay==null) {
    this.globalToastService.warning("Please Enter SalaryDay");
    this.spinnerService.hide();
    return false;
  }
  else if (this.formInput.Password == ""||this.formInput.Password==null) {
    this.globalToastService.warning("Please Enter Password");
    this.spinnerService.hide();
    return false;
  }
  else if (this.formInput.ConfirmPassword == ""||this.formInput.ConfirmPassword==null) {
    this.globalToastService.warning("Please Enter ConfirmPassword");
    this.spinnerService.hide();
    return false;
  }
  else if(this.formInput.ConfirmPassword!=this.formInput.Password) {
    this.globalToastService.warning("Password & Confirm Password Don't Match");
    this.spinnerService.hide();
    return false;
  }
  else{
    const digitCount: number = this.formInput.MobileNumber.toString().length;
    var mail=this.validateEmail(this.formInput.Email);
    if(digitCount<10)    {
      this.globalToastService.warning("Mobile number must have at least 10 digits");
      return false;
    }else{
      if(mail!="Ok") 
      {this.globalToastService.warning("Please Enter Valid Email ID"); 
      return false; }
      else
      {
        const passcount: number = this.formInput.Password.toString().length;
        if(passcount<6)    {
          this.globalToastService.warning("Password must have at least 6 Characters");
          return false;
        }else{
      this.spinnerService.show();
  this.formInput.StateID=this.selectedStateId;
    this.formInput.CityID=this.selectedCityId;
    this.formInput.ConfirmPassword =this.formInput.Password;
    this._commonservice.ApiUsingPost("Account/PortalSignUp",this.formInput).subscribe((data:any) => {
      if(data.Status==true){
        this.spinnerService.hide();
        this.globalToastService.success("You have successfully registered to EPagar App");
        this._router.navigate(['auth/signin']);
          // window.location.reload();
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
    }}
  }
  
    return true;
  }
}

validatemobilenumber(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.globalToastService.warning("Please Enter Valid Input");
  this.formInput.MobileNumber.clear();
  }
  else{
    if((this.formInput.MobileNumber==""||this.formInput.MobileNumber==undefined||this.formInput.MobileNumber==null )&& (event.key!="6"
    &&event.key!="7"&&event.key!="8"&&event.key!="9"))
    {
      this.globalToastService.warning("First digit should contain numbers between 6 to 9");
      this.formInput.MobileNumber.clear();
     
    }
  }
}


public handleAddressChange(address: any) {
  this.formattedAddress = address.formatted_address;
  
  this.findLocation(this.formattedAddress);


}
public handleAddressChanges(places: any) {
  this.formattedAddress1 = places.formatted_address;

  this.findLocationDest(this.formattedAddress1);

}
findLocationDest(address:any) {
  this.destiny = address;
  if (!this.geocoder) this.geocoder = new google.maps.Geocoder()
  this.geocoder.geocode({
    'address': address
  }, (results:any, status:any) => {
    console.log(results);
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0].geometry.location) {
        this.curlatitude= results[0].geometry.location.lat();
        this.curlongitude = results[0].geometry.location.lng();

        this.getDirection();
       
       //this.setCurrentLocation();
        
       // this.location.viewport = results[0].geometry.viewport;
      }
      
    //  this.map.triggerResize()
    } else {
      alert("Sorry, this search produced no results.");
    }
  })
}

checksalaryday(Val:any)
{
if(Val>this.MaxSalaryDay)
{
  this.globalToastService.warning("Salary Day should be less than " +this.MaxSalaryDay);
  this.formInput.SalaryDay='';
}
if(Val<=0)
{
  this.globalToastService.warning("Salary Day should be greater than 0");
  this.formInput.SalaryDay='';
}
}
findLocation(address:any) {
  this.source = address;
      if (!this.geocoder) this.geocoder = new google.maps.Geocoder()
  this.geocoder.geocode({
    'address': address
  }, (results:any, status:any) => {
    console.log(results);
    if (status == google.maps.GeocoderStatus.OK) {
  

      if (results[0].geometry.location) {
        this.latitude= results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();

        this.getDirection();
       
       //this.setCurrentLocation();
        
       // this.location.viewport = results[0].geometry.viewport;
      }
      
    //  this.map.triggerResize()
    } else {
      alert("Sorry, this search produced no results.");
    }
  })
}

logout()
{
  // localStorage.clear();
  // localStorage.clear();
  this._router.navigate(['auth/signin']);

}

validateEmail(inputval:any) {
  const input = inputval;
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input);

  if (!isValidEmail ) {
   return "Fail";
  }

  return "Ok";;
}
public handleAddressChange1(address:any)
{
 this.formInput.Address=address.formatted_address;
 this.findLocationDest(this.formattedAddress);
}



ngAfterViewInit() {
  this.getPlaceAutocomplete();
}

private getPlaceAutocomplete() {
  const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
          componentRestrictions: { country: 'IN' },
          types: [this.adressType]
      });
  google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.invokeEvent(place);
  });
}

invokeEvent(address: any) {
  this.setAddress.emit(address);
  this.formInput.Address=address.name +", "+ address.formatted_address;
 this.searchAddress=this.formInput.Address;
 this.searchAddressOnMap();
}
}
