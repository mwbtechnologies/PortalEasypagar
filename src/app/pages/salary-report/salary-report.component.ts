import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { forkJoin, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentSummary } from '../generate-payslip/generate-payslip.component';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { ApprovepayslipComponent } from './approvepayslip/approvepayslip.component';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { CommonTableButtonsComponent } from '../common-table-buttons/common-table-buttons/common-table-buttons.component';
import { LoanListComponent } from './loan-list/loan-list.component';
import { environment } from 'src/environments/environment.prod';

export class Emp{
  EmployeeID:any;
}

// Step 1: Define your master column configuration once
const masterColumnMap: { [key: string]: string } = {
  SelectAll: "SelectAll",
  SLno: "Sl No",
  MappedEmpId: "EmpID",
  Employee: "Emp Name",
  Branch: "Branch",
  PaidDays: "P",
  Department: "Department",
  Designation: "Designation",
  TotalWokingDays: "T",
  BasicSalary: "Basic",
  EarnedBasicSalary: "Basic",
  HRA: "HRA",
  TA: "TA",
  DA: "DA",
    MA: "MA",
    LTA: "LTA",
    Conveyance: "Conveyance",
  CalcGrossSalary: "Total",
  CalcBasicSalary: "Basic",
  CalcHRA: "HRA",
  CalcDA: "DA",
  CalcTA: "TA",
  CalcMA: "MA",
  CalcLTA: "LTA",
  CalcConveyance: "Conveyance",
       CalcWashingAllowance:"WA",
 CalcFuelAllowance: "FA",
 CalcSpecialAllowance: "SA",
  ActualGross: "Gross",
  TotalGross: "Total",
     PSA: "PSA",
  FixedIncentive: "FI",
 
  ShiftAmount: "Shift Amt",
  OTAmount: "OT Amt",
  Bonus: "Bonus",
  Incentive: "Incentive",
    AttendanceBonus:"AttBonus",

LastMonthIncentive:"LMI",
PerformanceIncentive:"PI",
  leaveDeduction: "Leave",

  LoanDeduction: "Loan",
  AdvanceDeduction: "Advance",
  Deduction: "Deduction",
  Penalty: "Penalty",
  FinePoints:"FP",
  SecurityDeposit: "SD",
   EarningsOthers: "Others",

  ESI: "ESI",
  PF: "EPF",
  PT: "PT",
  CalcESI: "ESI",
  CalcEPF: "EPF",
  CalcPT: "PT",
  TDS: "TDS",
   DeductionOthers: "Others",
  TotalOtherEarnings: "Total",
  TotalDeduction: "Total",
  NetSalary: "Net Pay",
  Actions: "Actions",
};
 const topHeaderMaster: {
  id: string;
  name: string;
  fields: string[];
  condition?: () => boolean; // Optional dynamic condition
}[] = [
  {
    id: "blank1",
    name: "",
    fields: ["SelectAll","Actions", "SLno", "MappedEmpId", "Employee", "Branch"]
  },
  {
    id: "workingDays",
    name: "Working Days",
    fields: ["TotalWokingDays", "PaidDays"]
  },
  {
    id: "blank2",
    name: "",
    fields: ["NetSalary"]
  },
  {
    id: "ActualSalary",
    name: "",
    fields: ["ActualGross", "leaveDeduction"]
  },
  {
    id: "Gross",
    name: "Gross Earnings",
    fields: [
      "CalcGrossSalary", "CalcBasicSalary", "CalcHRA", "CalcDA", "CalcTA", "CalcMA",
      "CalcLTA", "CalcConveyance", " CalcWashingAllowance", " CalcFuelAllowance"," CalcSpecialAllowance"
    ]
  },
  {
    id: "OtherEarnings",
    name: "Other Earnings",
    fields: ["PSA",
      "FixedIncentive", "ShiftAmount", "OTAmount", "Bonus", "Incentive","AttendanceBonus","LastMonthIncentive", "PerformanceIncentive", "EarningsOthers", "TotalOtherEarnings"
    ]
  },
  {
    id: "Deductions",
    name: "Deductions",
    fields: [
      "LoanDeduction", "AdvanceDeduction", "Deduction", "Penalty","FinePoints", "SecurityDeposit",
      "CalcESI", "CalcEPF", "CalcPT", "TDS", "DeductionOthers", "TotalDeduction"
    ]
  }
];

const allColumnKeys: string[] = [
  "SelectAll",
  "Actions",
  "SLno",
  "MappedEmpId",
  "Employee",
  "TotalWokingDays",
  "PaidDays",
  "NetSalary",
  "ActualGross",
  "leaveDeduction",
  "CalcGrossSalary",
  "CalcBasicSalary",
  "CalcHRA",
  "CalcDA",
  "CalcTA",
  "CalcMA",
  "CalcLTA",
  "CalcConveyance",
   " CalcWashingAllowance", 
  " CalcFuelAllowance",
  " CalcSpecialAllowance",
  "PSA",
  "FixedIncentive",
  "ShiftAmount", // conditional
  "OTAmount",    // conditional
  "Bonus",
  "Incentive",
  "AttendanceBonus", 
  "LastMonthIncentive",
"PerformanceIncentive",
  "EarningsOthers",
  "TotalOtherEarnings",
  "LoanDeduction",
  "AdvanceDeduction",
  "Deduction",
  "Penalty",
  "FinePoints",
  "SecurityDeposit",
  "DeductionOthers",
  "CalcESI",
  "CalcEPF",
  "CalcPT",
  "TDS",
  "TotalDeduction"
];
const conditionalColumnsToCheck = [
     { key: "CalcDA", flag: "isDA" },
        { key: "CalcTA", flag: "isTA" },
        { key: "ShiftAmount", flag: "isShiftAmount" },
           { key: "OTAmount", flag: "isOTAmount" },
                 { key: "Incentive", flag: "isIncentive" },
   { key: "TDS", flag: "isTDS" },
    { key: "CalcPT", flag: "isPT" },
     { key: "penalty", flag: "ispenalty" },
      { key: "DeductionOthers", flag: "isDeductionOthers" },
       { key: "CalcPF", flag: "isPF" },
        { key: "CalcESI", flag: "isESI" },
         { key: "EarningsOthers", flag: "isEarningsOthers" },
  { key: "Basic", flag: "isBasic" },
  { key: "HRA", flag: "isHRA" },
   { key: "Deduction", flag: "isDeductions" },
      { key: "SecurityDeposit", flag: "isSD" },
         { key: "FinePoints", flag: "isFinePoints" },
            { key: "PerformanceIncentive", flag: "isPerformanceIncentive" },
               { key: "LastMonthIncentive", flag: "isLastMonthIncentive" },
  { key: "PSA", flag: "isPSA" },
                  { key: "FixedIncentive", flag: "isFixedIncentive" },
                    { key: "AttendanceBonus", flag: "isAttendanceBonus" },
                      { key: " CalcWashingAllowance", flag: "isWashingAllowance" },
                       { key: " CalcFuelAllowance", flag: "isFuelAllowance" },
                              { key: " CalcSpecialAllowance", flag: "isSpecialAllowance" },
                        { key: "", flag: "isAttendanceBonus" },
                     { key: "PSA", flag: "isPSA" },
                        { key: "Bonus", flag: "isBonus" },

    { key: "CalcMA", flag: "isMA" },
     { key: "CalcLTA", flag: "isLTA" },
      { key: "CalcConveyance", flag: "isConveyance" },

];

export class FormInput {
  IsESIEnabled: any;
}
@Component({
  selector: "app-salary-report",
  templateUrl: "./salary-report.component.html",
  styleUrls: ["./salary-report.component.css"],
})
export class SalaryReportComponent implements OnInit, AfterViewInit {
 cellWiseButtons: any = [];
  formInput: FormInput | any;
  EmployeeList: any;
  EmpClass: Array<Emp> = [];
  BranchList: any;
  DepartmentList: any;
  YearList: any;
  MonthList: any;
  public isSubmit: boolean | any;
  LoginUserData: any;
  AdminID: any;
  selected_year_deductions: string="";
  selected_month_deductions: string ="";
  ApiURL: any;
  file: any;
  EmployeeId: any;
  selectedFile: File | null = null;
  selectedDepartmentIds: string[] | any;
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  selectedMonthId: string[] | any;
  selectedEmployeeId: string[] | any;
  OrgID: any;
  SalaryList: any[] = [];
  NewApiURL: any;
  index = 0;
  pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission: any;
  EditPermission: any;
  ViewPermission: any;
  DeletePermission: any;
  branchSettings: IDropdownSettings = {};
  departmentSettings: IDropdownSettings = {};
  listTypeSettings: IDropdownSettings = {};
  otherFilterSettings: IDropdownSettings = {};
  monthSettings: IDropdownSettings = {};
  yearSettings: IDropdownSettings = {};
  employeeSettings: IDropdownSettings = {};
  temparray: any = [];
  // tempdeparray: any = [];
  selectedDepartment: any[] = [];
  selectedyear: any[] = [];
    selectedMonth: any[] = [];
  selectedEmployees: any[] = [];
  selectedBranch: any[] = [];
  selectedListType: any[] = [];
  otherFilterType: any[] = [];
  showBankPayslip = false
  showPayslip = false;
  showPayList = true
  actionOptions: any;
  displayColumns: any;
  displayedColumns: any;
  employeeLoading: any;
  editableColumns: any = [];
  topHeaders: any = [];
  headerColors: any = [];
  headerInfo: any = {};
  smallHeaders: any = [];
  ReportTitles: any = {};
  isBranchLoaded: boolean = false;
  selectedRows: any = [];
  commonDownloadFlag: boolean = false;
  tableDataColors:any;UserID:any;
  ShowAll:boolean=false;
  commonTableOptions: any = {};
  employeeDetail: any;
  PayJsons:any = {}
  BankPaySlipList:any[]=[]
  commonTableDataSource : any
  public isDrawerOpen: boolean = false;
  drawerOpened: boolean = false;
  ListTypeData:any[]=["Approved","UnApproved"]
    otherFilterData: any[] = ["ESI", "Non ESI"]
    @ViewChild(CommonTableButtonsComponent) commonTableChild: CommonTableButtonsComponent | any;
  dev:boolean = true
  devParams :any
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  length:any;
  isESIEnabled:any=false;  isPFEnabled:any=false;  isPTEnabled:any=false;  isSDEnabled:any=false;
  ImageUrl: any;
  SalarySettingList: any;
    salaryConfig: any;


