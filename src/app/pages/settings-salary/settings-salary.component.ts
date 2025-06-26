import { Component } from "@angular/core"
import {  MatDialog } from "@angular/material/dialog"
import { Router } from "@angular/router"
import { NgxSpinnerService } from "ngx-spinner"
import { ToastrService } from "ngx-toastr"
import { HttpCommonService } from "src/app/services/httpcommon.service"
import { IDropdownSettings } from 'ng-multiselect-dropdown'
import { ThemePalette } from "@angular/material/core"
import { AddEditSalarySettingComponent } from "../add-edit-salary-setting/add-edit-salary-setting.component"
import { ShowalertComponent } from "../create-employee/showalert/showalert.component"

@Component({
  selector: 'app-settings-salary',
  templateUrl: './settings-salary.component.html',
  styleUrls: ['./settings-salary.component.css']
})
export class SettingsSalaryComponent {


 BranchList: any
  DepartmentList: any
  EmployeeList: any
  AdminID: any
  OrgID:any;UserID:any;
  selectedBranch:any[]=[]
  selectedDepartment:any[]=[]
  selectedEmployees:any[]=[]
  isBranchLoaded:boolean = false
  ApiURL:any
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  temparray:any=[]
  tempdeparray:any=[]
  SalarySettingList:any=[]
  editableColumns:any=[]
  displayedColumns:any ;
  displayColumns:any;
  actionOptions:any;
  salarySettingLoading : any ;
  topHeaders:any;
  headerInfo:any;
  headerColors:any;
  tableDataColors:any;
  dataToolTip:any;

  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}

  constructor(
    private _router: Router,
    private spinnerService: NgxSpinnerService,
    private _commonservice: HttpCommonService,
    private globalToastService: ToastrService,
    public dialog: MatDialog
  ) {
    this.branchSettings = {
      singleSelection: false,
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
    this.departmentSettings = {
      singleSelection: true,
      idField: "Value",
      textField: "Text",
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

    this.actionOptions = [
      {
        name: "View & Edit",
        icon: "fa fa-edit",
        // rowClick: true,
      },
      // {
      //   name: "Update salary setting",
      //   icon: "fa fa-cog",
      //   filter: [
      //     // { field:'IsPayslipExist',value : false}
      //   ],
      // },
    ];

    this.displayColumns = {
      SelectAll: "SelectAll",
      SLno: "Sl No",
      branchCount: "Branch",
      departmentCount: "Dept.",
      empCount: "Employee",
      Basic: "Basic",
      HRA: "HRA",
      DA: "DA",
      TA: "TA",
        MA: "MA",
        LTA: "LTA",
      
        Conveyance:"Conveyance",
      totalGross:"Total",
      ShiftAmount: "Shift Amt",
      OtAmount: "OT Amt",
      Incentive: "Incentive",
   
      isBasic: "Basic",
      isHRA: "HRA",
      isDA: "DA",
      isTA: "TA",
        isMA: "MA",
        isLTA: "LTA",
        isConveyance: "Conveyance",
        isPSA: "PSA",
        isFixedIncentive: "FI",
        isOTAmount: "OT Amount",
        isLastMonthIncentive: "Last Month Incentive",
        isPerformanceIncentive: "Performance Incentive",
        isBonus: "Bonus",
        isAttendanceBonus: "Attendance Bonus",
        isFuelAllowance: "Fuel Allowance",
        isWashingAllowance: "Washing Allowance",
       
       

      isShiftAmount: "Shift Amt",
    
      isIncentive: "Incentive",
   
      isESI: "ESI",
      isPF: "EPF",
      isDeductionOthers: "Others",
      ispenalty: "Penalty",
      isPT: "PT",
        isTDS: "TDS",
        isDeductions: "Deduction",
        isSD: "Security Deposit",
        isFinePoints: "Fine points",
        isDeductionsStatus: "Deductions",
        isSDStatus: "SD",
        isFinePointsStatus: "Penalty points",
      isBasicStatus: "Basic",
      isHRAStatus: "HRA",
      isDAStatus: "DA",
      isTAStatus: "TA",
        isMAStatus: "MA",
        isLTAStatus: "LTA",
        isConveyanceStatus:"Conveyance",
      isShiftAmountStatus: "Shift Amt",
      isOTAmountStatus: "OT Amt",
      isIncentiveStatus: "Incentive",
    
      isESIStatus: "ESI",
        isPFStatus: "EPF",
        isPSAStatus:"PSA",
        isFixedIncentiveStatus:"FI",
     
        isLastMonthIncentiveStatus:"LastMonthIncentive",
        isPerformanceIncentiveStatus:"PerformanceIncentive",
        isBonusStatus:"Bonus",
        isAttendanceBonusStatus:"Attendance Bonus",
        isFuelAllowanceStatus: "Fuel Allowance",
        isWashingAllowanceStatus: "Washing Allowance",
        isSpecialAllowanceStatus: "Special Allowance",
        isBasicAndDAStatus: "Basic + DA",

      
       
      isDeductionOthersStatus: "Others",
      ispenaltyStatus: "Penalty",
      isPTStatus: "PT",
      isTDSStatus: "TDS",
      CreatedDate: "Created Dt",
      Status: "Status",
      Actions: "Actions",
    };

    this.displayedColumns = [
      // "SelectAll",
      "SLno",
      "branchCount",
      "departmentCount",
      "empCount",
        "isBasicStatus",
        "isBasicAndDAStatus",
      "isHRAStatus",
      "isDAStatus",
      "isTAStatus",
      "isMAStatus",
        "isLTAStatus",

    
     
       
        


        "isConveyanceStatus",
        "isPSAStatus",
        "isFixedIncentiveStatus",
        "isOTAmountStatus",
        "isLastMonthIncentiveStatus",
        "isPerformanceIncentiveStatus",
        "isBonusStatus",
        "isAttendanceBonusStatus",
        "isWashingAllowanceStatus",
        "isFuelAllowanceStatus",
        "isSpecialAllowanceStatus",
       
      "isShiftAmountStatus",
   
      "isIncentiveStatus",
      "isEarningsOthersStatus",
      "isESIStatus",
      "isPFStatus",
      "isDeductionOthersStatus",
      "ispenaltyStatus",
      "isPTStatus",
        "isTDSStatus",
        "isDeductionsStatus",
        "isSDStatus",
        "isFinePointsStatus",
        "Basic",
        "BasicAndDA",
      "HRA",
      "DA",
      "TA",
      "MA",
      "Conveyance",
      "LTA",
      
        "WashingAllowance",
        "FuelAllowance",
        "SpecialAllowance",
     
      // "ShiftAmount",
      // "OtAmount",
      // "Incentive",
      // "Others",
      "CreatedDate",
      "Status",
      "Actions",
    ];

    this.editableColumns = {
      // isBasic: { default: false, type: "Boolean", filters: {isBasic:false} },
      // isHRA: { default: false, type: "Boolean", filters: {} },
      // isDA: { default: false, type: "Boolean", filters: {} },
      // isTA: { default: false, type: "Boolean", filters: {} },
      // isMA: { default: false, type: "Boolean", filters: {} },
      // isShiftAmount: { default: false, type: "Boolean", filters: {} },
      // isOTAmount: { default: false, type: "Boolean", filters: {} },
      // isIncentive: { default: false, type: "Boolean", filters: {} },
      // isEarningsOthers: { default: false, type: "Boolean", filters: {} },
      // isESI: { default: false, type: "Boolean", filters: {} },
      // isPF: { default: false, type: "Boolean", filters: {} },
      // isDeductionOthers: { default: false, type: "Boolean", filters: {} },
      // ispenalty: { default: false, type: "Boolean", filters: {} },
      // isPT: { default: false, type: "Boolean", filters: {} },
      // isTDS: { default: false, type: "Boolean", filters: {} },
      // IsPerDay: { default: false, type: "Boolean", filters: {} },
      Status: { filters: {} },
      // Basic: {
      //   filters: {},
      // },
      // HRA: {
      //   filters: {},
      // },
      // DA: {
      //   filters: {},
      // },
      // TA: {
      //   filters: {},
      // },
      // MA: {
      //   filters: {},
      // },
    };

    this.topHeaders = [
      {
        id: "blank1",
        name: "",
        colspan: 4,
      },
      {
        id: "earnings",
        name: "Earnings",
        colspan: 21,
      },
      {
        id: "deductions",
        name: "Deductions",
        colspan: 9,
      },
      {
        id: "Gross",
        name: "Gross in %",
        colspan: 11,
      },
      {
        id: "blank2",
        name: "",
        colspan: 3,
      },
    ];
    // this.smallHeaders = ["TotalWokingDays", "NoOfPresentDays"];
    this.tableDataColors = {
      isBasicStatus: [
        { styleClass: "greenBold", filter: [{ col: "isBasic", value: true }] },
      ],
      isHRAStatus: [
        { styleClass: "greenBold", filter: [{ col: "isHRA", value: true }] },
      ],
      isDAStatus: [
        { styleClass: "greenBold", filter: [{ col: "isDA", value: true }] },
      ],
      isTAStatus: [
        { styleClass: "greenBold", filter: [{ col: "isTA", value: true }] },
      ],
      isMAStatus: [
      { styleClass: "greenBold", filter: [{ col: "isMA", value: true }] },
      ],
        isLTAStatus: [
            { styleClass: "greenBold", filter: [{ col: "isLTA", value: true }] },
        ],
        isConveyanceStatus: [
            { styleClass: "greenBold", filter: [{ col: "isConveyance", value: true }] },
        ],
      isShiftAmountStatus: [
        { styleClass: "greenBold", filter: [{ col: "isShiftAmount", value: true }] },
      ],
      isOTAmountStatus: [
        { styleClass: "greenBold", filter: [{ col: "isOTAmount", value: true }] },
      ],
      isIncentiveStatus: [
        { styleClass: "greenBold", filter: [{ col: "isIncentive", value: true }] },
      ],
      isEarningsOthersStatus: [
        { styleClass: "greenBold", filter: [{ col: "isEarningsOthers", value: true }] },
      ],
      isESIStatus: [
        { styleClass: "greenBold", filter: [{ col: "isESI", value: true }] },
      ],
      isPFStatus: [
        { styleClass: "greenBold", filter: [{ col: "isPF", value: true }] },
      ],
      isDeductionOthersStatus: [
        { styleClass: "greenBold", filter: [{ col: "isDeductionOthers", value: true }] },
      ],
      ispenaltyStatus: [
        { styleClass: "greenBold", filter: [{ col: "ispenalty", value: true }] },
      ],
      isPTStatus: [
        { styleClass: "greenBold", filter: [{ col: "isPT", value: true }] },
      ],
      isTDSStatus: [
        { styleClass: "greenBold", filter: [{ col: "isTDS", value: true }] },
      ],
      "totalGross": [
        { styleClass: "greenBold", filter: [{ col: "totalGross", value: 100 }] },
      ]
    }
    this.headerInfo = {
      NoOfPresentDays: { text: "No of days present in the specified month" },
      TotalWokingDays: {
        text: "Total no of working days in the specified month",
      },
      // "BasicSalary":{text:"BasicSalary"},
      HRA: { text: "House Rent Allowance" },
      TA: { text: "Travel Allowance" },
      DA: { text: "Dearness Allowance" },
        MA: { text: "Medical Allowance" },
        LTA: { text: "LTA" },
        Conveyance: { text: "Conveyance" },
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
      // "Earningsothers":{text:"Earningsothers"},
      TotalOtherEarnings: {
        text: "Calculated as the sum of Medical Allowance(MA), Shift Amount, OT Amount, Incentive, and others",
      },
      TotalDeduction: {
        text: "Calculated as the sum of Leave, Loan, Advance, Penalty, ESI, EPF, PT and Others",
      },
      NetSalary: {
        text: "Net pay is the result of adding Gross Salary and other earnings, then subtracting total deductions",
      },
    };

    this.headerColors = {
      isBasic: { text: "#00a927", bg: "#daffe2" },
      isHRA: { text: "#00a927", bg: "#daffe2" },
      isDA: { text: "#00a927", bg: "#daffe2" },
      isTA: { text: "#00a927", bg: "#daffe2" },
        isMA: { text: "#00a927", bg: "#daffe2" },
        isLTA: { text: "#00a927", bg: "#daffe2" },
        isConveyance: { text: "#00a927", bg: "#daffe2" },
      isShiftAmount: { text: "#00a927", bg: "#daffe2" },
      isOTAmount: { text: "#00a927", bg: "#daffe2" },
      isIncentive: { text: "#00a927", bg: "#daffe2" },
      isEarningsOthers: { text: "#00a927", bg: "#daffe2" },
      isESI: { text: "#ff2d2d", bg: "#fff1f1" },
      isPF: { text: "#ff2d2d", bg: "#fff1f1" },
      isDeductionOthers: { text: "#ff2d2d", bg: "#fff1f1" },
      ispenalty: { text: "#ff2d2d", bg: "#fff1f1" },
      isPT: { text: "#ff2d2d", bg: "#fff1f1" },
      isTDS: { text: "#ff2d2d", bg: "#fff1f1" },
      isBasicStatus: { text: "#00a927", bg: "#daffe2" },
      isHRAStatus: { text: "#00a927", bg: "#daffe2" },
      isDAStatus: { text: "#00a927", bg: "#daffe2" },
      isTAStatus: { text: "#00a927", bg: "#daffe2" },
        isMAStatus: { text: "#00a927", bg: "#daffe2" },
        isLTAStatus: { text: "#00a927", bg: "#daffe2" },
        isConveyanceStatus: { text: "#00a927", bg: "#daffe2" },
        isPSAStatus: { text: "#00a927", bg: "#daffe2" },
        isFixedIncentiveStatus: { text: "#00a927", bg: "#daffe2" },
        isLastMonthIncentiveStatus: { text: "#00a927", bg: "#daffe2" },
        isPerformanceIncentiveStatus: { text: "#00a927", bg: "#daffe2" },
        isBonusStatus: { text: "#00a927", bg: "#daffe2" },
        isAttendanceBonusStatus: { text: "#00a927", bg: "#daffe2" },
        isFuelAllowanceStatus: { text: "#00a927", bg: "#daffe2" },
        isWashingAllowanceStatus: { text: "#00a927", bg: "#daffe2" },
        isSpecialAllowanceStatus: { text: "#00a927", bg: "#daffe2" },
        isBasicAndDAStatus: { text: "#00a927", bg: "#daffe2" },



      isShiftAmountStatus: { text: "#00a927", bg: "#daffe2" },
      isOTAmountStatus: { text: "#00a927", bg: "#daffe2" },
      isIncentiveStatus: { text: "#00a927", bg: "#daffe2" },
      isEarningsOthersStatus: { text: "#00a927", bg: "#daffe2" },
      isESIStatus: { text: "#ff2d2d", bg: "#fff1f1" },
      isPFStatus: { text: "#ff2d2d", bg: "#fff1f1" },
      isDeductionOthersStatus: { text: "#ff2d2d", bg: "#fff1f1" },
      ispenaltyStatus: { text: "#ff2d2d", bg: "#fff1f1" },
      isPTStatus: { text: "#ff2d2d", bg: "#fff1f1" },
        isTDSStatus: { text: "#ff2d2d", bg: "#fff1f1" },
        isDeductionsStatus: { text: "#ff2d2d", bg: "#fff1f1" },
        isSDStatus: { text: "#ff2d2d", bg: "#fff1f1" },
        isFinePointsStatus: { text: "#ff2d2d", bg: "#fff1f1" },
    
      Basic: { text: "#00a927", bg: "#daffe2" },
      HRA: { text: "#00a927", bg: "#daffe2" },
      TA: { text: "#00a927", bg: "#daffe2" },
      DA: { text: "#00a927", bg: "#daffe2" },
        MA: { text: "#00a927", bg: "#daffe2" },
        LTA: { text: "#00a927", bg: "#daffe2" },
        BasicAndDA: { text: "#00a927", bg: "#daffe2" },
        WashingAllowance: { text: "#00a927", bg: "#daffe2" },
        FuelAllowance: { text: "#00a927", bg: "#daffe2" },
        SpecialAllowance: { text: "#00a927", bg: "#daffe2" },
  
        Conveyance: { text: "#00a927", bg: "#daffe2" },
      totalGross: { text: "#00a927", bg: "#daffe2" },
      earnings: { text: "#00a927", bg: "#daffe2" },
      Gross: { text: "#00a927", bg: "#daffe2" },
      deductions: { text: "#ff2d2d", bg: "#fff1f1" },

      Deductions: { text: "#ff2d2d", bg: "#fff1f1" },
      TotalDeduction: { text: "#240000", bg: "#ff6767" },
      // leaveDeduction : {text:"#ff2d2d",bg:"#fff1f1"},
      Penalty: { text: "#ff2d2d", bg: "#fff1f1" },
      Deductionsothers: { text: "#ff2d2d", bg: "#fff1f1" },
      LoanDeduction: { text: "#ff2d2d", bg: "#fff1f1" },
      AdvanceDeduction: { text: "#ff2d2d", bg: "#fff1f1" },
      ESI: { text: "#ff2d2d", bg: "#fff1f1" },
      PF: { text: "#ff2d2d", bg: "#fff1f1" },
      PT: { text: "#ff2d2d", bg: "#fff1f1" },
      TDS: { text: "#ff2d2d", bg: "#fff1f1" },
      OtherEarnings: { text: "#00a927", bg: "#daffe2" },
      Earningsothers: { text: "#00a927", bg: "#daffe2" },
      // Gross: { text: "#00a927", bg: "#daffe2" },
      EarnedBasicSalary: { text: "#00a927", bg: "#daffe2" },
      TotalOtherEarnings: { text: "#006116", bg: "#65ff87" },
      TotalGross: { text: "#006116", bg: "#65ff87" },
      Incentive: { text: "#00a927", bg: "#daffe2" },
      ShiftAmount: { text: "#00a927", bg: "#daffe2" },
      OT: { text: "#00a927", bg: "#daffe2" },
    };
  }

  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID")
    this.OrgID = localStorage.getItem("OrgID")
    this.UserID = localStorage.getItem("UserID")
    this.GetOrganization()
    this.GetBranches()
  }

  onselectedOrg(item:any){
    this.selectedBranch = []
    this.selectedDepartment = []
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranch = []
    this.selectedDepartment = []
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
    this.selectedBranch=[];
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice
      .ApiUsingGetWithOneParam(
        this.ApiURL
      )
      .subscribe(
        (data) => {
          this.BranchList = data.List;
          if (this.BranchList.length > 0) {
            if (this.BranchList.length == 1) {
              this.selectedBranch = [
                {
                  Text: this.BranchList[0].Text,
                  Value: this.BranchList[0].Value,
                },
              ];

              this.GetDepartments();
              this.getEmployeeList();
            }
          } else {
            // this.globalToastService.warning("No Branch found");
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

    GetDepartments() {

        if (this.selectedBranch.length == 0) return;

    this.selectedDepartment=[];
    this.DepartmentList=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json =
      this.selectedBranch && this.selectedBranch.length > 0
        ? {
          OrgID:this.OrgID,AdminID:loggedinuserid,
            Branches: this.selectedBranch.map((br: any) => {
              return {
                id: br.Value,
              };
            }),
          }
        : { Branches: [{ id: this.BranchList[0].Value }], OrgID:this.OrgID };

    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe(
      (data) => {
        
        if (data.DepartmentList.length > 0) {
          this.DepartmentList = data.List;
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
    this.selectedEmployees=[];
    this.EmployeeList=[];
    const json: any = { AdminID:this.AdminID};
    if (this.selectedBranch.length>0) {
      json["BranchID"] = this.selectedBranch.map((br: any) => {
        return br.Value;
      });
      if (this.selectedDepartment) {
        json["DepartmentID"] = this.selectedDepartment.map((br: any) => {
          return br.Value;
        });
      }
  
      this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch", json).subscribe(
        (data) => {
          this.EmployeeList = data.List.map((emp: any) => {
            return { Value: emp.ID, Text: emp.Name };
          });
          // this.selectedEmployees = this.EmployeeList;
        },
        (error) => {
          console.log(error);
          this.spinnerService.hide();
        }
      );
    }
  
  }

  onDeptSelect(item: any) {
    // console.log(item,"item")
    this.tempdeparray.push({ id: item.Value, text: item.Text });
    this.getEmployeeList();
  }
  onDeptSelectAll(item: any) {
    // console.log(item,"item")
    this.tempdeparray = item;
    this.getEmployeeList();
  }
  onDeptDeSelectAll() {
    this.tempdeparray = [];
    this.getEmployeeList();
  }
  onDeptDeSelect(item: any) {
    // console.log(item,"item")
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    this.getEmployeeList();
  }
  onBranchSelect(item: any) {
    // console.log(this.selectedBranch)

    //  console.log(item,"item")
    this.temparray.push({ id: item.Value, text: item.Text });
    this.GetDepartments();
    this.selectedEmployees = [];
    this.getEmployeeList();
  }
    onBranchDeSelect(item: any) {
     this.selectedDepartment
        //  console.log(item,"item")
        this.selectedDepartment = [];
     this.temparray.splice(this.temparray.indexOf(item), 1);
     this.GetDepartments();
     this.selectedEmployees = [];
      this.getEmployeeList();
      this.DepartmentList = [];
    }

    onBranchSelect_All(item: any) {
        // console.log(this.selectedBranch)

        //  console.log(item,"item")
        this.selectedBranch = item;
        this.GetDepartments();
        this.selectedEmployees = [];
        this.getEmployeeList();
    }
    onBranchDeSelect_All(item: any) {
        //  console.log(item,"item")
      
        this.selectedBranch = [];
        this.DepartmentList = [];
        this.temparray.splice(this.temparray.indexOf(item), 1);
        this.selectedDepartment = [];
        this.selectedEmployees = [];
        this.getEmployeeList();
    }
  OnEmployeesChange(_event: any) {}
    OnEmployeesChangeDeSelect(event: any) { }



    changeStatus(data: any) {
        if (data == undefined) return;
        let config_id = data.ID;
        this.spinnerService.show();
        let userid = localStorage.getItem("LoggedInUserID")!;
        let api_url = "api/SalaryCalculation/Changestatussalaryconfig?id=" + config_id + "&modifiedbyid=" + userid + "";
        this._commonservice.PostWithOneParam(api_url).subscribe({
            next: (result) => {
                this.spinnerService.hide();
                if (result.Status) {
                    this.ShowToast(result.Message, 'success');
                } else {
                    this.ShowToast(result.Message, 'warning');

                }
                this.GetReport();
            }, error: (error) => {
                this.spinnerService.hide();

                if (error.error == undefined) {
                    this.ShowToast(error.Message, 'error');
                }
                else
                {
                    this.ShowToast(error.error.Message, 'error');
                }
            }
        });
      
    }
  GetReport() {
    let json = {
      Employeelist: this.selectedEmployees.map((e) => e.Value) || [],
      BranchList: this.selectedBranch.map((e) => e.Value) || [],
      DepartmentList: this.selectedDepartment.map((e) => e.Value) || [],
    };

    if(json.BranchList.length == 0){
      // this.globalToastService.warning("Please select a Branch")
      this.ShowToast("Please select a Branch","warning")
      return
    }
    this.spinnerService.show();
    this.salarySettingLoading = true;
    this._commonservice
      .ApiUsingPost("SalaryCalculation/getSalaryConfiguration", json)
      .subscribe(
        (data) => {
          if(data.Status == false){
            this.spinnerService.hide();
            this.salarySettingLoading = undefined;
            this.SalarySettingList = undefined
            // this.globalToastService.error(data.Message);
            this.ShowToast("No Settings Found","error")
          }else{
            this.SalarySettingList = data?.List.map((l: any, index: any) => {
              let totalGross = 0
                if (l.Configfields[0].isBasic && l.Configfields[0].isBasicAmount==false) totalGross += l.Configfields[0].Basic
                if (l.Configfields[0].isHRA && l.Configfields[0].isHRAAmount == false) totalGross += l.Configfields[0].HRA
                if (l.Configfields[0].isDA && l.Configfields[0].isDAAmount == false) totalGross += l.Configfields[0].DA
                if (l.Configfields[0].isTA && l.Configfields[0].isTAAmount == false) totalGross += l.Configfields[0].TA
                if (l.Configfields[0].isMA && l.Configfields[0].isMAAmount == false) totalGross += l.Configfields[0].MA
                if (l.Configfields[0].isLTA && l.Configfields[0].isLTAAmount == false) totalGross += l.Configfields[0].LTA
                if (l.Configfields[0].isConveyance && l.Configfields[0].isConveyanceAmount == false) totalGross += l.Configfields[0].Conveyance
                if (l.Configfields[0].isSpecialAllowance && l.Configfields[0].isSpecialAllowanceAmount == false) totalGross += l.Configfields[0].SpecialAllowance
                if (l.Configfields[0].isFuelAllowance && l.Configfields[0].isFuelAllownceAmount == false) totalGross += l.Configfields[0].FuelAllowance
                if (l.Configfields[0].isWashingAllowance && l.Configfields[0].isWashingAllowanceAmount == false) totalGross += l.Configfields[0].WashingAllowance
                if (l.Configfields[0].isBasicAndDA && l.Configfields[0].isBasicAndDAAmount == false) totalGross += l.Configfields[0].BasicAndDA


              return {
                SLno: index + 1,
                Index:index + 1,
                ...l,
                ...l.Configfields[0],
                Configfields: [],
                empCount: l.Employee.length > 1 ? l.Employee[0].Name + ' +'+ (l.Employee.length-1) + '' :l.Employee[0]?.Name,
                departmentCount: l.Department.length > 1 ? l.Department[0].Name + ' +'+ (l.Department.length-1) + '' :l.Department[0]?.Name,
                branchCount: l.Branch.length > 1 ? l.Branch[0].Name + ' +'+ (l.Branch.length-1) + '' :l.Branch[0].Name,
                Status: l.Configfields[0].isActive,
                isBasicStatus: l.Configfields[0].isBasic == true ? 'Enabled' : 'Disabled',
                isHRAStatus: l.Configfields[0].isHRA == true ? 'Enabled' : 'Disabled',
                isDAStatus: l.Configfields[0].isDA == true ? 'Enabled' : 'Disabled',
                isTAStatus: l.Configfields[0].isTA == true ? 'Enabled' : 'Disabled',
                  isMAStatus: l.Configfields[0].isMA == true ? 'Enabled' : 'Disabled',
                  isBasicAndDAStatus: l.Configfields[0].isBasicAndDA == true ? 'Enabled' : 'Disabled',
                  isSpecialAllowanceStatus: l.Configfields[0].isSpecialAllowance == true ? 'Enabled' : 'Disabled',
                  isFuelAllowanceStatus: l.Configfields[0].isFuelAllowance == true ? 'Enabled' : 'Disabled',
                  isWashingAllowanceStatus: l.Configfields[0].isWashingAllowance == true ? 'Enabled' : 'Disabled',

                isShiftAmountStatus: l.Configfields[0].isShiftAmount == true ? 'Enabled' : 'Disabled',
                isOTAmountStatus: l.Configfields[0].isOTAmount == true ? 'Enabled' : 'Disabled',
                isIncentiveStatus: l.Configfields[0].isIncentive == true ? 'Enabled' : 'Disabled',
                isEarningsOthersStatus: l.Configfields[0].isEarningsOthers == true ? 'Enabled' : 'Disabled',
                isESIStatus: l.Configfields[0].isESI == true ? 'Enabled' : 'Disabled',
                  isPFStatus: l.Configfields[0].isPF == true ? 'Enabled' : 'Disabled',
                  isLTAStatus: l.Configfields[0].isLTA == true ? 'Enabled' : 'Disabled',
                  isConveyanceStatus: l.Configfields[0].isConveyance == true ? 'Enabled' : 'Disabled',
                isDeductionOthersStatus: l.Configfields[0].isDeductionOthers == true ? 'Enabled' : 'Disabled',
                ispenaltyStatus: l.Configfields[0].ispenalty == true ? 'Enabled' : 'Disabled',
                isPTStatus: l.Configfields[0].isPT == true ? 'Enabled' : 'Disabled',
                  isTDSStatus: l.Configfields[0].isTDS == true ? 'Enabled' : 'Disabled',

                  isPSAStatus: l.Configfields[0].isPSA == true ? 'Enabled' : 'Disabled',
                  isFixedIncentiveStatus: l.Configfields[0].isFixedIncentive == true ? 'Enabled' : 'Disabled',
                  isLastMonthIncentiveStatus: l.Configfields[0].isLastMonthIncentive == true ? 'Enabled' : 'Disabled',
                  isPerformanceIncentiveStatus: l.Configfields[0].isPerformanceIncentive == true ? 'Enabled' : 'Disabled',
                  isBonusStatus: l.Configfields[0].isBonus == true ? 'Enabled' : 'Disabled',
                  isAttendanceBonusStatus: l.Configfields[0].isAttendanceBonus == true ? 'Enabled' : 'Disabled',
                
                  isDeductionsStatus: l.Configfields[0].isDeductions == true ? 'Enabled' : 'Disabled',
                  isSDStatus: l.Configfields[0].isSD == true ? 'Enabled' : 'Disabled',
                  isFinePointsStatus: l.Configfields[0].isFinePoints == true ? 'Enabled' : 'Disabled',

                  Basic: l.Configfields[0].isBasicAmount == true ? l.Configfields[0].Basic + '₹' : l.Configfields[0].Basic + '%',
                  HRA: l.Configfields[0].isHRAAmount == true ? l.Configfields[0].HRA + '₹' : l.Configfields[0].HRA + '%',
                  DA: l.Configfields[0].isDAAmount == true ? l.Configfields[0].DA + '₹' : l.Configfields[0].DA + '%',
                  TA: l.Configfields[0].isTAAmount == true ? l.Configfields[0].TA + '₹' : l.Configfields[0].TA + '%',
                  MA: l.Configfields[0].isMAAmount == true ? l.Configfields[0].MA + '₹' : l.Configfields[0].MA + '%',
                  Conveyance: l.Configfields[0].isConveyanceAmount == true ? l.Configfields[0].Conveyance + '₹' : l.Configfields[0].Conveyance + '%',
                  LTA: l.Configfields[0].isLTAAmount == true ? l.Configfields[0].LTA + '₹' : l.Configfields[0].LTA + '%',
                  SpecialAllowance: l.Configfields[0].isSpecialAllowanceAmount == true ? l.Configfields[0].SpecialAllowance + '₹' : l.Configfields[0].SpecialAllowance + '%',
                  WashingAllowance: l.Configfields[0].isWashingAllowanceAmount == true ? l.Configfields[0].WashingAllowance + '₹' : l.Configfields[0].WashingAllowance + '%',
                  FuelAllowance: l.Configfields[0].isFuelAllownceAmount == true ? l.Configfields[0].FuelAllowance + '₹' : l.Configfields[0].FuelAllowance + '%',
                  BasicAndDA: l.Configfields[0].isBasicAndDAAmount == true ? l.Configfields[0].BasicAndDA + '₹' : l.Configfields[0].BasicAndDA + '%',

                totalGross,
                tooltip:{
                  branchCount:this.getJoinedNames(l.Branch,'Name'),
                  empCount:this.getJoinedNames(l.Employee,'Name'),
                  departmentCount:this.getJoinedNames(l.Department,'Name')
                }
              };
            });
            
          //   if(l.Configfields[0].isBasic) totalGross += l.Configfields[0].Basic
          //   if(l.Configfields[0].isHRA) totalGross += l.Configfields[0].HRA
          //   if(l.Configfields[0].isDA) totalGross += l.Configfields[0].DA
          //   if(l.Configfields[0].isTA) totalGross += l.Configfields[0].TA
          //   if(l.Configfields[0].isMA) totalGross += l.Configfields[0].MA

          //   return {
          //     SLno: index + 1,
          //     ...l,
          //     ...l.Configfields[0],
          //     Configfields: [],
          //     empCount: l.Employee.length,
          //     departmentCount: l.Department.length,
          //     branchCount: l.Branch.length,
          //     Status: l.Configfields[0].isActive,
          //     isBasicStatus: l.Configfields[0].isBasic == true ? 'Enabled' : 'Disabled',
          //     isHRAStatus: l.Configfields[0].isHRA == true ? 'Enabled' : 'Disabled',
          //     isDAStatus: l.Configfields[0].isDA == true ? 'Enabled' : 'Disabled',
          //     isTAStatus: l.Configfields[0].isTA == true ? 'Enabled' : 'Disabled',
          //     isMAStatus: l.Configfields[0].isMA == true ? 'Enabled' : 'Disabled',
          //     isShiftAmountStatus: l.Configfields[0].isShiftAmount == true ? 'Enabled' : 'Disabled',
          //     isOTAmountStatus: l.Configfields[0].isOTAmount == true ? 'Enabled' : 'Disabled',
          //     isIncentiveStatus: l.Configfields[0].isIncentive == true ? 'Enabled' : 'Disabled',
          //     isEarningsOthersStatus: l.Configfields[0].isEarningsOthers == true ? 'Enabled' : 'Disabled',
          //     isESIStatus: l.Configfields[0].isESI == true ? 'Enabled' : 'Disabled',
          //     isPFStatus: l.Configfields[0].isPF == true ? 'Enabled' : 'Disabled',
          //     isDeductionOthersStatus: l.Configfields[0].isDeductionOthers == true ? 'Enabled' : 'Disabled',
          //     ispenaltyStatus: l.Configfields[0].ispenalty == true ? 'Enabled' : 'Disabled',
          //     isPTStatus: l.Configfields[0].isPT == true ? 'Enabled' : 'Disabled',
          //     isTDSStatus: l.Configfields[0].isTDS == true ? 'Enabled' : 'Disabled',
          //     totalGross
          //   };
          // });

          // if(dataList){

          //   let ids:any ={}
          // for (let i = 0; i < dataList.length; i++) {
          //   const element = dataList[i];
          //   let insertData = element.Configfields
          //   let empDetail= {
          //     EmployeeID: element?.Employee.ID,
          //     EmployeeName: element?.Employee.Name,
          //     BranchID: element?.Branch.ID,
          //     BranchName: element?.Branch.Name,
          //     DepartmentID: element?.Department.ID,
          //     DepartmentName: element?.Department.Name,
          //   }
          //   if(ids.hasOwnProperty(insertData.ID)){
          //     this.SalarySettingList[ids[insertData.ID]].employees.push(empDetail)
          //   }else{
          //     ids[insertData.ID] = this.SalarySettingList.length
          //     this.SalarySettingList.push({SLno:this.SalarySettingList.length+1 ,...insertData,employees:[empDetail]})
          //   }

          // }
          //   for (let i = 0; i < this.SalarySettingList.length; i++) {

          //     const element = this.SalarySettingList[i];
          //     let empList = element.employees
          //     let branchList :any= {}
          //     let deptList :any= {}

          //     for (let j = 0; j < empList.length; j++) {
          //       const empDetail = empList[j];
          //       branchList[empDetail.BranchID] = empDetail.BranchName
          //       deptList[empDetail.DepartmentID] = empDetail.DepartmentName
          //     }

          //     this.SalarySettingList[i]['empList'] = empList
          //     this.SalarySettingList[i]['branchList'] = branchList
          //     this.SalarySettingList[i]['deptList'] = deptList
          //     this.SalarySettingList[i]['branchString'] = Object.values(branchList).join(', ')
          //     this.SalarySettingList[i]['departmentString'] = Object.values(deptList).join(', ')
          //     this.SalarySettingList[i]['departmentCount'] = Object.values(deptList).length
          //     this.SalarySettingList[i]['empCount'] = empList.length
          //     this.SalarySettingList[i]['Status'] = this.SalarySettingList[i]['isActive']
          //   }

          //   console.log(this.SalarySettingList);

          // }

          //For testing purpose
          //  this.SalaryList = [this.SalaryList[0]]
          //  this.ViewDetails(this.SalaryList[0])

          //  this.dtTrigger.next(null);
          this.spinnerService.hide();
          this.salarySettingLoading = false;
          }
        },
        (error) => {
          this.spinnerService.hide();
          this.salarySettingLoading = false;
          // this.globalToastService.error(error.message);
          this.ShowToast(error.message,"error")
        }
      );
  }
  GetReportNew() {
    let json = {
      Employeelist: this.selectedEmployees.map((e) => e.Value) || [],
      BranchList: this.selectedBranch.map((e) => e.Value) || [],
      DepartmentList: this.selectedDepartment.map((e) => e.Value) || [],
    };

    if(json.BranchList.length>0){

    this.spinnerService.show();
    this.salarySettingLoading = true;
    this._commonservice
      .ApiUsingPost("SalaryCalculation/getSalaryConfiguration", json)
      .subscribe(
        (data) => {
          if(data.Status == false){
            this.spinnerService.hide();
            this.salarySettingLoading = undefined;
            this.SalarySettingList = undefined
            // this.globalToastService.error(data.Message);
            this.ShowToast(data.Message,"error")
          }else{
            this.SalarySettingList = data?.List.map((l: any, index: any) => {
              let totalGross = 0
              if(l.Configfields[0].isBasic) totalGross += l.Configfields[0].Basic
              if(l.Configfields[0].isHRA) totalGross += l.Configfields[0].HRA
              if(l.Configfields[0].isDA) totalGross += l.Configfields[0].DA
              if(l.Configfields[0].isTA) totalGross += l.Configfields[0].TA
                if (l.Configfields[0].isMA) totalGross += l.Configfields[0].MA
                if (l.Configfields[0].isLTA) totalGross += l.Configfields[0].LTA
                if (l.Configfields[0].isConveyance) totalGross += l.Configfields[0].Conveyance
              return {
                SLno: index + 1,
                Index:index + 1,
                ...l,
                ...l.Configfields[0],
                Configfields: [],
                empCount: l.Employee.length > 1 ? l.Employee[0].Name + ' +'+ (l.Employee.length-1) + '' :l.Employee[0]?.Name,
                departmentCount: l.Department.length > 1 ? l.Department[0].Name + ' +'+ (l.Department.length-1) + '' :l.Department[0]?.Name,
                branchCount: l.Branch.length > 1 ? l.Branch[0].Name + ' +'+ (l.Branch.length-1) + '' :l.Branch[0].Name,
                Status: l.Configfields[0].isActive,
                isBasicStatus: l.Configfields[0].isBasic == true ? 'Enabled' : 'Disabled',
                isHRAStatus: l.Configfields[0].isHRA == true ? 'Enabled' : 'Disabled',
                isDAStatus: l.Configfields[0].isDA == true ? 'Enabled' : 'Disabled',
                isTAStatus: l.Configfields[0].isTA == true ? 'Enabled' : 'Disabled',
                  isMAStatus: l.Configfields[0].isMA == true ? 'Enabled' : 'Disabled',
                  isLTAStatus: l.Configfields[0].isLTA == true ? 'Enabled' : 'Disabled',
                  isConveyanceStatus: l.Configfields[0].isConveyance == true ? 'Enabled' : 'Disabled',
                isShiftAmountStatus: l.Configfields[0].isShiftAmount == true ? 'Enabled' : 'Disabled',
                isOTAmountStatus: l.Configfields[0].isOTAmount == true ? 'Enabled' : 'Disabled',
                isIncentiveStatus: l.Configfields[0].isIncentive == true ? 'Enabled' : 'Disabled',
                isEarningsOthersStatus: l.Configfields[0].isEarningsOthers == true ? 'Enabled' : 'Disabled',
                isESIStatus: l.Configfields[0].isESI == true ? 'Enabled' : 'Disabled',
                isPFStatus: l.Configfields[0].isPF == true ? 'Enabled' : 'Disabled',
                isDeductionOthersStatus: l.Configfields[0].isDeductionOthers == true ? 'Enabled' : 'Disabled',
                ispenaltyStatus: l.Configfields[0].ispenalty == true ? 'Enabled' : 'Disabled',
                isPTStatus: l.Configfields[0].isPT == true ? 'Enabled' : 'Disabled',
                  isTDSStatus: l.Configfields[0].isTDS == true ? 'Enabled' : 'Disabled',

                  isPSAStatus: l.Configfields[0].isPSA == true ? 'Enabled' : 'Disabled',
                  isFixedIncentiveStatus: l.Configfields[0].isFixedIncentive == true ? 'Enabled' : 'Disabled',
                  isLastMonthIncentiveStatus: l.Configfields[0].isLastMonthIncentive == true ? 'Enabled' : 'Disabled',
                  isPerformanceIncentiveStatus: l.Configfields[0].isPerformanceIncentive == true ? 'Enabled' : 'Disabled',
                  isBonusStatus: l.Configfields[0].isBonus == true ? 'Enabled' : 'Disabled',
                  isAttendanceBonusStatus: l.Configfields[0].isAttendanceBonus == true ? 'Enabled' : 'Disabled',
                  isFuelAllowanceStatus: l.Configfields[0].isFuelAllowance == true ? 'Enabled' : 'Disabled',
                  isWashingAllowanceStatus: l.Configfields[0].isWashingAllowance == true ? 'Enabled' : 'Disabled',

                  isDeductionsStatus: l.Configfields[0].isDeductions == true ? 'Enabled' : 'Disabled',
                  isSDStatus: l.Configfields[0].isSD == true ? 'Enabled' : 'Disabled',
                  isFinePointsStatus: l.Configfields[0].isFinePoints == true ? 'Enabled' : 'Disabled',
               


                totalGross,
                tooltip:{
                  branchCount:this.getJoinedNames(l.Branch,'Name'),
                  empCount:this.getJoinedNames(l.Employee,'Name'),
                  departmentCount:this.getJoinedNames(l.Department,'Name')
                }
              };
            });
            
          //   if(l.Configfields[0].isBasic) totalGross += l.Configfields[0].Basic
          //   if(l.Configfields[0].isHRA) totalGross += l.Configfields[0].HRA
          //   if(l.Configfields[0].isDA) totalGross += l.Configfields[0].DA
          //   if(l.Configfields[0].isTA) totalGross += l.Configfields[0].TA
          //   if(l.Configfields[0].isMA) totalGross += l.Configfields[0].MA

          //   return {
          //     SLno: index + 1,
          //     ...l,
          //     ...l.Configfields[0],
          //     Configfields: [],
          //     empCount: l.Employee.length,
          //     departmentCount: l.Department.length,
          //     branchCount: l.Branch.length,
          //     Status: l.Configfields[0].isActive,
          //     isBasicStatus: l.Configfields[0].isBasic == true ? 'Enabled' : 'Disabled',
          //     isHRAStatus: l.Configfields[0].isHRA == true ? 'Enabled' : 'Disabled',
          //     isDAStatus: l.Configfields[0].isDA == true ? 'Enabled' : 'Disabled',
          //     isTAStatus: l.Configfields[0].isTA == true ? 'Enabled' : 'Disabled',
          //     isMAStatus: l.Configfields[0].isMA == true ? 'Enabled' : 'Disabled',
          //     isShiftAmountStatus: l.Configfields[0].isShiftAmount == true ? 'Enabled' : 'Disabled',
          //     isOTAmountStatus: l.Configfields[0].isOTAmount == true ? 'Enabled' : 'Disabled',
          //     isIncentiveStatus: l.Configfields[0].isIncentive == true ? 'Enabled' : 'Disabled',
          //     isEarningsOthersStatus: l.Configfields[0].isEarningsOthers == true ? 'Enabled' : 'Disabled',
          //     isESIStatus: l.Configfields[0].isESI == true ? 'Enabled' : 'Disabled',
          //     isPFStatus: l.Configfields[0].isPF == true ? 'Enabled' : 'Disabled',
          //     isDeductionOthersStatus: l.Configfields[0].isDeductionOthers == true ? 'Enabled' : 'Disabled',
          //     ispenaltyStatus: l.Configfields[0].ispenalty == true ? 'Enabled' : 'Disabled',
          //     isPTStatus: l.Configfields[0].isPT == true ? 'Enabled' : 'Disabled',
          //     isTDSStatus: l.Configfields[0].isTDS == true ? 'Enabled' : 'Disabled',
          //     totalGross
          //   };
          // });

          // if(dataList){

          //   let ids:any ={}
          // for (let i = 0; i < dataList.length; i++) {
          //   const element = dataList[i];
          //   let insertData = element.Configfields
          //   let empDetail= {
          //     EmployeeID: element?.Employee.ID,
          //     EmployeeName: element?.Employee.Name,
          //     BranchID: element?.Branch.ID,
          //     BranchName: element?.Branch.Name,
          //     DepartmentID: element?.Department.ID,
          //     DepartmentName: element?.Department.Name,
          //   }
          //   if(ids.hasOwnProperty(insertData.ID)){
          //     this.SalarySettingList[ids[insertData.ID]].employees.push(empDetail)
          //   }else{
          //     ids[insertData.ID] = this.SalarySettingList.length
          //     this.SalarySettingList.push({SLno:this.SalarySettingList.length+1 ,...insertData,employees:[empDetail]})
          //   }

          // }
          //   for (let i = 0; i < this.SalarySettingList.length; i++) {

          //     const element = this.SalarySettingList[i];
          //     let empList = element.employees
          //     let branchList :any= {}
          //     let deptList :any= {}

          //     for (let j = 0; j < empList.length; j++) {
          //       const empDetail = empList[j];
          //       branchList[empDetail.BranchID] = empDetail.BranchName
          //       deptList[empDetail.DepartmentID] = empDetail.DepartmentName
          //     }

          //     this.SalarySettingList[i]['empList'] = empList
          //     this.SalarySettingList[i]['branchList'] = branchList
          //     this.SalarySettingList[i]['deptList'] = deptList
          //     this.SalarySettingList[i]['branchString'] = Object.values(branchList).join(', ')
          //     this.SalarySettingList[i]['departmentString'] = Object.values(deptList).join(', ')
          //     this.SalarySettingList[i]['departmentCount'] = Object.values(deptList).length
          //     this.SalarySettingList[i]['empCount'] = empList.length
          //     this.SalarySettingList[i]['Status'] = this.SalarySettingList[i]['isActive']
          //   }

          //   console.log(this.SalarySettingList);

          // }

          //For testing purpose
          //  this.SalaryList = [this.SalaryList[0]]
          //  this.ViewDetails(this.SalaryList[0])

          //  this.dtTrigger.next(null);
          this.spinnerService.hide();
          this.salarySettingLoading = false;
          }
        },
        (error) => {
          this.spinnerService.hide();
          this.salarySettingLoading = false;
          // this.globalToastService.error(error.message);
          this.ShowToast(error.message,"error")
        }
      );
    }
  }

  addSalarySetting() {}

  openAddDialog() {
    const dialogRef = this.dialog.open(AddEditSalarySettingComponent, {
        disableClose: true,
        panelClass: 'full-screen-modal',
      data: { edit: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          //this.GetReportNew()

          this.GetReport();
      }
    });
  }

  actionEmitter(data: any) {
    if (data.action.name == "View & Edit") {
      this.EditSalarySettingRow(data);
    }
    // else
    // if (data.action.name == "View Details") {
    //   this.ViewDetails(data.row);
    // }
    else
    if (data.action.name == "editColumn") {
      this.editColumn(data.row);
    }
    else
    if (data.action.name == "Update salary setting") {
    }
    // else
    // if (data.action.name == "Approve Payslip") {
    //   this.Pay(data.row);
    // }
  }


  validateEarnings(row:any){
    if(!row.isBasic && !row.isHRA && !row.isDA && !row.isTA && !row.isMA){
      // this.globalToastService.error("Please select minimum one Earnings")
      this.ShowToast("Please select minimum one Earnings","error")
      return false
    }
    else return true
  }

  validateDeductions(row:any){
    if(!row.isESI && !row.isPF && !row.isDeductionOthers && !row.ispenalty && !row.isPT && !row.isTDS){
      // this.globalToastService.error("Please select minimum one Deductions")
      this.ShowToast("Please select minimum one Deductions","error")
      return false
    }
    else return true
  }

  validateGross(row:any){
    this.updateTotalGross(row)
    if(row.totalGross != 100) {
      // this.globalToastService.error("Sum of all salary type given below must be equal to 100")
      this.ShowToast("Sum of all salary type given below must be equal to 100","error")
      return false
    }
    return true
  }

  updateTotalGross(row:any){
    
    let totalGross = 0

    if(row.isBasic) totalGross += row.Basic
    if(row.isHRA) totalGross += row.HRA
    if(row.isDA) totalGross += row.DA
    if(row.isTA) totalGross += row.TA
    if(row.isMA) totalGross += row.MA
    
    row['totalGross'] = totalGross
    
  }

  editColumn(row: any) {
    let data = row.data;
    let column = row.column;
    let value = row.value;
   

    let index = this.SalarySettingList.findIndex((e: any) => e.ID == data.ID);
  

    if (index != -1) this.SalarySettingList[index][column] = Number(value);
    
    if(column == 'isHRA'){
      this.SalarySettingList[index]['HRA'] = 0
      // this.globalToastService.warning("HRA % in Gross set to 0")
      this.ShowToast("HRA % in Gross set to 0","warning")
    }
    if(column == 'isDA'){
      this.SalarySettingList[index]['DA'] = 0
      // this.globalToastService.warning("DA % in Gross set to 0")
      this.ShowToast("DA % in Gross set to 0","warning")
    }
    if(column == 'isMA'){
      this.SalarySettingList[index]['MA'] = 0
      // this.globalToastService.warning("MA % in Gross set to 0")
      this.ShowToast("MA % in Gross set to 0","warning")
    }
    if(column == 'isTA'){
      this.SalarySettingList[index]['TA'] = 0
      // this.globalToastService.warning("TA % in Gross set to 0")
      this.ShowToast("TA % in Gross set to 0","warning")
    }

    this.validateEarnings(data)
    this.validateDeductions(data)
    this.validateGross(data)
  }

    EditSalarySettingRow(data: any) {
       
    const dialogRef = this.dialog.open(AddEditSalarySettingComponent, {
      disableClose: true,
      data: { edit: true, row: data.row },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetReport()
      }
    });
  }
  getJoinedNames(list:any, param:any){
    let paramValues = []
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if(element[param]) paramValues.push(element[param])
    }

    return paramValues.join(', ')
  }
  backToDashboard()
{
  this._router.navigate(["appdashboard"]);
}

  ShowToast(message: string, type: 'success' | 'warning' | 'error'): void {
    this.dialog.open(ShowalertComponent, {
      data: { message, type },
      panelClass: 'custom-dialog',
      disableClose: true  // Prevents closing on outside click
    }).afterClosed().subscribe((res) => {
      if (res) {
        
      }
    });
  }
}


