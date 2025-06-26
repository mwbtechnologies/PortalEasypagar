import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CalendarView, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { CalendarEvent } from 'calendar-utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { isSameDay, isSameMonth } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DeleteconfirmationComponent } from 'src/app/layout/admin/deleteconfirmation/deleteconfirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ConfirmationpopupComponent } from 'src/app/layout/admin/confirmationpopup/confirmationpopup.component';
import { SuccesspopupComponent } from 'src/app/layout/admin/successpopup/successpopup.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
export class SettingFormInput {
  OldPassword: any;
  NewPassword: any;
  ConfirmPassword: any;
}
export class FormInput {
  IsHalfday: any;
  StartDate: any;
  EndDate: any;
  Title: any;
  Description: any;
}
export class eventclass {
  start: any;
  end: any;
  title: any;
  color: any;
  allDay: any;
  draggable: any;
  actions: any;
  comment: any;
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settingformInput: SettingFormInput | any;
  Settings: any[] = [
    {
      image:"./assets/images/pngs/changepassword.png",
      text: 'Change Password'
    },
    {
      image:"./assets/images/pngs/calendarfile.png",
      text: 'Holidays'
    },
    {
      image:"./assets/images/pngs/timeformathours.png",
      text: 'Time Format(24/12 Hours)'
    },
    {
      image:"./assets/images/pngs/gracetime2.png",
      text: 'Attendance Grace Period'
    },
    {
      image:"./assets/images/pngs/notification.png",
      text: 'Notification Settings'
    },
    {
      image:"./assets/images/pngs/accesscontrol.jpg",
      text: 'Access Control'
    },
    // {
    //   image:"./assets/images/pngs/salary_Setting.png",
    //   text: 'Salary Settings'
    // },
    // {
    //   image:"./assets/images/pngs/break.png",
    //   text: 'Breaks Config'
    // },
    {
      image:"./assets/images/pngs/tracker.png",
      text: 'Easy Tracker Mapping'
    },
    {
      image:"./assets/images/pngs/branchlevels.png",
      text: 'Weekoff/Holiday Logic'
    },
    {
      image:"./assets/images/pngs/defaultbranch.png",
      text: 'Default Branch'
    },
    {
      image:"./assets/images/pngs/geofence.png",
      text: 'Geo Fence Config'
    },
    {
      image:"./assets/images/pngs/locationaddress.png",
      text: 'Location Config'
    },
    {
      image:"./assets/images/pngs/geofence.png",
      text: 'Check-In Device Configuration'
    },
    // {
    //   image:"./assets/images/pngs/geofence.png",
    //   text: 'Work Hour Configuration'
    // },
 

  ]
  Editdetails: any;
  EditAttendance:any
  editid: any; locationConfig:boolean = false
  workHourConfig:boolean = false
  IsChangePassword: boolean = false
  showbtn:boolean = false
  showgracebtn:boolean = false
  IsHoliday: boolean = false
  IsTimeFormat:boolean = false
  GracePeriod:boolean = false
  IsNotification:boolean = false
  isAccessControl:boolean = false
  isBreakConfig:boolean = false
  isEasyTrackerMap:boolean = false
  isBranchLevels:boolean = false
  isDefaultBranch:boolean = false
  salarySetting:boolean = false
  isGeoFence:boolean = false;    
  isCheckIns:boolean = false;    
  GeoFenceList: any
  passwordinput: any; confirmpasswordinput: any; oldpasswordinput: any;
  ApiUrl: any
  UserID: any
  EasyTracker:any;
  selectedSetting: any = ''
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | any;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  CalendarEvents: Array<eventclass> = [];
  AddPermission: any; EditPermission: any; ViewPermission: any; DeletePermission: any;
  Add:boolean = true
  Edit:boolean = false
  modalData: {
    action: string;
    event: CalendarEvent;
  } | any;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent: CalendarEvent<any>) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

     //common table
 actionOptions:any
 displayColumns:any
 displayedColumns:any
 employeeLoading:any=undefined;
 editableColumns:any =[]
 topHeaders:any = []
 headerColors:any = []
 smallHeaders:any = []
 ReportTitles:any = {}
 selectedRows:any = []
 commonTableOptions :any = {}
 @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
  OriginalBranchList:any
  refresh = new Subject<void>();
  title: any; description: any;
  activeDayIsOpen: boolean = false;
  twelvehoursformat: boolean = false;
  twentyfourhoursformat: boolean = false;
  ApiURl: any
  AdminID: any; OrgID: any;
  formInput: FormInput | any;
  events: any;
  HolidayList: any;
  index: any; EventStartDate: any; EventEndDate: any;
  calanderview: boolean = false;
  tableview: boolean = true;
  dtExportButtonOptions: any = {};
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
    public isSubmit: boolean;
    branchSettings :IDropdownSettings = {}
    departmentSettings :IDropdownSettings = {}
    ApiURL:any
    BranchList:any[]=[]
    Branches:any
    selectedBranch:any[]=[];
    selectedBranchH:any=[];
    selectedDepartment:any[]=[];
    temparray:any=[]; tempdeparray:any=[];
    DepartmentList: any;
    checkingrace:number = 0
    checkoutgrace:number = 0
    AttendanceGraceList:any[]=[]
    editbranch:any
    editdepartment:any
    editdeptid:any
    graceTimeAdd : boolean = true
    graceTimeEdit : boolean = false
    NotificationList: any[] = [];
    AccessControlList: any[] = [];
    // defaultTypes = [
    //   { type: "Attendance", label: "Attendance (Location and Grace Time Alerts)" },
    //   { type: "Attendance Alert", label: "Attendance Alert (Attendance Approval Alerts : Yes/No)" },
    //   { type: "Expense", label: "Expense" },
    //   { type: "Leave", label: "Leave" },
    //   { type: "Loan", label: "Loan And Advance" },
    //   { type: "Referral", label: "Referral" },
    //   { type: "Support", label: "Support" }
    // ]

 //ends here

 //for geo isGeoFenced
 lat = 37.7749; // Default latitude (San Francisco)
 lng = -122.4194; // Default longitude (San Francisco)
 zoom = 14; // Default zoom level
 radius = 500; // Default radius in meters
 checkLat: any;
 checkLng: any;
 checkResult: string = '';
  selectedbranchid: any;
 //geo fenced ends here

 isAnySelected = false;
 selectedOrganization:any[]=[]
 OrgList:any[]=[]
 orgSettings:IDropdownSettings = {}
  constructor(private modal: NgbModal, private globalToastService: ToastrService,
     private toastr: ToastrService, private _commonservice: HttpCommonService,
      private spinnerService: NgxSpinnerService, public dialog: MatDialog,private _router :Router) {
      this.isSubmit = false;

    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.departmentSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
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
    
  }
  ngOnInit() {
    this.UserID = localStorage.getItem("UserID");
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.settingformInput = {
      OldPassword: '',
      NewPassword: '',
      ConfirmPassword: ''
    };
    this.formInput = {
      IsHalfday: false,
      StartDate: '',
      EndDate: '',
      Title: '',
      Description: ''
    };
    this.GetUserProfile();
    this.getNotificationList()
    this.getAccessControlList()
    this.getGeoConfigList()
    this.AddPermission = localStorage.getItem("AddPermission"); if (this.AddPermission == "true") { 
    this.AddPermission = true; } else { this.AddPermission = false; }
    this.EditPermission = localStorage.getItem("EditPermission"); if (this.EditPermission == "true") { this.EditPermission = true; } else { this.EditPermission = false; }
    this.ViewPermission = localStorage.getItem("ViewPermission"); if (this.ViewPermission == "true") { this.ViewPermission = true; } else { this.ViewPermission = false; }
    this.DeletePermission = localStorage.getItem("DeletePermission"); if (this.DeletePermission == "true"){  this.DeletePermission = true; } else { this.DeletePermission = false; }
    this.EasyTracker = localStorage.getItem("IsTrackerUser"); if (this.EasyTracker == "true"){  this.EasyTracker = true; } else { this.EasyTracker = false; }
    let timeformat:any = localStorage.getItem("TimeFormat");
    if(timeformat === "true"){
      this.twentyfourhoursformat = true;
     this.twelvehoursformat=false;
    }else if(timeformat === "false"){
      this.twelvehoursformat = true;
      this.twentyfourhoursformat = false;
    }
    else{
      this.twentyfourhoursformat = true;
      this.twelvehoursformat=false;
    }
  }
  CheckDate(date: any) {
    this.ApiURL="Admin/CheckDate?UserDate="+date;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
        (data) => {
      if(data.Status==true){
       this.spinnerService.hide();
          return true;
          } else {
         this.spinnerService.hide();
            // this.globalToastService.warning(
            //   "Date should be greater than Current Date"
            // );
            this.ShowAlert("Date should be greater than Current Date","warning")
            this.formInput.DateOfJoining = "";
        
          return false;
       }
        },
        (error: any) => {
     this.spinnerService.hide();
    //  this.globalToastService.warning(error.message);
    this.ShowAlert(error.message,"warning")
     return false;
    }
    );
   }
   newonDeselectedBranchesChange(event: any) {
    this.selectedbranchid = 0;
    this.GetHolidayDepartments()
  }
  newonselectedBranchesChange(event: any) {
    this.selectedbranchid=event.Value;
    this.GetHolidayDepartments()
  }
  toggleSetting(st: any) {
    // if (st.text != "Salary Settings") {
      if (this.selectedSetting === st) {
        this.selectedSetting = "";
      } else {
        this.selectedSetting = st;
      }
    // } else {
    //   this.openDialog(st.text);
    // }
  }
  getSettingsData(st: any) {
    // if(st.text != 'Salary Settings')
    // {
      this.isAccessControl = false
      this.IsNotification = false
      this.GracePeriod = false
      this.IsTimeFormat = false
      this.IsHoliday = false
      this.IsChangePassword = false
      this.salarySetting = false
      this.isBreakConfig = false
      this.isEasyTrackerMap = false
      this.isBranchLevels = false
      this.isDefaultBranch = false
      this.isGeoFence = false
      this.locationConfig=false
      this.workHourConfig=false
      this.isCheckIns=false
      if (st.text === 'Change Password') {
        this.IsChangePassword = true
      }
      if (st.text === 'Holidays') {
        this.GetOrganization();
        this.GetBranches();
        this.SetCalendarEvent();
        this.IsHoliday = true
      }
      if (st.text === 'Time Format(24/12 Hours)') {
        this.IsTimeFormat = true
      }
      if (st.text === 'Attendance Grace Period') {
        this.GetOrganization();
      this.GetBranches();
      this.getAttendanceList()
        this.GracePeriod = true
      }
      if (st.text === 'Notification Settings') {
        this.IsNotification = true
      }
      if (st.text === 'Access Control') {
        this.isAccessControl = true
      }
      if (st.text === 'Salary Settings') {
        this.salarySetting = true
      }
      if (st.text === 'Breaks Config') {
        this.isBreakConfig = true
      }
      if (st.text === 'Easy Tracker Mapping') {
        if(this.EasyTracker==true)
        {
          this.isEasyTrackerMap = true
        }
        else{
          // this.toastr.warning("Please Purchase Easy-Tracker AddOn Through Mobile App");
          this.ShowAlert("Please Purchase Easy-Tracker AddOn Through Mobile App","warning")
        }
        
      }
      if (st.text === 'Weekoff/Holiday Logic') {
        this.isBranchLevels = true
      }
      if (st.text === 'Default Branch') {
        this.isDefaultBranch = true
      }

      if (st.text === 'Location Config') {
        this.locationConfig = true
      }
      if (st.text === 'Work Hour Configuration') {
        this.workHourConfig = true
      }
      if (st.text === 'Geo Fence Config') {
        this.isGeoFence = true
      }
      if (st.text === 'Check-In Device Configuration') {
        this.isCheckIns = true
      }
    // }
    // else{
    //   this.openDialog(st.text);
    // }
   
  }
  backToSettings(){
    this.isBreakConfig = false
  }

  getGeoConfigList(){
    const json = {
      "UserID":this.UserID,
      "Branchwisedata":[]
    }
    this._commonservice.ApiUsingPost("Settings/SetGeofenceradius",json).subscribe((res:any)=>{
      this.GeoFenceList = res.List.Branchwisedata
    },(error):any=>{
      //this.toastr.error(error.message)
    })

  }

  InputValidation(bl:any){
    if (bl.Radius > 500) {
      // this.globalToastService.warning("Radius Cannot Be Greater than 500 meters")
      this.ShowAlert("Radius Cannot Be Greater than 500 meters","warning")
      bl.Radius = 500;
    }
    if (bl.Radius < 0) {
      bl.Radius = 0;
    }
  }

  preventPlusMinus(event: KeyboardEvent): void {
    if (event.key === '+' || event.key === '-'|| event.key === 'e' || event.key === 'ArrowUp'|| event.key === 'ArrowDown') {
      event.preventDefault();
    }
  }

  SaveGeoFenced(){
     let json:any = {
       "UserID":parseInt(this.AdminID)
     }
     json["Branchwisedata"] = this.GeoFenceList.filter((res: any) => res.Radius > 1).map((res: any) => {
       return {
         "Radius":res.Radius,"ID":res.ID
       }
     })
    console.log(json,"save");
    this._commonservice.ApiUsingPost("Settings/SetGeofenceradius",json).subscribe((res:any)=>{
      if(res.Status==true){
        // this.globalToastService.success(res.Message)
        this.ShowAlert(res.Message,"success")
      }else if(res.Status==false){
      // this.globalToastService.error(res.Message)
      this.ShowAlert(res.Message,"error")
      }else{
      // this.globalToastService.error("An Error Occured")
      this.ShowAlert("An Error Occured","error")
      }
    },(error):any=>{
      // this.globalToastService.error(error.error.message)
      //this.ShowAlert(error.error.message,"error")
    })
  }
  onselectedOrg(item:any){
    this.selectedBranch = []
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranch = []
    this.GetBranches()
  }

  GetOrganization() {
    this.UserID=localStorage.getItem("UserID");
    this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List
      if(data.List.length == 1){
        this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
        this.onselectedOrg({Value:this.OrgList[0].Value,Text:this.OrgList[0].Text})
      }
    }, (error) => {
       console.log(error);
    });
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      // this.globalToastService.error(error.error.message);
      //this.ShowAlert(error.error.message,"error")
       console.log(error);
    });

  }
  GetHolidayDepartments() {
    var loggedinuserid=localStorage.getItem("UserID");
    const json={
      OrgID:this.OrgID,
      AdminID:loggedinuserid,
      Branches:this.selectedBranchH.map((br: any) => {
        return {
          "id":br.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments",json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        console.log(this.DepartmentList,"department list");
      }
    }, (error) => {
      // this.globalToastService.error(error.error.message); 
      //this.ShowAlert(error.error.message,"error")
      console.log(error);
    });
  }

  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json={
      OrgID:this.OrgID,
      AdminID:loggedinuserid,
      Branches:this.selectedBranch.map((br: any) => {
        return {
          "id":br.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments",json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        console.log(this.DepartmentList,"department list");
      }
    }, (error) => {
      // this.globalToastService.error(error.error.message); 
      //this.ShowAlert(error.error.message,"error")
      console.log(error);
    });
  }

  onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.push({id:item.Value, text:item.Text });
   }
   onDeptSelectAll(item:any){
    console.log(item,"item");
    this.tempdeparray = item;
   }
   onDeptDeSelectAll(){
    this.tempdeparray = [];
   }
   onDeptDeSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
   }
  onBranchSelect(item:any){
   console.log(item,"item");
   this.temparray.push({id:item.Value,text:item.Text });
   this.GetDepartments();
  }
  onBranchDeSelect(item:any){
   console.log(item,"item");
   this.temparray.splice(this.temparray.indexOf(item), 1);
   this.GetDepartments();
  }
  selectCalendar() {
    this.calanderview = true
    this.tableview = false
  }
  selectTable() {
    this.calanderview = false
    this.tableview = true
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
  
  submitpassword(){
    if (this.settingformInput.OldPassword == "" || this.settingformInput.OldPassword == null || this.settingformInput.OldPassword == undefined) {
      // this.globalToastService.warning("Please Enter Old Password...!");
      this.ShowAlert("Please Enter Old Password...!","warning")
      this.spinnerService.hide();
      return false;
    }
    else if (this.settingformInput.NewPassword == "" || this.settingformInput.NewPassword == null || this.settingformInput.NewPassword == undefined) {
      // this.globalToastService.warning("Please Enter New Password...!");
      this.ShowAlert("Please Enter New Password...!","warning")
      this.spinnerService.hide();
      return false;
    }
    else if (this.settingformInput.ConfirmPassword == "" || this.settingformInput.ConfirmPassword == null || this.settingformInput.ConfirmPassword == undefined) {
      // this.globalToastService.warning("Please Enter Confirm Password...!");
      this.ShowAlert("Please Enter Confirm Password...!","warning")
      this.spinnerService.hide();
      return false;
    }
    else if (this.settingformInput.NewPassword != this.settingformInput.ConfirmPassword) {
      // this.globalToastService.warning("Password and Confirm Password Doesn't match...!");
      this.ShowAlert("Password and Confirm Password Doesn't match...!","warning")
      this.spinnerService.hide();
      return false;
    }
    else {
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      data: "Are You Sure Want To Change Password!",
    });
    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.submit();
      dialogRef.close();
  
    },(error):any=>{
      // this.globalToastService.error(error.error.message)
      //this.ShowAlert(error.error.message,"error")
    });
    return true;
  }
}
  submit() {
    this.spinnerService.show();
      const oldcount: number = this.settingformInput.OldPassword.toString().length;
      const newcount: number = this.settingformInput.NewPassword.toString().length;
      // if (oldcount < 6) {
      //   this.globalToastService.warning("Old Password must have at least 6 Characters");
      //   return false;
      // } else {
      const json={
        "UserID":this.UserID,
        "OldPassword":this.settingformInput.OldPassword
      }
        this._commonservice.ApiUsingPost("Account/CheckPasswordPortal",json).subscribe(

      (data: any) => {
        if (data == "Ok") {
        if (newcount < 6) {
          // this.globalToastService.warning("New Password must have at least 6 Characters");
          this.ShowAlert("New Password must have at least 6 Characters","warning")
          this.spinnerService.hide();
          return false;
        } else {
          const ujson={
            "UserID":this.UserID,
             "OldPassword":this.settingformInput.OldPassword,
             "NewPassword":this.settingformInput.NewPassword,
              "Key":"en"
          }
          this._commonservice.ApiUsingPost("Account/UpdatePasswordPortal",ujson).subscribe(

            (data: any) => {
              if (data.Status == true) {
                this.spinnerService.hide();
                   this.dialog.open(SuccesspopupComponent, {
                    data: { message:data.Message }
                  })
                // this.globalToastService.success("Password Changed Successfully...!");
                this._router.navigate(["auth/signin"]);
              }
              else {
                this.spinnerService.hide();
                // this.globalToastService.warning(data.Message);
                this.ShowAlert(data.Message,"warning")
                this.spinnerService.hide();
              }

            }, (error: any) => {
              localStorage.clear();
              this.spinnerService.hide();
              // this.globalToastService.warning("Sorry something went wrong");
              this.ShowAlert("Sorry something went wrong","error")
            }
          );
        // }
      }
    }
    else
    {
      if (data == "Wrong Old Password") {
        this.spinnerService.hide();
  //  this.globalToastService.warning("Wrong Old Password");
  this.ShowAlert("Wrong Old Password","warning")
      }
      else if (data == "Invalid UserID") {
        this.spinnerService.hide();
        // this.globalToastService.warning("User Details Not Found...!");
        this.ShowAlert("User Details Not Found...!","warning")
      }
      else {
        this.spinnerService.hide();
        // this.globalToastService.warning("Failed to Validate Old Password");
        this.ShowAlert("Failed to Validate Old Password","warning")
      }
      return false;
    }
    return true;
  }, (error: any) => {
    localStorage.clear();
    this.spinnerService.hide();
    // this.globalToastService.warning("Sorry something went wrong");
    this.ShowAlert("Sorry something went wrong","warning")
  });
  }
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    var datePipe = new DatePipe("en-US");
    this.formInput.StartDate = datePipe.transform(date, 'yyyy-MM-dd');
    this.formInput.EndDate = this.formInput.StartDate
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent: CalendarEvent<any>) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: any): void {
    this.title = event.comment;
    this.description = event.title;
    this.EventStartDate = event.start;
    this.EventEndDate = event.end;
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
  setView(view: CalendarView) {
    this.view = view;
  }
  onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const regex = /^[a-zA-Z\s]$/;
    if (!regex.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
  }
  
  onInputDescChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(value)) {
      inputElement.value = this.formInput.Description; 
    this.formInput.Description = inputElement.value;
    } else {
      this.formInput.Description = value;
    }
  }
  onInputTitleChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(value)) {
      inputElement.value = this.formInput.Title; 
    this.formInput.Title = inputElement.value;
    } else {
      this.formInput.Title = value;
    }
  }
  onPaste(event: ClipboardEvent) {
    const paste = event.clipboardData?.getData('text');
    const regex = /^[a-zA-Z\s]*$/;
    if (paste && !regex.test(paste)) {
      event.preventDefault(); 
    }
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  edit(IL: any): any {
    this.selectedBranchH = []
      this.Editdetails = IL;
      this.editid=IL.HolidayID;   
      this.formInput.IsHalfday = this.Editdetails.IsHalfday;
      const selectedBranch = this.BranchList.find(emp => emp.Value === IL.BranchID);
      // console.log('Selected Branch:', selectedBranch); // Debug log
      if (selectedBranch) {
        this.selectedBranchH = [selectedBranch];
      }
      this.GetBranches()
      this.formInput.StartDate = this.Editdetails.StartDate.split('T')[0];  
      this.formInput.EndDate = this.Editdetails.EndDate.split('T')[0];
      this.formInput.Title = this.Editdetails.Title;
      this.formInput.Description = this.Editdetails.Comment;
      this.Edit=true;
      this.Add = false
      this.showbtn = true

  } 
  addHoliday(){
      this.Add=true;
      this.Edit=false;
      this.showbtn = false
      this.formInput = {
        IsHalfday: false,
        StartDate: '',
        EndDate: '',
        Title: '',
        Description: ''
      };
      this.selectedbranchid=0;this.selectedBranchH=[];
      this.GetOrganization();
      this.GetBranches();
  
  }

  DeleteHoliday(row:any){
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      data: "Are You Sure Want To Delete The Holiday!",
    });
    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.Delete(row);
      dialogRef.close();
  
    },(error):any=>{
      // this.globalToastService.error(error.error.message)
      //this.ShowAlert(error.error.message,"error")
    });
  }
  Delete(row:any){
    this._commonservice.ApiUsingGetWithOneParam("Admin/DeleteHoliday?HolidayID="+row.HolidayID).subscribe((data:any)=>{
      if(data.Status == true){
        // this.toastr.success(data.Message)
        this.dialog.open(SuccesspopupComponent, {
          data: { message:data.Message }
        })
        this.SetCalendarEvent()
      }
      else if(data.Status == false){
        // this.toastr.error(data.Message)
        this.ShowAlert(data.Message,"error")
      }
      else{
        // this.toastr.error("An Error Occured")
        this.ShowAlert("An Error Occured","error")
      }
    },(error)=>{
      // this.globalToastService.error(error.error.message)
      //this.ShowAlert(error.error.message,"error")
    })
  }

  SaveHoliday(){
 if (this.formInput.StartDate == "" || this.formInput.StartDate == undefined) {
      // this.toastr.warning("Please Select StartDate...!");
      // this.ShowAlert("Please Select StartDate...!","warning")
      
    }
    else if (this.formInput.EndDate == "" || this.formInput.EndDate == undefined) {
      // this.toastr.warning("Please Select EndDate...!");
      // this.ShowAlert("Please Select EndDate...!","warning")
      
    }
    else if (this.formInput.Title == "" || this.formInput.Title == undefined) {
      // this.toastr.warning("Please Enter Title...!");
      // this.ShowAlert("Please Enter Title","warning")
      
    }
    else if (this.formInput.Description == "" || this.formInput.Description == undefined) {
      // this.toastr.warning("Please Enter Description...!");
      // this.ShowAlert("Please Enter Description","warning")
      
    }
    else {
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      data: "Are You Sure Want To Add Holiday!",
    });
    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.Save();
      dialogRef.close();
  
    },(error):any=>{
      // this.globalToastService.error(error.error.message)
      //this.ShowAlert(error.error.message,"error")
    });
  }
}
  Save() {
      const json = {
        AdminID: this.AdminID,
        Comment: this.formInput.Description,
        ModifiedBy: this.AdminID,
        StartDate: this.formInput.StartDate,
        EndDate: this.formInput.EndDate,
        IsHalfday: this.formInput.IsHalfday,
        OrgID: this.OrgID,
        Title: this.formInput.Title,
        BranchID:this.selectedbranchid,
        DepartmentID:this.selectedDepartment.length>0? this.selectedDepartment.map((rs:any)=>rs.Value)[0]:0
      }
      this._commonservice.ApiUsingPost("Portal/SetHolidays", json).subscribe(

        (data: any) => {
          if (data.Status == true) {
            this.spinnerService.hide();this.selectedBranchH=[];
            this.dialog.open(SuccesspopupComponent, {
             data: { message:"Holiday Added Successfully" }
           })
            this.formInput.StartDate = ''
            this.formInput.EndDate = ''
            this.formInput.Title = ''
            this.formInput.Description = ''
            this.SetCalendarEvent()
          }
          else {
            // this.toastr.warning(data.Message);
            this.ShowAlert(data.Message,"warning")
            this.spinnerService.hide();
            this.formInput = {
              IsHalfday: false,
              StartDate: '',
              EndDate: '',
              Title: '',
              Description: ''
            };
          }

        }, (error: any) => {
          localStorage.clear();

          ////this.toastr.error(error.message);
          this.spinnerService.hide();
        }
      );
      return true;
    }

  updateHoliday(){
     if (this.formInput.StartDate == ""||this.formInput.StartDate ==undefined) {
      // this.globalToastService.warning("Please Select StartDate...!");
      this.ShowAlert("Please Select StartDate...!","warning")

    }
    else  if (this.formInput.EndDate == ""||this.formInput.EndDate ==undefined) {
      // this.globalToastService.warning("Please Select EndDate...!");
      this.ShowAlert("Please Select EndDate...!","warning")

    }
    else  if (this.formInput.Title == ""||this.formInput.Title ==undefined) {
      // this.globalToastService.warning("Please Enter Title...!");
      this.ShowAlert("Please Enter Title","warning")

    }
    else  if (this.formInput.Description == ""||this.formInput.Description ==undefined) {
      // this.globalToastService.warning("Please Enter Description...!");
      this.ShowAlert("Please Enter Description","warning")
    }
    else{
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      data: "Are You Sure Want To Edit The Holiday!",
    });
    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.Update();
      dialogRef.close();
  
    },(error):any=>{
      // this.globalToastService.error(error.error.message)
      //this.ShowAlert(error.error.message,"error")
    });
  }
}
  Update() { 

       const json={
         AdminID:this.AdminID, 
         Comment:this.formInput.Description,
         ModifiedBy:this.AdminID,
         StartDate:this.formInput.StartDate,
         EndDate:this.formInput.EndDate,
         IsHalfday:this.formInput.IsHalfday,
         OrgID:this.OrgID,
         Title:this.formInput.Title,
         HolidayID:this.editid,
         BranchID:this.selectedbranchid,
         DepartmentID:this.selectedDepartment.length>0? this.selectedDepartment.map((rs:any)=>rs.Value)[0]:0
                   }
       this._commonservice.ApiUsingPost("Portal/UpdateHoliday",json).subscribe(
   
         (data: any) => {
           if(data.Status==true){
            this.selectedBranchH=[];
           this.spinnerService.hide();
           this.dialog.open(SuccesspopupComponent, {
            data: { message:"Holiday Updated Successfully" }
          })
          //  this.globalToastService.success("Holiday Updated Successfully");
           this.SetCalendarEvent()
           this.Edit = false;
           this.Add = true;
           this.formInput = {
            IsHalfday: false,
            StartDate: '',
            EndDate: '',
            Title: '',
            Description: ''
          };
           }
           else
           {
            //  this.globalToastService.warning(data.Message);
            this.ShowAlert(data.Message,"warning")
               this.spinnerService.hide();
           }
           
         }, (error: any) => {
           localStorage.clear();
   
          //  this.globalToastService.error(error.message);
          this.ShowAlert(error.message,"error")
           this.spinnerService.hide();
          }
       );
       return true;
     }
       

   Checkdate(EndDate:any) {
    if (this.formInput.StartDate == '' || this.formInput.StartDate == null || this.formInput.StartDate == "" || this.formInput.StartDate == undefined) {
      // this.toastr.warning("Please select StartDate");
      this.ShowAlert("Please select StartDate","warning")
      this.formInput.EndDate = ''
    }
    else if ((this.formInput.StartDate != '' && this.formInput.StartDate != null && this.formInput.StartDate != "" && this.formInput.StartDate != undefined) && (this.formInput.EndDate != '' && this.formInput.EndDate != null && this.formInput.EndDate != "" && this.formInput.EndDate != undefined)) {
      this.ApiURl = "Portal/CheckDateRange?FromDate=" + this.formInput.StartDate + "&ToDate=" + this.formInput.EndDate;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURl).subscribe((res: any) => {
        if (res.Status == false) {
          // this.toastr.warning("Holidays EndDate should be Greater than StartDate");
          this.ShowAlert("Holidays EndDate should be Greater than StartDate","warning")
          this.formInput.EndDate = '';
        }
      }, (error) => { });
    }
  }
  // CheckDate(date: any) {
  //   this.ApiURL="Admin/CheckDate?UserDate="+date;
  //     this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
  //       (data) => {
  //     if(data.Status==true){
  //      this.spinnerService.hide();
  //         return true;
  //         } else {
  //        this.spinnerService.hide();
  //           this.globalToastService.warning(
  //             "End Date should be greater than Start Date"
  //           );
  //           this.formInput.StartDate = "";
        
  //         return false;
  //      }
  //       },
  //       (error: any) => {
  //    this.spinnerService.hide();
  //    this.globalToastService.warning(error.message);
  //    return false;
  //   }
  //   );
  //  }


  SetCalendarEvent() {
    this.employeeLoading=true
    this.CalendarEvents = []
    this._commonservice.ApiUsingGetWithOneParam("Portal/GetHolidays?OrgID=" + this.OrgID).subscribe((res: any) => {
      if (res.Status == true) {
        this.HolidayList = res.Holidays
      
        const holidayListCopy = [...this.HolidayList];
        for (this.index = 0; this.index < holidayListCopy.length; this.index++) {
          let holi = new eventclass();
          holi.allDay = true;
          holi.draggable = true;
          holi.color = {
            primary: '#ad2121',
            secondary: '#FAE3E3'
          };
          holi.start = new Date(this.HolidayList[this.index].StartDate);
          holi.title = this.HolidayList[this.index].Comment;
          holi.end = new Date(this.HolidayList[this.index].EndDate);
          holi.actions = this.actions,
          holi.comment = this.HolidayList[this.index].Title;
          this.CalendarEvents.push(holi);
          this.employeeLoading=false
        }
        this.events = this.CalendarEvents;
        // this.dtTrigger.next(null);
      }
    }, (error) => {this.employeeLoading=false });
  }
  twhformat(){
    this.twentyfourhoursformat = false
    this.twelvehoursformat = true
  }

  ttfformat(){
    this.twentyfourhoursformat = true
    this.twelvehoursformat = false
  }
  // saveTimeFormat(){
  //   const json = {
  //     "fullday":this.twentyfourhoursformat,
  //     "userid":this.AdminID
  //   }
  //   console.log(json,"time format");
  //   this._commonservice.ApiUsingPost("Admin/timeformat",json).subscribe(data =>{
  //     this.toastr.success(data.msg)
  //   })
  // }
  saveTimeFormat(){
      const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
        data: "Are You Sure Want To Save The Time Format!",
      });
      dialogRef.componentInstance.confirmClick.subscribe(() => {
        this.saveTime();
        dialogRef.close();
    
      },(error):any=>{
        // this.globalToastService.error(error.error.message)
        //this.ShowAlert(error.error.message,"error")
      });
  }
  saveTime(){
    const json = {
      "fullday":this.twentyfourhoursformat,
      "userid":this.AdminID
    }
    console.log(json,"time format");
    this._commonservice.ApiUsingPost("Admin/timeformat",json).subscribe(data =>{
      // this.toastr.success(data.message)
      this.dialog.open(SuccesspopupComponent, {
        data: { message:data.msg }
      })
      this.GetUserProfile()
    },(error)=>{
      // this.globalToastService.warning(error.error.message)
      //this.ShowAlert(error.error.message,"error")
    })
  }

  GetUserProfile() {
    this._commonservice.ApiUsingGetWithOneParam("Employee/GetUserProfileDetails?ID="+this.UserID+"&IsEmail=true").toPromise().then(
       response => {
         if(response.Status==true)
         {
           localStorage.setItem("TimeFormat",response.List[0].TimeFormat);
           localStorage.setItem("UserID",response.List[0].EmpID);
         } 
       })
     }


  addGrace(){
    this.graceTimeAdd=true;
    this.graceTimeEdit=false;
    this.showgracebtn = false
      this.selectedBranch = []
      this.selectedDepartment = []
      this.checkingrace = 0
      this.checkoutgrace = 0
      this.GetOrganization();
      this.GetBranches()
    }
  editAttendanceGrace(IL: any): any {
    this.EditAttendance = IL;
    this.editid=IL.HolidayID;   
    this.editbranch = IL.Branchname
    this.editdeptid = IL.deptID
    this.editdepartment = IL.deptname
    this.checkingrace = IL.CheckinGraceint || 0,
    this.checkoutgrace = IL.checkoutGraceint || 0
    this.graceTimeAdd = false
    this.graceTimeEdit = true
    this.showgracebtn = true
} 
  getAttendanceList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetGraceList?OrgID="+this.OrgID+"&UserID="+this.AdminID+"").subscribe((res:any)=>{
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();
      this.AttendanceGraceList = res.list
         this.dtTrigger.next(null);
    })
  }
  addAttendanceGrace(){
    if(this.selectedBranch.length==0){
      // this.globalToastService.warning("Please Select Branch First")
      this.ShowAlert("Please Select Branch","warning")
    }
      if(this.selectedDepartment.length==0){
      // this.globalToastService.warning("Please Select Branch First")
      this.ShowAlert("Please Select Department","warning")
    }
    else if(this.checkingrace == 0){
      // this.globalToastService.warning("Please Enter Checkin Grace Time")
      this.ShowAlert("Please Enter Checkin Grace Time","warning")
    }else if(this.checkoutgrace == 0){
      // this.globalToastService.warning("Please Enter Checkout Grace Time")
      this.ShowAlert("Please Enter Checkout Grace Time","warning")
    }else{
     const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
    data: "Are You Sure Want To Add Attendance Grace Timings!",
     });
     dialogRef.componentInstance.confirmClick.subscribe(() => {
    this.addAttendanceGraceTiming();
    dialogRef.close();

  },(error):any=>{
    // this.globalToastService.error(error.error.message)
    //this.ShowAlert(error.error.message,"error")
     });
}
  }
  addAttendanceGraceTiming(){
    let selectedbranch =  this.temparray.map((br: any) => br.id)
    let selectedDepartment =  this.selectedDepartment.map((br: any) => br.Value)
    const json = {
        "BranchID":selectedbranch[0],
        "CheckinGrace":this.checkingrace,
        "CheckoutGrace":this.checkoutgrace,
        "DepartmentID":selectedDepartment,
        "key":"en"
      }
    console.log(json,"json");
    this._commonservice.ApiUsingPost("Admin/AddGracePeriodAttendance",json).subscribe((res:any)=>{
      // this.toastr.success(res.message)
      this.dialog.open(SuccesspopupComponent, {
        data: { message:res.message }
      })
      this.getAttendanceList();
      this.selectedBranch = []
      this.selectedDepartment = []
      this.checkingrace = 0
      this.checkoutgrace = 0
    },(error):any=>{
      //this.toastr.error(error.message)
      this.selectedBranch = []
      this.selectedDepartment = []
      this.checkingrace = 0
      this.checkoutgrace = 0
    })
  }

  updateAttendanceGrace(){
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      data: "Are You Sure Want To Edit Attendance Grace Timings!",
    });
    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.updateAttendanceGraceTimings();
      dialogRef.close();
  
    },(error):any=>{
      // this.globalToastService.error(error.error.message)
      //this.ShowAlert(error.error.message,"error")
    });
  }
      updateAttendanceGraceTimings(){
    this._commonservice.ApiUsingGetWithOneParam("Portal/EditGraceTime?deptID="+this.editdeptid+"&Checkingrace="+this.checkingrace+"&checkoutgrace="+this.checkoutgrace+"&Key=en").subscribe((res:any)=>{
    if(res.Status==true)
    {
      this.dialog.open(SuccesspopupComponent, {
        data: { message:res.message }
      })
      this.graceTimeAdd = true
      this.graceTimeEdit = false
      this.getAttendanceList();
    }
    else{
      // this.toastr.warning(res.Message)
      this.ShowAlert(res.Message,"error")
    }
   
    },(error):any=>{
    })
  }

  deleteGrace(row:any){
    const dialogRef = this.dialog.open(DeleteconfirmationComponent, {
      data: row,
    });
    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.confirmed(row);
      dialogRef.close();
    },(error):any=>{
      //this.toastr.error(error.message)
    });
  }

  confirmed(row:any){
   this._commonservice.ApiUsingGetWithOneParam("Admin/RemoveGraceTime?deptID="+row.deptID+"&Key=en").subscribe(data =>{
    // this.toastr.success(data.message)
    this.ShowAlert(data.message,"success")
    this.getAttendanceList()
   })
  }

  getNotificationList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetNotifyTypes?Userid="+this.AdminID+"").subscribe((res:any)=>{
      this.NotificationList = res.List
      // this.NotificationList = this.defaultTypes.map((type:any) => {
      //   const apiItem = res.List.find((item:any) => item.Type === type.type);
      //   let status = apiItem ? !apiItem.Status : false; 
      //   return {
      //     type: type.type,
      //     label: type.label,
      //     status: status
      //   };
      // });
    },(error):any=>{
      // //this.toastr.error(error.message)
    })

  }
  getAccessControlList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetAccesscontrol?UserID="+this.AdminID+"").subscribe((res:any)=>{
      this.AccessControlList = res.List
    },(error):any=>{
      //this.toastr.error(error.message)
    })

  }
  // getGeoConfigList(){
  //   const json = {
  //     "UserID":this.UserID,
  //     "Branchwisedata":[]
  //   }
  //   this._commonservice.ApiUsingPost("Settings/SetGeofenceradius",json).subscribe((res:any)=>{
  //     this.GeoFenceList = res.List.Branchwisedata
  //   },(error):any=>{
  //     this.toastr.error(error.error.message)
  //   })

  // }
  //   InputValidation(bl:any){
  //   if (bl.Radius > 300) {
  //     this.globalToastService.warning("Radius Cannot Be Grater Than 300 meters")
  //     bl.Radius = 300;
  //   }
  //   if (bl.Radius < 0) {
  //     bl.Radius = 0;
  //   }
  // }

  // preventPlusMinus(event: KeyboardEvent): void {
  //   if (event.key === '+' || event.key === '-'|| event.key === 'e' || event.key === 'ArrowUp'|| event.key === 'ArrowDown') {
  //     event.preventDefault();
  //   }
  // }

  // SaveGeoFenced(){
  //   const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
  //     data: "Are You Sure Want To Set The Meters For Particular Branch!",
  //   });
  //   dialogRef.componentInstance.confirmClick.subscribe(() => {
  //     this.SaveGeoFencedLocation();
  //     dialogRef.close();
  
  //   },(error):any=>{
  //     this.globalToastService.error(error.error.message)
  //   });
  // }
  SaveGeoFencedLocation(){
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      data: "Are You Sure Want To Set These Radius!",
    });
    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.submitgeofence();
      dialogRef.close();
  
    },(error):any=>{
      // this.globalToastService.error(error.error.message)
      //this.ShowAlert(error.error.message,"error")
    });

  }

  submitgeofence(){
    let json:any = {
      "UserID":parseInt(this.AdminID)
    }
    json["Branchwisedata"] = this.GeoFenceList.filter((res: any) => res.Radius > 1).map((res: any) => {
      return {
        "Radius":res.Radius,"ID":res.ID
      }
    })
   console.log(json,"save");
   this._commonservice.ApiUsingPost("Settings/SetGeofenceradius",json).subscribe((res:any)=>{
     if(res.Status==true){
       // this.globalToastService.success(res.Message)
       this.dialog.open(SuccesspopupComponent, {
         data: { message:res.Message}
       })
     }else if(res.Status==false){
     // this.globalToastService.error(res.Message)
     this.ShowAlert(res.Message,"error")
     }else{
     // this.globalToastService.error("An Error Occured")
     this.ShowAlert("An Error Occured","error")
     }
   },(error):any=>{
     // this.globalToastService.error(error.error.message)
     //this.ShowAlert(error.error.message,"error")
   })
  }

  checkIfAnySelected() {
    this.isAnySelected = this.NotificationList.some(noti => noti.Status);
  }

  saveNotification(){
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      data: "Are You Sure Want To Save The Notification Settings!",
    });
    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.saveNotificationMessages();
      dialogRef.close();
  
    },(error):any=>{
      // this.globalToastService.error(error.error.message)
      //this.ShowAlert(error.error.message,"error")
    });
  }
  
  saveNotificationMessages(){
    const NotifyTypes = this.NotificationList
    .filter(noti => noti.Status)  
    .map(noti => {
    return { "Status": noti.Status, "Type": noti.Type };
  });
  const json = {
    "NotifyTypes": NotifyTypes,
    "UserID":this.AdminID
  }
  console.log(json,"json for add notification");
  
  this._commonservice.ApiUsingPost("Admin/AddNotifySettings",json).subscribe((res: any) => {
    //  this.toastr.success(res.Message)
    this.dialog.open(SuccesspopupComponent, {
      data: { message:res.Message }
    })
     this.getNotificationList()
    },(error):any=>{
      // this.toastr.error(error.error.Message)
      //this.ShowAlert(error.error.message,"error")
    });
}
saveAccessControl(){
  const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
    data: "Are You Sure Want To Save The Controls!",
  });
  dialogRef.componentInstance.confirmClick.subscribe(() => {
    this.saveAccessControlModule();
    dialogRef.close();

  },(error):any=>{
    // this.globalToastService.error(error.error.message)
    //this.ShowAlert(error.error.message,"error")
  });
}
   saveAccessControlModule(){
  const json = {
    "AccessRights":this.AccessControlList.map((res:any)=>{
     return {
      "AdminID":res.AdminID,
     "Branchid":res.Branchid,
     "BranchName":res.BranchName,
     "isExpenses":res.isExpenses,
     "isLoanAdvance":res.isLoanAdvance
    }
    })
  }
  console.log(json,"json for add accesscontrol");
  
  this._commonservice.ApiUsingPost("Admin/SaveAccesscontrol",json).subscribe((res: any) => {
    //  this.toastr.success(res.Message)
    this.dialog.open(SuccesspopupComponent, {
      data: { message:res.Message }
    })
     this.getNotificationList()
    },(error):any=>{
      // this.toastr.error(error.error.Message)
      //this.ShowAlert(error.error.message,"error")
    });
}

openDialog(Module:any): void {
  this.dialog.open(ComingSoonComponent,{
    data: {Module:Module}
     ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
    if(res){
    }
  })
}

     ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
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
