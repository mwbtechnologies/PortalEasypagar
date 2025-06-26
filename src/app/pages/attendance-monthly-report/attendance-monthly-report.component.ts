import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApproveattendanceComponent } from './approveattendance/approveattendance.component';
import { DatePipe } from '@angular/common';
import { ShowAlertComponent } from './showalert/showalert.component';
import { ShowapprovallistComponent } from './showapprovallist/showapprovallist.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

export interface DialogData {
  Array: any;
  SessionTypes: any;
  ApprovedSessionID: any;
}

export class DynamicArray {
  RequestID: any;
  Date: any;
  IsHalfDay: any;
  IsFullDay: any;
  LeaveType: any;
  ApprovedLeaveType: any;
  ApproveStatus: any;
}
export class Dropdown {
  Text: any;
  Value: any;
}
export class FormInput {
  StartDate: any;
}

@Component({
  selector: 'app-attendance-monthly-report',
  templateUrl: './attendance-monthly-report.component.html',
  styleUrls: ['./attendance-monthly-report.component.css']
})
export class AttendanceMonthlyReportComponent {
 formInput: FormInput | any;
  public isSubmit: boolean | any;
  LoginUserData: any;
  ListTypes: Array<Dropdown> = [];
  AdminID: any;
  ApiURL: any;
  file: any;
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
  DateRange: Array<DynamicArray> = [];
  length: any;
  employeeData:any
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
  ShowEarlyIn:any=false;
  ShowLateExit:any=false;
  ShowActPresent:any=false
  ShowOnTimeExit:any=false;
  ShowOnTime:any=false;ShowPending:any=false;ShowShift:any=false;
  BranchName: any;UserID:any;
  userselectedbranchid: any;RecordDate:any;
  showBreakHistory = false
  showShiftWise = false
  shiftdata:any
  FiltersType:any;
  TotalCount: any;
  LateExitcount: any=0;
  OnTimeOutcount: any=0;
  EarlyCheckinCount: any=0;
  checkall: boolean=false;
  userselecteddeptid: any;
  userselectedemployeeid: any;
  EmployeeList: any[]=[]
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  YearList: any;
  MonthList: any;
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  monthSettings :IDropdownSettings = {}
  yearSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  selectedBranch: []=[];
  selectedEmployees: []=[];
  selectedDepartment: []=[];
  currentyear: any;
  currentmonth: any;
  originalAttendanceList: any;
  selectedOrganization:any[]=[]
  OrgList:any[]=[];
  ActualPresentCount:any=0;
  PresentText:any
  orgSettings:IDropdownSettings = {}
  constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private toastr: ToastrService, private dialog: MatDialog) { 
    this.SingleSelectionSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.branchSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.departmentSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.yearSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.employeeSettings = {
      singleSelection: true,
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
    this.isSubmit = false 
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
  }
  ngOnInit(): void {
    this.BranchID = 0;
    this.formInput = {
      StartDate: ''
    }
    this.PresentText="P(0) WO(0) L(0) H(0)";
    this.currentmonth=0;
    this.currentyear=0;
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID=localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
  this.BranchID = localStorage.getItem("BranchID");
  this.userselectedbranchid=this.BranchID;
  this.BranchName = localStorage.getItem("BranchName"); 
  this.formInput.StartDate = localStorage.getItem("Date");
  this.UserID=localStorage.getItem("UserID");
    this.FilterType=['All'];
    this.selectedBranchId = 0; this.selectedDepartmentId = 0;
    this.GetOrganization();
    this.GetBranches();
    this.GetYearList();
    this.GetMonthList();
 
    this.getcheckintypes();
    const now = new Date();
    const currentMonth = now.getMonth() + 1; 
    const currentYear = now.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = currentMonth - 1;

    this.selectedMonth = [{
      "Value": currentMonth, 
      "CreatedByID": null,
      "Text": monthNames[monthIndex],
      "createdbyname": null,
      "Key": null
    }];
    this.selectedyear = [{
     "Value": currentYear,
     "CreatedByID": null,
     "Text": currentYear.toString(),
     "createdbyname": null,
     "Key": null
 }]
 this.currentyear=currentYear;
 this.currentmonth=currentMonth;
 this.getemployeeslist();
  }

  GetYearList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
    console.log(error);
 });
  }
  GetMonthList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
    console.log(error);
 });
  }
  Search()
  {
    localStorage.removeItem("RecordID");this.RecordID=0;
    localStorage.removeItem("RecordDate");this.RecordDate=null;
    localStorage.removeItem("BranchID");
    localStorage.removeItem("BranchName");
    localStorage.removeItem("Date");
    this.GetAttendanceList(); 
    this.selectedListType=[];
    this.ShowPresent=false;this.ShowAbsent=false;this.ShowEarlyExit=false;this.ShowEarlyIn=false;this.ShowLateExit=false;this.ShowLateIn=false;this.ShowOnTime=false;this.ShowOnTimeExit=false;
    
    // this.GetAttendanceCount();
    // this.GetShiftFilters(this.formInput.StartDate);
  }

  parseDateString(dateString: string): Date {
    // Split the date and time parts
    const [datePart, timePart] = dateString.split('T');
  
    // Split the date part into day, month, and year
    const [year, month, day] = datePart.split('-').map(part => parseInt(part, 10));
  
  
    // Create a new Date object using the parsed components
    const parsedDate = new Date(year, month - 1,day);
    return parsedDate;
  }
  onselectedOrg(item:any){
    this.selectedBranchId = []
    this.selectedDepartmentId = []
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranchId = []
    this.selectedDepartmentId = []
    this.GetBranches()
  }

  GetOrganization() {
    this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List
      if(data.List.length == 1){
        this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
        this.onselectedOrg({Value:this.OrgList[0].Value,Text:this.OrgList[0].Text})
      }
    }, (error) => {
      this.ShowToast(error,"error")
       console.log(error);
    });
  }

  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      console.log(data);
      if (data.List.length > 0) {
        this.AllBranchList = data.List;
        let tmp = [];

        if (this.AllBranchList.length > 0) 
          {
          for (let i = 0; i < this.AllBranchList.length; i++) {
            tmp.push({ id: this.AllBranchList[i].Value, text: this.AllBranchList[i].Text });
          }
        }
        this.Columns = tmp;
        this.selectedBranchId=[this.BranchName];
        this.userselectedbranchid=this.BranchID;
        this.OriginalBranchList = this.Columns;
      }
    }, (error) => {
      this.SelectedBranch = this.Columns;
      // this.globalToastService.error(error); 
      this.ShowToast(error,"error")
      console.log(error);
    });
  }

  CheckPendingStatus(event:any)
  {
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetPendingStatus?AdminID="+this.AdminID+"&Date="+event.target.value).subscribe((data) => {
      console.log(data);
      if (data.Status==true) {
        // this.formInput.StartDate = localStorage.setItem("Date",event.target.value);
     localStorage.setItem("Date",event.target.value);
     var msg="Dear "+data.Name+ ".Please Don't Forget to Approve Pending Attendance";
     this.ShowAlert(msg);
      }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowToast(error,"error")
       console.log(error);
    });
  }

  GetDepartments() {
    var tmp=[];
    this.DeptColumns=[];
    this.selectedDepartment=[];
    if(this.selectedBranch.length==0){this.userselectedbranchid=0;} else{this.userselectedbranchid=this.selectedBranch?.map((y:any) => y.id)[0];}
    if(this.userselectedbranchid>0)
      {
      tmp.push({"id":this.userselectedbranchid});
      }
      var loggedinuserid=localStorage.getItem("UserID");
    const json = {
      "AdminID":loggedinuserid,
      "OrgID":this.OrgID,
      "Branches": tmp
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DeptColumns = data.DepartmentList;
      }
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowToast(error,"error")
      console.log(error);
    });
  }


  getcheckintypes() {
    this.ApiURL = "Admin/GetCheckInTypes/Session/0/en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.SessionTypes = data.List, (error) => {

    });
  }

  // GetShiftFilters(Date:any) {
  //   if(this.userselectedbranchid==null){this.userselectedbranchid=0;}
  //   this.ApiURL = "ShiftMaster/GetPortalShiftFilters?AdminID="+this.AdminID+"&BranchID="+this.userselectedbranchid+"&Date="+Date;
  //   this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.FiltersType = data.List, (error) => {

  //   });
  // }
  ShowAlert(Message: any): void {
    this.dialog.open(ShowAlertComponent,{
      data: { IL:Message}
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
      if(res){
      }
    })
  }
  openDialog(IL: any): void {
    this.dialog.open(ApproveattendanceComponent,{
      data: { IL, fulldata: this.AttendanceList }
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
      // if(res){
        localStorage.removeItem("RecordID");this.RecordID=0;
        localStorage.removeItem("RecordDate");this.RecordDate=null;
     this.GetAttendanceList();
        this.checkall=false;
        // this.GetAttendanceCount()
      // }
    })
  }
  openBreakHistory(row:any){
    this.showBreakHistory = true
    this.ShowList = false
    console.log(row,"rowClick");
    this.employeeData = {empid:row.EmployeeID ,date:this.formInput.StartDate,name:row.EmployeeName}
    console.log(this.employeeData,"whats here");
    
    // this.InoutHistory = row
  }
  backToAttendance(){
    this.showBreakHistory = false
    this.showShiftWise = false
    this.ShowList = true
    this.GetBranches()
    // this.GetAttendanceList()
  }

  ApproveAll(Type:any) {
    var tmp=[];
    for(this.index=0;this.index<this.AttendanceList.length;this.index++)
    {
      if(this.AttendanceList[this.index].IsChecked==true)
      {
        tmp.push({"EmployeeID":this.AttendanceList[this.index].EmployeeID, "Date":this.AttendanceList[this.index].Date})
      }
      
    }
const json={
  Date:this.formInput.StartDate,
  Status:Type,
  AdminID:this.AdminID,
  Key:'en',
  Employees:tmp
}
this.dialog.open(ShowapprovallistComponent,{
  data: { IL:json}
   ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
//  this.GetAttendanceCount();
this.GetAttendanceList();
 this.checkall=false;
})


  }



  Approve(ID: any, ApprovedType: any, Comment: any) {
    if (ApprovedType == "" || ApprovedType == null || ApprovedType == undefined) {
      // this.toastr.warning("Please Select Approved Session Type");
      this.ShowToast("Please Select Approved Session Type","warning")
    }
    else if (Comment == "" || Comment == null || Comment == 0) {
      // this.toastr.warning("Please Enter Comment");
      this.ShowToast("Please Enter Comment","warning")
    }
    else {
      this.ApiURL = "Admin/ApproveAttendance?AttendanceID=" + ID + "&Status='Approved'&Comment=" + Comment + "&SessionTypeID=" + ApprovedType + "&Key=en&AdminID="+this.AdminID+"&ShiftID=0";

      this._commonservice.ApiUsingPostWithOneParam(this.ApiURL).subscribe(data => {
        if (data.Status == true) {
          // this.toastr.success(data.Message);
          this.ShowToast(data.Message,"success")
          this.spinnerService.hide();
          this.GetAttendanceList();
        }
        else {
          // this.toastr.warning(data.Message);
          this.ShowToast(data.Message,"warning")
          this.spinnerService.hide();
        }

      }, (error: any) => {
        //  this.toastr.error(error.message);
        this.spinnerService.hide();

      }

      );
      this.spinnerService.hide();

    }

  }

  Reject(ID: any, Comment: any) {
    if (Comment == "" || Comment == null || Comment == 0) {
      // this.toastr.warning("Please Enter Comment");
      this.ShowToast("Please Enter Comment","warning")
    }
    else {
      this.ApiURL = "Admin/ApproveAttendance?AttendanceID=" + ID + "&Status='Rejected'&Comment=" + Comment + "&SessionTypeID=0&Key=en&AdminID="+this.AdminID+"&ShiftID=0";

      this._commonservice.ApiUsingPostWithOneParam(this.ApiURL).subscribe(data => {
        if (data.Status == true) {
          // this.toastr.success(data.Message);
          this.ShowToast(data.Message,"success")
          this.spinnerService.hide();
          this.GetAttendanceList();
        }
        else {
          // this.toastr.warning(data.Message);
          this.ShowToast(data.Message,"warning")
          this.spinnerService.hide();
        }

      }, (error: any) => {
        //  this.toastr.error(error.message);
        this.spinnerService.hide();

      }

      );
      this.spinnerService.hide();

    }

  }

  GetAttendanceList()
  {
    //   if(this.selectedBranch.length == 0){
    //     this.globalToastService.warning("Please Select Branch")
    //   }
    //  else
      if(this.selectedyear.length == 0){
        // this.globalToastService.warning("Please Select year")
        this.ShowToast("Please Select year","warning")
      }
      else if(this.selectedMonth.length == 0){
        // this.globalToastService.warning("Please Select Month")
        this.ShowToast("Please Select Month","warning")
      }
      else if(this.selectedEmployees.length == 0){
        // this.globalToastService.warning("Please Select Employee")
        this.ShowToast("Please Select Employee","warning")
      }else{
        this.spinnerService.show();
        const Month = this.selectedMonth?.map((y:any) => y.Value)[0]
        const Year = this.selectedyear?.map((y:any) => y.Text)[0]
        const EmployeeId = this.selectedEmployees.map((e:any) => e.Value)[0]
        this.ApiURL="Performance/GetCustomAttendance?EmployeeID="+EmployeeId+"&Month="+Month+"&Year="+Year+"&StartDate=&EndDate=&Filter=All";
     
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();
      this.originalAttendanceList=res.List;
      this.AttendanceList = res.List;
      this.Absentcount=res.Absent;
      this.EarlyExitCount=res.EarlyExitcount;
      this.LateCheckinCount=res.Lateincount;
      // this.Efficiency=res.Absent;
      this.OnTimeCheckinCount=res.OnTimeIncount;
      this.pendingcount=res.Pending;
      this.presentcount=res.Present;
      this.TotalCount=res.totalcount;
      this.EarlyCheckinCount=res.Earlyincount;
      this.LateExitcount=res.LateExitcount;
      this.OnTimeOutcount=res.OnTimeOutcount;
      this.ActualPresentCount=res.ActualPresentCount;
      this.PresentText="P("+res.PresentAct+") WO("+res.WeekOff+") L("+res.Leaves+") H("+res.Holiday+")";
      this.dtTrigger.next(null);
      this.spinnerService.hide();

    }, (error) => {
      this.spinnerService.hide();
    });
      }
    }

    GetFilteredAttendanceList()
    {
        if(this.selectedyear.length == 0){
          // this.globalToastService.warning("Please Select year")
            this.ShowToast("Please Select year","warning")
        }
        else if(this.selectedMonth.length == 0){
          // this.globalToastService.warning("Please Select Month")
          this.ShowToast("Please Select Month","warning")
        }
        else if(this.selectedEmployees.length == 0){
          // this.globalToastService.warning("Please Select Employee")
           this.ShowToast("Please Select Employee","warning")
        }else{
          const Month = this.selectedMonth?.map((y:any) => y.Value)[0]
          const Year = this.selectedyear?.map((y:any) => y.Text)[0]
          const EmployeeId = this.selectedEmployees.map((e:any) => e.Value)[0]
          this.ApiURL="Performance/GetCustomAttendance?EmployeeID="+EmployeeId+"&Month="+Month+"&Year="+Year+"&StartDate=&EndDate=&Filter="+this.selectedListType;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
    
    //     this.originalAttendanceList=res.List;
    
    //     this.Absentcount=res.Absent;
    //     this.EarlyExitCount=res.EarlyExitcount;
    //     this.LateCheckinCount=res.Lateincount;
    //     // this.Efficiency=res.Absent;
    //     this.OnTimeCheckinCount=res.OnTimeIncount;
    //     this.pendingcount=res.Pending;
    //     this.presentcount=res.Present;
    //     this.TotalCount=res.totalcount;
    //     this.EarlyCheckinCount=res.Earlyincount;
    //     this.LateExitcount=res.LateExitcount;
    //     this.OnTimeOutcount=res.OnTimeOutcount;
    //     var table = $('#DataTables_Table_0').DataTable();
    //     table.destroy();
    //     this.AttendanceList = res.List;
    //     this.dtTrigger.next(null);
    //     this.spinnerService.hide();
  
    //   }, (error) => {
    //     this.spinnerService.hide();
    //   });
    //     }
    //   }
      })
    }
  }

  onselectedTypeChangenew(event: any) {
    this.selectedListType=event;
    // this.GetAttendanceList();
    this.FilterType=[event];
    //  this.GetAttendanceCount();
  }
  onselectedTypeChange(event: any) {
    this.spinnerService.show();  
    var table = $('#DataTables_Table_0').DataTable();
    table.destroy();
    this.selectedListType=event;
    if(this.selectedListType=="actualpresent")
      {
        this.ShowActPresent=true;
        this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;this.ShowEarlyIn=false;
        this.ShowLateExit=false;
        this.ShowOnTimeExit=false;
        this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;
        this.AttendanceList = this.originalAttendanceList.filter((record: { count: any; }) => record.count != 0);
  
      }
    if(this.selectedListType=="present")
    {
      this.ShowActPresent=false;
      this.ShowPresent=true;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;this.ShowEarlyIn=false;
      this.ShowLateExit=false;
      this.ShowOnTimeExit=false;
      this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;
      this.AttendanceList = this.originalAttendanceList.filter((record: { Type: any; }) => record.Type != "A" && record.Type!="LOP" );

    }
    if(this.selectedListType=="absent")
    {
      this.ShowActPresent=false;
      this.ShowPresent=false;this.ShowAbsent=true;this.ShowLateIn=false;this.ShowEarlyExit=false;this.ShowEarlyIn=false;
      this.ShowLateExit=false;
      this.ShowOnTimeExit=false;
      this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;
      this.AttendanceList = this.originalAttendanceList.filter((record: { Type: string }) => 
        record.Type.includes("A") || record.Type.includes("LOP")
      );
    }
    if(this.selectedListType=="ontime")
      {
        this.ShowActPresent=false;
        this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
        this.ShowOnTime=true;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
        this.ShowLateExit=false;
        this.ShowOnTimeExit=false;
        this.AttendanceList = this.originalAttendanceList.filter((record: { Instatus: any; }) => record.Instatus == "OnTime");
   
      }
      if(this.selectedListType=="latein")
        {
          this.ShowActPresent=false;
          this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=true;this.ShowEarlyExit=false;
          this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
          this.ShowLateExit=false;
          this.ShowOnTimeExit=false;
          this.AttendanceList = this.originalAttendanceList.filter((record: { Instatus: any; }) => record.Instatus == "LateIn");
   
        }
        if(this.selectedListType=="earlyexit")
          {
            this.ShowActPresent=false;
            this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=true;
            this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
            this.ShowLateExit=false;
            this.ShowOnTimeExit=false;
            this.AttendanceList = this.originalAttendanceList.filter((record: { Outstatus: any; }) => record.Outstatus == "EarlyExit");
   
          }
          if(this.selectedListType=="pending")
            {
              this.ShowActPresent=false;
              this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
              this.ShowOnTime=false;this.ShowPending=true;this.ShowShift=false;this.ShowEarlyIn=false;
              this.ShowLateExit=false;
              this.ShowOnTimeExit=false;

              this.AttendanceList = this.originalAttendanceList.filter((record: { Attstatus?: string }) =>
                record.Attstatus &&
                (record.Attstatus.includes("Partial") || 
                 record.Attstatus.includes("Partially") || 
                 record.Attstatus.includes("Pending"))
            );
            }
            if(this.selectedListType=="earlyin")
              {
                this.ShowActPresent=false;
                this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
                this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=true;
                this.ShowLateExit=false;
                this.ShowOnTimeExit=false;
                this.AttendanceList = this.originalAttendanceList.filter((record: { Instatus: any; }) => record.Instatus == "EarlyIn");
   
              }
              if(this.selectedListType=="lateexit")
                {
                  this.ShowActPresent=false;
                  this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
                  this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
                  this.ShowLateExit=true;
                  this.ShowOnTimeExit=false;
                  this.AttendanceList = this.originalAttendanceList.filter((record: { Outstatus: any; }) => record.Outstatus == "LateExit");
                  
                }
                if(this.selectedListType=="ontimeexit")
                  {
                    this.ShowActPresent=false;
                    this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
                    this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
                    this.ShowLateExit=false;
                    this.ShowOnTimeExit=true;
                    this.AttendanceList = this.originalAttendanceList.filter((record: { Outstatus: any; }) => record.Outstatus == "OntimeExit");
                  }
                  this.dtTrigger.next(null);
                  this.spinnerService.hide();         
  }
  
  onDeselectedTypeChange(event: any) {
    this.selectedListType=0;
    this.FilterType=['All'];
  }
  openShiftData(){
    if(this.userselectedbranchid == null || this.userselectedbranchid == undefined || this.userselectedbranchid == ""){
      this.userselectedbranchid=0;
    }
    // else{
    this.shiftdata = {
       date:this.formInput.StartDate,
      branch:this.userselectedbranchid,
      department:this.selectedDepartmentId}
      console.log(this.shiftdata,"what");
      
    this.showShiftWise = true
    this.showBreakHistory = false
    this.ShowList = false
    // }
   
  }

  onDeselectedDepartmentsChange(event: any) {
    this.userselecteddeptid=0; this.getemployeeslist();
  }
  onselectedDepartmentsChange(event: any) {
    this.userselecteddeptid=event.id;this.getemployeeslist();
  }
  onDeselectedBranchesChange(event: any) {this.selectedDepartment=[];this.selectedBranchId=0;this.userselectedbranchid=0; this.userselecteddeptid=0;this.getemployeeslist();  this.GetDepartments(); }
  onselectedBranchesChange(event: any) { 
    this.userselectedbranchid=event.id; this.selectedDepartment=[];this.userselecteddeptid=0;
    this.GetDepartments();this.getemployeeslist();
  }

  onDeselectedEmployeeChange(event: any) {this.userselectedemployeeid=0; }
  onselectedEmployeeChange(event: any) { 
    this.userselectedemployeeid=event.Value;

  }

  getemployeeslist()
  {
    var year=0; var month=0;
    if(this.selectedBranch.length==0){this.userselectedbranchid=0;} else{this.userselectedbranchid=this.selectedBranch?.map((y:any) => y.id)[0];}
    if(this.selectedDepartment.length==0){this.userselecteddeptid=0;} else{this.userselecteddeptid=this.selectedDepartment?.map((y:any) => y.id)[0];}
    if(this.selectedyear.length==0){year=this.currentyear} else{year=this.selectedyear?.map((y:any) => y.Value)[0];}
if(this.selectedMonth.length==0){month=this.currentmonth} else{month=this.selectedMonth?.map((y:any) => y.Value)[0];}
if(this.userselecteddeptid>0){this.userselecteddeptid=this.userselecteddeptid}else{this.userselecteddeptid=0;}
if(this.userselectedbranchid>0){this.userselectedbranchid=this.userselectedbranchid}else{this.userselectedbranchid=0;}
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.userselectedbranchid+"&DeptId="+this.userselecteddeptid+"&Year="+year+"&Month="+month+"&Key=en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
       console.log(error);
      this.spinnerService.hide();
    });
  }

  allCheck(event: any) {
    this.EnableApprove = false;
    this.checkall = true
    const isChecked = event.target.checked;

    for (let i = 0; i < this.AttendanceList.length; i++) {
        if (this.AttendanceList[i].AllowApprove!=false && this.AttendanceList[i].Type != "H" && this.AttendanceList[i].Type != "WO" && this.AttendanceList[i].Type != "PL" && this.AttendanceList[i].Type != "SL") {
          if(this.AttendanceList[i].Type == "A" &&this.AttendanceList[i].count != 0)
            {
          this.AttendanceList[i].IsChecked = isChecked;
            }
      }
    }

    if (isChecked) {
        this.EnableApprove = true;
    }
}
 
  OnChange(event:any) {
    this.checkall = this.AttendanceList
    .filter((employee: any) => employee.Type !== 'Absent')
    .every((employee: any) => employee.IsChecked);
    this.EnableApprove = this.AttendanceList.some((employee:any) => employee.IsChecked);
}