    component_selection!: FormGroup;
  constructor(
    private _router: Router,private httpClient:HttpClient,
    private spinnerService: NgxSpinnerService,
    private _commonservice: HttpCommonService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
     this.dev = false
    this.devParams= {
      branchIndex:24,
      empIndex:0
    }

    this.isSubmit = false;
    this.dtExportButtonOptions = {
      dom: "Bfrtip",
      buttons: ["copy", "print", "excel", "csv"],
    };

    this.actionOptions = [
      {
        name: "View Details",
        icon: "fa fa-eye",
        // rowClick: true,
      },
      {
        name: "Approve Payslip",
        icon: "fa fa-money",
        filter: [
          { field:'IsPayslipExist',value : false },{field:'AllowPayslipGeneration',value : true}
          // ,{ field: 'PaidDays', operator: '>', value: 0 }
        ],
      },
      {
        name: "Recalculate",
        icon: "fa fa-refresh",
        filter: [
          { field:'IsPayslipExist',value : false},{field:'AllowPayslipGeneration',value : true}
          // ,{ field: 'PaidDays', operator: '>', value: 0 }
        ],
      },
      ];


     this.component_selection = new FormGroup({
         isBasicSalary: new FormControl(false),
         isHRA: new FormControl(false),
         isDA: new FormControl(false),
         isTA: new FormControl(false),
         isMA: new FormControl(false),
         isLTA: new FormControl(false),
         isConveyance: new FormControl(false),
         isPSA: new FormControl(false),
         isFixedIncentive: new FormControl(false),
         isShiftAmount: new FormControl(false),

         isOTAmount: new FormControl(false),
         isBonus: new FormControl(false),
         isIncentive: new FormControl(false),
         isEarningsothers: new FormControl(false),
         isAttendanceBonus: new FormControl(true),
         isLastMonthIncentive: new FormControl(true),
         isPerformanceIncentive: new FormControl(true),
         isFuelAllowance: new FormControl(false),
         isWashingAllowance: new FormControl(false),
         isLoanDeduction: new FormControl(false),
         isAdvanceDeduction: new FormControl(false),
         isDeduction: new FormControl(false),
         isPenalty: new FormControl(false),
         isSecurityDeposit: new FormControl(false),
         isOthers: new FormControl(false),
         isESI: new FormControl(false),
         isPF: new FormControl(false),
         isPT: new FormControl(false),
         isTDS: new FormControl(false),
         isFinePoints: new FormControl(true),
     });

    
    //   this.displayColumns = {
    //   SelectAll: "SelectAll",
    //   SLno: "Sl No",
    //   MappedEmpId: "EmpID",
    //   Employee: "Emp Name",
    //   Branch: "Branch",
    //   // NoOfPresentDays: "P",
    //   PaidDays: "P",
    //   Department: "Department",
    //   Designation: "Designation",
    //   TotalWokingDays: "T",
    //   BasicSalary: "Basic",
    //   EarnedBasicSalary: "Basic",
    //   HRA: "HRA",
    //   TA: "TA",
    //   DA: "DA",
    //   MA: "MA",
    //   CalcGrossSalary:"Total",
    //   CalcBasicSalary:"Basic",
    //   CalcHRA:"HRA",
    //   CalcDA:"DA",
    //   CalcTA:"TA",
    //   CalcMA:"MA",
    //    CalcLTA:"LTA",
    //     CalcConveyance:"Conveyance",
    //   ActualGross: "Gross",
    //   TotalGross: "Total",
    //   FixedIncentive: "FI/PSA",
    //   ShiftAmount: "Shift Amt",
    //   OTAmount: "OT Amt",
    //   Bonus: "Bonus",
    //   Incentive: "Incentive",
    //   leaveDeduction: "Leave",
    //   LoanDeduction: "Loan",
    //   AdvanceDeduction: "Advance",
    //   Deduction: "Deduction",
    //   Penalty: "Penalty",
    //   SecurityDeposit: "SD",
    //   DeductionOthers: "Others",
    //   ESI: "ESI",
    //   PF: "EPF",
    //   PT: "PT",
    //   CalcESI:"ESI",
    //   CalcEPF:"PF",
    //   CalcPT:"PT",
    //   TDS: "TDS",
    //   EarningsOthers: "Others",
    //   TotalOtherEarnings: "Total",
    //   TotalDeduction: "Total",
    //   NetSalary: "Net Pay",
    //   Actions: "Actions",
    // }
    //   this.displayedColumns = [
    //     "SelectAll",
    //     "Actions",
    //     "SLno",
    //     "MappedEmpId",
    //     "Employee",
    //     // "Branch",
    //     // "Department",
    //     // "Designation",
    //     "TotalWokingDays",
    //     // "NoOfPresentDays",
    //     "PaidDays",
    //     "NetSalary",
    //     "ActualGross",
    //     "leaveDeduction",
    //     // "TotalGross",
    //     // "BasicSalary",
    //     // // "EarnedBasicSalary",
    //     // "HRA",
    //     // "DA",
    //     // "TA",
    //     // "MA",
    //     "CalcGrossSalary",
    //     "CalcBasicSalary",
    //     "CalcHRA",
    //     "CalcDA",
    //     "CalcTA",
    //     "CalcMA",
    //     "CalcLTA",
    //     "CalcConveyance",
    //     "FixedIncentive",
    //     "ShiftAmount",
    //     "OTAmount",
    //     "Bonus",
    //     "Incentive",
    //     "EarningsOthers",
    //     "TotalOtherEarnings",
    //     "LoanDeduction",
    //     "AdvanceDeduction",
    //     "Deduction",        
    //     "Penalty",
    //     "SecurityDeposit",
    //     "DeductionOthers",
    //     // "ESI",
    //     // "PF",
    //     // "PT",
    //     "CalcESI",
    //     "CalcEPF",
    //     "CalcPT",
    //     "TDS",
    //     "TotalDeduction",
    //     // "Actions"
    //   ];
      this.cellWiseButtons = {
          //"LoanDeduction": [
          //    {
          //        name: "Loan", icon: "fa fa-pencil", class: "btn btn-sm", tooltip: 'Click To  Edit'
          //    }
          //],
          //"ShiftAmount": [
          //    {
          //        name: "Shift", icon: "fa fa-pencil", class: "btn btn-sm", tooltip: 'Click To  Edit'
          //    }
          //],
          //"OTAmount": [
          //    {
          //        name: "OT", icon: "fa fa-pencil", class: "btn btn-sm", tooltip: 'Click To  Edit'
          //    }
          //],
          //"AdvanceDeduction": [
          //    {
          //        name: "Advance", icon: "fa fa-pencil", class: "btn btn-sm", tooltip: 'Click To  Edit'
          //    }
          //]

      };
    this.editableColumns = {
      SelectAll: {
        //commented by ashwini- changed logic of approve all, now each payslip should be approved manually and this checkbox is used for generating bank payslip
        //    filters: {},
            filters: { IsPayslipExist:false},
      },
      HRA: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      TA: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      DA: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      MA: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      CalcHRA: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      CalcDA: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      CalcTA: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      CalcMA: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
        SpecialAllowance: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
        CalcLTA: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
        CalcConveyance: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      leaveDeduction: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
           AttendanceBonus: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
          WashingAllowance: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
          FuelAllowance: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      // LoanDeduction: {
      //   filters: {IsPayslipExist:false},
      // },
      // AdvanceDeduction: {
      //   filters: {IsPayslipExist:false},
      // },
      // NoOfPresentDays: {
      //   filters: {IsPayslipExist:false},
      // },
      FixedIncentive:{
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
   
      ShiftAmount: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      OTAmount: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      BasicSalary: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      CalcBasicSalary: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
        LastMonthIncentive: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
        PerformanceIncentive: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
        FinePoints: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      // ActualGross: {
      //   filters: {IsPayslipExist:false},
      // },
      Bonus: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      Incentive: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      ESI: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      PF: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      PT: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      CalcESI: {type:'Number',
        filters:{IsPayslipExist:false,ConfigIDStatus:false,AllowPayslipGeneration:true,PaidDays: { $gt: 0 }},
      },
      CalcEPF: {type:'Number',
        filters:{IsPayslipExist:false,ConfigIDStatus:false,AllowPayslipGeneration:true,PaidDays: { $gt: 0 }},
      },
      CalcPT: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      TDS: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      EarningsOthers: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      Deduction: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      Penalty: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      SecurityDeposit: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      DeductionOthers: {
        filters: {IsPayslipExist:false,AllowPayslipGeneration:true
          // ,PaidDays: { $gt: 0 }
        },
      },
      // CalcGrossSalary:{
      //   type:'Number',
      //   filters:{IsPayslipExist:false,ConfigIDStatus:true}
      // }
    };

    // this.topHeaders = [
    //   {
    //     id: "blank1",
    //     name: "",
    //     colspan: 5,
    //   },
    //   {
    //     id: "workingDays",
    //     name: "Working Days",
    //     colspan: 2,
    //   },
    //   {
    //     id: "blank2",
    //     name: "",
    //     colspan: 1,
    //   },
    //   {
    //     id: "ActualSalary",
    //     name: "",
    //     colspan: 2,
    //   },
    //   {
    //     id: "Gross",
    //     name: "Gross Earnings",
    //     colspan: 8,
    //   },
    //   {
    //     id: "OtherEarnings",
    //     name: "Other Earnings",
    //     colspan: 7,
    //   },
    //   {
    //     id: "Deductions",
    //     name: "Deductions",
    //     colspan: 11,
    //   },
    // ];

   

    this.smallHeaders = ["TotalWokingDays", "PaidDays"];
    this.tableDataColors = {
      "Employee": [
            { styleClass: "greenBold", filter: [{ col: "IsPayslipExist", value: true }] },
            { styleClass: "text-danger", filter: [{ col: "IsSaved", value: true }] },
        ],
       
      "NetSalary": [
        { styleClass: "greenBold", filter: [{ col: "IsPayslipExist", value: true }] },
      ]
    }
    this.headerInfo = {
      NoOfPresentDays: { text: "No of days present in the specified month" },
      PaidDays: { text: "No of days paid in the specified month" },
      TotalWokingDays: {
        text: "Total no of working days in the specified month",
      },
      // "BasicSalary":{text:"BasicSalary"},
      // CalcGrossSalary
      // CalcBasicSalary
      leaveDeduction: { text: "Leave deduction for the month" },
      CalcHRA: { text: "House Rent Allowance" },
      PSA : { text: "Personal Skill Assistance" },
       FixedIncentive: { text: "Fixed Incentive / Personal Skill Assistance" },
      CalcDA: { text: "Dearness Allowance" },
      CalcTA: { text: "Travel Allowance" },
      CalcMA: { text: "Medical Allowance" },
           CalcLTA: { text: "Leave Travel Allowance" },
      HRA: { text: "House Rent Allowance" },
      TA: { text: "Travel Allowance" },
      DA: { text: "Dearness Allowance" },
      MA: { text: "Medical Allowance" },
         SA: { text: "Special Allowance" },
      LastMonthIncentive:{text:"Last month earned Incentive"},
        PerformanceIncentive:{text:" Earned Performance Incentive"},
          FinePoints:{text:"Fine applicable to this month"},
      AttendanceBonus:{text: "Attendance Bonus for the month"},
      WashingAllowance:{text: "Washing Allowance for the month"},
      FuelAllowance: { text: "Fuel Allowance for the month" },
      CalcConveyance: { text: "Conveyance Allowance" },
      Employee: { text: "Employee name in green indicates that salary slip has been approved for the specified month." },
      TotalGross: {
        text: "Gross salary is the total gross earnings before any deductions, calculated as the sum of Basic Salary, Dearness Allowance (DA), Travel Allowance (TA), and House Rent Allowance (HRA)",
      },
      // "ShiftAmount":{text:"ShiftAmount"},
      // "Incentive":{text:"Incentive"},
      // "leaveDeduction":{text:"leaveDeduction"},
      // "LoanDeduction":{text:"LoanDeduction"},
      // "AdvanceDeduction":{text:"AdvanceDeduction"},
      // "Penalty":{text:"Penalty"},
      ESI: {
        text: "The Employee State Insurance (ESI) contribution is calculated as a percentage of the employee's gross salary. Currently, the employee contributes 0.75% of their gross salary. ESI applies to employees earning a monthly wage of ₹21,000 or less.",
      },
      PF: {
        text: "The amount deducted for Employee Provident Fund (EPF) is 12% of the Basic Salary plus Dearness Allowance (DA)",
      },
      TDS: {
        text: "TDS full form stands for Tax Deducted at Source. It is the tax amount deducted by the employer from the taxpayer which is deposited to the IT Department on behalf of the taxpayer. It is a certain percentage of one's monthly income which is taxed from the point of payment.",
      },
      PT: {
        text: "₹200 is the Professional Tax (PT) charged if the basic salary is ₹25,000 or more.",
      },
      CalcESI: {
        text: "The Employee State Insurance (ESI) contribution is calculated as a percentage of the employee's gross salary. Currently, the employee contributes 0.75% of their gross salary. ESI applies to employees earning a monthly wage of ₹21,000 or less.",
      },
      CalcEPF: {
        text: "The amount deducted for Employee Provident Fund (EPF) is 12% of the Basic Salary plus Dearness Allowance (DA)",
      },
      CalcPT: {
        text: "₹200 is the Professional Tax (PT) charged if the basic salary is ₹25,000 or more.",
      },
      // "EarningsOthers":{text:"EarningsOthers"},
      TotalOtherEarnings: {
        text: "Calculated as the sum of Medical Allowance(MA), Shift Amount, OT Amount, Incentive, Fixed Incentive and others",
      },
      TotalDeduction: {
        text: "Calculated as the sum of Leave, Loan, Advance, Penalty, ESI, EPF, PT and Others",
      },
      NetSalary: {
        text: "Net pay is the result of adding Gross Salary and other earnings, then subtracting total deductions",
      },
    };

    this.headerColors = {
      Deductions: { text: "#ff2d2d", bg: "#fff1f1" },
      TotalDeduction: { text: "#240000", bg: "#ff6767" },
      SecurityDeposit: { text: "#ff2d2d", bg: "#fff1f1" },
      Penalty: { text: "#ff2d2d", bg: "#fff1f1" },
      DeductionOthers: { text: "#ff2d2d", bg: "#fff1f1" },
      LoanDeduction: { text: "#ff2d2d", bg: "#fff1f1" },
      AdvanceDeduction: { text: "#ff2d2d", bg: "#fff1f1" },
        FinePonits: { text: "#ff2d2d", bg: "#fff1f1" },
      ESI: { text: "#ff2d2d", bg: "#fff1f1" },
      PF: { text: "#ff2d2d", bg: "#fff1f1" },
      PT: { text: "#ff2d2d", bg: "#fff1f1" },
      CalcESI: { text: "#ff2d2d", bg: "#fff1f1" },
      CalcEPF: { text: "#ff2d2d", bg: "#fff1f1" },
      CalcPT: { text: "#ff2d2d", bg: "#fff1f1" },
      TDS: { text: "#ff2d2d", bg: "#fff1f1" },
      OtherEarnings: { text: "#00a927", bg: "#daffe2" },
      EarningsOthers: { text: "#00a927", bg: "#daffe2" },
      CalcGrossSalary: { text: "#006116", bg: "#65ff87" },
      Gross: { text: "#00a927", bg: "#daffe2" },
      EarnedBasicSalary: { text: "#00a927", bg: "#daffe2" },
      BasicSalary: { text: "#00a927", bg: "#daffe2" },
      HRA: { text: "#00a927", bg: "#daffe2" },
      TA: { text: "#00a927", bg: "#daffe2" },
      DA: { text: "#00a927", bg: "#daffe2" },
      MA: { text: "#00a927", bg: "#daffe2" },
       SpecialAllowance: { text: "#00a927", bg: "#daffe2" },
      AttendanceBonus:{ text: "#00a927", bg: "#daffe2" },
       WashingAllowance:{ text: "#00a927", bg: "#daffe2" },
        FuelAllowance:{ text: "#00a927", bg: "#daffe2" },
       LTA: { text: "#00a927", bg: "#daffe2" },
        Conveyance: { text: "#00a927", bg: "#daffe2" },
      CalcBasicSalary: { text: "#00a927", bg: "#daffe2" },
      CalcHRA: { text: "#00a927", bg: "#daffe2" },
      CalcDA: { text: "#00a927", bg: "#daffe2" },
      CalcTA: { text: "#00a927", bg: "#daffe2" },
      CalcMA: { text: "#00a927", bg: "#daffe2" },
  CalcLTA: { text: "#00a927", bg: "#daffe2" },
  CalcConveyance: { text: "#00a927", bg: "#daffe2" },
      TotalOtherEarnings: { text: "#006116", bg: "#65ff87" },
      TotalGross: { text: "#006116", bg: "#65ff87" },
      Incentive: { text: "#00a927", bg: "#daffe2" },
          PSA: { text: "#00a927", bg: "#daffe2" },
      FixedIncentive: { text: "#00a927", bg: "#daffe2" },
      ShiftAmount: { text: "#00a927", bg: "#daffe2" },
      OTAmount: { text: "#00a927", bg: "#daffe2" },
      Deduction: { text: "#ff2d2d", bg: "#fff1f1" },
      Bonus: { text: "#00a927", bg: "#daffe2" },
       PerformanceIncentive: { text: "#00a927", bg: "#daffe2" },
       FinePoints: { text: "#ff2d2d", bg: "#fff1f1" },
         LastMonthIncentive: { text: "#00a927", bg: "#daffe2" },
    };
  }

  @ViewChild('drawer') drawer: any;
  drawerOpen() {
    this.drawer.open();
    this.drawerOpened = true;
  }

  closeDrawer() {
    this.drawer.close();
    this.drawerOpened = false;
  }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID=localStorage.getItem("UserID");
    if (this.AdminID == null || this.OrgID == null) {
      this._router.navigate(["auth/signin"]);
    }
   
       this.formInput = {
      isESIEnabled: false,
        isPFEnabled: false,
          isPTEnabled: false,
            isSDEnabled: false
    }
    this.branchSettings = {
      singleSelection: true,
      idField: "Value",
      textField: "Text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.yearSettings = {
      singleSelection: true,
      idField: "Value",
      textField: "Text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.employeeSettings = {
      singleSelection: false,
      idField: "Value",
      textField: "Text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.monthSettings = {
      singleSelection: true,
      idField: "Value",
      textField: "Text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.departmentSettings = {
      singleSelection: false,
      idField: "Value",
      textField: "Text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.listTypeSettings = {
      singleSelection: true,
      idField: "id",
      textField: "text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.otherFilterSettings = {
      singleSelection: true,
      idField: "id",
      textField: "text",
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

    const now = new Date();
    const currentMonth = now.getMonth()+1; 
    const currentYear = now.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = currentMonth - 1; // setting month to previous month

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
       this.selected_year_deductions = currentYear.toString();
    this.selected_month_deductions = monthIndex.toString();
    this.GetOrganization();
    this.GetBranches();

    //  this.getEmployeeList()
    this.AddPermission = localStorage.getItem("AddPermission");
    if (this.AddPermission == "true") {
      this.AddPermission = true;
    } else {
      this.AddPermission = false;
    }
    this.EditPermission = localStorage.getItem("EditPermission");
    if (this.EditPermission == "true") {
      this.EditPermission = true;
    } else {
      this.EditPermission = false;
    }
    this.ViewPermission = localStorage.getItem("ViewPermission");
    if (this.ViewPermission == "true") {
      this.ViewPermission = true;
    } else {
      this.ViewPermission = false;
    }
    this.DeletePermission = localStorage.getItem("DeletePermission");
    if (this.DeletePermission == "true") {
      this.DeletePermission = true;
    } else {
      this.DeletePermission = false;
    }

    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe(
      (data) => (this.YearList = data.List),
      (error) => {
        console.log(error);
      }
    );
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe(
      (data) => (this.MonthList = data.List),
      (error) => {
        console.log(error);
      }
    );
    this.ViewPermission = localStorage.getItem("ViewPermission");
    if (this.ViewPermission == "true") {
      this.ViewPermission = true;
    } else {
      this.ViewPermission = false;
    }
    }
initializeTable() {
   this.isESIEnabled=false;  this.isPFEnabled=false;  this.isPTEnabled=false;  this.isSDEnabled=false;
}

    processOption()
    {

    }
    onListTypeSelect(item:any){

    }
    onListTypeDeSelect(item:any){

    }
    onotherFilterSelect(item:any){

    }
    onotherFilterDeSelect(item:any){

    }

    get isActionDisabled(): boolean {
  return !(this.selectedRows?.length > 0) || !(this.commonTableDataSource?.filteredData?.length > 0);
}

    onselectedOrg(item:any){
      this.selectedBranch = []
      this.selectedDepartment = []
      this.selectedEmployees = []
      this.GetBranches()
    }
    onDeselectedOrg(item:any){
      this.selectedBranch = []
      this.selectedDepartment = []
      this.selectedEmployees = []
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
    this._commonservice
      .ApiUsingGetWithOneParam(
        this.ApiURL
      )
      .subscribe(
        (data) => {
          this.BranchList = data.List;
          // console.log(this.BranchList, "branchlist");
          if(this.BranchList.length>0){
            if(this.BranchList.length == 1){
              this.selectedBranch = [{
                Text:this.BranchList[0].Text,
                Value:this.BranchList[0].Value
              }]

            this.GetDepartments();
            this.getEmployeeList();
            this.GetSalarySettingsReport();
            }

            if(this.dev == true){
              this.selectedBranch = [{
                Text:this.BranchList[this.devParams.branchIndex].Text,
                Value:this.BranchList[this.devParams.branchIndex].Value
              }]
              this.GetDepartments();
              this.getEmployeeList();
              this.GetSalarySettingsReport();
            }
          }
          else{
            // this.globalToastService.warning("No Branch found")
            this.ShowToast("No Branch found","warning")
          }
        },
        (error) => {
          // this.globalToastService.error(error);
          this.ShowToast(error,"error")
          console.log(error);
        }
      );
  }

    OpenListPopUp(Loan_data:any) {
        const dialogRef = this.dialog.open(LoanListComponent, {
            data: {
                Loan_data

            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == null || result == undefined) return;
            debugger;
            if (result.result_data.Status == true) {
                let emp_record = this.SalaryList.find((item: any) => item.EmployeeID == result.result_data.EmpID);

                if (emp_record != undefined || emp_record != null) {
                    if (result.result_data.type == 'Loan') {
                        debugger;
                        emp_record.LoanList=emp_record.LoanList.filter((item: any) => item.LoanType != 'Loan');

                        for (let i = 0; i < result.result_data.list.length; i++) {
                            emp_record.LoanList.push(result.result_data.list[i]);
                        }
                       
                        let list_of_loans = result.result_data.list;

                        let amount = 0;
                        for (let i = 0; i < list_of_loans.length; i++) {
                            amount += Number(list_of_loans[i]["Deduction"]);

                        }
                        emp_record.LoanDeduction = amount;
                        emp_record.TotalLoanDeduction = amount;


                        emp_record.TotalDeduction = emp_record.TotalLoanDeduction + emp_record.FinePoints+ emp_record.AdvanceDeduction + emp_record.Deductionsothers + emp_record.Penalty + emp_record.TDS + emp_record.SecurityDeposit + emp_record.Others + emp_record.ESI + emp_record.PF + emp_record.PT + emp_record.TDS;
                    }
                    else if (result.result_data.type == 'OT') {
                        emp_record.OTEarning = result.result_data.list;
                        emp_record.OTAmount = emp_record.OTEarning.OTAmount;
                        emp_record.TotalOtherEarnings = emp_record.OTAmount + emp_record.PSA + emp_record.FixedIncentive + emp_record.ShiftAmount + emp_record.Bonus + emp_record.Incentive + emp_record.PerformanceIncentive + emp_record.LastMonthIncentive + emp_record.WashingAllowance + emp_record.FuelAllowance+ emp_record.AttendanceBonus+ emp_record.Earningsothers;

                    }
                    else if (result.result_data.type == 'Advance') {
                        debugger;
                        emp_record.LoanList=emp_record.LoanList.filter((item: any) => item.LoanType != 'Advance');

                        for (let i = 0; i < result.result_data.list.length; i++) {
                            emp_record.LoanList.push(result.result_data.list[i]);
                        }
                        let list_of_loans = result.result_data.list;

                        let amount = 0;
                        for (let i = 0; i < list_of_loans.length; i++) {
                            amount += Number(list_of_loans[i]["Deduction"]);

                        }
                        emp_record.AdvanceDeduction = amount;
                     

                        emp_record.TotalDeduction = emp_record.LoanDeduction + emp_record.AdvanceDeduction + emp_record.Deductionsothers + emp_record.Penalty + emp_record.TDS + emp_record.SecurityDeposit + emp_record.Others + emp_record.ESI + emp_record.PF + emp_record.PT + emp_record.TDS + emp_record.FinePoints;
                        emp_record.TotalDeduction = emp_record.LoanDeduction + emp_record.AdvanceDeduction + emp_record.Deductionsothers + emp_record.Penalty + emp_record.TDS + emp_record.SecurityDeposit + emp_record.Others + emp_record.ESI + emp_record.PF + emp_record.PT + emp_record.TDS + emp_record.FinePoints;
                    }
                }
            }
        });

    }

  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json =
      this.selectedBranch && this.selectedBranch.length > 0
        ? {
          OrgID:this.OrgID,
          AdminID:loggedinuserid,
            Branches: this.selectedBranch.map((br: any) => {
              return {
                id: br.Value,
              };
            }),
          }
        : { Branches: [{ id: this.BranchList[0].Value }],OrgID:this.OrgID };

    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe(
      (data) => {
        // console.log(data);
        if (data.DepartmentList.length > 0) {
          this.DepartmentList = data.List;
          // console.log(this.DepartmentList,"department list");
          this.getEmployeeList();
        }
      },
      (error) => {
        // this.globalToastService.error(error);
        this.ShowToast(error,"error")
        console.log(error);
      }
    );
  }

