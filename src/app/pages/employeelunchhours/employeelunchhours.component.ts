import { MapsAPILoader } from '@agm/core';
import { ChangeDetectorRef, Component, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-employeelunchhours',
  templateUrl: './employeelunchhours.component.html',
  styleUrls: ['./employeelunchhours.component.css']
})
export class EmployeelunchhoursComponent {
  userid:any
  minutes:any
  longitude: any;
  curlatitude: any;
  curlongitude: any;
  lat:any
  zoom:any
  compolength:any
  lng:any
  geocoder:any
  Address:any
  lunchin:boolean = true
  lunchout:boolean = false
  status:any
  Remainingtime:any
  public timerInterval: any;
  timerValue: number = 0;
  private intervalId: any;
  seconds: number = 0;
  // BreakType:any
  Lateminutes: number = 0;
  extratime:any
  // BreakID:any
  breakSettings:IDropdownSettings = {}
  selectedBreak:any
  Breaks:any
  interval: any;
  constructor(public mapsApiLoader: MapsAPILoader,private _router: Router, private cd: ChangeDetectorRef,
    private globalToastService: ToastrService, private spinnerService: NgxSpinnerService, 
    private _commonservice: HttpCommonService, private toastr: ToastrService, private dialog: MatDialog) { 
    this.breakSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }

  ngOnInit(){
  this.userid = localStorage.getItem('UserID')
  this.mapsApiLoader.load().then(() => {
    this.geocoder = new google.maps.Geocoder();
  })
  this.getDuration()
  this.setCurrentLocation()
}
  ngOnDestroy(): void {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
  }
  
  onBreakSelect(item:any){

  }

  onBreakDeSelect(item:any){
  }
  getDuration(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetLunchDuration?EmployeeID="+this.userid).subscribe(data =>{
     this.minutes = data.Duration
     this.status = data.IsLunchExist
     this.Breaks = data.Breaks
     console.log(this.Breaks,"breaks array");
     this.Remainingtime = data.Remainingtime
     this.extratime = data.Extratime
     this.timer(data.Remainingtime)
     this.startTimer(data.Extratime)
    })
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.curlatitude = position.coords.latitude;
        this.curlongitude = position.coords.longitude;
        this.lat = this.curlatitude;
        this.lng = this.curlongitude;
        this.lat = this.lat || "";
        this.lng = this.lng || "";
        this.getAddress(this.lat, this.lng);
      });
    }
  }

  getAddress(latitude:any, longitude:any) {
    this.geocoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.compolength=0;
          this.compolength=results[0].address_components.length;
          this.Address = results[0].formatted_address;
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
  
    });
  }

  lunchIn(){
    if(this.selectedBreak.length = 0 ){
      this.toastr.warning("Please Select Break")
    }
    const json={
      "UserID": this.userid,
      "Lunchout": "",
      "LunchoutLocation": "",
      "Lunchoutlat": "",
      "Lunchoutlong": "",
      "LunchinLocation": this.Address,
      "Lunchinlat": this.lat,
      "Lunchinlong": this.lng,
      "Lunchin": new Date().toLocaleString(),
      "BreakID": this.selectedBreak.map((sb:any)=>sb.id)[0]
  }
    console.log(json);
    this._commonservice.ApiUsingPost("Admin/LogLunchData",json).subscribe((data:any)=>{
      this.minutes = data.LunchMins
      this.Remainingtime = data.LunchMins
      this.timer(data.LunchMins)
      this.status = true
      window.location.reload()
      this.globalToastService.success(data.Message)
    },(error)=>{
      this.globalToastService.error(error.Message)
    })
  }

  timer(input: any) {
  let totalSeconds: number;

  if (typeof input === 'string') {
      const [hours, minutes, seconds] = input.split(':').map(Number);
      totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
  } else if (!isNaN(input) && input > 0) {
      totalSeconds = input * 60;
  } else {
      console.error('Invalid input. Please provide valid minutes or time.');
      return;
  }

  const updateDisplay = () => {
      const minutesPart = Math.floor(totalSeconds / 60);
      const secondsPart = totalSeconds % 60;
      const formattedMinutes = minutesPart < 10 ? `0${minutesPart}` : `${minutesPart}`;
      const formattedSeconds = secondsPart < 10 ? `0${secondsPart}` : `${secondsPart}`;
      this.minutes = `${formattedMinutes}:${formattedSeconds}`;
  };

  updateDisplay();
  this.timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
          totalSeconds--;
          updateDisplay();
      } else {
          clearInterval(this.timerInterval);
      }
  }, 1000);
  }

  lunchOut(){
  const json={
    "UserID": this.userid,
    "Lunchout": new Date().toLocaleString(),
    "LunchoutLocation": this.Address,
    "Lunchoutlat": this.lat,
    "Lunchoutlong": this.lng,
    "LunchinLocation": "",
    "Lunchinlat": "",
    "Lunchinlong": "",
    "Lunchin": ""
}
  console.log(json);
  this._commonservice.ApiUsingPost("Admin/LogLunchData",json).subscribe((data:any)=>{
    window.location.reload()
    this.status = false
    this.globalToastService.success(data.Message)
  },(error)=>{
    this.globalToastService.error(error.Message)
  })
  }

  startTimer(extratime: string) {
    let [hours, minutes, seconds] = extratime.split(':').map(Number);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    this.interval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds++;
        this.extratime = this.formatTime(totalSeconds);
      } else {
        clearInterval(this.interval); // Stop when timer reaches 0
      }
    }, 1000);
  }

  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map(unit => (unit < 10 ? '0' + unit : unit.toString()))
      .join(':');
  }

  }