exportPdf(){
  if(this.AttendanceList.length>0)
  {
  const json = {
    "AttendanceList":this.AttendanceList
  }
  this._commonservice.ApiUsingPostNew("ReportsNew/GetEmpMonthlyAttendanceReport",json,{ responseType: 'text' }).subscribe((res:any)=>{
    if(res){
       window.open(res,'_blank')
    }
   else{
    // this.globalToastService.error("Something went wrong");
    this.ShowToast("Something went wrong","error")
   }
  },(error)=>{
    // this.globalToastService.error(error.message);
    this.ShowToast(error.message,"error")
  })
}
}
exportExcel(){
  if(this.AttendanceList.length>0)
    {
  const json = {
    "AttendanceList":this.AttendanceList
  }
  this._commonservice.ApiUsingPostNew("ExReports/GetMonthlyAttendanceReport",json,{ responseType: 'text' }).subscribe((res:any)=>{
    if(res){
      window.open(res,'_blank')
   }
  else{
  //  this.globalToastService.error("Something went wrong");
   this.ShowToast("Something went wrong","error")
  }
  },(error)=>{
    // this.globalToastService.error(error.message);
        this.ShowToast(error.message,"error")
  })
}
}
backToDashboard(){
  this._router.navigate(["appdashboard"]);
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
