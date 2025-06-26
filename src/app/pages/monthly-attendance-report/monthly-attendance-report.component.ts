import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
@Component({
  selector: 'app-monthly-attendance-report',
  templateUrl: './monthly-attendance-report.component.html',
  styleUrls: ['./monthly-attendance-report.component.css']
})
export class MonthlyAttendanceReportComponent {
  public isSubmit: boolean | any;
  LoginUserData: any;
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
  OriginalBranchList: any;;
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
  originalAttendanceList: any;
  Year:any; Month:any;StartDate:any;EndDate:any;
  ReportType:any;

  constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private toastr: ToastrService, private dialog: MatDialog) { 

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
    this.AdminID = localStorage.getItem("AdminID");
    this.EmployeeID=localStorage.getItem("EmployeeID");
    this.Year = localStorage.getItem("Year");
  this.Month = localStorage.getItem("Month");
  this.StartDate = localStorage.getItem("StartDate");
  this.ReportType=localStorage.getItem("ReportType");
  this.EmployeeName=localStorage.getItem("EmployeeName");
  if(this.StartDate=="undefined"){this.StartDate="";}
  this.EndDate = localStorage.getItem("EndDate");
  if(this.EndDate=="undefined"){this.EndDate="";}
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
  GetAttendanceList()
  {
        this.spinnerService.show();
        this.ApiURL="Performance/GetCustomAttendance?EmployeeID="+this.EmployeeID+"&Month="+this.Month+"&Year="+this.Year+"&StartDate="+this.StartDate+"&EndDate="+this.EndDate+"&Filter=All";
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
      this.dtTrigger.next(null);
      this.spinnerService.hide();

    }, (error) => {
      this.spinnerService.hide();
    });
    }

backToDashboard(){
  this._router.navigate(["appdashboard"]);
}
onselectedTypeChange(event: any) {
  this.spinnerService.show();
  var table = $('#DataTables_Table_0').DataTable();
  table.destroy();
  this.selectedListType=event;
  if(this.selectedListType=="present")
  {
    this.ShowPresent=true;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;this.ShowEarlyIn=false;
    this.ShowLateExit=false;
    this.ShowOnTimeExit=false;
    this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;
    this.AttendanceList = this.originalAttendanceList.filter((record: { Type: any; }) => record.Type != "A" && record.Type!="LOP");

  }
  if(this.selectedListType=="absent")
  {
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
      this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
      this.ShowOnTime=true;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
      this.ShowLateExit=false;
      this.ShowOnTimeExit=false;
      this.AttendanceList = this.originalAttendanceList.filter((record: { Instatus: any; }) => record.Instatus == "OnTime");
 
    }
    if(this.selectedListType=="latein")
      {
        this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=true;this.ShowEarlyExit=false;
        this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
        this.ShowLateExit=false;
        this.ShowOnTimeExit=false;
        this.AttendanceList = this.originalAttendanceList.filter((record: { Instatus: any; }) => record.Instatus == "LateIn");
 
      }
      if(this.selectedListType=="earlyexit")
        {
          this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=true;
          this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
          this.ShowLateExit=false;
          this.ShowOnTimeExit=false;
          this.AttendanceList = this.originalAttendanceList.filter((record: { Outstatus: any; }) => record.Outstatus == "EarlyExit");
 
        }
        if(this.selectedListType=="pending")
          {
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
              this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
              this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=true;
              this.ShowLateExit=false;
              this.ShowOnTimeExit=false;
              this.AttendanceList = this.originalAttendanceList.filter((record: { Instatus: any; }) => record.Instatus == "EarlyIn");
 
            }
            if(this.selectedListType=="lateexit")
              {
                this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
                this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
                this.ShowLateExit=true;
                this.ShowOnTimeExit=false;
                this.AttendanceList = this.originalAttendanceList.filter((record: { Outstatus: any; }) => record.Outstatus == "LateExit");
                
              }
              if(this.selectedListType=="ontimeexit")
                {
                  this.ShowPresent=false;this.ShowAbsent=false;this.ShowLateIn=false;this.ShowEarlyExit=false;
                  this.ShowOnTime=false;this.ShowPending=false;this.ShowShift=false;this.ShowEarlyIn=false;
                  this.ShowLateExit=false;
                  this.ShowOnTimeExit=true;
                  this.AttendanceList = this.originalAttendanceList.filter((record: { Outstatus: any; }) => record.Outstatus == "OntimeExit");
                }
                this.dtTrigger.next(null);
                this.spinnerService.hide();
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

