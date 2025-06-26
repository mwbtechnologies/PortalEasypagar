import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';

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
  selector: 'app-daywiseattendancereport',
  templateUrl: './daywiseattendancereport.component.html',
  styleUrls: ['./daywiseattendancereport.component.css']
})
export class DaywiseattendancereportComponent {
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
   selectedOrganization:any[]=[]
   OrgList:any[]=[]
   orgSettings:IDropdownSettings = {}
 
   constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private toastr: ToastrService, private dialog: MatDialog) { 
     this.SingleSelectionSettings = {
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
   }
   else
   {
     if (this.formInput.StartDate == null || this.formInput.StartDate == undefined || this.formInput.StartDate=='') {
       const today = new Date();
       const year = today.getFullYear();
       const month =(today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
       const day = today.getDate().toString().padStart(2, '0');
       this.formInput.StartDate = `${year}-${month}-${day}`;
       this.GetAttendanceList();
     } 
   }
     this.FilterType=['All'];
     this.selectedBranchId = 0; this.selectedDepartmentId = 0;
     // this.selectedListType="All"; 
     this.GetOrganization();
     this.GetBranches();
     this.GetDepartments();
     if(this.userselectedbranchid>0 && this.userselectedbranchid!=null && this.userselectedbranchid!=undefined)
     {
      
       // this.GetAttendanceCount();
       this.GetAttendanceList();
     }
   }
 
   backToDashboard()
   {
     this._router.navigate(["appdashboard"]);
   }
   Search()
   {
     localStorage.removeItem("RecordID");this.RecordID=0;
     localStorage.removeItem("RecordDate");this.RecordDate=null;
     localStorage.removeItem("BranchID");
     localStorage.removeItem("BranchName");
     localStorage.removeItem("Date");
     this.GetAttendanceList(); 
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
       this.globalToastService.error(error); console.log(error);
     });
   }
 

 
   GetDepartments() {
    this.selectedDepartmentId=[];
    var loggedinuserid=localStorage.getItem("UserID");
     var tmp=[];
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
       this.globalToastService.error(error); console.log(error);
     });
   }
 
 
   GetAttendanceList() {
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
  
     this.ApiURL = "Performance/GetAttendance?AdminID=" + this.AdminID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=" + this.selectedListType + "&DeptID=" + this.selectedDepartmentId;
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
       this.ApiURL = "Performance/GetAttendance?AdminID=" + this.AdminID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=All&DeptID=" + this.selectedDepartmentId;
   
     }
     this.spinnerService.show();
     this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
       var table = $('#DataTables_Table_0').DataTable();
       table.destroy();
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
       this.dtTrigger.next(null);
       this.spinnerService.hide();
       if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
         {
           this.AttendanceList = res.List.filter((item:any) => item.EmployeeID ===parseInt(this.RecordID));
           if(this.AttendanceList.length==1)
           {
             localStorage.removeItem("RecordID");this.RecordID=0;
             localStorage.removeItem("RecordDate");this.RecordDate=null;
             this.spinnerService.hide();
           }
         }
 
     }, (error) => {
       this.spinnerService.hide();
     });
   }
 
   GetFilterAttendanceList() {
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
  
     this.ApiURL = "Performance/GetAttendance?AdminID=" + this.AdminID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=" + this.selectedListType + "&DeptID=" + this.selectedDepartmentId;
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
       this.ApiURL = "Performance/GetAttendance?AdminID=" + this.AdminID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=All&DeptID=" + this.selectedDepartmentId;
   
     }
     this.spinnerService.show();
     this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
       var table = $('#DataTables_Table_0').DataTable();
       table.destroy();
       this.AttendanceList = res.List;
       this.dtTrigger.next(null);
       this.spinnerService.hide();
       if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
         {
           this.AttendanceList = res.List.filter((item:any) => item.EmployeeID ===parseInt(this.RecordID));
           if(this.AttendanceList.length==1)
           {
             localStorage.removeItem("RecordID");this.RecordID=0;
             localStorage.removeItem("RecordDate");this.RecordDate=null;
             this.spinnerService.hide();
           }
         }
 
     }, (error) => {
       this.spinnerService.hide();
     });
   }
 
   onDeselectedTypeChange(event: any) {
     this.selectedListType=0;
     this.FilterType=['All'];
   }

   onDeselectedDepartmentsChange(event: any) {
     this.selectedDepartmentId=0;
   }
   onselectedDepartmentsChange(event: any) {
     this.selectedDepartmentId=event.id;
   }
   onDeselectedBranchesChange(event: any) {this.selectedBranchId=0;this.userselectedbranchid=0; }
   onselectedBranchesChange(event: any) { 
     this.userselectedbranchid=event.id
   }

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
     this.globalToastService.error("Something went wrong");
    }
   },(error)=>{
     this.globalToastService.error(error.message);
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
    this.globalToastService.error("Something went wrong");
   }
   },(error)=>{
     this.globalToastService.error(error.message);
   })
 }
 }
 }
 
 