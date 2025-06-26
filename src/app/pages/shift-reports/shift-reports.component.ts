import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../common-table/common-table.component';

export class Emp {
  EmployeeID: any;
}

@Component({
  selector: 'app-shift-reports',
  templateUrl: './shift-reports.component.html',
  styleUrls: ['./shift-reports.component.css']
})
export class ShiftReportsComponent implements OnInit, AfterViewInit {
  @Input()
  MonthlyData:any
  EmployeeList: any;
  ListType: any = ['Day Shift', 'Morning Shift', 'Afternoon Shift', 'Evening Shift', 'Night Shift'];
  selectedListType: any;
  EmpClass: Array<Emp> = [];
  BranchList: any[] = [];
  DepartmentList: any; YearList: any; MonthList: any;
  public isSubmit: boolean | any;
  LoginUserData: any;
  AdminID: any;
  ApiURL: any;
  file: any; UserListType: any;
  EmployeeId: any;
  ShowDownload = false;
  selectedDepartmentIds: string[] | any;
  selectedBranch: any[] = [];
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  selectedMonthId: string[] | any;
  selectedEmployeeId: string[] | any;
  OrgID: any;
  EmpName:any
  SalaryList: any;
  NewApiURL: any;
  index = 0; pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  ViewPermission: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  monthSettings: IDropdownSettings = {}
  yearSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  temparray: any = []; tempdeparray: any = [];
  selectedDepartment: any[] = [];
  selectedyear: any[] = []
  selectedMonth: any[] = []
  selectedEmployees: any[] = []
  ShiftList: any;
  UserID:any;
  monthlyData:any

  //common table
  actionOptions: any
  displayColumns: any
  displayedColumns: any
  loading: any;
  editableColumns: any = []
  topHeaders: any = []
  headerColors: any = []
  smallHeaders: any = []
  ReportTitles: any = {}
  selectedRows: any = []
  commonTableOptions: any = {}
  tableDataColors: any = {}
  ShowBtn: boolean = false
  currentYear:any;currentMonth:any;
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here
  branch:any
month:any
year:any

  constructor(private _router: Router, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private globalToastService: ToastrService) {
    this.isSubmit = false
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
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
    this.monthSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.departmentSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50
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

    //common table
    this.actionOptions = [
      // {
      //   name: "View Details",
      //   icon: "fa fa-eye",
      //   // rowClick: true,
      // }
    ];

    // this.displayColumns = {
    //   SelectAll: "SelectAll",
    //   "SLno": "SL NO",
    //   "Date": "DATE",
    //   "Shift": "SHIFT",
    //   "WorkDuration": "WORK DURATION",
    //   "EmployeeStartTime": "LOGIN",
    //   "EmployeeEndTime": "LOGOUT",
    //   "EmpDuration": "DURATION",
    //   "ExtraWork": "EXTRA HRS WORKED",
    //   "LunchDuration": "LUNCH DURATION",
    //   "LoginStatus": "LOGIN STATUS",
    //   "LogoutStatus": "LOGOUT STATUS",
    //   "AttenStatus": "APPROVAL STATUS",
    // },


    //   this.displayedColumns = [
    //     // "SelectAll",
    //     "SLno",
    //     "Date",
    //     "Shift",
    //     "WorkDuration",
    //     "EmployeeStartTime",
    //     "EmployeeEndTime",
    //     "EmpDuration",
    //     "ExtraWork",
    //     "LunchDuration",
    //     "LoginStatus",
    //     "LogoutStatus",
    //     "AttenStatus",
    //     // "Actions"
    //   ]
    this.displayColumns= {
      "SLno":"SL NO",
      "Date":"DATE",
      "Shift":"SHIFT",
       "ShiftAmount":"SHIFT-AMOUNT",
      "ShiftStartTime":"SHIFT-START-TIME",
      "ShiftEndTime":"SHIFT-END-TIME",
      "EmployeeStartTime":"EMPLOYEE-START-TIME",
      "EmployeeEndTime":"EMPLOYEE-END-TIME",
      "EmpDuration":"EMPLOYEE-DURATION",
    },
    
    
    this.displayedColumns= [
      "SLno",
      "Date",
      "Shift",
       "ShiftAmount",
      "ShiftStartTime",
      "ShiftEndTime",
      "EmployeeStartTime",
      "EmployeeEndTime",
      "EmpDuration",
    ]

    this.editableColumns = {
      // "HRA":{
      //   filters:{}
      // },
    }

    this.topHeaders = [
      // {
      //   id: "blank1",
      //   name: "",
      //   colspan: 4
      // },
      // {
      //   id: "Logindetails",
      //   name: "LOGIN DETAILS",
      //   colspan: 5
      // },
      // {
      //   id: "blank2",
      //   name: "",
      //   colspan: 3
      // },
    ]

    this.headerColors = {
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    // <span style="color: green;" *ngIf="IL.AttenStatus=='Approved'">{{IL.AttenStatus}}</span>
    // <span *ngIf="IL.AttenStatus=='Pending'" style="color: blue;" >{{IL.AttenStatus}}</span>
    // <span *ngIf="IL.AttenStatus=='Rejected'||IL.AttenStatus=='Absent'" style="color: red;">{{IL.AttenStatus}}</span>

    this.tableDataColors = {
      // "AttenStatus": [
      //   { styleClass: "green", filter: [{ col: "AttenStatus", value: "Approved" }] },
      //   { styleClass: "blue", filter: [{ col: "AttenStatus", value: "Pending" }] },
      //   { styleClass: "red", filter: [{ col: "AttenStatus", value: "Rejected" }] },
      //   { styleClass: "red", filter: [{ col: "AttenStatus", value: "Absent" }] }
      // ]
    }
    //ends here
  }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    this.UserListType = "All";
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    if (this.AdminID == null || this.OrgID == null) {

      this._router.navigate(["auth/signin"]);
    }
    this.EmpName = this.MonthlyData.EmployeeName
    this.branch =  localStorage.getItem("SRBranch")
    this.month =  localStorage.getItem("SRMonth")
    this.year =  localStorage.getItem("SRYear")
    this.GetReport()
  }
 

