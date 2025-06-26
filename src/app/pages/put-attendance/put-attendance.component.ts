import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MapsAPILoader } from '@agm/core';
import { DatePipe } from '@angular/common';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { NgForm } from '@angular/forms';


declare var google: any;
export class FormInput{
  CheckInAddress:any;
  CheckOutAddress:any;
  VisitType:any;
  SessionTypeID:any;
  EmployeeID:any;
  StoreID:any;
  CheckIn_Address:any;
  CheckOut_Address:any;
  Location_Latitude:any;
  Location_Longitude:any;
  LogTime:any;
  LogDate:any;
  Address:any;
  Image:any;
}

@Component({
  selector: 'app-put-attendance',
  templateUrl: './put-attendance.component.html',
  styleUrls: ['./put-attendance.component.css']
})
export class PutAttendanceComponent implements OnInit {
  public lat = 15.3583616;
  public lng = 75.1403008;
  // private geoCoder:any;
  geocoder:any;
  public origin: any;
  public destination: any;
  latitude: any;
  longitude: any;
  curlatitude: any;
  curlongitude: any;
  GetLocations:any;zoom:any
  source: any;
  destiny: any;
  Length:any;
  SessionTypes:any;VisitTypes:any;
  selectedSessionID:string[] | any;  selectedVisitID:string[] | any;
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

  @ViewChild('search')   public searchElementRef: ElementRef | any;
  formInput: FormInput | any;
  public isSubmit: boolean | any;
  UserID:any;AdminID:any;OrgID:any;ApiURL:any;
LiveImage:any;
  public showWebcam = true;
  public multipleWebcamsAvailable = false;
  file:any;
  ShowCamIcon=true;
  reclick=false;
  clickok=true;
basestring:any;CurrentDate:any;
  constructor(public mapsApiLoader: MapsAPILoader, private zone: NgZone,private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,private globalToastService:ToastrService)
  { this.isSubmit=false;
    this.zone = zone;
    //this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });}
    formattedAddress = '';
    formattedAddress1 = '';
    formattedAddress2 = '';
CheckInStatus:any;
DisableSession=false;


  ngOnInit(): void {
    this.UserID = localStorage.getItem("UserID");
    if (this.UserID==null) {

      this._router.navigate(["auth/signin"]);
    }
    else{
      this.AdminID = localStorage.getItem("AdminID");    
      this.OrgID = localStorage.getItem("OrgID");

      WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    }
    this.setCurrentLocation();
  
    this.formInput = {  
      CheckInAddress:'',
  CheckOutAddress:'',
  VisitType:'',
  SessionTypeID:'',
  EmployeeID:'',
  StoreID:'',
  ImageURl:'',
  Location_Latitude:'',
  Location_Longitude:'',
  LogTime:'',
  LogDate:'',
  Address:'',
  Image:''
    }
    var currentdate=new Date();
    var datePipe = new DatePipe("en-US");
    this.formInput.LogDate = datePipe.transform(currentdate, 'yyyy-MM-dd HH:mm a');

    this.ApiURL="Admin/GetCheckInTypes/Session/"+this.UserID+"/en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.SessionTypes = data.List, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
    this.GetVisitTypes();
    this.GetLoginStatus();
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   

  }

  GetLoginStatus()
  {    var currentdate=new Date();
    var datePipe = new DatePipe("en-US");
    this.CurrentDate=datePipe.transform(currentdate, 'yyyy-MM-dd');
    this.ApiURL="Employee/GetLoginStatus?EmployeeID="+this.UserID+"&Date="+this.CurrentDate;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => 
    {
      if(data.LoginStatus==true)
      {
        this.CheckInStatus = "Check-In";
      }
      else{
        this.CheckInStatus = "Check-Out";
        this.selectedSessionID=data.SessionTypeID;
        this.selectedVisitID=data.VisitTypeID;
        this.DisableSession=true;
      }

    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
  }
  GetVisitTypes()
  {
    this.ApiURL="Admin/GetCheckInTypes/Visit/"+this.UserID+"/en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.VisitTypes = data.List, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
  }

  public webcamImage: any = null;

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
    this.ShowCamIcon=false;
  }
  private trigger: Subject<void> = new Subject<void>();

  public triggerSnapshot(): void {
    this.trigger.next();
    this.showWebcam=false;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public errors: WebcamInitError[] = [];
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.imageHandle1(this.webcamImage);
  }

  imageHandle1(event:WebcamImage) {
    this.basestring=this.webcamImage._imageAsDataUrl;
const fData: FormData = new FormData();
fData.append('BaseString', this.basestring);
if (event != undefined) {
this._commonservice.ApiUsingPost("Admin/ImageUpload",fData).subscribe(data => { this.LiveImage=data.URL;});}
  }
  cImage: any;
  
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.curlatitude = position.coords.latitude;
        this.curlongitude = position.coords.longitude;
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        
        this.zoom = 8;
        
       this.getAddress(this.lat, this.lng);
      });
    }
  }
  getAddress(latitude:any, longitude:any) {
    this.geocoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.formInput.Address = results[0].formatted_address;
          this.Length=results[0].address_components.length;
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
    this.destination = { lat: this.curlatitude, lng: this.curlongitude };
  }

submit()
{

  if (this.selectedSessionID == "" || this.selectedSessionID==null || this.selectedSessionID==undefined) {
    this.globalToastService.warning("Please Select Session Type");
    return false;
  }  
  else if (this.formInput.LogDate == ""||this.formInput.LogDate == null) {
    this.globalToastService.warning("Login/Logout Date Required");
    return false;
  }  
  else{
    this.formInput.CheckInAddress=this.formInput.Address;
    this.formInput.CheckOutAddress=this.formInput.Address;
    this.formInput.VisitType=this.selectedVisitID;
    this.formInput.SessionTypeID=this.selectedSessionID;
    this.formInput.EmployeeID=this.UserID;
    this.formInput.StoreID=0;
    this.formInput.Location_Latitude=this.latitude;
    this.formInput.Location_Longitude=this.longitude;
    this.formInput.ImageURl=this.LiveImage;
    this._commonservice.ApiUsingPost("Employee/SaveAttendance",this.formInput).subscribe((data:any) => {
      if(data.Status==true){
        this.spinnerService.hide();
        this.globalToastService.success(data.Message);
          window.location.reload();
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
    return true;
  }
}

options = {
  ComponentRestrictions: {
    country: ['IND']
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
}
