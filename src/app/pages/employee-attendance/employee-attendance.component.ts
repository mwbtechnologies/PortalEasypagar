import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApproveattendanceComponent } from './approveattendance/approveattendance.component';
import { DatePipe } from '@angular/common';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { MapsAPILoader } from '@agm/core';

import { ApexDataLabels, ApexPlotOptions, ApexTitleSubtitle, ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { ShowalertComponent } from './showalert/showalert.component';
import { ShiftalertComponent } from './shiftalert/shiftalert.component';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
};

declare var google: any;
export interface DialogData {
  Array: any;
  SessionTypes: any;
  ApprovedSessionID: any;
}

export class Dropdown {
  Text: any;
  Value: any;
}
export class CheckInData
{
  Address:any;
  EmployeeID:any;ImageURl:any;
  Key:any='en';
  Location_Latitude:any;
  Location_Longitude:any;
  LogDate:any;SessionTypeID:any;VisitType:any; 
}
export class FormInput {
  StartDate: any;LogDate:any;
}
@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css']
})
export class EmployeeAttendanceComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent|any;
  public chartOptions: Partial<ChartOptions>|any;
  public lat = 15.3583616;
  public lng = 75.1403008;
  formInput: CheckInData | any;
  checkInData: FormInput | any;
  public isSubmit: boolean | any;
  LoginUserData: any;
  ListTypes: Array<Dropdown> = [];
  AdminID: any;
  ApiURL: any;
  file: any;
  showvisittype:any;
  showsessiontype:any;
  @ViewChild('search')   public searchElementRef: ElementRef | any;
  public showWebcam = true;
  public multipleWebcamsAvailable = false;
  ShowCamIcon=true;
  reclick=false;
  clickok=true;
basestring:any;
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
  NewApiURL: any;
  EmployeeId: any;
  selectedDepartmentId: any;
  selectedBranchId: any;
  selectedListType: any;
  OrgID: any; RecordID: any;
  LeaveList: any; approvedtype: any;
  LeaveURL: any;
  index = 0; numberofdays: any; comment: any; LeaveTypes: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  length: any;
  ApproveList: any; AttendanceList: any;AttendanceCount:any;
  editid: any; ShowDetails = false; ShowList = true;
  SessionTypes: any;
  AddPermission: any; EditPermission: any; ViewPermission: any; DeletePermission: any;
  BranchID: any;
  EmployeeID: any;
  EmployeeName: any;
  MonthName: any;
  pdfSrc: any;
  sortType: any;
  sortIndex: any;
  data: any; ShowAttendance = true;
  UserName: any; AttendanceAlerts: any;
  OrganizationName: any; TotalUsers: any;
  OverallResponse: any;
  tempbranches: any = [];
  selectedRoles: any[] = []
  tooltipTexts: string[] = [];
  ShiftList:any[]=[]
  selectedShiftID:any
  multiselectcolumns: IDropdownSettings = {};
  RolesSettings: IDropdownSettings = {};
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  CurrentDate: any; FormattedDate: any; Day: any; FromDate: any; ToDate: any;
  ApiExist: any;
  UserListWithoutFilter: any[] = [];
  isScrolled: boolean = false;
  searchText: string = '';
  icon: string = 'default';
  AllBranchList: any[] = [];
  UserSelectedColumns: any[] = [];
  selection: any;
  Roles: any[] = [];
  Softwares: any[] = [];
  Createdby: any[] = [];
  ApplicationList: any = ["All","Present", "Absent", "Ontime", "EarlyExit", "LateIn","Pending"];
  Columns: any[] = [];
  SelectedBranch: any = [];
  filterJson: any = {}
  selectedListTypeId: any;
  statusFilter: any;
  filterJsonDisplayName: any = {}
  selectedChips: string[] = [];
  filtersSelected: boolean = false;
  filterBarVisible: boolean = true;
  displayNames: any = {};
  OriginalBranchList: any; Branchstring: any; FilterType: any;
  SingleSelectionSettings:any;
  DeptColumns: any;
  all_selected_values: any;
  EnableApprove: any=false;
  Absentcount: any=0;
  EarlyExitCount: any=0;
  LateCheckinCount: any=0;
  Efficiency: any=0;
  pendingcount: any=0;
  OnTimeCheckinCount: any=0;presentcount:any=0;
  ShowPresent:any=false;ShowAbsent:any=false;ShowLateIn:any=false;ShowEarlyExit:any=false;
  ShowOnTime:any=false;ShowPending:any=false;
  BranchName: any;
  userselectedbranchid: any;    
  formattedAddress = '';
  formattedAddress1 = '';
  formattedAddress2 = '';