  GetReport() {
    this.loading = true
    this.spinnerService.show();
    // this._commonservice.ApiUsingGetWithOneParam("ShiftMaster/GetEmployeeOtReport?EmployeeID="+this.MonthlyParams.employeeid+"&Month="+this.MonthlyParams.month+"&Year="+this.MonthlyParams.year+"").subscribe((res: any) => {
    //   if(res.Status == true){
    //     this.monthlyData = res.SalaryDetails.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
    //     this.employeeLoading = false
    //     this.spinnerService.hide();
    //   }else if(res.Status == false){
    //     this.globalToastService.error(res.message)
    //     this.employeeLoading = false
    //   }else{
    //     this.globalToastService.error("An Error Occured.")
    //     this.employeeLoading = false
    //   }
    // }, (err) => {
    //   this.spinnerService.hide();
    //   this.employeeLoading = false
    //   this.globalToastService.error('Something went wrong')
    // })
    this.monthlyData = this.MonthlyData.DaywiseDetails.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
    this.loading = false
    this.spinnerService.hide();

  }

  GetReportInPDF() {
    this.ApiURL = "PortalReports/GetAttendanceReport";
    this._commonservice.ApiUsingPost(this.ApiURL, this.SalaryList).subscribe((res: any) => {
      if (res.Status == true) {
        this.pdfSrc = res.URL;
        window.open(res.URL, '_blank')
      }
      else {
        this.globalToastService.warning("Sorry Failed to Generate");
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      this.globalToastService.error(error.message);
    });

  }
  OnTypeChange(event: any) {
    if (event != undefined && event != null) {
      // this.selectedListType=event;
      this.UserListType = event;
    }
    else {
      // this.selectedListType=['Active'];
      this.UserListType = "All";
    }

  }
  //common table
  actionEmitter(data: any) {
    if (data.action.name == "View Details") {
      this.ShowShiftDetails(data.row);
    }

  }

  ShowShiftDetails(row: any) {
  }

  downloadReport() {
    let selectedColumns = this.displayedColumns
    this.commonTableChild.downloadReport(selectedColumns)
  }
  //ends here
}