    getEmployeeList() {       
   if (this.selectedMonth.length == 0 || this.selectedyear.length == 0) return;
    const json:any = {
      AdminID:this.AdminID
    }
    if (this.selectedBranch.length>0) {
      json["BranchID"] =  this.selectedBranch.map((br:any)=>{return br.Value});
        if (this.selectedDepartment) {
      // json["DepartmentID"] =  this.tempdeparray.map((br:any)=>{ return br.id})
      json["DepartmentID"] =  this.selectedDepartment.map((br:any)=>{ return br.Value})
     }
    if (this.selectedMonth && this.selectedyear) {
        // json["DepartmentID"] =  this.tempdeparray.map((br:any)=>{ return br.id})
        console.log(this.selectedMonth);
        console.log(this.selectedyear);
      json["Month"] =  this.selectedMonth[0].Value
      json["Year"] =  this.selectedyear[0].Value
     }
    
    this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch",json).subscribe((data) => {
    this.EmployeeList = data.List.map((emp:any)=>{return { Value: emp.ID, Text: emp.Name }})
    this.selectedEmployees = this.EmployeeList
    if(this.dev==true){
      this.selectedEmployees = [this.EmployeeList[this.devParams.empIndex]]
      this.GetReport()
    }
    }
    ,(error) => {
    console.log(error);this.spinnerService.hide();
  });
     }
  }

  onDeptSelect(item: any) {
    // console.log(item,"item");
    this.selectedDepartment.push({ Value: item.Value, Text: item.Text });

    this.getEmployeeList();
  }
  onDeptSelectAll(item: any) {
    // console.log(item,"item");
    this.selectedDepartment = item;
    this.getEmployeeList();
  }
  onDeptDeSelectAll() {
    this.selectedDepartment = [];
    this.getEmployeeList();
     this.GetSalarySettingsReport();
  }
  onDeptDeSelect(item: any) {
    // console.log(item,"item");
    this.selectedDepartment.splice(this.selectedDepartment.indexOf(item), 1);
    this.getEmployeeList();
     this.GetSalarySettingsReport();
  }
  onBranchSelect(item: any) { this.selectedDepartment = []
    this.selectedEmployees = []

    this.temparray.push({ id: item.Value, text: item.Text });
    this.GetDepartments();
    this.selectedEmployees = [];
    this.getEmployeeList();
    this.GetSalarySettingsReport();
  }
  onBranchDeSelect(item: any) {
    if(this.selectedBranch.length<1) {
      this.selectedDepartment = []
      this.selectedEmployees = []
        this.GetSalarySettingsReport();
      return
    }
    //  console.log(item,"item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.GetDepartments();
    this.selectedEmployees = [];
    this.getEmployeeList();
  }

  OnYearChange(event: any) {
    this.spinnerService.show();
    this.getEmployeeList();
    this.spinnerService.hide();
  }
  onyearDeSelect(event: any) {
    this.spinnerService.show();
    this.getEmployeeList();
    this.spinnerService.hide();
  }
  OnMonthChange(event: any) {
    this.spinnerService.show();
    this.getEmployeeList();
    this.spinnerService.hide();
  }
  onMonthDeSelect(event: any) {
    this.spinnerService.show();
    this.getEmployeeList();
    this.spinnerService.hide();
  }

  OnEmployeesChange(_event: any) { this.GetSalarySettingsReport();}
  OnEmployeesChangeDeSelect(event: any) {this.GetSalarySettingsReport();}
  ViewDetails(rowData: any) {
    let seleectedmonth = this.selectedMonth.map((res) => res.Value)[0];
    let seleectedyear = this.selectedyear.map((res) => res.Text)[0];
    let selectedbranch = this.selectedBranch?.map((y: any) => y.Value)[0];
    let selectedemployee = rowData.EmployeeID;
    let selectedemployeename = rowData.Employee;
    localStorage.setItem("EmployeeID", selectedemployee);
    localStorage.setItem("Month", seleectedmonth);
    localStorage.setItem("Year", seleectedyear);
    localStorage.setItem("Branch", selectedbranch);
    localStorage.setItem("Employee", selectedemployee);
    localStorage.setItem("EmployeeName", selectedemployeename);
    // this._router.navigate(['GeneratePayslip']);
    this.employeeDetail = rowData;
    this.showPayslip = true;
    this.showPayList = false
  }

  generateBankPaySlip(){
    this.showPayList = false
    this.showBankPayslip = true
    this.updatedSelectedRows
    this.BankPaySlipList = this.selectedRows
  }

  GetReport() {
    if(this.selectedBranch.length<1) {
      // this.globalToastService.warning("Please select a branch") 
      this.ShowToast("Please select a branch","warning")
      return
    }
    this.spinnerService.show();
    this.employeeLoading = true;
    if (this.selectedyear.length == 0) {
      // this.globalToastService.warning("Please Select Year");
      this.ShowToast("Please select a Year","warning")
      this.spinnerService.hide();
      this.employeeLoading = undefined;
    } else if (this.selectedMonth.length == 0) {
      // this.globalToastService.warning("Please Select Month");
      this.ShowToast("Please select a Month","warning")
      this.spinnerService.hide();
      this.employeeLoading = undefined;
    } else if (this.selectedEmployees.length == 0) {
      // this.globalToastService.warning("Please select Employee");
      this.ShowToast("Please select a Employee","warning")
      this.spinnerService.hide();
      this.employeeLoading = undefined;
    } else {
      this.spinnerService.show();
      const json = {
             ApproveStatus:this.selectedListType.length>0?this.selectedListType[0] : "All",
        Filter:this.otherFilterType.length>0?this.otherFilterType[0] : "All",
        Month: this.selectedMonth?.map((y: any) => y.Value)[0],
         Year: this.selectedyear?.map((y: any) => y.Text)[0],
        BranchID: this.selectedBranch?.map((y: any) => y.Value)[0],       
        Employee: this.selectedEmployees?.map((se: any) => {
          return {
            EmployeeID: se.Value,
            EmployeeName: se.Text,
          };
        }),
        AdminID: this.AdminID,

      };
      this.commonTableChild.clearSelectAll()
      this._commonservice
        .ApiUsingPost("Performance/GetSalaryReport", json)
        .subscribe(
          (data) => {
             var table = $('#DataTables_Table_0').DataTable();
             table.destroy();
            if(data.Status == true || data.status == true){
              this.SalaryList = data.Attendance.map((l: any, i: any) => {
                if(l.IsPayslipExist == true){
                  if(l.salaryfields){
                    l.salaryfields['PaidPercentage'] = 100 - ((Number(l["leaveDeduction"])/Number(l["Gross"]))*100)
                    l.salaryfields['GrossSalary'] = Number(l["Gross"])
                    l.salaryfields['CalcGrossSalary'] = Number(l["Gross"]) - Number(l["leaveDeduction"])
                  }
                }
              return {
                SLno: i + 1,
                ...l,
                // PaidDays         : l.NoOfPresentDays + l.ActualWeekOff + l.OfficialHolidays,
                PaidDays:l.PaidDays,
                leaveDeduction   : this.formatNumber(Number(l.salaryfields["GrossSalary"]) - l.salaryfields["CalcGrossSalary"]),
                ActualGross      : l.salaryfields.GrossSalary,
                CalcBasicSalary  : l.IsPayslipExist == true ? l.salaryfields.BasicSalary : l.salaryfields.CalcBasicSalary,
                CalcGrossSalary  : l.IsPayslipExist == true ? 
                this.formatNumber(l.salaryfields.BasicSalary + l.salaryfields.HRA + l.salaryfields.DA + l.salaryfields.TA + l.salaryfields.MA + l.salaryfields.LTA + l.salaryfields.Conveyance + l.salaryfields.SA + l.salaryfields.WashingAllowance + l.salaryfields.FuelAllowance)
                : l.salaryfields.CalcGrossSalary,
                CalcHRA          : l.IsPayslipExist == true ? l.salaryfields.HRA : l.salaryfields.CalcHRA,
                CalcDA           : l.IsPayslipExist == true ? l.salaryfields.DA : l.salaryfields.CalcDA,
                CalcTA           : l.IsPayslipExist == true ? l.salaryfields.TA : l.salaryfields.CalcTA,
                CalcMA           : l.IsPayslipExist == true ? l.salaryfields.MA : l.salaryfields.CalcMA,
                  CalcLTA           : l.IsPayslipExist == true ? l.salaryfields.LTA : l.salaryfields.CalcLTA,
                    CalcConveyance           : l.IsPayslipExist == true ? l.salaryfields.Conveyance : l.salaryfields.CalcConveyance,
                CalcESI          : l.ConfigID!=null && l.ConfigID!=0 ? l.salaryfields.CalcESI : l.salaryfields.ESI,
                CalcEPF          : l.ConfigID!=null && l.ConfigID!=0 ? l.salaryfields.CalcEPF : l.salaryfields.EPF,
                CalcPT           : l.ConfigID!=null && l.ConfigID!=0 ? l.salaryfields.CalcPT : l.salaryfields.PT,
                ConfigIDStatus   : l.ConfigID>0?true:false
              }
              });

                debugger;
                for (let i = 0; i < this.SalaryList.length; i++) {
                    this.SalaryList[i]["isEditable"] = Number(this.SalaryList[i]["PaidDays"]) > 0;
                }

            }else{
              this.ShowToast("No data found","error")
              this.SalaryList = []
            }
            this.spinnerService.hide();
            this.employeeLoading = false;
            this.selectedRows = []

            if(this.dev == true){
              this.ViewDetails(this.SalaryList[0])
            }

          },
          (error) => {
            this.spinnerService.hide();
            this.employeeLoading = false;
            this.ShowToast(error.message || error.Message,"error")
          }
        );
    }
  }

  GetCalculatedReport() {
    this.spinnerService.show();
    this.employeeLoading = true;
    if (this.selectedyear.length == 0) {
      // this.globalToastService.warning("Please Select Year");
      this.ShowToast("Please Select Year","warning")
      this.spinnerService.hide();
      this.employeeLoading = undefined;
    } else if (this.selectedMonth.length == 0) {
      // this.globalToastService.warning("Please Select Month");
      this.ShowToast("Please Select Month","warning")
      this.spinnerService.hide();
      this.employeeLoading = undefined;
    }
     else
      {
      this.spinnerService.show();
      const json = {
        Month: this.selectedMonth?.map((y: any) => y.Value)[0],
        Year: this.selectedyear?.map((y: any) => y.Text)[0],
        Employee: this.selectedRows?.map((se: any) => {
          return {
            EmployeeID: se.EmployeeID,
            EmployeeName: se.Employee,
          };
        }),
        AdminID: this.AdminID,

      };
      this._commonservice
        .ApiUsingPost("Performance/RecalculateSalaryReport", json)
        .subscribe(
          (data) => {
            if(data.Status == true || data.status == true){
            
              // this.globalToastService.success(data.Message);
              this.ShowToast(data.Message,"success")
              this.GetReport();
            }else{
              // this.globalToastService.error("Failed to Recalculte Salary. Please try again..");
              this.ShowToast("Failed to Recalculte Salary. Please try again..","error")
            }
            this.spinnerService.hide();
            this.employeeLoading = false;
            this.selectedRows = []

          },
          (error) => {
            this.spinnerService.hide();
            this.employeeLoading = false;
            // this.globalToastService.error(error.message || error.Message);
            this.ShowToast(error.message || error.Message,"error")
          }
        );
        // this.GetReport();
    }
  }
  ChangeShowAll(val:any)
  {
this.ShowAll=val;
    this.GetReport();
  }
  downloadReport() {
    let selectedColumns = [
        "SLno",
        "MappedEmpId",
        "Employee",
        // "Branch",
        // "Department",
        // "Designation",
        "TotalWokingDays",
        // "NoOfPresentDays",
        "PaidDays",
        // "BasicSalary",
        // "leaveDeduction",
        "TotalGross",
        "EarnedBasicSalary",
        "HRA",
        "DA",
        "Conveyance",
        // "FixedIncentive",
        // "ShiftAmount",
        // "OTAmount",
        // "Incentive",
        // "EarningsOthers",
        "TotalOtherEarnings",
        "LoanDeduction",
        "AdvanceDeduction",
        // "Penalty",
        "SecurityDeposit",
        // "DeductionOthers",
        "ESI",
        "PF",
        "PT",
        "TotalDeduction",
        "NetSalary",
    ];
    this.commonTableChild.downloadReport(selectedColumns);
  }

  GetReportInPDF() {
    if (this.SalaryList.length > 0) {
      this.ApiURL = "PortalReports/GetSalaryReport";
      this._commonservice.ApiUsingPost(this.ApiURL, this.SalaryList).subscribe(
        (res: any) => {
          if (res.Status == true) {
            this.pdfSrc = res.URL;
            window.open(res.URL, "_blank");
          } else {
            // this.globalToastService.warning("Sorry Failed to Generate");
            this.ShowToast("Sorry Failed to Generate","warning")
          }
          this.spinnerService.hide();
        },
        (error) => {
          this.spinnerService.hide();
          // this.globalToastService.error(error.message);
          this.ShowToast(error.message,"error")
        }
      );
    } else {
      this.spinnerService.hide();
      // this.globalToastService.warning("No Records Found");
      this.ShowToast("No Records Found","warning")
    }
  }

  showReport() {
    console.log(this.BranchList);
    console.log(this.DepartmentList);
    console.log(this.EmployeeList);
    console.log(this.employeeSettings);
    console.log(this.branchSettings);
    console.log(this.departmentSettings);
    console.log(this.selectedBranch, this.selectedBranchId);
    console.log(this.selectedDepartment, this.selectedDepartmentIds);
    console.log(this.selectedEmployees, this.selectedEmployeeId);
  }

  backToSalaryReport() {
    this.employeeDetail = {};
   this.clearSelect()
    this.showPayslip = false;
    this.showBankPayslip = false
    this.showPayList = true
  }

  formatNumber(num:number) {
    return num % 1 === 0 ? num : parseFloat(num.toFixed(2));
  }
  
  formulateSalary(index: number, grosstotal: boolean = false) {
  const salary = this.SalaryList[index];
  const values = this.salaryConfig; // assume set earlier from API: data?.List[0]?.Configfields[0]

  // Grouped Fields (Dynamic)
  const grossComponents = ["CalcBasicSalary", "CalcHRA", "CalcDA", "CalcTA", "CalcMA", "CalcLTA", "CalcConveyance", "CalcSpecialAllowance", "CalcWashingAllowance", "CalcFuelAllowance"];

  const otherEarnings = [
    ...(values?.isShiftAmount !== false ? ["ShiftAmount"] : []),
    ...(values?.isOTAmount !== false ? ["OTAmount"] : []),
    "Bonus","PSA", "FixedIncentive", "Incentive", "AttendanceBonus","EarningsOthers"
  ];

  const deductionFields = [
    "Deduction", "LoanDeduction", "AdvanceDeduction", "DeductionOthers",
    "Penalty", "SecurityDeposit", "CalcESI", "CalcEPF", "CalcPT", "TDS"
  ];

  // If payslip already exists, just format earnings
  if (salary.IsPayslipExist === true) {
    otherEarnings.forEach(field => salary[field] = this.formatNumber(salary[field]));
    salary["TotalOtherEarnings"] = this.formatNumber(
      otherEarnings.reduce((sum, field) => sum + Number(salary[field] || 0), 0)
    );
    return;
  }

  // Paid Percentage
  salary.salaryfields["PaidPercentage"] = 100 - ((Number(salary["leaveDeduction"]) / Number(salary.salaryfields["GrossSalary"])) * 100);

  // Calc Gross
  salary["CalcGrossSalary"] = this.formatNumber(
    grossComponents.reduce((sum, field) => sum + Number(salary[field] || 0), 0)
  );

  // Format and compute TotalOtherEarnings
  otherEarnings.forEach(field => salary[field] = this.formatNumber(salary[field]));
  salary["TotalOtherEarnings"] = this.formatNumber(
    otherEarnings.reduce((sum, field) => sum + Number(salary[field] || 0), 0)
  );

  // Total Earnings
  salary["TotalEarnings"] = this.formatNumber(Number(salary["CalcGrossSalary"]) + Number(salary["TotalOtherEarnings"]));

  // Deductions
  salary["TotalDeduction"] = this.formatNumber(
    deductionFields.reduce((sum, field) => sum + Number(salary[field] || 0), 0)
  );

  // Net Salary
  salary["NetSalary"] = this.formatNumber(Number(salary["TotalEarnings"]) - Number(salary["TotalDeduction"]));
  if (salary["NetSalary"] < 0) salary["NetSalary"] = 0;

  return salary;
}

  // formulateSalary(index:number,grosstotal:boolean= false) {
  //   let salary  = this.SalaryList[index]
  //   if(salary.IsPayslipExist == true){
  //     salary["Bonus"] = this.formatNumber(salary["Bonus"])
  //     salary["FixedIncentive"] = this.formatNumber(salary["FixedIncentive"])
  //     salary["ShiftAmount"] = this.formatNumber(salary["ShiftAmount"])
  //     salary["OTAmount"] = this.formatNumber(salary["OTAmount"])
  //     salary["Incentive"] = this.formatNumber(salary["Incentive"])
  //     salary["EarningsOthers"] = this.formatNumber(salary["EarningsOthers"])
  //     salary["TotalOtherEarnings"] = this.formatNumber(Number(
  //       Number(salary["Bonus"]) +
  //       Number(salary["FixedIncentive"]) +
  //       Number(salary["ShiftAmount"]) +
  //       Number(salary["OTAmount"]) +
  //       Number(salary["Incentive"]) +
  //       Number(salary["EarningsOthers"])
  //     ))
  //     return
  //   }
  //   console.log(salary);
    
  //   salary.salaryfields["PaidPercentage"] = 100 - ((Number(salary["leaveDeduction"])/Number(salary.salaryfields["GrossSalary"]))*100)
  //   salary["CalcGrossSalary"] = this.formatNumber(
  //     Number(salary["CalcBasicSalary"]) +
  //     Number(salary["CalcHRA"]) +
  //     Number(salary["CalcDA"]) +
  //     Number(salary["CalcTA"]) +
  //     Number(salary["CalcMA"]) +
  //      Number(salary["CalcLTA"]) +
  //       Number(salary["CalcConveyance"])
  //     )
  //     salary["Bonus"] = this.formatNumber(salary["Bonus"])
  //     salary["FixedIncentive"] = this.formatNumber(salary["FixedIncentive"])
  //     salary["ShiftAmount"] = this.formatNumber(salary["ShiftAmount"])
  //     salary["OTAmount"] = this.formatNumber(salary["OTAmount"])
  //     salary["Incentive"] = this.formatNumber(salary["Incentive"])
  //     salary["EarningsOthers"] = this.formatNumber(salary["EarningsOthers"])

  //     salary["TotalOtherEarnings"] = this.formatNumber(Number(
  //       Number(salary["Bonus"]) +
  //       Number(salary["FixedIncentive"]) +
  //       Number(salary["ShiftAmount"]) +
  //       Number(salary["OTAmount"]) +
  //       Number(salary["Incentive"]) +
  //       Number(salary["EarningsOthers"])
  //     ))
      
  //   salary["TotalEarnings"] = this.formatNumber(salary["CalcGrossSalary"] + salary["TotalOtherEarnings"]);
  //       console.log("Total earnings calculated");
  //       salary["TotalDeduction"] = this.formatNumber(Number(
  //         Number(salary["Deduction"] || 0) +
  //         Number(salary["LoanDeduction"] || 0) +
  //         Number(salary["AdvanceDeduction"] || 0) +
  //         Number(salary["DeductionOthers"] || 0) +
  //         Number(salary["Penalty"] || 0) +
  //         Number(salary["SecurityDeposit"] || 0) +
  //     Number(salary["CalcESI"] || 0) +
  //     Number(salary["CalcEPF"] || 0) +
  //     Number(salary["CalcPT"] || 0) +
  //         Number(salary["TDS"] || 0)
  //       ));
        
  //       salary["NetSalary"] = this.formatNumber(Number( Number(salary["TotalEarnings"]) - Number(salary["TotalDeduction"]) ));
  //       if(salary["NetSalary"]<0){salary["NetSalary"]=0;}
  //   return salary
  // }

  
    editColumn(row: any) {
        if (row.value < 0) {
            this.ShowToast('Negative Values are Not Allowed', 'warning');
            return;
        }

    let data = row.data;
    let column = row.column;
    let value = row.value;
    // console.log(this.SalaryList);
    console.log(row);

    let index = this.SalaryList.findIndex(
      (e: any) => e.EmployeeID == data.EmployeeID
    );
    // console.log({index});

    this.SalaryList[index][column] = Number(value);

    if(column == "leaveDeduction"){
      this.SalaryList[index].salaryfields["PaidPercentage"] = 100 - Number((this.SalaryList[index]["leaveDeduction"]/this.SalaryList[index].salaryfields["GrossSalary"]*100))
    }
    // this.formulateSalary(index)
    if(['CalcGrossSalary','leaveDeduction'].includes(column)){
      this.calculateSalary(index,true,true)
      this.formulateSalary(index)
    }else{
      console.log(column);
      
      if(["CalcBasicSalary","CalcHRA","CalcDA","CalcMA","CalcTA","CalcLTA","CalcConveyance","CalcWashingAllowance", "CalcFuelAllowance","CalcSpecialAllowance"].includes(column)){
        this.calculateSalary(index,false,true)
        this.formulateSalary(index,true)
      }else if(["CalcESI","CalcEPF","CalcPT"].includes(column)){
        this.calculateSalary(index,false,false)
        this.formulateSalary(index)
      }else{
        this.calculateSalary(index,false,false)
        this.formulateSalary(index)

      }
    }

  }

  
  calculate(type:string,SalaryFormulae:any,empList:any,){
    for (let i = 0; i < SalaryFormulae.length; i++) {
      const sf = SalaryFormulae[i];
      if(sf.SalaryType == type){
        let value =0
        if(sf.isBasic) value += empList.CalcBasicSalary || 0
        if(sf.isHRA) value += empList.CalcHRA || 0
        if(sf.isDA) value += empList.CalcDA || 0
        if(sf.isTA) value += empList.CalcTA || 0
        if(sf.isMA) value += empList.CalcMA || 0
         if(sf.isLTA) value += empList.CalcLTA || 0
          if(sf.isConveyance) value += empList.CalcConveyance || 0
          if(sf.isSpecialAllowance) value += empList.CalcSpecialAllowance || 0
          if(sf.isWashingAllowance) value += empList.CalcWashingAllowance || 0
          if(sf.isFuelAllowance) value += empList.CalcFuelAllowance || 0
   || 0
        value = this.formatNumber(Number(value))
        
        
        if((sf.Min == null || value >= sf.Min) && (sf.Max == null || value <= sf.Max)){
          
          // console.log("--------------------------");
          // console.log("--------------------------");
          // console.log(sf);
          // console.log("value : ", value);
          // console.log(sf.Min ," - ", sf.Max);
          // console.log(sf.Min == null,value >= sf.Mi,sf.Max == null,value <= sf.Max);
          // console.log("--------------------------");
          // console.log("--------------------------");
          if(sf.isAmount == true){
            return this.formatNumber(Number(sf.Value))
          }else{
            return this.formatNumber(Number(value * (sf.Value/100)))
          }
        }
      }
    }
    return 0
  }
  
  
  calculateSalary(index:any,total:boolean,deductions:boolean){
    console.log({total,deductions});
    if(this.SalaryList[index].IsPayslipExist == true) return
    if(this.SalaryList[index].SalaryCalculation || this.SalaryList[index].ConfigID == null || this.SalaryList[index].ConfigID == 0){
      console.log(this.SalaryList[index]);
      let config = this.SalaryList[index].SalaryCalculation?.config
      let formula = this.SalaryList[index].SalaryCalculation?.formula
      if(total == true)
        {  
        this.SalaryList[index]['CalcBasicSalary'] = this.formatNumber(this.SalaryList[index].salaryfields.BasicSalary * Number((this.SalaryList[index].salaryfields.PaidPercentage/100)))
        
        // if(config.isHRA){
          this.SalaryList[index]['CalcHRA'] = this.formatNumber(this.SalaryList[index].salaryfields.HRA * Number((this.SalaryList[index].salaryfields.PaidPercentage/100)))
        // } else this.SalaryList[index]['CalcHRA'] = 0
        // if(config.isDA){
          this.SalaryList[index]['CalcDA'] = this.formatNumber(this.SalaryList[index].salaryfields.DA * Number((this.SalaryList[index].salaryfields.PaidPercentage/100)))
        // } else this.SalaryList[index]['CalcDA'] =  0
        // if(config.isTA){
          this.SalaryList[index]['CalcTA'] = this.formatNumber(this.SalaryList[index].salaryfields.TA * Number((this.SalaryList[index].salaryfields.PaidPercentage/100)))
        // } else this.SalaryList[index]['CalcTA'] =  0
        // if(config.isMA){
          this.SalaryList[index]['CalcMA'] = this.formatNumber(this.SalaryList[index].salaryfields.MA * Number((this.SalaryList[index].salaryfields.PaidPercentage/100)))
        // } else this.SalaryList[index]['CalcMA'] =  0

            this.SalaryList[index]['CalcLTA'] = this.formatNumber(this.SalaryList[index].salaryfields.LTA * Number((this.SalaryList[index].salaryfields.PaidPercentage/100)))
        // } else this.SalaryList[index]['CalcLTA'] =  0

            this.SalaryList[index]['CalcConveyance'] = this.formatNumber(this.SalaryList[index].salaryfields.Conveyance * Number((this.SalaryList[index].salaryfields.PaidPercentage/100)))
        // } else this.SalaryList[index]['CalcConveyance'] =  0
      }
      if(deductions==true && config){
        if(config?.isESI){
          this.SalaryList[index]['CalcESI'] = this.calculate('ESI',formula,this.SalaryList[index])
        } else this.SalaryList[index]['CalcESI'] = 0
        if(config?.isPF){
          this.SalaryList[index]['CalcEPF'] = this.calculate('EPF',formula,this.SalaryList[index])
        } else this.SalaryList[index]['CalcEPF'] =  0
        
        if(config?.isPT){
          this.SalaryList[index]['CalcPT'] = this.calculate('PT',formula,this.SalaryList[index])
        } else this.SalaryList[index]['CalcPT'] =  0
        
      }
      
    }else{
      this.GetSalaryConfigs(this.SalaryList,index,total,deductions)
    }
   this.formulateSalary(index)
    return
  }
  
  
  
  GetSalaryConfigs(empList:any,index:any,total:any,deductions:any) {
    let Branch = empList[index].Branchid || 0;
    // let empid =  0;
    let empid = empList[index].EmployeeID || 0;
    if (Branch == 0 && empid == 0) return;
    let json = {
      BranchList: Branch != 0 ? [Branch] : [],
      DepartmentList: [],
      Employeelist: empid != 0 ? [empid] : [],
    };
  
    if (
      json.Employeelist.length == 0 &&
      json.BranchList.length == 0 &&
      json.DepartmentList.length == 0
    ) {
      // this.globalToastService.warning(
      //   "Please select a Branch or a Department or an Employee"
      // )
      this.ShowToast("Please select a Branch or a Department or an Employee","warning")
      return
  }
    this.spinnerService.show();
    empList[index]['SalaryCalculation'] = {config:null,formula:null}
    this._commonservice
      .ApiUsingPost("SalaryCalculation/getSalaryConfiguration", json)
      .subscribe(
        (data) => {
          empList[index]['SalaryCalculation']['config'] = data?.List[0]?.Configfields[0];
          this._commonservice
            .ApiUsingPost("SalaryCalculation/GetSalaryCalculationConfig", json)
            .subscribe(
              (calData) => {
                console.log({ calData });
                empList[index]['SalaryCalculation']['formula'] = calData.List[0]?.ConfigFields
                this.spinnerService.hide();
                this.calculateSalary(index,total,deductions)
              },
              (error) => {
                this.spinnerService.hide();
                // this.globalToastService.error(error.message);
                this.ShowToast(error.message,"error")
              }
            );
        },
        (error) => {
          this.spinnerService.hide();
          // this.globalToastService.error(error.message);
          this.ShowToast(error.message,"error")
        }
      );
  }