CheckInStatus:any;
DisableSession=false;
  selectedSessionID: any;
  selectedVisitID: any;
  UserID: any;
  VisitTypes: any;
  LiveImage: any;
  Length: any;
  AbsentData:any;
  LateInData:any;OnTimeData:any;
  EarlyExitData:any;
  DisplayList: any;
  filteredAttendanceList:any[]=[]
  loginData: any;
  public cameraNotFound: boolean = false;
  constructor(private globalToastService : ToastrService,private _router: Router,private zone: NgZone,public mapsApiLoader: MapsAPILoader, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private toastr: ToastrService, private dialog: MatDialog) { 
    this.SingleSelectionSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.isSubmit = false
    this.zone = zone;
    //this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    }); 
  }
  
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
    if (this.AdminID == null || this.OrgID == null) {

      this._router.navigate(["auth/signin"]);
    }
    this.BranchID = 0;
    this.formInput = {
      StartDate: '',
      LogDate:''
    }
    this.checkInData={
      Address:'',EmployeeID:'',ImageURl:'',Key:'en',Location_Latitude:'',Location_Longitude:'',LogDate:'',SessionTypeID:'',VisitType:''
    }
    this.showvisittype="Select VisitType";
    this.showsessiontype="Select SessionType";
    // this.GetVisitTypes();
    this.setchartoptions(0,0,0,0);
    var currentdate=new Date();
    var datePipe = new DatePipe("en-US");
    this.formInput.LogDate = datePipe.transform(currentdate, 'yyyy-MM-dd HH:mm a');
    this.CheckInStatus="Check-In";
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    this.setCurrentLocation();
    this.FilterType=['All'];
    this.selectedBranchId = 0; this.selectedDepartmentId = 0;
    // this.BranchID = localStorage.getItem("BranchID");
    this.BranchID = localStorage.getItem("BranchID");
    this.userselectedbranchid=this.BranchID;
    this.BranchName = localStorage.getItem("BranchName");
    this.formInput.StartDate = localStorage.getItem("Date");
    var currentdate = new Date();
    if (this.formInput.StartDate != null && this.formInput.StartDate != undefined) {
      this.formInput.StartDate = new Date();
    } 
    // this.selectedListType="All"; 
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
    // this.getcheckintypes();
    if(this.UserID>0 && this.UserID!=null && this.UserID!=undefined)
    {
      var month = '0' + (new Date().getMonth() + 1).toString().slice(-2).toString();
      var year = '0' + new Date().getFullYear().toString();
      this.ApiURL = "Performance/GetAttendance?EmployeeNew?UserID=" + this.UserID + "&Month=" + month + "&Year=" + year + "&IsCheckIn=false" ;
      this.GetAttendanceList(this.ApiURL);
      this.GetLoginStatus();
    }
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter(device => device.kind === 'videoinput');
      if (cameras.length === 0) {
        console.log('No camera found');  // You can display a message in the UI as well
        this.cameraNotFound = true;
      } else {
        console.log('Camera found');  // Camera is detected
        this.cameraNotFound = false;
      }
    });
  }


  back(){
    this._router.navigate(['/mydashboard']);
  }
  onChartClick(config: any): void {
    if (config.dataPointIndex !== -1) {
      const dataPointIndex = config.dataPointIndex;
      const label = this.chartOptions.labels[dataPointIndex];
      this.DisplayList = this.filteredAttendanceList.filter(
        (item:any) => item.Filter.toLowerCase().trim() === label.toLowerCase()
      );
    }
  }

  onCountClick(label: any){
        this.DisplayList = this.filteredAttendanceList.filter(
          (item:any) => item.Filter.toLowerCase().trim() === label.toLowerCase()
        );
  }
  GetLoginStatus()
  {    var currentdate=new Date();
    var datePipe = new DatePipe("en-US");
    this.CurrentDate=datePipe.transform(currentdate, 'yyyy-MM-dd');
    this.ApiURL="Employee/GetLoginStatus?EmployeeID="+this.UserID+"&Date="+this.CurrentDate;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => 
    {
      this.loginData=data.LoginData;  
      this.ShiftList = data.Shifts    
      if(this.loginData.LoginStatus==false)
      {
        this.CheckInStatus = "Check-In";
        this.GetVisitTypes();
        this.getcheckintypes();
      }
      else{
        this.CheckInStatus = "Check-Out";
        this.showvisittype="Select VisitType";
        this.showsessiontype="Select SessionType";
        this.selectedSessionID=this.loginData.SessionTypeID;
        this.selectedVisitID=this.loginData.VisitTypeID;
        this.showsessiontype=this.loginData.SessionTypeName,
        this.showvisittype=this.loginData.VisitTypeName
        // this.showsessiontype = this.SessionTypes.filter((item:any) => item.Value ===parseInt(this.selectedSessionID));
        //  this.showvisittype = this.VisitTypes.filter((item:any) => item.Value ===parseInt(this.selectedVisitID));
      
         this.DisableSession=true;
      }

    }, (error) => {
      this.toastr.error(error); console.log(error);
    });
  }
  GetVisitTypes()
  {
    this.ApiURL="Admin/GetCheckInTypes/Visit/"+this.UserID+"/en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) =>{ 
      this.VisitTypes = data.List;
      // this.showvisittype = this.VisitTypes.filter((item:any) => item.Value ===parseInt(this.selectedVisitID));

    }, (error) => {
      this.toastr.error(error); console.log(error);
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
 handleInitError(error: WebcamInitError): void {
  console.log('Webcam initialization error: ', error);  // Log the error
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
this._commonservice.ApiUsingPost("Admin/ImageUpload",fData).subscribe(data => { this.LiveImage=data.ImagePath;});}
  }
  cImage: any;
  
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.curlatitude = position.coords.latitude;
        this.curlongitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        
        this.zoom = 8;
        
       this.getAddress(this.latitude, this.longitude);
      }, (error) => {
        // Location access denied or other error
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            alert("Please enable location services to use this feature.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        }
    });
    }
  }
  getAddress(latitude:any, longitude:any) {
    this.geocoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.checkInData.Address = results[0].formatted_address;
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
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  submit(){
    let shiftid = this.selectedShiftID || 0
    this._commonservice.ApiUsingGetWithOneParam("Employee/GetLoginValidation?ShiftID="+shiftid+"&Key=en").subscribe(data =>{
      if(data.ShowPopup == true){
            this.dialog.open(ShiftalertComponent,{
        data: data.Message,
      }).afterClosed().subscribe(res=>{
        this.submitDetails();
      }) 
      }else if(data.ShowPopup == false){
        this.submitDetails();
      }
      else{

      }
   
    })
  }
submitDetails(){
  if (((this.selectedVisitID == "" || this.selectedVisitID==null || this.selectedVisitID==undefined) && (this.CheckInStatus=="Check-In")) ||((this.showvisittype == " " || this.showvisittype==null || this.showvisittype==undefined) && (this.CheckInStatus=="Check-Out"))) {
    this.toastr.warning("Please Select Visit Type");
    return false;
  }  
 else if (this.selectedSessionID == "" || this.selectedSessionID==null || this.selectedSessionID==undefined) {
    this.toastr.warning("Please Select Session Type");
    return false;
  }  
  else if (this.LiveImage == "" || this.LiveImage==null || this.LiveImage==undefined) {
    this.toastr.warning("Please Capture the Image");
    return false;
  }  
  else if (this.formInput.LogDate == ""||this.formInput.LogDate == null) {
    this.toastr.warning("Login/Logout Date Required");
    return false;
  }  
  else{
    let shiftid = this.selectedShiftID || 0
    var json={
      CheckInAddress:this.checkInData.Address,
      LoginStatus:this.loginData.LoginStatus,
      VisitType:this.selectedVisitID,
      SessionTypeID:this.selectedSessionID,
      EmployeeID:this.UserID,
      CheckOutAddress:'',
      Location_Latitude:this.latitude,
      Location_Longitude:this.longitude,
      ImageURl:this.LiveImage,
      LogDate:this.formInput.LogDate,
      Key:"en",
      ShiftID:shiftid
    }
    if(this.CheckInStatus=="Check-Out")
    {
      json={
        CheckOutAddress:this.checkInData.Address,
        LoginStatus:this.loginData.LoginStatus,
        VisitType:this.showvisittype,
        SessionTypeID:this.selectedSessionID,
        EmployeeID:this.UserID,
        CheckInAddress:'',
        Location_Latitude:this.latitude,
        Location_Longitude:this.longitude,
        ImageURl:this.LiveImage,
        LogDate:this.formInput.LogDate,
        Key:"en",
        ShiftID:shiftid
      }
    }
    
    this._commonservice.ApiUsingPost("Employee/SaveAttendance",json).subscribe((data:any) => {
      if(data.Status==true){
        this.spinnerService.hide();
        // this.toastr.success(data.Message);
        this.ShowAlert(data);
        window.location.reload();
          return true;
       }
       else{
        this.spinnerService.hide();
        this.toastr.warning(data.Message);
          return false;
       }
    
    }, (error: any) => {this.spinnerService.hide();
      // this.toastr.error(error.message);
     return false;
    }
    );
    return true;
  }
}

ShowAlert(data:any): void {
  this.dialog.open(ShowalertComponent,{
    data: { Message:data.Message,Emoji:data.Emoji}
     ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
  })
}

// ShowAlert(data:any): void {
//   this.dialog.open(ShowalertComponent,{
//     data: { Message:"Hello Testing!!",Emoji:"https://wbtechindia.com/apis/EasyPagar/Content/Images/Emoji/ontime_checkout.gif"}
//      ,panelClass: 'custom-dialog',
//     if(res){
//     }
//   })
// }
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
  getcheckintypes() {
    this.ApiURL="Admin/GetCheckInTypes/Session/"+this.UserID+"/en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {this.SessionTypes = data.List;
      // this.showsessiontype = this.SessionTypes.filter((item:any) => item.Value ===parseInt(this.selectedSessionID));
    }, (error) => {

    });
  }

  openDialog(IL: any): void {
    console.log(IL);
    this.dialog.open(ApproveattendanceComponent,{
      data: { IL, fulldata: this.AttendanceList }
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
      if(res){
        // var month = '0' + (new Date().getMonth() + 1).toString().slice(-2).toString();
        // var year = '0' + new Date().getFullYear().toString();
        // this.ApiURL = "SalaryCalculation/GetAttendance?UserID=" + this.UserID + "&Month=" + month + "&Year=" + year + "&Status=All" ;
        // this.GetAttendanceList(this.ApiURL);
      }
    })
  }
 

  GetAttendanceList(APIUrl:any) {
    var d = '0' + (new Date().getMonth() + 1).toString().slice(-2) + '-' + new Date().getFullYear().toString();console.log(d);
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(APIUrl).subscribe((res: any) => {
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();
      console.log(res);
      if(res.Status==true)
      {
        this.AttendanceList = res.List[0];
        this.DisplayList=this.AttendanceList.LoginData;
        this.filteredAttendanceList = [...this.DisplayList]
        // this.DisplayList=this.AttendanceList.LoginData;
        console.log(this.DisplayList);
        this.LateCheckinCount=res.LateInCounts; this.OnTimeCheckinCount=res.OnTimeCounts; this.EarlyExitCount=res.EarlyExitCounts; this.Absentcount=res.AbsentCount;
        this.setchartoptions(res.LateInCounts,res.OnTimeCounts,res.EarlyExitCounts,res.AbsentCount);
      }
    
      this.dtTrigger.next(null);
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
    });
  }

setchartoptions(LateIn:number,OnTime:number,EarlyExit:number,Absent:number)
{ var data=[LateIn,OnTime,EarlyExit,Absent];
  this.chartOptions = {
    series: data,
    chart: {
      type: "donut",
      height: 250,
      events: {
        dataPointSelection: (event:any, chartContext:any, config:any) => {
          this.onChartClick(config);
        }
      }
    },
    labels: ["LateIn", "OnTime", "EarlyExit", "Absent"],
    title: {
      // text: "Doughnut Chart"
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: (w: any) => {
                // Display the total value
                return w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        // Ensure data labels show the actual value, not percentage
        return opts.w.config.series[opts.seriesIndex]; // Access series data directly
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };
}

exportPdf(){
  const json = {
    "AttendanceList":this.AttendanceList
  }
  this._commonservice.ApiUsingPostNew("ReportsNew/GetEmployeeMonthlyReport",json,{ responseType: 'text' }).subscribe((res:any)=>{
    if(res){
       window.open(res,'_blank')
    }
   else{
    this.globalToastService.error("Something went wrong");
   }
  },(error)=>{
    this.globalToastService.error(error.message);
  })
}
}


