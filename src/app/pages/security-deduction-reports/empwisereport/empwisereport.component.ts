import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClient } from '@angular/common/http';
import * as saveAs from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

export class Emp{
  EmployeeID:any;
}
@Component({
  selector: 'app-empwisereport',
  templateUrl: './empwisereport.component.html',
  styleUrls: ['./empwisereport.component.css']
})
export class EmpwisereportComponent {
 EmployeeList:any;
  EmpClass:Array<Emp> = [];
  BranchList:any[]=[];
  DepartmentList:any; YearList:any;MonthList:any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  file:any;
  EmployeeId:any;
  ShowDownload=false;
  showMonthWise=false;
  selectedDepartmentIds: string[] | any;
  selectedBranch:any[]=[];
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  selectedMonthId: string[] | any;
  selectedEmployeeId: string[] | any;
  OrgID:any;
  SalaryList:any;
  NewApiURL:any;
userselectedfromdate:any;
  index=0;pdfSrc:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  ViewPermission:any;
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  monthSettings :IDropdownSettings = {}
  yearSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  temparray:any=[]; tempdeparray:any=[];
  selectedDepartment:any[]=[];
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  selectedEmployees:any[]=[];
  UserID:any;
  TypeList:any[]=["Weekly","Monthly","Custom"]
  selectedType:any
  typeSettings:IDropdownSettings = {}
  fromSummary:boolean = true
  selectedWeeklyDate:any
  selectedFromDate:any;
  selectedToDate:any
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
    reporttype:any;
    //ends here
    selectedOrganization:any[]=[]
    OrgList:any[]=[]
    orgSettings:IDropdownSettings = {}
  EmployeeName: any;DeductionStatus: any;
;
  EstimatedDate: any;;
  FirstDate: any;
  TotalSD:any;
  MonthlyDeduction:any;
  Balance:any;
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private dialog:MatDialog,
    private _commonservice: HttpCommonService, private globalToastService:ToastrService,private _httpClient:HttpClient){ 
    this.isSubmit=false //common table
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye",
      },
          {
        name: "Stop Deductions",
        icon: "fa fa-trash",
      }
    ];

    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"SL No",
      "DeductionAmount":"AMOUNT",
      "DeductionDate":"DATE"
    },


    this.displayedColumns= [
      "SLno",
      "DeductionAmount",
      "DeductionDate",
    ]
    this.editableColumns = {
      // "HRA":{
      //   filters:{}
      // },
    }

    // this.topHeaders = [
      // {
      //   id:"blank1",
      //   name:"",
      //   colspan:5
      // },
    // ]

    this.headerColors ={
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    //ends here
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID=localStorage.getItem("UserID");
       this.EmployeeId=localStorage.getItem("EmployeeID");
this.GetReport();
  }

  GetReport(){
    this.spinnerService.show();
    this.employeeLoading = false;
       this._commonservice.ApiUsingGetWithOneParam("Performance/GetEmpSDReports?EmpID="+this.EmployeeId).subscribe((data) => { 
        if(data.Status==true)
        {
          this.employeeLoading = true;
          this.SalaryList = data.List.History.map((l: any, i: any) => {return { SLno: i + 1, ...l } ;
            });
            
         this.EmployeeName=data.List.EmployeeName;
              this.TotalSD=data.List.TotalSD
               this.MonthlyDeduction=data.List.MonthlyDeduction;
                this.Balance=data.List.Balance;
                  this.DeductionStatus=data.List.DeductionStatus;
                    this.EstimatedDate=data.List.LastEstimatedDate;
            this.ShowDownload = true;
            this.spinnerService.hide();
        }
        else{
          this.ShowToast(data.Message,"warning")
          this.spinnerService.hide();
        } 
    
      // this.dtTrigger.next(null);
      this.spinnerService.hide();
      this.employeeLoading = false
    }, (error) => {
      this.spinnerService.hide();
      this.employeeLoading = false
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });
 
}

  GetReportInPDF(){
    this.ApiURL="ReportsNew/GetAttendanceReport";
    this._commonservice.ApiUsingPostNew(this.ApiURL,this.SalaryList,{ responseType: 'text' }).subscribe((res:any) => {
      if(res)
      {
       this.pdfSrc = res;
       window.open(res,'_blank')
      }
      else{
        // this.globalToastService.warning("Sorry Failed to Generate");
        this.ShowToast("Sorry Failed to Generate","warning")
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });
 
}
GetReportInExcel(){
  this.ApiURL="ExReports/GetAttendanceReport ";
  this._commonservice.ApiUsingPostNew(this.ApiURL,this.SalaryList,{ responseType: 'text' }).subscribe((res:any) => {
    if(res)
      {
        // this.downloadExcelFile(res);

        window.open(res,'_blank')
                // this.globalToastService.success("Downloaded");
                this.ShowToast("Downloaded","success")
      }
      else{
        // this.globalToastService.warning("Sorry Failed to Generate");
        this.ShowToast("Sorry Failed to Generate","warning")
      }
}, (error) => {
    this.spinnerService.hide();
    // this.globalToastService.error(error.message);
    this.ShowToast(error.message,"error")
  });
}
downloadExcelFile(url: string) {
  this._httpClient.get(url, { responseType: 'blob' }).subscribe(
    (response: Blob) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'AttendanceReport.xlsx'); // Save the file with a desired name
    },
    (error) => {
      console.error("Error downloading the file:", error);
    }
  );
}


 actionEmitter(data:any){}
backToDashboard()
{
  this._router.navigate(["appdashboard"]);
}
//ends here

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

  
 //common table