updatedSelectedRows(data: any) {
  this.selectedRows = [];
  let row = data?.row;

  if (row && row.length > 0) {
    for (let i = 0; i < row.length; i++) {
      const ri = row[i];

      if (ri.IsPayslipExist === true || ri.AllowPayslipGeneration !== true) {
        // Unselect the row in UI (if user manually checked it)
        let slIndex = this.SalaryList.findIndex(
          (sl: any) => sl.EmployeeID == ri.EmployeeID
        );
        if (slIndex != -1) {
          this.SalaryList[slIndex]['isSelected'] = false;
        }
      } else {
        if (ri.isSelected === true) {
          this.selectedRows.push(ri);
        }
      }
    }
    console.log(this.selectedRows, "Selected rows eligible for payslip generation");
  }
}



  // updatedSelectedRows(data:any){
  //   this.selectedRows = []
  //   let row = data?.row
  //   if(row.length > 0){
  //     for (let i = 0; i < row.length; i++) {
  //       const ri = row[i];
  //       if(ri.IsPayslipExist == true){
  //         // this.globalToastService.warning("Payslip has been already approved.")
  //         let slIndex = this.SalaryList.findIndex((sl:any)=>sl.EmployeeID == ri.EmployeeID)
  //         if(slIndex != -1 ){
  //           this.SalaryList[slIndex]['isSelected'] = false
  //           console.log(this.SalaryList);
  //         }          
          
  //       }else{
  //         if(ri.isSelected == true) this.selectedRows.push(ri)
  //           console.log(this.selectedRows,"whats here...");
  //       }
  //     }
  //     // this.selectedRows = data.row;
  //   }

  // }

  actionEmitter(data: any) {
    if (data.action.name == "Edit") {
    } else if (data.action.name == "View Details") {
      this.ViewDetails(data.row);
    } else if (data.action.name == "editColumn") {
      this.editColumn(data.row);
    } else if (data.action.name == "updatedSelectedRows") {
      this.updatedSelectedRows(data)
    } else if (data.action.name == "Approve Payslip") {
      this.Pay(data.row);
    }
    else if (data.action.name == "Recalculate") {
      this.Refreshdata(data.row);
    } 
    else if (data.action.name == "searchUpdate") {
      this.commonTableDataSource = data.row
      console.log(this.commonTableDataSource);
      
    }
  }

  Refreshdata(Data:any) {
    this.spinnerService.show();
    this._commonservice
      .ApiUsingGetWithOneParam(
        "Performance/RecalculateAttendance?EmployeeID=" + Data.EmployeeID + "&Month=" + Data.MonthID+"&Year="+Data.Year
      )
      .subscribe(
        (data) => {
          if(data.Status==true){
            // this.globalToastService.success(data.Message);
            this.ShowToast(data.Message,"success")
            this.GetReport();
            this.spinnerService.hide();
          
          }
          else{
            // this.globalToastService.warning(data.Message);
            this.ShowToast(data.Message,"warning")
            this.spinnerService.hide();
          }
        },
        (error) => {
          // this.globalToastService.warning(error);
          this.ShowToast(error,"error")
          this.spinnerService.hide();
          console.log(error);
        }
      );
  }

  generatePaymentJsons(){
    let paymentJson : any = []
    let payslipJson : any = []
    for (let i = 0; i < this.selectedRows.length; i++) {
      const row = this.selectedRows[i];
      const paymentTemp = {
        AccountNumber: "",
        ChequeBankName: "",
        ChequeDate: new Date().toISOString().split("T")[0],
        ChequeNumber: "",
        IFSCcode: "",
        ImageURL: "",
        PaidAmount: row.NetSalary,
        PaidFromID: parseInt(this.AdminID),
        PaidToID: parseInt(row.EmployeeID),
        PaymentDate: new Date().toISOString().split("T")[0],
        PaymentFor: "Salary",
        PaymentID: "",
        PaymentMode: "Bank",
        PaymentTypeID: "",
        ReferenceID: "",
        UPIBankName: "",
        UPINumber: "",
      }

      const payslipTemp = {
        IsPayslipExist: false,
        bonusdata:row.bonusdata,
        AdminAmount: row.AdminAmount,
        BasicSalary: row.BasicSalary,
        CalculatedLeaves: row.CalculatedLeaves,
        Comment: "",
        DateWiseInfo: [],
        Employee: row.Employee,
        EmployeeID: row.EmployeeID,
        EmployeeLeaves: row.EmployeeLeaves,
        ESI: row.ESI,
        FromDate: row.FromDate,
        Incentive: row.Incentive,
        Key: "en",
        leaveDeduction: row.leaveDeduction,
        LoanDeduction: row.LoanDeduction,
        Month: row.MonthID,
        NetSalary: row.NetSalary,
        NewLoanBalance: row.NewLoanBalance,
        NewSalaryBalance: row.NewSalaryBalance,
        OfficialHolidays: row.OfficialHolidays,
        OldLoanBalance: row.OldLoanBalance,
        OldSalaryBalance: row.OldSalaryBalance,
        PaidAmount: row.PaidAmount,
        PaidLeave: row.PaidLeave,
        PayableSalary: row.PayableSalary,
        // PaymentID: data.PaymentId,
        PayslipDate: row.PayslipDate,
        PerDaySalary: row.PerDaySalary,
        PF: row.PF,
        PresentDays: row.NoOfPresentDays,
        ProfessionalTax: row.ProfessionalTax,
        SickLeave: row.SickLeave,
        ToDate: row.ToDate,
        TotalDays: row.TotalDays,
        TotalLoanDeduction: row.TotalLoanDeduction,
        TotalWokingDays: row.TotalWokingDays,
        Type: row.Type,
        WeekOffDays: row.WeekOffDays,
        WeekOffDeduction: row.WeekOffDeduction,
        Year: row.Year,
        AllowPayslipGeneration:row.AllowPayslipGeneration,
        Gross:row.Gross,
        FinalGross:row.CalcGross,
        LoanList:row.LoanList,
        MonthID:row.MonthID,
        PT:row.ProfessionalTax,
        DeductionOthers:row.DeductionOthers,
        TotalOtherEarnings:row.EarningsOthers,
        SecurityDeposit:row.SecurityDeposit,
         AttendanceBonus:row.AttendanceBonus,
         WashingAllowance:row.CalcWashingAllowance,
         SpecialAllowance:row.CalcSpecialAllowance,
        FuelAllowance:row.CalcFuelAllowance,
        FinePoints:row.FinePoints,
        LastMonthIncentive:row.LastMonthIncentive,
        PerformanceIncentive:row.PerformanceIncentive
      };

      paymentJson.push(paymentTemp)
      payslipJson.push(payslipTemp)

    }

    return {paymentJson,payslipJson}
  }

  generatePayslipJsons(res:any,payslipJsons:any){
    let successPayslipJsons = []
    for (let i = 0; i < res.length; i++) {
      const resElement = res[i];
      if(resElement.Status == true){
        successPayslipJsons.push({
          ...payslipJsons[i],
          PaymentID: resElement.PaymentId
        })
      }
    }
    return successPayslipJsons
  }


  ApproveBulkPayslip() {
    this.PayJsons = {}
    this.PayJsons = this.generatePaymentJsons()
    let PaymentJsons = this.PayJsons.paymentJson
    debugger

    this.clearSelect()
    let SavePaymentDetailsReuests =  PaymentJsons.map((jsonBody:any) => this._commonservice.ApiUsingPost("Admin/SavePaymentDetails",jsonBody));
    forkJoin(SavePaymentDetailsReuests).subscribe(
      (paymentResults) => {
        let PayslipJsons = this.generatePayslipJsons(paymentResults,this.PayJsons.payslipJson)
        let SavePaySlipDetailsReuests =  PayslipJsons.map((jsonBody:any) => this._commonservice.ApiUsingPost("SalaryCalculation/SavePaySlipDetails",jsonBody));
        forkJoin(SavePaySlipDetailsReuests).subscribe(
          (payslipResults) => {
            this.commonTableChild.clearSelectAll()
            this.dialog.open(PaySlipReport, {
              data: { PayslipJsons,payslipResults,SalaryList:this.SalaryList,selectedRows:this.selectedRows},
               panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
              this.GetReport()
            })

          },
          (error) => {
            // this.globalToastService.error(error.message);
            this.ShowToast(error.message,"error")
          }
        );
      },
      (error) => {
        // this.globalToastService.error(error.message);
        this.ShowToast(error.message,"error")
      }
    );
  }

  submitBulkSummary(IL: any) {}

  clearSelect(){
    this.selectedRows = []
    this.SalaryList.forEach(element => {
      element.isSelected = false
    });
  }
    onCellButtonClicked(event: any) {
      
        if (event.button.name == "Loan") {
            let data_payload = {
                payload: event.row,
                
                type: 'Loan'
            }
            this.OpenListPopUp(data_payload);
        }
        if (event.button.name == "Shift") {
             
            let data_payload = {
                payload: event.row,

                type: 'Shift'
            }
            this.OpenListPopUp(data_payload);
        }
        if (event.button.name == "OT") {
       
            let data_payload = {
                payload: event.row,
                type: 'OT'
            }
            this.OpenListPopUp(data_payload);
        }

        if (event.button.name == "Advance") {

            let data_payload = {
                payload: event.row,
                type: 'Advance'
            }
            this.OpenListPopUp(data_payload);
        }
    }

  Pay(row: any) {
      this.clearSelect();
      debugger;
    // row = row.map((r:any)=>{return { ...r, comment:"" }})
    row["comment"] = row["comment"] ? row["comment"] : "";
    this.dialog.open(PaymentSummary, {
      data: { IL: row },
       panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
      if(res){
        console.log(res);
        this.dialog.open(PaySlipReport, {
          data: { PayslipJsons:[res.json],payslipResults:[res.data]},
           panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
          this.GetReport()
        })
      }
    })
  }
  backToDashboard()
  {
    this._router.navigate(["appdashboard"]);
  }

  updateValues(event:any){
    this.editColumn(event)
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
downloadSample() {
  this.spinnerService.show();
  if (this.selectedRows.length == 0) {
    this.ShowToast("Please Select Employee", "warning");
  } else {
    const paysliparray: any[] = [];

    for (let i = 0; i < this.selectedRows.length; i++) {
      const emp = this.selectedRows[i];
      const temp = {
        IsPayslipExist: false,
        PaidDays:emp.PaidDays,
        AdminAmount: emp.AdminAmount,
        BasicSalary: emp.CalcBasicSalary,
        HRA: emp.CalcHRA,
        DA: emp.CalcDA,
        TA: emp.CalcTA,
        MA: emp.CalcMA,
        ShiftAmount: emp.ShiftAmount,
        OTAmount: emp.OTAmount,
        Others: emp.Others,
        TotalOtherEarnings: emp.EarningsOthers,
        Incentive: emp.Incentive,
        leaveDeduction: emp.leaveDeduction,
        LoanDeduction: emp.LoanDeduction,
        AdvanceDeduction: emp.AdvanceDeduction,
        Penalty: emp.Penalty,
        DeductionOthers: emp.DeductionOthers,
        ESI: emp.CalcESI,
        PF: emp.CalcEPF,
        ProfessionalTax: emp.CalcPT,
        TDS: emp.TDS,
        CalculatedLeaves: emp.CalculatedLeaves,
        Comment: "",
        DateWiseInfo: [],
        Employee: emp.Employee,
        EmployeeID: emp.EmployeeID,
        EmployeeLeaves: emp.EmployeeLeaves,
        FromDate: emp.FromDate,
        Key: "en",
        MonthID: emp.MonthID,
        Month: emp.MonthID,
        NetSalary: emp.NetSalary,
        NewLoanBalance: emp.NewLoanBalance,
        NewSalaryBalance: emp.NewSalaryBalance,
        OfficialHolidays: emp.OfficialHolidays,
        OldLoanBalance: emp.OldLoanBalance,
        OldSalaryBalance: emp.OldSalaryBalance,
        PaidAmount: emp.PaidAmount,
        PaidLeave: emp.PaidLeave,
        PayableSalary: emp.PayableSalary,
        PaymentID: 0,
        PayslipDate: emp.PayslipDate,
        PerDaySalary: emp.PerDaySalary,
        PresentDays: emp.NoOfPresentDays,
        SickLeave: emp.SickLeave,
        ToDate: emp.ToDate,
        TotalDays: emp.TotalDays,
        TotalLoanDeduction: emp.TotalLoanDeduction,
        TotalWokingDays: emp.TotalWokingDays,
        Type: 'Pay',
        WeekOffDays: emp.WeekOffDays,
        WeekOffDeduction: emp.WeekOffDeduction,
        Year: emp.Year,
        Bonus: emp.Bonus,
        Deduction: emp.Deduction,
        bonusdata: emp.bonusdata,
        Gross: emp.Gross,
        FinalGross: emp.CalcGross,
        LoanList: emp.LoanList,
        PSA: emp.PSA,
        FixedIncentive: emp.FixedIncentive,
        SecurityDeposit: emp.SecurityDeposit,
        PT: emp.CalcPT,
        AttendanceBonus: emp.AttendanceBonus,
        WashingAllowance: emp.CalcWashingAllowance,
        SpecialAllowance: emp.CalcSpecialAllowance,
        FuelAllowance: emp.CalcFuelAllowance,
             FinePoints:emp.FinePoints,
        LastMonthIncentive:emp.LastMonthIncentive,
        PerformanceIncentive:emp.PerformanceIncentive
     
      };
      paysliparray.push(temp);
    }

    const json = { Payslips: paysliparray };

    // Step 1: Get download link from API
    this._commonservice.ApiUsingPostNew("api/Payslip/BulkUploadSalaryReport", json)
      .subscribe((res: any) => {
         this.spinnerService.show();
        if (res.Status && res.Link) {
          // Step 2: Make a separate request to download the file as blob
          this.httpClient.get(res.Link, { responseType: 'blob' as 'json' })
            .subscribe((fileBlob: any) => {
              const blob = new Blob([fileBlob], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Employee_Salary_Report.xlsx'; // Or extract from URL if dynamic
              document.body.appendChild(a);
              a.click();
              
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
               this.spinnerService.hide();
            }, error => {
              this.ShowToast("Failed to download file", "error");
               this.spinnerService.hide();
              console.error(error);
            });
        } else {
          this.ShowToast("No file link received from server", "error");
           this.spinnerService.hide();
        }
      }, error => {
        this.ShowToast("API call failed", "error");
         this.spinnerService.hide();
        console.error(error);
      });
  }
}

    onFileChange(event: any,form:NgForm ): void {
      const target = event.target as HTMLInputElement;
          this.length=target.files?.length;
           this.file = (target.files as FileList)[0];
          var reader = new FileReader();
          reader.readAsDataURL(this.file);
        
          const fData: FormData = new FormData();
        fData.append('formdata', JSON.stringify(form.value));
      fData.append('FileType', "Image");
          if (this.file != undefined) { fData.append('File', this.file, this.file.name);
          this._commonservice.ApiUsingPostMultipart("Admin/FileUpload",fData).subscribe(data => { 
            this.ImageUrl=data.NewUrl;
          });}        
        }


    uploadExcel(): void {
      if (this.ImageUrl==null || this.ImageUrl=="" || this.ImageUrl==" " || this.ImageUrl==undefined) {
        this.ShowToast("Please select a file first","warning")
        return;
      }
         const paysliparray: any[] = [];
var FromDate=""; var ToDate="";
    for (let i = 0; i < this.selectedRows.length; i++) {
      const emp = this.selectedRows[i];
      const temp = {
        IsPayslipExist: false,
        AdminAmount: emp.AdminAmount,
        BasicSalary: emp.CalcBasicSalary,
        HRA: emp.CalcHRA,
        DA: emp.CalcDA,
        TA: emp.CalcTA,
        MA: emp.CalcMA,
        ShiftAmount: emp.ShiftAmount,
        OTAmount: emp.OTAmount,
        Others: emp.Others,
        TotalOtherEarnings: emp.EarningsOthers,
        Incentive: emp.Incentive,
        leaveDeduction: emp.leaveDeduction,
        LoanDeduction: emp.LoanDeduction,
        AdvanceDeduction: emp.AdvanceDeduction,
        Penalty: emp.Penalty,
        DeductionOthers: emp.DeductionOthers,
        ESI: emp.CalcESI,
        PF: emp.CalcEPF,
        ProfessionalTax: emp.CalcPT,
        TDS: emp.TDS,
        CalculatedLeaves: emp.CalculatedLeaves,
        Comment: "",
        DateWiseInfo: [],
        Employee: emp.Employee,
        EmployeeID: emp.EmployeeID,
        EmployeeLeaves: emp.EmployeeLeaves,
        FromDate: emp.FromDate,
        Key: "en",
        MonthID: emp.MonthID,
        Month: emp.MonthID,
        NetSalary: emp.NetSalary,
        NewLoanBalance: emp.NewLoanBalance,
        NewSalaryBalance: emp.NewSalaryBalance,
        OfficialHolidays: emp.OfficialHolidays,
        OldLoanBalance: emp.OldLoanBalance,
        OldSalaryBalance: emp.OldSalaryBalance,
        PaidAmount: emp.PaidAmount,
        PaidLeave: emp.PaidLeave,
        PayableSalary: emp.PayableSalary,
        PaymentID: 0,
        PayslipDate: emp.PayslipDate,
        PerDaySalary: emp.PerDaySalary,
        PresentDays: emp.NoOfPresentDays,
        SickLeave: emp.SickLeave,
        ToDate: emp.ToDate,
        TotalDays: emp.TotalDays,
        TotalLoanDeduction: emp.TotalLoanDeduction,
        TotalWokingDays: emp.TotalWokingDays,
        Type: 'Pay',
        WeekOffDays: emp.WeekOffDays,
        WeekOffDeduction: emp.WeekOffDeduction,
        Year: emp.Year,
        Bonus: emp.Bonus,
        Deduction: emp.Deduction,
        bonusdata: emp.bonusdata,
        Gross: emp.Gross,
        FinalGross: emp.CalcGross,
        LoanList: emp.LoanList,
        PSA: emp.PSA,
        FixedIncentive: emp.FixedIncentive,
        SecurityDeposit: emp.SecurityDeposit,
        PT: emp.CalcPT,
        AttendanceBonus: emp.AttendanceBonus,
        WashingAllowance:emp.CalcWashingAllowance,
        FuelAllowance: emp.CalcFuelAllowance, 
      SpecialAllowance: emp.CalcSpecialAllowance, 
           FinePoints:emp.FinePoints,
        LastMonthIncentive:emp.LastMonthIncentive,
        PerformanceIncentive:emp.PerformanceIncentive
      };
      FromDate=emp.FromDate;
      ToDate=emp.ToDate;
      paysliparray.push(temp);
    }
     const json={
      FileURL:this.ImageUrl,
      Salarydetails:paysliparray,
AdminID:this.UserID,
FromDate:FromDate,
ToDate:ToDate

     }   
      const apiUrl = 'Payslip/SalaryBulkExcelreader';
      this._commonservice.ApiUsingPost(apiUrl,json).subscribe(res =>{
        console.log(res);
        if(res.Status == true){
                   if (res.Status && res.Filepath) {
                    res.Filepath= environment.Url + res.Filepath; // Ensure the URL is complete
          // Step 2: Make a separate request to download the file as blob
          this.httpClient.get(res.Filepath, { responseType: 'blob' as 'json' })
            .subscribe((fileBlob: any) => {
              const blob = new Blob([fileBlob], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Employee_Salary_Report.xlsx'; // Or extract from URL if dynamic
              document.body.appendChild(a);
              a.click();
              
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
               this.spinnerService.hide();
            }, error => {
              this.ShowToast("Failed to download file", "error");
               this.spinnerService.hide();
              console.error(error);
            });
        }
          this.GetReport();
      
          // if(data.ErrorFilePath){
          //   window.open(environment.Url+data.ErrorFilePath,'_blank')
          // }
        }
        else{
          this.ShowToast("Failed to Upload File","error")
        }
      },(error)=>{
        this.ShowToast(error.error.message,"error")
      })

      

     
    }

      ApprovePayslips()
  {
    if(this.selectedRows.length>0)
    {
    this.dialog.open(ApprovepayslipComponent, {
      data:{IL:this.selectedRows, Month:this.selectedMonth?.map((y: any) => y.Value)[0],
      Year:this.selectedyear?.map((y: any) => y.Value)[0],},
       panelClass: 'custom-dialog',
        disableClose: true
    }).afterClosed().subscribe((res: any) => {
        debugger;
        console.log("result from Approve PaySlip");
        if (res != undefined) {
            if (res.server_response.Status) {
              
                this.ShowToast(res.server_response.Message, "success");
                this.GetReport();
                
            }
        }
      
    })
    }
    else
    {
      this.ShowToast("Please select atleast one checkbox","warning");
    }
  }

    SaveCalculations()
  {
    if(this.selectedRows.length>0)
    {
      var paysliparray:any[]=[];
         for(let i=0;i<this.selectedRows.length;i++)
    {
        var temp={
          "IsPayslipExist":false,
          "AdminAmount":this.selectedRows[i].AdminAmount,
          "BasicSalary":this.selectedRows[i].CalcBasicSalary,
          "HRA":this.selectedRows[i].CalcHRA,
          "DA":this.selectedRows[i].CalcDA,
          "TA":this.selectedRows[i].CalcTA,
            "MA": this.selectedRows[i].CalcMA,
            "LTA": this.selectedRows[i].CalcLTA,
            "Conveyance": this.selectedRows[i].CalcConveyance,
          "ShiftAmount":this.selectedRows[i].ShiftAmount,
          "OTAmount":this.selectedRows[i].OTAmount,
          "Others":this.selectedRows[i].Others,
          "TotalOtherEarnings":this.selectedRows[i].EarningsOthers,
          "Incentive":this.selectedRows[i].Incentive,
          "leaveDeduction":this.selectedRows[i].leaveDeduction,
          "LoanDeduction":this.selectedRows[i].LoanDeduction,
          "AdvanceDeduction":this.selectedRows[i].AdvanceDeduction,
          "Penalty":this.selectedRows[i].Penalty,
          "DeductionOthers":this.selectedRows[i].DeductionOthers,
          "ESI":this.selectedRows[i].CalcESI,
          "PF":this.selectedRows[i].CalcEPF,
          "ProfessionalTax":this.selectedRows[i].CalcPT,
          "TDS":this.selectedRows[i].TDS,
          "CalculatedLeaves":this.selectedRows[i].CalculatedLeaves,
          "Comment":"",
          "DateWiseInfo":[],
          "Employee":this.selectedRows[i].Employee,
          "EmployeeID":this.selectedRows[i].EmployeeID,
          "EmployeeLeaves":this.selectedRows[i].EmployeeLeaves,
          "FromDate":this.selectedRows[i].FromDate,
          "Key":"en",
          "MonthID":this.selectedRows[i].MonthID,
          "Month":this.selectedRows[i].MonthID,
          "NetSalary":this.selectedRows[i].NetSalary,
          "NewLoanBalance":this.selectedRows[i].NewLoanBalance,
          "NewSalaryBalance":this.selectedRows[i].NewSalaryBalance,
          "OfficialHolidays":this.selectedRows[i].OfficialHolidays,
          "OldLoanBalance":this.selectedRows[i].OldLoanBalance,
          "OldSalaryBalance":this.selectedRows[i].OldSalaryBalance,
          "PaidAmount":this.selectedRows[i].PaidAmount,
          "PaidLeave":this.selectedRows[i].PaidLeave,
          "PayableSalary":this.selectedRows[i].PayableSalary,
            "PaymentID":0,
          "PayslipDate":this.selectedRows[i].PayslipDate,
          "PerDaySalary":this.selectedRows[i].PerDaySalary,
          "PresentDays":this.selectedRows[i].NoOfPresentDays,
          // "ProfessionalTax":this.selectedRows[i].ProfessionalTax,
          "SickLeave":this.selectedRows[i].SickLeave,
          "ToDate":this.selectedRows[i].ToDate,
          "TotalDays":this.selectedRows[i].TotalDays,
          "TotalLoanDeduction":this.selectedRows[i].TotalLoanDeduction,
          "TotalWokingDays":this.selectedRows[i].TotalWokingDays,
          "Type":'Pay',
          "WeekOffDays":this.selectedRows[i].WeekOffDays,
          "WeekOffDeduction":this.selectedRows[i].WeekOffDeduction,
          "Year":this.selectedRows[i].Year,
          "Bonus":this.selectedRows[i].Bonus,
          "Deduction":this.selectedRows[i].Deduction,
          "bonusdata":this.selectedRows[i].bonusdata,
          "Gross":this.selectedRows[i].Gross,
          "FinalGross":this.selectedRows[i].CalcGross,
          "LoanList":this.selectedRows[i].LoanList,
          "PSA":this.selectedRows[i].PSA,
          "FixedIncentive":this.selectedRows[i].FixedIncentive,
          "SecurityDeposit":this.selectedRows[i].SecurityDeposit,
          "PT":this.selectedRows[i].CalcPT,
          "AttendanceBonus":this.selectedRows[i].AttendanceBonus,
          "WashingAllowance":this.selectedRows[i].CalcWashingAllowance,
          "FuelAllowance":this.selectedRows[i].CalcFuelAllowance,
           "SpecialAllowance":this.selectedRows[i].CalcSpecialAllowance,
             "FinePoints":this.selectedRows[i].FinePoints,
        "LastMonthIncentive":this.selectedRows[i].LastMonthIncentive,
        "PerformanceIncentive":this.selectedRows[i].PerformanceIncentive
    }
    paysliparray.push(temp);
  }
      const json=
      {
Payslips:paysliparray,
AdminID:this.AdminID
      }
   this._commonservice.ApiUsingPost("Payslip/SavePayslipData",json).subscribe((data: any) => {
      if(data.Status==true){  
        this.ShowToast(data.Message,"success")
          this.spinnerService.hide();
     }
      else
      {
        this.ShowToast(data.Message,"warning")
          this.spinnerService.hide();
       }

       this.GetReport();
     }, (error: any) => {
      this.ShowToast(error.Message,"error")
      this.spinnerService.hide();
     }
  );
    }
  }

BulkUpdateDeductions() {
     let employees= this.selectedRows.filter((item: any) => item.isSelected == true).map((item: any) => { return { EmployeeID: item.EmployeeID } });
      console.log("selected list of employees");
      console.log(employees);
      if (this.selected_month_deductions=="")
    {
      this.ShowToast("Please select Month","warning")
      return;
    }
      if (this.selected_year_deductions=="")
    {
      this.ShowToast("Please select Year","warning")
      return;
    }
  if (this.selectedRows.length > 0) {
    var tmp:any[]=[];
    tmp.push({ComponentType:"ESI", IsEnabled:this.formInput.isESIEnabled});
     tmp.push({ComponentType:"PF", IsEnabled:this.formInput.isPFEnabled});
      tmp.push({ComponentType:"PT", IsEnabled:this.formInput.isPTEnabled});
       tmp.push({ComponentType:"SD", IsEnabled:this.formInput.isSDEnabled});
var json={ 
   Employees: this.selectedRows.filter((item:any)=>item.isSelected==true).map((item: any) => { return { EmployeeID :item.EmployeeID} }),
     Month: this.selected_month_deductions,
     Year: this.selected_year_deductions,
  Components:tmp,UserID: this.UserID}
    this._commonservice.ApiUsingPost("Payslip/BulkStopDeductions",json).subscribe(
      (res: any) => {
        if (res.Status == true) 
          {
        this.ShowToast(res.Message,"success")
        } 
        else 
        {
          this.ShowToast(res.Message,"warning")
        }
        this.spinnerService.hide();
      },
      (error) => {
        this.spinnerService.hide();
        // this.globalToastService.error(error.message);
        this.ShowToast(error.message,"error")
      }
    );
  } else {
    this.spinnerService.hide();
    // this.globalToastService.warning("No Records Found");
    this.ShowToast("Please select Employees","warning")
  }
}

  //   BulkUpdateDeductions() {

  //     if(this.selectedMonth.length==0)
  //     {
  //       this.ShowToast("Please select Month","warning")
  //       return;
  //     }
  //       if(this.selectedyear.length==0)
  //     {
  //       this.ShowToast("Please select Year","warning")
  //       return;
  //     }
  //   if (this.selectedRows.length > 0) {
  //     var tmp:any[]=[];
  //     tmp.push({ComponentType:"ESI", IsEnabled:this.formInput.isESIEnabled});
  //      tmp.push({ComponentType:"PF", IsEnabled:this.formInput.isPFEnabled});
  //       tmp.push({ComponentType:"PT", IsEnabled:this.formInput.isPTEnabled});
  //        tmp.push({ComponentType:"SD", IsEnabled:this.formInput.isSDEnabled});
  //  var json={ 
  //    Employees: this.selectedRows.map((item: any) => { return { EmployeeID :item.EmployeeID} }),
  //     Month: this.selectedMonth?.map((y: any) => y.Value)[0],
  //        Year: this.selectedyear?.map((y: any) => y.Text)[0],
  //   Components:tmp,UserID: this.UserID}
  //     this._commonservice.ApiUsingPost("Payslip/BulkStopDeductions",json).subscribe(
  //       (res: any) => {
  //         if (res.Status == true) 
  //           {
  //         this.ShowToast(res.Message,"success")
  //         } 
  //         else 
  //         {
  //           this.ShowToast(res.Message,"warning")
  //         }
  //         this.spinnerService.hide();
  //       },
  //       (error) => {
  //         this.spinnerService.hide();
  //         // this.globalToastService.error(error.message);
  //         this.ShowToast(error.message,"error")
  //       }
  //     );
  //   } else {
  //     this.spinnerService.hide();
  //     // this.globalToastService.warning("No Records Found");
  //     this.ShowToast("Please select Employees","warning")
  //   }
  // }

    GetSalarySettingsReport() {
    let json: { BranchList: any[]; Employeelist: any[]; DepartmentList: any[] } = {
      BranchList: this.selectedBranch.map((e) => e.Value) || [],
      Employeelist: [],
      DepartmentList: []
    };

    if(this.selectedEmployees.length==1)
    {
json.Employeelist = this.selectedEmployees.map((e) => e.Value) || [];
    }
    else if(this.selectedDepartment.length>0)
    {
      json.DepartmentList = this.selectedDepartment.map((e) => e.Value) || [];
    }
     else if(this.selectedBranch.length>0)
    {
      json.BranchList = this.selectedDepartment.map((e) => e.Value) || [];
    }
    else{
      return;
    }
    this.spinnerService.show();
    this._commonservice
      .ApiUsingPost("SalaryCalculation/getSalaryConfiguration", json)
      .subscribe(
        (data) => {
          if(data.Status == false){
                  this.displayColumns = {
      SelectAll: "SelectAll",
      SLno: "Sl No",
      MappedEmpId: "EmpID",
      Employee: "Emp Name",
      Branch: "Branch",
      // NoOfPresentDays: "P",
      PaidDays: "P",
      Department: "Department",
      Designation: "Designation",
      TotalWokingDays: "T",
      BasicSalary: "Basic",
      EarnedBasicSalary: "Basic",
      HRA: "HRA",
      TA: "TA",
      DA: "DA",
      MA: "MA",
      LTA: "LTA",
      Conveyance:"Conveyance",
      CalcGrossSalary:"Total",
      CalcBasicSalary:"Basic",
      CalcHRA:"HRA",
      CalcDA:"DA",
      CalcTA:"TA",
      CalcMA:"MA",
       CalcLTA:"LTA",
        CalcConveyance:"Conveyance",
      ActualGross: "Gross",
      TotalGross: "Total",
      PSA: "PSA",
      FixedIncentive: "FI",
      ShiftAmount: "Shift Amt",
      OTAmount: "OT Amt",
      Bonus: "Bonus",
      Incentive: "Incentive",
      leaveDeduction: "Leave",
      AttendanceBonus:"AttBonus",
      CalcWashingAllowance:"WA",
      CalcFuelAllowance:"FA",
       CalcSpecialAllowance:"SA",
      LastMonthIncentive:"LMI",
      PerformanceIncentive:"PI",
      LoanDeduction: "Loan",
      AdvanceDeduction: "Advance",
      Deduction: "Deduction",
      Penalty: "Penalty",
      FinePoints:"FinePoints",
      SecurityDeposit: "SD",
      DeductionOthers: "Others",
      ESI: "ESI",
      PF: "EPF",
      PT: "PT",
      CalcESI:"ESI",
      CalcEPF:"EPF",
      CalcPT:"PT",
      TDS: "TDS",
      EarningsOthers: "Others",
      TotalOtherEarnings: "Total",
      TotalDeduction: "Total",
      NetSalary: "Net Pay",
      Actions: "Actions",
    }
      this.displayedColumns = [
        "SelectAll",
        "Actions",
        "SLno",
        "MappedEmpId",
        "Employee",
        "TotalWokingDays",
        "PaidDays",
        "NetSalary",
        "ActualGross",
        "leaveDeduction",
        "CalcGrossSalary",
        "CalcBasicSalary",
        "CalcHRA",
        "CalcDA",
        "CalcTA",
        "CalcMA",
        "CalcLTA",
        "CalcConveyance",
        "PSA",
        "FixedIncentive",
        "ShiftAmount",
        "OTAmount",
        "Bonus",
        "Incentive",
        "AttendanceBonus",
        "CalcWashingAllowance",
        "CalcFuelAllowance",
         "CalcSpecialAllowance",
        "LastMonthIncentive",
        "PerformanceIncentive",
        "EarningsOthers",
        "TotalOtherEarnings",
        "LoanDeduction",
        "AdvanceDeduction",
        "Deduction",        
        "Penalty",
        "FinePoints",
        "SecurityDeposit",
        "DeductionOthers",
        "CalcESI",
        "CalcEPF",
        "CalcPT",
        "TDS",
        "TotalDeduction",
      ];

    this.topHeaders = [
      {
        id: "blank1",
        name: "",
        colspan: 5,
      },
      {
        id: "workingDays",
        name: "Working Days",
        colspan: 2,
      },
      {
        id: "blank2",
        name: "",
        colspan: 1,
      },
      {
        id: "ActualSalary",
        name: "",
        colspan: 2,
      },
      {
        id: "Gross",
        name: "Gross Earnings",
        colspan: 8,
      },
      {
        id: "OtherEarnings",
        name: "Other Earnings",
        colspan: 13,
      },
      {
        id: "Deductions",
        name: "Deductions",
        colspan: 12,
      },
    ];

            this.spinnerService.hide();
          }else{
       const Values = data?.List[0]?.Configfields[0];
this.salaryConfig=data?.List[0]?.Configfields[0];
this.displayedColumns = allColumnKeys.filter(col => {
  // Handle conditional columns
  const condition = conditionalColumnsToCheck.find(c => c.key === col);
  if (condition) {
    return Values?.[condition.flag] !== false; // show only if true or undefined
  }
  return true; // otherwise show always
});

this.displayColumns = {};
this.displayedColumns.forEach((key: any) => {
  if (masterColumnMap[key]) {
    this.displayColumns[key] = masterColumnMap[key];
  }
});
        
       this.topHeaders = topHeaderMaster
  .map(header => {
    // Apply the same filtering logic as used for columns
    const filteredFields = header.fields.filter(field => {
      if (field === "ShiftAmount" && Values?.isShiftAmount === false) return false;
      if (field === "OTAmount" && Values?.isOTAmount === false) return false;
       if (field === "DA" && Values?.isDA === false) return false;
        if (field === "TA" && Values?.isTA === false) return false;
         if (field === "MA" && Values?.isMA === false) return false;
          if (field === "penalty" && Values?.ispenalty === false) return false;
           if (field === "Incentive" && Values?.isIncentive === false) return false;
            if (field === "TDS" && Values?.isTDS === false) return false;
             if (field === "PT" && Values?.isPT === false) return false;
              if (field === "DeductionOthers" && Values?.isDeductionOthers === false) return false;
               if (field === "EPF" && Values?.isEPF === false) return false;
                if (field === "ESI" && Values?.isESI === false) return false;
                 if (field === "EarningsOthers" && Values?.isEarningsOthers === false) return false;
                  if (field === "Basic" && Values?.isBasic === false) return false;
                   if (field === "HRA" && Values?.isHRA === false) return false;
                    if (field === "Deductions" && Values?.isDeductions === false) return false;
                     if (field === "SD" && Values?.isSD === false) return false;
                      if (field === "FinePoints" && Values?.isFinePoints === false) return false;
                       if (field === "PerformanceIncentive" && Values?.isPerformanceIncentive === false) return false;
                        if (field === "LastMonthIncentive" && Values?.isLastMonthIncentive === false) return false;
                         if (field === "FixedIncentive" && Values?.isFixedIncentive === false) return false;                          
                           if (field === "PSA" && Values?.isPSA === false) return false;
                             if (field === "Bonus" && Values?.isBonus === false) return false;
                               if (field === "MA" && Values?.isMA === false) return false;
                                 if (field === "LTA" && Values?.isLTA === false) return false;
                                   if (field === "Conveyance" && Values?.isConveyance === false) return false;
                                     if (field === "Deductions" && Values?.isDeductions === false) return false;
                                     if (field === "AttendanceBonus" && Values?.isAttendanceBonus === false) return false;
                                       if (field === "WashingAllowance" && Values?.isWashingAllowance === false) return false;
                                         if (field === "FuelAllowance" && Values?.isFuelAllowance === false) return false;
                                         if (field === "LastMonthIncentive" && Values?.isLastMonthIncentive === false) return false;
                                         if (field === "PerformanceIncentive" && Values?.isPerformanceIncentive === false) return false;
                                         if (field === "FinePoints" && Values?.isFinePoints === false) return false;
      return this.displayedColumns.includes(field); // must exist in final display list
    });

    return {
      id: header.id,
      name: header.name,
      colspan: filteredFields.length
    };
  })
  .filter(header => header.colspan > 0);
          this.spinnerService.hide();
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
    }

    dynamic_downloadSample() {
        this.spinnerService.show();
        if (this.selectedRows.length == 0) {
            this.ShowToast("Please Select Employee", "warning");
        } else {
            const paysliparray: any[] = [];

            for (let i = 0; i < this.selectedRows.length; i++) {
                const emp = this.selectedRows[i];
                const temp = {
                    IsPayslipExist: false,
                    PaidDays: emp.PaidDays,
                    AdminAmount: emp.AdminAmount,
                    BasicSalary: emp.CalcBasicSalary,
                    HRA: emp.CalcHRA,
                    DA: emp.CalcDA,
                    TA: emp.CalcTA,
                    MA: emp.CalcMA,
                    ShiftAmount: emp.ShiftAmount,
                    OTAmount: emp.OTAmount,
                    Others: emp.Others,
                    TotalOtherEarnings: emp.EarningsOthers,
                    Incentive: emp.Incentive,
                    leaveDeduction: emp.leaveDeduction,
                    LoanDeduction: emp.LoanDeduction,
                    AdvanceDeduction: emp.AdvanceDeduction,
                    Penalty: emp.Penalty,
                    DeductionOthers: emp.DeductionOthers,
                    ESI: emp.CalcESI,
                    PF: emp.CalcEPF,
                    ProfessionalTax: emp.CalcPT,
                    TDS: emp.TDS,
                    CalculatedLeaves: emp.CalculatedLeaves,
                    Comment: "",
                    DateWiseInfo: [],
                    Employee: emp.Employee,
                    EmployeeID: emp.EmployeeID,
                    EmployeeLeaves: emp.EmployeeLeaves,
                    FromDate: emp.FromDate,
                    Key: "en",
                    MonthID: emp.MonthID,
                    Month: emp.MonthID,
                    NetSalary: emp.NetSalary,
                    NewLoanBalance: emp.NewLoanBalance,
                    NewSalaryBalance: emp.NewSalaryBalance,
                    OfficialHolidays: emp.OfficialHolidays,
                    OldLoanBalance: emp.OldLoanBalance,
                    OldSalaryBalance: emp.OldSalaryBalance,
                    PaidAmount: emp.PaidAmount,
                    PaidLeave: emp.PaidLeave,
                    PayableSalary: emp.PayableSalary,
                    PaymentID: 0,
                    PayslipDate: emp.PayslipDate,
                    PerDaySalary: emp.PerDaySalary,
                    PresentDays: emp.NoOfPresentDays,
                    SickLeave: emp.SickLeave,
                    ToDate: emp.ToDate,
                    TotalDays: emp.TotalDays,
                    TotalLoanDeduction: emp.TotalLoanDeduction,
                    TotalWokingDays: emp.TotalWokingDays,
                    Type: 'Pay',
                    WeekOffDays: emp.WeekOffDays,
                    WeekOffDeduction: emp.WeekOffDeduction,
                    Year: emp.Year,
                    Bonus: emp.Bonus,
                    Deduction: emp.Deduction,
                    bonusdata: emp.bonusdata,
                    Gross: emp.Gross,
                    FinalGross: emp.CalcGross,
                    LoanList: emp.LoanList,
                    PSA: emp.PSA,
                    FixedIncentive: emp.FixedIncentive,
                    SecurityDeposit: emp.SecurityDeposit,
                    PT: emp.CalcPT,
                    AttendanceBonus: emp.AttendanceBonus,
                    WashingAllowance: emp.CalcWashingAllowance,
                    FuelAllowance: emp.CalcFuelAllowance,
                    SpecialAllowance: emp.CalcSpecialAllowance,
                    FinePoints: emp.FinePoints,
                    LastMonthIncentive: emp.LastMonthIncentive,
                    PerformanceIncentive: emp.PerformanceIncentive
                };
                paysliparray.push(temp);
            }

            const json = { Payslips: paysliparray, details:[this.component_selection.value] };

            // Step 1: Get download link from API
            this._commonservice.ApiUsingPostNew("api/Payslip/BulkUploadDeductionSalaryReport", json)
                .subscribe((res: any) => {
                    this.spinnerService.show();
                    if (res.status && res.fileLink) {
                        // Step 2: Make a separate request to download the file as blob
                        this.httpClient.get(res.fileLink, { responseType: 'blob' as 'json' })
                            .subscribe((fileBlob: any) => {
                                const blob = new Blob([fileBlob], {
                                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'Employee_Salary_Report.xlsx'; // Or extract from URL if dynamic
                                document.body.appendChild(a);
                                a.click();

                                document.body.removeChild(a);
                                window.URL.revokeObjectURL(url);
                                this.spinnerService.hide();
                            }, error => {
                                this.ShowToast("Failed to download file", "error");
                                this.spinnerService.hide();
                                console.error(error);
                            });
                    } else {
                        this.ShowToast("No file link received from server", "error");
                        this.spinnerService.hide();
                    }
                }, error => {
                    this.ShowToast("API call failed", "error");
                    this.spinnerService.hide();
                    console.error(error);
                });
        }
    }
}

@Component({
  selector: 'payslipreport',
  templateUrl: 'paySlipReport.html',
  styleUrls: ['paySlipReport.css'], 
})
export class PaySlipReport {
  PayslipJsons:any = []
  payslipResults:any = []
  SalaryList:any = []
  report : any = []
  showNetPay:boolean

  constructor(
    public dialogRef: MatDialogRef<PaySlipReport>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){
      this.showNetPay = false
  }
  ngOnInit(): void {
    this.generateReport()
  }

  close(): void {
    const dialogData = {};
    this.dialogRef.close(dialogData);
  }

  generateReport(){
    // PayslipJsons,payslipResults,SalaryList,selectedRows
    for (let i = 0; i < this.data.payslipResults.length; i++) {
      const psResult = this.data.payslipResults[i];
      if(this.data.PayslipJsons[i].NetSalary){
        this.showNetPay = true
      }
      this.report.push({
        status: psResult.Status,
        result: psResult.Message,
        EmployeeName:this.data.PayslipJsons[i].Employee,
        EmployeeID:this.data.PayslipJsons[i].EmployeeID,
        NetSalary:this.data.PayslipJsons[i].NetSalary
      })
      
    }
    }
}