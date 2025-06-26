import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-view-employee-attendance',
  templateUrl: './view-employee-attendance.component.html',
  styleUrls: ['./view-employee-attendance.component.css']
})
export class ViewEmployeeAttendanceComponent implements OnInit {
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
  selectedBranchId: any[]=[];
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
  SingleSelectionSettings:IDropdownSettings = {};
  branchsettings:IDropdownSettings = {};
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
  ShowLateExit:any=false;ShowActPresent:any=false;ShowActAbsent:any=false;
  ShowOnTimeExit:any=false;
  ShowOnTime:any=false;ShowPending:any=false;ShowShift:any=false;
  BranchName: any;UserID:any;
  userselectedbranchid: any;RecordDate:any;
  showBreakHistory = false
  showShiftWise = false
  shiftdata:any
  FiltersType:any;
  TotalCount: any;
  ActualPresentCount:any=0;
  ActualAbsentCount:any=0;
  LateExitcount: any=0;
  OnTimeOutcount: any=0;
  EarlyCheckinCount: any=0;
  checkall: boolean=false;
  originalAttendanceList: any;
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {};
  PresentText:any;

  constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private toastr: ToastrService, private dialog: MatDialog) { 
    this.SingleSelectionSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.branchsettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
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
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID=localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
  this.BranchID = localStorage.getItem("BranchID");
  this.userselectedbranchid=this.BranchID;
  this.BranchName = localStorage.getItem("BranchName"); 
  this.formInput.StartDate = localStorage.getItem("Date");
  this.RecordID=  localStorage.getItem("RecordID");
  this.RecordDate=  localStorage.getItem("RecordDate");
  this.UserID=localStorage.getItem("UserID");
  if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
  {
    this.userselectedbranchid=0;
    var today=this.parseDateString(this.RecordDate); 
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = today.getDate().toString().padStart(2, '0');
    this.formInput.StartDate= `${year}-${month}-${day}`; 
      this.GetAttendanceList();
    this.GetShiftFilters(this.formInput.StartDate);
  }
  else
  {
    if (this.formInput.StartDate == null || this.formInput.StartDate == undefined || this.formInput.StartDate=='') {
      const today = new Date();
      const year = today.getFullYear();
      const month =(today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = today.getDate().toString().padStart(2, '0');
      this.formInput.StartDate = `${year}-${month}-${day}`;
      // this.GetAttendanceList();
      // this.GetShiftFilters(this.formInput.StartDate);
    } 
  }
    this.FilterType=['All'];
    this.selectedBranchId = []; this.selectedDepartmentId = 0;
    // this.selectedListType="All"; 

    this.GetOrganization();
    this.GetBranches();
    // this.GetDepartments();
    this.getcheckintypes();
    if(this.userselectedbranchid>0 && this.userselectedbranchid!=null && this.userselectedbranchid!=undefined)
    {
     
      // this.GetAttendanceCount();
      this.GetAttendanceList();
      this.GetShiftFilters(this.formInput.StartDate);
    }
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
  //  if(this.selectedOrganization.length>0)
  //  {
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
        this.selectedBranchId=[];
        if(this.BranchName!="" && this.BranchName!=null && this.BranchName!=undefined)
        {
          this.selectedBranchId = this.Columns.filter((branch: any) => 
            this.BranchName.includes(branch.text))
        }
        this.userselectedbranchid=this.BranchID;
        this.OriginalBranchList = this.Columns;
        this.GetDepartments();
      }
    }, (error) => {
      this.SelectedBranch = this.Columns;
      // this.globalToastService.error(error);
      this.ShowToast(error,"error")
       console.log(error);
    });
  //  }

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
    this.selectedDepartmentId=[];
    var loggedinuserid=localStorage.getItem("UserID");
    var tmp=[];
    this.selectedDepartmentId=[];
    if(this.userselectedbranchid>0)
      {
      tmp.push({"id":this.userselectedbranchid});
      }
    const json = {
      "OrgID":this.OrgID,
      "Branches": tmp,
      "AdminID":loggedinuserid
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

  GetShiftFilters(Date:any) {
    if(this.userselectedbranchid==null){this.userselectedbranchid=0;}
    this.ApiURL = "ShiftMaster/GetPortalShiftFilters?AdminID="+this.AdminID+"&BranchID="+this.userselectedbranchid+"&Date="+Date;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.FiltersType = data.List, (error) => {

    });
  }
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
        tmp.push({"EmployeeID":this.AttendanceList[this.index].EmployeeID})
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
          this.GetAttendanceList();
          this.spinnerService.hide();
       
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
          this.GetAttendanceList();
          this.spinnerService.hide();
   
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

  GetAttendanceList() {

    if (this.selectedBranchId.length>0 ||  this.userselectedbranchid>0) 
      {     
        if (this.formInput.StartDate == null || this.formInput.StartDate == undefined || this.formInput.StartDate == "") {
      var currentdate = new Date();
      this.formInput.StartDate = currentdate;     
    }  
    var len=this.formInput.StartDate.length;console.log(len);
    if(len==undefined || len>10 || len==null)
    {
      var datePipe = new DatePipe('en-US');
      this.formInput.StartDate= datePipe.transform(this.formInput.StartDate, 'dd/MM/yyyy');
    }
    if(this.userselectedbranchid==undefined||this.userselectedbranchid==null||this.userselectedbranchid=='')
      {
        this.userselectedbranchid= this.selectedBranchId.map(res => res.Value)[0] || 0;
      }
      if(this.selectedDepartmentId==undefined||this.selectedDepartmentId==null||this.selectedDepartmentId==''|| this.selectedDepartmentId=='undefined')
        {
          this.selectedDepartmentId=0;
        }
    this.ApiURL = "Performance/GetDailyAttendance?AdminID=" + this.UserID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=All&DeptID=" + this.selectedDepartmentId;
   
    // if(this.selectedListType==undefined||this.selectedListType==null||this.selectedListType=='')
    // {
    //   this.ApiURL = "Performance/GetDailyAttendance?AdminID=" + this.UserID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=All&DeptID=" + this.selectedDepartmentId;
  
    // }
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
      //    var table = $('#DataTables_Table_0').DataTable();
      // table.destroy();
      this.ShowPresent=false;this.ShowAbsent=false;this.ShowEarlyExit=false;this.ShowEarlyIn=false;this.ShowLateExit=false;this.ShowLateIn=false;this.ShowOnTime=false;this.ShowOnTimeExit=false;
    this.ShowPending=false;
     this.originalAttendanceList= res.List;
      this.Absentcount=res.Absent;
      this.EarlyExitCount=res.EarlyExitcount;
      this.LateCheckinCount=res.Lateincount;
      // this.Efficiency=res.Absent;
      this.OnTimeCheckinCount=res.OnTimeIncount;
      // this.pendingcount=res.Pending;
      this.pendingcount=res.ActualPendingCount;
      this.presentcount=res.Present;
      this.TotalCount=res.totalcount;
      this.ActualPresentCount=res.ActualPresentCount;
      this.ActualAbsentCount=res.ActualAbsentCount;
      this.EarlyCheckinCount=res.Earlyincount;
      this.LateExitcount=res.LateExitcount;
      this.OnTimeOutcount=res.OnTimeOutcount;
      this.PresentText="P("+res.PresentAct+") WO("+res.WeekOff+") L("+res.Leaves+") H("+res.Holiday+")";
   
      this.AttendanceList = res.List;
      // this.dtTrigger.next(null);
      // this.spinnerService.hide();
      if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
        {
          this.AttendanceList = res.List.filter((item:any) => item.EmployeeID ===parseInt(this.RecordID));
          if(this.AttendanceList.length==1)
          {
            localStorage.removeItem("RecordID");this.RecordID=0;
            localStorage.removeItem("RecordDate");this.RecordDate=null;
            this.openDialog(this.AttendanceList[0]);
            this.spinnerService.hide();
          }
        }
    this.onselectedTypeChange(this.selectedListType);
    this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
    });
  }
  else
  {
    // if(this.selectedOrganization.length==0)
    // {
    //   this.ShowToast("Please Select Organization","warning");
    //   this.spinnerService.hide();
    // }
    // else{
      this.ShowToast("Please Select Branch","warning");
      this.spinnerService.hide();
    // }
  
  }
  }

  // GetFilterAttendanceList() 
  // { 
  //   this.ApiURL = "Performance/GetDailyAttendance?AdminID=" + this.AdminID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=" + this.selectedListType + "&DeptID=" + this.selectedDepartmentId;
  //   if(this.selectedListType==undefined||this.selectedListType==null||this.selectedListType=='')
  //   {
  //     this.ApiURL = "Performance/GetDailyAttendance?AdminID=" + this.AdminID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=All&DeptID=" + this.selectedDepartmentId;
  //   }
  //   this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
  //    this.originalAttendanceList= res.List;
  //     this.Absentcount=res.Absent;
  //     this.EarlyExitCount=res.EarlyExitcount;
  //     this.LateCheckinCount=res.Lateincount;
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

  //   }, (error) => {
  //     this.spinnerService.hide();
  //   });
  // }

  // GetAttendanceCount() {
  //   if (this.formInput.StartDate == null || this.formInput.StartDate == undefined || this.formInput.StartDate == "") {
  //     var currentdate = new Date();
  //     this.formInput.StartDate = currentdate;
  //        }
  //   var len=this.formInput.StartDate.length;console.log(len);
  //   if(len==undefined || len>10 || len==null)
  //   {
  //     var datePipe = new DatePipe('en-US');
  //     this.formInput.StartDate= datePipe.transform(this.formInput.StartDate, 'dd/MM/yyyy');
  //   }
 

  //   this.ApiURL = "Admin/GetAttendanceCount?AdminID=" + this.AdminID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&DeptID=" + this.selectedDepartmentId;
  //   // this.spinnerService.show();
  //   this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
  //     (res: any) => {
  //     this.AttendanceCount = res;
  //     this.Absentcount=this.AttendanceCount?this.AttendanceCount.Absentcount:0;
  //     this.EarlyExitCount=this.AttendanceCount?this.AttendanceCount.EarlyExitCount:0;
  //     this.LateCheckinCount=this.AttendanceCount?this.AttendanceCount.LateCheckinCount:0;
  //     this.Efficiency=this.AttendanceCount?this.AttendanceCount.Efficiency:0;
  //     this.OnTimeCheckinCount=this.AttendanceCount?this.AttendanceCount.OnTimeCheckinCount:0;
  //     this.pendingcount=this.AttendanceCount?this.AttendanceCount.pendingcount:0;
  //     this.presentcount=this.AttendanceCount?this.AttendanceCount.presentcount:0;
  //     // this.spinnerService.hide();
  //   }, (error) => {
  //     // this.spinnerService.hide();
  //   });
  // }
  onselectedTypeChangenew(event: any) {
    this.selectedListType=event;
    // this.GetAttendanceList();
    this.FilterType=[event];
    //  this.GetAttendanceCount();
  }
  onselectedTypeChange(event: any) {
    // if(this.userselectedbranchid == null || this.userselectedbranchid == undefined || this.userselectedbranchid == ""){
    //   this.userselectedbranchid=0;
    // }
    this.spinnerService.show(); 
    var table = $('#DataTables_Table_0').DataTable();
    table.destroy();
    this.selectedListType=event;
    if(this.selectedListType=="actualabsent")
      {
        this.ShowActPresent=false;this.ShowActAbsent=true;
        this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;this.ShowEarlyIn=false;
        this.ShowLateExit=false;
        this.ShowOnTimeExit=false;
        this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;
        this.AttendanceList = this.originalAttendanceList.filter((record: { Type: any; }) => record.Type == 'Absent');
  
      }
    if(this.selectedListType=="actualpresent")
      {
        this.ShowActPresent=true;this.ShowActAbsent=false;
        this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;this.ShowEarlyIn=false;
        this.ShowLateExit=false;
        this.ShowOnTimeExit=false;
        this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;
        this.AttendanceList = this.originalAttendanceList.filter((record: { LoginData: any; }) => record.LoginData.length>0);
  
      }
    if(this.selectedListType=="present")
    {
      this.ShowPresent=true;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;this.ShowEarlyIn=false;
      this.ShowLateExit=false; this.ShowActPresent=false;this.ShowActAbsent=false;
      this.ShowOnTimeExit=false;
      this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;
      this.AttendanceList = this.originalAttendanceList.filter((record: { Type: any; }) => record.Type != "A" && record.Type!="LOP");

    }
    if(this.selectedListType=="absent")
    {
      this.ShowPresent=false;this.ShowAbsent=true;this.ShowLateIn=false;this.ShowEarlyExit=false;this.ShowEarlyIn=false;
      this.ShowLateExit=false; this.ShowActPresent=false;this.ShowActAbsent=false;
      this.ShowOnTimeExit=false;
      this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;
      this.AttendanceList = this.originalAttendanceList.filter((record: { Type: string }) => 
        record.Type.includes("A") || record.Type.includes("LOP")
      ); }
    if(this.selectedListType=="ontime")
      {
        this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
        this.ShowOnTime=true;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
        this.ShowLateExit=false; this.ShowActPresent=false;
        this.ShowOnTimeExit=false;this.ShowActAbsent=false;
        this.AttendanceList = this.originalAttendanceList.filter((record: { Instatus: any; }) => record.Instatus == "OnTime");
   
      }
      if(this.selectedListType=="latein")
        {
          this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=true;this.ShowEarlyExit=false;
          this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
          this.ShowLateExit=false; this.ShowActPresent=false;
          this.ShowOnTimeExit=false;this.ShowActAbsent=false;
          this.AttendanceList = this.originalAttendanceList.filter((record: { Instatus: any; }) => record.Instatus == "LateIn");
   
        }
        if(this.selectedListType=="earlyexit")
          {
            this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=true;
            this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
            this.ShowLateExit=false; this.ShowActPresent=false;
            this.ShowOnTimeExit=false;this.ShowActAbsent=false;
            this.AttendanceList = this.originalAttendanceList.filter((record: { Outstatus: any; }) => record.Outstatus == "EarlyExit");
   
          }
          if(this.selectedListType=="pending")
            {
              this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
              this.ShowOnTime=false;this.ShowPending=true;this.ShowShift=false;this.ShowEarlyIn=false;
              this.ShowLateExit=false; this.ShowActPresent=false;
              this.ShowOnTimeExit=false;this.ShowActAbsent=false;

              this.AttendanceList = this.originalAttendanceList.filter((record: { Attstatus?: string }) =>
                record.Attstatus &&
                (record.Attstatus.includes("Partial") || 
                 record.Attstatus.includes("Partially") || 
                 record.Attstatus.includes("Pending"))
            );
            }
            if(this.selectedListType=="earlyin")
              {
                this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
                this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=true;
                this.ShowLateExit=false; this.ShowActPresent=false;
                this.ShowOnTimeExit=false;this.ShowActAbsent=false;
                this.AttendanceList = this.originalAttendanceList.filter((record: { Instatus: any; }) => record.Instatus == "EarlyIn");
   
              }
              if(this.selectedListType=="lateexit")
                {
                  this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
                  this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
                  this.ShowLateExit=true; this.ShowActPresent=false;
                  this.ShowOnTimeExit=false;this.ShowActAbsent=false;
                  this.AttendanceList = this.originalAttendanceList.filter((record: { Outstatus: any; }) => record.Outstatus == "LateExit");
                  
                }
                if(this.selectedListType=="ontimeexit")
                  {
                    this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
                    this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
                    this.ShowLateExit=false;this.ShowActAbsent=false;
                    this.ShowOnTimeExit=true; this.ShowActPresent=false;
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
    this.selectedDepartmentId=0;
  }
  onselectedDepartmentsChange(event: any) {
    this.selectedDepartmentId=event.id;
  }
  onDeselectedBranchesChange(event: any) {
    this.selectedBranchId=[];this.userselectedbranchid=0;
    this.GetDepartments()
    this.checkall = false
    this.AttendanceList?.map((IL:any) => IL.IsChecked = false);
   }
  onselectedBranchesChange(event: any) { 
    this.userselectedbranchid=event.id
    this.GetDepartments()
    this.checkall = false
    this.AttendanceList?.map((IL:any) => IL.IsChecked = false);
  }
  // allCheck(event:any) {
  //   this.EnableApprove=false;
  //   for(this.index=0;this.AttendanceList.length;this.index++)
  //   {
  //     if(this.AttendanceList[this.index].VerificationStatus=="UnVerified" ||this.AttendanceList[this.index].VerificationStatus=="Pending")
  //     {
  //       if(this.AttendanceList[this.index].IsChecked==false)
  //         {
  //           this.AttendanceList[this.index].IsChecked=true;
  //           this.EnableApprove=true;
  //         }
  //        else
  //           {
  //             this.AttendanceList[this.index].IsChecked=false;
  //           }
        
  //     }     
  //   }
  // }
  allCheck(event: any) {
    this.EnableApprove = false;
    this.checkall = true
    const isChecked = event.target.checked;

    for (let i = 0; i < this.AttendanceList.length; i++) {
    //   if ( this.AttendanceList[i].AllowApprove!=false && this.AttendanceList[i].Type != "H" && this.AttendanceList[i].Type != "WO" && this.AttendanceList[i].Type != "PL" && this.AttendanceList[i].Type != "SL") {
    //     if(this.AttendanceList[i].Type == "A" &&this.AttendanceList[i].count != 0)
    //     {
    //       this.AttendanceList[i].IsChecked = isChecked;
    //     }     
    // }
    if (this.AttendanceList[i].AllowApprove!=false && (this.AttendanceList[i].Type=="Present" ||this.AttendanceList[i].Type=="Pending" || this.AttendanceList[i].Type=="Half Day" )) {
     
        this.AttendanceList[i].IsChecked = isChecked;
    
  }
  }

  this.EnableApprove = this.AttendanceList.some(
    (    item: { IsChecked: boolean; }) => item.IsChecked === true
  );
}
  // OnChange(event:any) {
  //   for(this.index=0;this.AttendanceList.length;this.index++)
  //   {
  //     if(this.AttendanceList[this.index].IsChecked==true)
  //     {
  //       this.EnableApprove=true;break;        
  //     }  
  //     else{
  //       this.EnableApprove=false;
  //     }   
  //   }
  // }
  OnChange(event:any) {
    this.checkall = this.AttendanceList
    .filter((employee: any) => employee.Type !== 'Absent')
    .every((employee: any) => employee.IsChecked);
    this.EnableApprove = this.AttendanceList.some((employee:any) => employee.IsChecked);
}
//   OnChange(event:any) {
//     var st=true;
//     this.EnableApprove = this.AttendanceList.some((employee:any) => employee.IsChecked);
//     for (let i = 0; i < this.AttendanceList.length; i++) {
//       if (this.AttendanceList[i].VerificationStatus != "Absent" && !this.AttendanceList[i].IsChecked) {
//         st=false;break;
//     }
//     if(!st==false)
//     {

//     }
//   }
// }
exportPdf(){
  if(this.AttendanceList.length>0)
  {
  const json = {
    "AttendanceList":this.AttendanceList
  }
  this._commonservice.ApiUsingPostNew("ReportsNew/GetAllEmployeeMonthlyReport",json,{ responseType: 'text' }).subscribe((res:any)=>{
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
  this._commonservice.ApiUsingPostNew("ExReports/GetAttendanceReportHrSample",json,{ responseType: 'text' }).subscribe((res:any)=>{
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

GetAttendanceListWithOutFilter() {
  if (this.formInput.StartDate == null || this.formInput.StartDate == undefined || this.formInput.StartDate == "") {
    var currentdate = new Date();
    this.formInput.StartDate = currentdate;
   
  }
  if(this.selectedListType==null||this.selectedListType==undefined||this.selectedListType=="")
  {
    this.selectedListType="All";
  }
  if (this.userselectedbranchid == null || this.userselectedbranchid == undefined || this.userselectedbranchid == "") {
   this.userselectedbranchid=0;
  }
  var len=this.formInput.StartDate.length;console.log(len);
  if(len==undefined || len>10 || len==null)
  {
    var datePipe = new DatePipe('en-US');
    this.formInput.StartDate= datePipe.transform(this.formInput.StartDate, 'dd/MM/yyyy');
  }

  this.ApiURL = "Performance/GetDailyAttendance?AdminID=" + this.UserID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=" + this.selectedListType + "&DeptID=" + this.selectedDepartmentId;
  if(this.userselectedbranchid==undefined||this.userselectedbranchid==null||this.userselectedbranchid=='')
    {
      this.userselectedbranchid=0;
    }
    if(this.selectedDepartmentId==undefined||this.selectedDepartmentId==null||this.selectedDepartmentId=='')
      {
        this.selectedDepartmentId=0;
      }
  if(this.selectedListType==undefined||this.selectedListType==null||this.selectedListType=='')
  {
    this.ApiURL = "Performance/GetDailyAttendance?AdminID=" + this.UserID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=All&DeptID=" + this.selectedDepartmentId;

  }
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
   this.originalAttendanceList= res.List;
    this.Absentcount=res.Absent;
    this.EarlyExitCount=res.EarlyExitcount;
    this.LateCheckinCount=res.Lateincount;
    this.OnTimeCheckinCount=res.OnTimeIncount;
    this.pendingcount=res.Pending;
    this.presentcount=res.Present;
    this.TotalCount=res.totalcount;
    this.EarlyCheckinCount=res.Earlyincount;
    this.LateExitcount=res.LateExitcount;
    this.OnTimeOutcount=res.OnTimeOutcount;
    var table = $('#DataTables_Table_0').DataTable();
    table.destroy();
    this.AttendanceList = res.List;
    this.dtTrigger.next(null);
  }, (error) => {
    this.spinnerService.hide();
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

