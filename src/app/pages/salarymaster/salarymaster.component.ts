import { Component, OnInit } from "@angular/core"
import {  MatDialog } from "@angular/material/dialog"
import { Router } from "@angular/router"
import { NgxSpinnerService } from "ngx-spinner"
import { ToastrService } from "ngx-toastr"
import { HttpCommonService } from "src/app/services/httpcommon.service"
import { IDropdownSettings } from 'ng-multiselect-dropdown'
import { AddEditSalarySettingComponent } from "../add-edit-salary-setting/add-edit-salary-setting.component"
import { SalarymastersettingsComponent } from "../salarymastersettings/salarymastersettings.component"


@Component({
  selector: 'app-salarymaster',
  templateUrl: './salarymaster.component.html',
  styleUrls: ['./salarymaster.component.css']
})
export class SalarymasterComponent {
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
      totalGross:"Total",
      ShiftAmount: "Shift Amt",
      OtAmount: "OT Amt",
      Incentive: "Incentive",
      Others: "Others",
      isBasic: "Basic",
      isHRA: "HRA",
      isDA: "DA",
      isTA: "TA",
      isMA: "MA",
      isShiftAmount: "Shift Amt",
      isOTAmount: "OT Amt",
      isIncentive: "Incentive",
      isEarningsOthers: "Others",
      isESI: "ESI",
      isPF: "EPF",
      isDeductionOthers: "Others",
      ispenalty: "Penalty",
      isPT: "PT",
      isTDS: "TDS",
      isBasicStatus: "Basic",
      isHRAStatus: "HRA",
      isDAStatus: "DA",
      isTAStatus: "TA",
      isMAStatus: "MA",
      isShiftAmountStatus: "Shift Amt",
      isOTAmountStatus: "OT Amt",
      isIncentiveStatus: "Incentive",
      isEarningsOthersStatus: "Others",
      isESIStatus: "ESI",
      isPFStatus: "EPF",
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
      "isHRAStatus",
      "isDAStatus",
      "isTAStatus",
      "isMAStatus",
      "isShiftAmountStatus",
      "isOTAmountStatus",
      "isIncentiveStatus",
      "isEarningsOthersStatus",
      "isESIStatus",
      "isPFStatus",
      "isDeductionOthersStatus",
      "ispenaltyStatus",
      "isPTStatus",
      "isTDSStatus",
      "Basic",
      "HRA",
      "DA",
      "TA",
      "MA",
      "totalGross",
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
        colspan: 9,
      },
      {
        id: "deductions",
        name: "Deductions",
        colspan: 6,
      },
      {
        id: "Gross",
        name: "Gross in %",
        colspan: 6,
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
      Basic: { text: "#00a927", bg: "#daffe2" },
      HRA: { text: "#00a927", bg: "#daffe2" },
      TA: { text: "#00a927", bg: "#daffe2" },
      DA: { text: "#00a927", bg: "#daffe2" },
      MA: { text: "#00a927", bg: "#daffe2" },
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
    this.GetOrganization();
    this.GetBranches();
    this.openAddDialog();// added for testing
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
    this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.AdminID
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
            this.globalToastService.warning("No Branch found");
          }
        },
        (error) => {
          this.globalToastService.error(error);
          console.log(error);
        }
      );
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
        : { Branches: [{ id: this.BranchList[0].Value }], OrgID:this.OrgID };

    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe(
      (data) => {
        // console.log(data)
        if (data.DepartmentList.length > 0) {
          this.DepartmentList = data.List;
          // console.log(this.DepartmentList,"department list")
          this.getEmployeeList();
        }
      },
      (error) => {
        this.globalToastService.error(error);
        console.log(error);
      }
    );
  }

  getEmployeeList() {
    const json: any = { AdminID:this.AdminID};
    if (this.selectedBranch) {
      
      json["BranchID"] = this.selectedBranch.map((br: any) => {
        return br.Value;
      });
    }
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
    //  console.log(item,"item")
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.GetDepartments();
    this.selectedEmployees = [];
    this.getEmployeeList();
  }
  OnEmployeesChange(_event: any) {}
  OnEmployeesChangeDeSelect(event: any) {}

  GetReport() {
    let json = {
      Employeelist: this.selectedEmployees.map((e) => e.Value) || [],
      BranchList: this.selectedBranch.map((e) => e.Value) || [],
      DepartmentList: this.selectedDepartment.map((e) => e.Value) || [],
    };

    if(json.BranchList.length == 0){
      this.globalToastService.warning("Please select a Branch")
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
            this.globalToastService.error(data.Message);
          }else{
            this.SalarySettingList = data?.List.map((l: any, index: any) => {
              let totalGross = 0
              if(l.Configfields[0].isBasic) totalGross += l.Configfields[0].Basic
              if(l.Configfields[0].isHRA) totalGross += l.Configfields[0].HRA
              if(l.Configfields[0].isDA) totalGross += l.Configfields[0].DA
              if(l.Configfields[0].isTA) totalGross += l.Configfields[0].TA
              if(l.Configfields[0].isMA) totalGross += l.Configfields[0].MA
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
          this.globalToastService.error(error.message);
        }
      );
  }

  addSalarySetting() {}

  openAddDialog() {
    const dialogRef = this.dialog.open(SalarymastersettingsComponent, {
      disableClose: true,
      data: { edit: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetReport()
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
      this.globalToastService.error("Please select minimum one Earnings")
      return false
    }
    else return true
  }

  validateDeductions(row:any){
    if(!row.isESI && !row.isPF && !row.isDeductionOthers && !row.ispenalty && !row.isPT && !row.isTDS){
      this.globalToastService.error("Please select minimum one Deductions")
      return false
    }
    else return true
  }

  validateGross(row:any){
    this.updateTotalGross(row)
    if(row.totalGross != 100) {
      this.globalToastService.error("Sum of all salary type given below must be equal to 100")
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
    console.log(this.SalarySettingList);
    console.log(row);

    let index = this.SalarySettingList.findIndex((e: any) => e.ID == data.ID);
    // // console.log({index});

    if (index != -1) this.SalarySettingList[index][column] = Number(value);
    
    if(column == 'isHRA'){
      this.SalarySettingList[index]['HRA'] = 0
      this.globalToastService.warning("HRA % in Gross set to 0")
    }
    if(column == 'isDA'){
      this.SalarySettingList[index]['DA'] = 0
      this.globalToastService.warning("DA % in Gross set to 0")
    }
    if(column == 'isMA'){
      this.SalarySettingList[index]['MA'] = 0
      this.globalToastService.warning("MA % in Gross set to 0")
    }
    if(column == 'isTA'){
      this.SalarySettingList[index]['TA'] = 0
      this.globalToastService.warning("TA % in Gross set to 0")
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
}


