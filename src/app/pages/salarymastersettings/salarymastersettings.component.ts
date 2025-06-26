import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { AddUpdateFieldComponent } from './add-update-field/add-update-field.component';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
  disabled: boolean;
}

@Component({
  selector: 'app-salarymastersettings',
  templateUrl: './salarymastersettings.component.html',
  styleUrls: ['./salarymastersettings.component.css']
})
export class SalarymastersettingsComponent {
  FieldsArray: any[] = [];

  selectedFileType: string;

  selectedColumns: any = []
  excludedColumns: any = ['SelectAll']
  dragDropHelp: boolean = false
  totalGross: number = 0



  earnings: Task = {
    name: 'Earnings',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Basic', completed: true, color: 'primary', disabled: true },
      { name: 'House Rent Allowance (HRA)', completed: true, color: 'primary', disabled: false },
      { name: 'Dearness Allowance (DA)', completed: true, color: 'primary', disabled: false },
      { name: 'Travel Allowance (TA)', completed: false, color: 'primary', disabled: false },
      { name: 'Medical Allowance (MA)', completed: false, color: 'primary', disabled: false },
      { name: 'Shift Amount', completed: false, color: 'primary', disabled: false },
      { name: 'OverTime (OT) Amount', completed: false, color: 'primary', disabled: false },
      { name: 'Incentive', completed: false, color: 'primary', disabled: false },
      { name: 'Others', completed: false, color: 'primary', disabled: false },
    ],
    disabled: false
  };

  deductions: Task = {
    name: 'Deductions',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Employees State Insurance (ESI)', completed: true, color: 'primary', disabled: false },
      { name: 'Provident Fund (PF)', completed: true, color: 'primary', disabled: false },
      { name: 'Professional Tax (PT)', completed: true, color: 'primary', disabled: false },
      { name: 'Others', completed: false, color: 'primary', disabled: false },
      { name: 'Penalty', completed: false, color: 'primary', disabled: false },
      { name: 'TDS', completed: false, color: 'primary', disabled: false },
    ],
    disabled: false
  };

  grossOptions: any = {}
  BranchList: any
  DepartmentList: any
  EmployeeList: any
  SalaryTypes: any
  AdminID: any
  UserID: any
  OrgID: any

  ApiURL: any
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  salaryTypeSettings: IDropdownSettings = {}


  selectedBranch: any[] = []
  selectedDepartment: any[] = []
  selectedEmployees: any[] = []
  selectedSalaryType: any = []

  SalaryFormulae: any = []
  temparray: any = []
  tempdeparray: any = []
  List: any = []
  errorMessages: any = {}
  salaryFormulaRow: any = {}

  steps: any = []
  @ViewChild(MatStepper) stepper!: MatStepper;

  // common table

  actionOptions: any;
  displayColumns: any;
  displayedColumns: any;
  employeeLoading: any;
  editableColumns: any = [];
  topHeaders: any = [];
  headerColors: any = [];
  headerInfo: any = {};
  smallHeaders: any = [];
  tableDataColors: any = {};
  salaryFormulaLoading: any = undefined
  originalDisplayedColumns: any = []
  // common table
  tempSalaryTypes: any = []
  edit: boolean;
  selectedOrganization: any[] = []
  OrgList: any[] = []; Receivedtext: any;
  orgSettings: IDropdownSettings = {}

  constructor(
    public dialogRef: MatDialogRef<SalarymastersettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _commonservice: HttpCommonService,
    private spinnerService: NgxSpinnerService,
    private globalToastService: ToastrService,
    private cdr: ChangeDetectorRef, private dialog: MatDialog
  ) {
    this.AdminID = localStorage.getItem("AdminID")
    this.UserID = localStorage.getItem("UserID")
    this.OrgID = localStorage.getItem("OrgID")


    this.tempSalaryTypes = [
      // { Text: "ESI", Value: "ESI", key: "Employees State Insurance (ESI)" },
      // { Text: "PF", Value: "PF", key: "Provident Fund (PF)" },
      // { Text: "PT", Value: "PT", key: "Professional Tax (PT)" }
    ]

    this.edit = data.edit || false;


    if (this.edit != true) this.GetBranches()

    this.branchSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    }
    this.employeeSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    }
    this.departmentSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    }
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.selectedFileType = "excel"

    // this.displayedColumns = data.displayedColumns.filter((dc:any)=>!this.excludedColumns.includes(dc))
    // this.selectedColumns = data.selectedColumns
    // this.headerColors = data.headerColors
    // this.removeRepeatedItems()

    // this.grossOptions = [
    // {
    //   title:"Basic",
    //   value:60,
    //   status:true
    // },
    // {
    //   title:"House Rent Allowance (HRA)",
    //   value:30,
    //   status:true
    // },
    // {
    //   title:"Dearness Allowance (DA)",
    //   value:10,
    //   status:true
    // },
    // {
    //   title:"Travel Allowance (TA)",
    //   value:0,
    //   status:true
    // },
    // {
    //   title:"Medical Allowance (MA)",
    //   value:0,
    //   status:true
    // }
    // ]
    this.updateTotalGross()


    this.salaryTypeSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    }

    this.SalaryTypes = []

    this.salaryFormulaRow = {
      type: [],
      Percent: 0,
      isAmount: false,
      isPercent: true,
      minAmt: undefined,
      maxAmt: undefined,
      isBasic: false,
      isHRA: false,
      isDA: false,
      isTA: false,
      isMA: false
    }


    this.steps = [false, false, false]



    //------------------common table ------------------

    this.actionOptions = [
      {
        name: "Delete",
        icon: "fa fa-trash",
        class: "danger-button"
        // rowClick: true,
      },
      // {
      //   name: "View Details",
      //   icon: "fa fa-eye",
      //   // rowClick: true,
      // },
      // {
      //   name: "Approve Payslip",
      //   icon: "fa fa-money",
      //   filter: [
      //     { field:'IsPayslipExist',value : false}
      //   ],
      // },
    ];


    this.displayColumns = {
      type: "Salary Type",
      isAmount: "Amount",
      isPercent: "Percent",
      Percent: "Value",
      minAmt: "Min Amt in ₹",
      maxAmt: "Max Amt in ₹",
      isBasic: "Basic",
      isHRA: "HRA",
      isDA: "DA",
      isTA: "TA",
      isMA: "MA",
      "Actions": "Actions"
    }
    this.originalDisplayedColumns = [
      "type",
      "Percent",
      "isAmount",
      "isPercent",
      "minAmt",
      "maxAmt",
      "isBasic",
      "isHRA",
      "isDA",
      "isTA",
      "isMA",
      "Actions"
    ];

    this.editableColumns = {
      Percent: {
        filters: {},
      },
      isAmount: {
        default: false,
        type: 'Boolean',
        filters: {},
      },
      isPercent: {
        default: false,
        type: 'Boolean',
        filters: {},
      },
      minAmt: {
        filters: {},
      },
      maxAmt: {
        filters: {},
      },
      isBasic: {
        default: false,
        type: 'Boolean',
        filters: { isBasicEnabled: true },
      },
      isHRA: {
        default: false,
        type: 'Boolean',
        filters: { isHRAEnabled: true },
      },
      isDA: {
        default: false,
        type: 'Boolean',
        filters: { isDAEnabled: true },
      },
      isTA: {
        default: false,
        type: 'Boolean',
        filters: { isTAEnabled: true },
      },
      isMA: {
        default: false,
        type: 'Boolean',
        filters: { isMAEnabled: true },
      },
    };

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
      Employee: { text: "Employee name in green indicates that salary slip has been approved for the specified month." },
      TotalGross: {
        text: "Gross salary is the total gross earnings before any deductions, calculated as the sum of Basic Salary, Dearness Allowance (DA), Travel Allowance (TA), and House Rent Allowance (HRA)",
      },
      ESI: {
        text: "The Employee State Insurance (ESI) contribution is calculated as a percentage of the employee's gross salary. Currently, the employee contributes 0.75% of their gross salary. ESI applies to employees earning a monthly wage of ₹21,000 or less.",
      },
      PF: {
        text: "The amount deducted for Provident Fund (PF) is 12% of the Basic Salary plus Dearness Allowance (DA)",
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
        text: "Calculated as the sum of Leave, Loan, Advance, Penalty, ESI, PF, PT and Others",
      },
      NetSalary: {
        text: "Net pay is the result of adding Gross Salary and other earnings, then subtracting total deductions",
      },
    };

    this.headerColors = {
      Deductions: { text: "#ff2d2d", bg: "#ffd5d5" },
      TotalDeduction: { text: "#240000", bg: "#ff6767" },
      // leaveDeduction : {text:"#ff2d2d",bg:"#ffd5d5"},
      Penalty: { text: "#ff2d2d", bg: "#ffd5d5" },
      Deductionsothers: { text: "#ff2d2d", bg: "#ffd5d5" },
      LoanDeduction: { text: "#ff2d2d", bg: "#ffd5d5" },
      AdvanceDeduction: { text: "#ff2d2d", bg: "#ffd5d5" },
      ESI: { text: "#ff2d2d", bg: "#ffd5d5" },
      PF: { text: "#ff2d2d", bg: "#ffd5d5" },
      PT: { text: "#ff2d2d", bg: "#ffd5d5" },
      TDS: { text: "#ff2d2d", bg: "#ffd5d5" },
      OtherEarnings: { text: "#00a927", bg: "#bbffca" },
      Earningsothers: { text: "#00a927", bg: "#bbffca" },
      Gross: { text: "#00a927", bg: "#bbffca" },
      HRA: { text: "#00a927", bg: "#bbffca" },
      EarnedBasicSalary: { text: "#00a927", bg: "#bbffca" },
      TA: { text: "#00a927", bg: "#bbffca" },
      DA: { text: "#00a927", bg: "#bbffca" },
      MA: { text: "#00a927", bg: "#bbffca" },
      TotalOtherEarnings: { text: "#006116", bg: "#65ff87" },
      TotalGross: { text: "#006116", bg: "#65ff87" },
      Incentive: { text: "#00a927", bg: "#bbffca" },
      ShiftAmount: { text: "#00a927", bg: "#bbffca" },
      OT: { text: "#00a927", bg: "#bbffca" },
    };

    if (this.edit == true) this.loadValuesEdit()
  }
  ngOnInit(): void {
    this.GetOrganization();
    this.GetFields();

  }

  GetFields() {
    this._commonservice.ApiUsingGetWithOneParam("SalaryMaster/GetFields?OrgID=" + this.OrgID).subscribe((data) => {
      this.FieldsArray = data.Field;
      this.grossOptions = data.Field.filter((res: any) => res.FieldType === 'Debit').map((res: any) => {
        return {
          "title": res.Key,
          "value": res.Value,
          "status": res.IsSelected
        }
      })
    }, (error) => {
      console.log(error);
    });
  }
  validateAmount(amount: any) {
    if (amount == true) {
      this.salaryFormulaRow.isPercent = false
    } else {
      this.salaryFormulaRow.isPercent = true
    }
  }
  validatePercent(percent: any) {
    if (percent == true) {
      this.salaryFormulaRow.isAmount = false
    } else {
      this.salaryFormulaRow.isAmount = true
    }
  }
  minMaxValidationAmount(min: any, max: any) {
    if (min != 0 && min != null && min != undefined && max != 0 && max != null && max != undefined) {
      if (min > max) {
        // this.globalToastService.warning("Minimun Amount Cannot Be Grater Than Maximum Amount")
        this.ShowToast("Minimun Amount Cannot Be Grater Than Maximum Amount", "warning")
        this.salaryFormulaRow.minAmt = null
        this.salaryFormulaRow.maxAmt = null
      }
      else if (max < min) {
        // this.globalToastService.warning("Maximum Amount Cannot Be Lesser Than Minimun Amount")
        this.ShowToast("Maximum Amount Cannot Be Grater Than Maximum Amount", "warning")
        this.salaryFormulaRow.maxAmt = null
        this.salaryFormulaRow.minAmt = null
      }
    }
  }

  earningAllComplete: boolean = false
  deductionAllComplete: boolean = false

  updateAllComplete(task: Task, allComplete: boolean) {
    allComplete = task.subtasks != null && task.subtasks.every(t => t.completed);
    this.updateTotalGross()
    this.updateSalaryTypes()
  }

  someComplete(task: Task, allComplete: boolean): boolean {
    if (task.subtasks == null) {
      return false;
    }
    this.updateTotalGross()
    this.updateSalaryTypes()
    return task.subtasks.filter(t => t.completed).length > 0 && !allComplete;

  }

  setAll(completed: boolean, task: Task, allComplete: boolean) {
    console.log('setAll', task, allComplete);
    allComplete = completed;
    // debugger
    if (task.subtasks)
      for (let index = 0; index < task.subtasks.length; index++) {
        const element = task.subtasks[index]
        if (element.disabled == false) {
          task.subtasks[index].completed = completed
        } else {
          task.completed = true
        }

      }

    this.updateTotalGross()
    this.updateSalaryTypes()
    if (task.subtasks == null) {
      return;
    }
    //task.subtasks.forEach(t => t.completed = completed);
  }

  AddField(Type: boolean, FieldName: any, ID: any) {
    const dialogRef = this.dialog.open(AddUpdateFieldComponent, {
      disableClose: true,
      data: { edit: Type, Field: FieldName, FieldID: ID },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetFields()
      }
    });
  }
  updateSalaryTypes() {
    this.SalaryTypes = []
    // for (let i = 0; i < this.tempSalaryTypes.length; i++) {
    //   const st = this.tempSalaryTypes[i];
    //   let stMatch = this.FieldsArray?.filter((dSt: any) => dSt.name == st.key)[0]
    //   if (stMatch && stMatch?.completed == true) {
    //     this.SalaryTypes.push({ Text: st.Text, Value: st.Value })
    //   }
    // }
    this.tempSalaryTypes = this.FieldsArray.filter(re=>re.FieldType == 'Debit').map(fs=>{
      return this.SalaryTypes.push({ Text: fs.Key, Value: fs.FieldID })
    })
  }

  getHeaderBorderColor(title: string) {
    let borderColor: string = this.headerColors[title]?.text
    if (!borderColor) borderColor = "1px solid #c3b6de"
    else borderColor = '1px solid ' + borderColor
    return borderColor
  }

  getHeaderBgColor(title: string) {
    let bgColor: string = this.headerColors[title]?.bg
    if (!bgColor) bgColor = "#e7e0f6"
    return bgColor
  }

  getHeaderTextColor(title: string) {
    let textColor: string = this.headerColors[title]?.text
    if (!textColor) textColor = "#000000"
    return textColor
  }

  getColumnDiaplayName(name: any) {
    // return this.data.displayColumns[name]
  }

  // removeRepeatedItems(){
  //   this.displayedColumns = this.displayedColumns.filter((dc:any)=>!this.selectedColumns.includes(dc))
  // }


  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );
  //   }
  // }

  close(): void {
    const dialogData = {};
    this.dialogRef.close(dialogData);
  }

  showDragDropHelp() {
    this.dragDropHelp = true
  }

  hideDragDropHelp() {
    this.dragDropHelp = false
  }
  onselectedOrg(item: any) {
    this.selectedBranch = []
    this.selectedDepartment = []
    this.GetBranches()
  }
  onDeselectedOrg(item: any) {
    this.selectedBranch = []
    this.selectedDepartment = []
    this.GetBranches()
  }

  GetOrganization() {
    this.ApiURL = "Admin/GetSuborgList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List
      if (data.List.length > 0) {
        this.selectedOrganization = [{ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text }]
        this.onselectedOrg({ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text })
      }

    }, (error) => {
      this.ShowToast(error, "error")
      console.log(error);
    });
  }

  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID
    this._commonservice
      .ApiUsingGetWithOneParam(
        this.ApiURL
      )
      .subscribe(
        (data) => {
          this.BranchList = data.List
          // console.log(this.BranchList, "branchlist")
          if (this.edit != true) {
            this.selectedBranch = [this.BranchList[0]]
          }
          this.GetDepartments()
          this.getEmployeeList()

        },
        (error) => {
          // this.globalToastService.error(error)
          this.ShowToast(error, "error")
          console.log(error)
        }
      )
  }

  GetDepartments() {
    this.selectedDepartment = [];
    var loggedinuserid = localStorage.getItem("UserID");
    if (!this.validateBranch()) return
    const json = {
      OrgID: this.OrgID,
      AdminID: loggedinuserid,
      Branches: this.selectedBranch.map((br: any) => {
        return {
          id: br.Value,
        }
      }),
    }

    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe(
      (data) => {
        // console.log(data)
        if (data.DepartmentList.length > 0) {
          this.DepartmentList = data.List
          // console.log(this.DepartmentList,"department list")
          this.getEmployeeList()
        }
      },
      (error) => {
        // this.globalToastService.error(error)
        this.ShowToast(error, "error")
        console.log(error)
      }
    )
  }

  validateBranch(): boolean {
    if (this.selectedBranch.length <= 0) {
      this.errorMessages['branch'] = { message: "Please select a Branch." }
      return false
    }
    if (this.errorMessages['branch']) delete this.errorMessages['branch']
    return true
  }
  // validateEmployee() : boolean{
  //   if(this.selectedEmployees.length <=0) {
  //     this.errorMessages['employee'] = {message:"Please select atleast one Employee."}
  //     return false
  //   }
  //   if(this.errorMessages['employee']) delete this.errorMessages['employee']
  //   return true
  // }

  // validateEarnings(){
  //   let earningsStatus = this.earnings.completed || (this.earnings?.subtasks ? this.earnings?.subtasks.filter((e:any)=>e.completed==true)?.length>0 : false)
  //   if (!earningsStatus) this.errorMessages['earnings'] = {message:"Please select minimum one of the above given Earnings"}
  //   else if( this.errorMessages['earnings']) delete this.errorMessages['earnings']
  //   return earningsStatus
  // }

  // validateDeductions(){
  //   let deductionsStatus = this.deductions.subtasks ? this.deductions.subtasks.filter((e:any)=>e.completed==true)?.length>0 : false)
  //   if (!deductionsStatus) this.errorMessages['deductions'] = {message:"Please select minimum one of the above given Deductions"}
  //   else if( this.errorMessages['deductions']) delete this.errorMessages['deductions']
  //   return deductionsStatus
  // }

  validateEarnings() {
    let earningsStatus = this.FieldsArray.filter((e: any) => e.IsSelected == true && e.FieldType == 'Credit')?.length > 0
    if (!earningsStatus) this.errorMessages['earnings'] = { message: "Please select minimum one of the above given Earnings" }
    else if (this.errorMessages['earnings']) delete this.errorMessages['earnings']
    return earningsStatus
  }

  validateDeductions() {
    let deductionsStatus = this.FieldsArray.filter((e: any) => e.IsSelected == true && e.FieldType == 'Debit')?.length > 0
    if (!deductionsStatus) this.errorMessages['deductions'] = { message: "Please select minimum one of the above given Deductions" }
    else if (this.errorMessages['deductions']) delete this.errorMessages['deductions']
    return deductionsStatus
  }

  validateGross() {
    if (this.totalGross != 100) {
      this.errorMessages['grossError'] = { message: "Sum of all salary type given below must be equal to 100", type: "danger" }
      return false
    }
    if (this.errorMessages['grossError']) delete this.errorMessages['grossError']
    return true
  }

  getEmployeeList() {
    this.selectedEmployees = []
    this.EmployeeList = [];
    if (this.validateBranch() == false) return
    if (this.selectedBranch) {
      let BranchID = this.selectedBranch?.map((y: any) => y.Value)[0]

      let deptID = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0
      this.ApiURL =
        "Admin/GetEmployees?AdminID=" +
        this.AdminID +
        "&BranchID=" +
        BranchID +
        "&DeptId=" +
        deptID +
        "&Year=0&Month=0&Key=en"
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
        (data) => {
          this.EmployeeList = data.data
          this.selectedEmployees = this.EmployeeList.map((e: any) => {
            return { Value: e.Value, Text: e.Text }
          })

          // this.GetReport()
        },
        (error) => {
          console.log(error)
          this.spinnerService.hide()
        }
      )
    }

  }


  onDeptSelect(item: any) {
    // console.log(item,"item")
    this.tempdeparray.push({ id: item.Value, text: item.Text })
    this.getEmployeeList()
  }
  onDeptSelectAll(item: any) {
    // console.log(item,"item")
    this.tempdeparray = item
    this.getEmployeeList()
  }
  onDeptDeSelectAll() {
    this.tempdeparray = []
    this.getEmployeeList()
  }
  onDeptDeSelect(item: any) {
    // console.log(item,"item")
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1)
    this.getEmployeeList()
  }
  onBranchSelect(item: any) {
    // console.log(this.selectedBranch)

    //  console.log(item,"item")
    this.temparray.push({ id: item.Value, text: item.Text })
    this.GetDepartments()
    this.selectedEmployees = []
    this.getEmployeeList()

  }
  onBranchDeSelect(item: any) {
    //  console.log(item,"item")
    this.temparray.splice(this.temparray.indexOf(item), 1)
    this.GetDepartments()
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  OnEmployeesChange(_event: any) {
    // this.validateEmployee()
  }
  OnEmployeesChangeDeSelect(event: any) {
    // this.validateEmployee()
  }

  onSalaryTypeSelect(item: any) {

  }

  onSalaryTypeDeSelect(item: any) {

  }

  GetReport() {
    this.List = [
      {
        id: 1,
        name: "setting 1",
      }
    ]
  }

  updateTotalGross() {
    this.totalGross = 0
    delete this.errorMessages["grossError"]
    for (let i = 0; i < this.grossOptions.length; i++) {
      const grossType = this.grossOptions[i];
      if (this.FieldsArray?.filter((es: any) => es.Key == grossType.title)[0]?.IsSelected == true) {
        this.grossOptions[i].status = true
        this.totalGross += grossType.value
      }
      else {
        this.grossOptions[i].status = false
        this.grossOptions[i].value = false

      }

    }

    if (this.totalGross != 100) this.errorMessages["grossError"] = {
      message: "Sum of all salary type given below must be equal to 100",
      type: "danger"
    }
  }

  checkEarningsStatus(option: string) {
    return !!(this.earnings.subtasks ? this.earnings.subtasks.filter((e: any) => e.name == option)[0]?.completed : false)
  }
  checkDeductionsStatus(option: string) {
    return !!(this.deductions.subtasks ? this.deductions.subtasks.filter((e: any) => e.name == option)[0]?.completed : false)
  }

  addSalaySetting() {

    this.errorMessages = {}
    this.validateBranch()
    // this.validateEmployee()
    // this.validateEarnings()
    this.validateDeductions()
    this.validateGross()


    if (Object.keys(this.errorMessages).length > 0) {
      return
    }
    console.log(this.grossOptions, "what are gross feilds");

    let json: any = {
      "Employeelist": [],
      "DepartmentList": [],
      "BranchList": [],
      // "configfields":this.grossOptions.map((res:any)=>{
      //   res.Key = res.Value
      // }),
      "configfields": {
        "isBasic": this.checkEarningsStatus('Basic'),
        "isHRA": this.checkEarningsStatus('House Rent Allowance (HRA)'),
        "isDA": this.checkEarningsStatus('Dearness Allowance (DA)'),
        "isTA": this.checkEarningsStatus('Travel Allowance (TA)'),
        "isMA": this.checkEarningsStatus('Medical Allowance (MA)'),
        "isShiftAmount": this.checkEarningsStatus('Shift Amount'),
        "isOTAmount": this.checkEarningsStatus('OverTime (OT) Amount'),
        "IsPercentage": true,
        "isIncentive": this.checkEarningsStatus('Incentive'),
        "isEarningsOthers": this.checkEarningsStatus('Others'),
        "isESI": this.checkDeductionsStatus('Employees State Insurance (ESI)'),
        "isPF": this.checkDeductionsStatus('Provident Fund (PF)'),
        "isDeductionOthers": this.checkDeductionsStatus('Others'),
        "ispenalty": this.checkDeductionsStatus('Penalty'),
        "isPT": this.checkDeductionsStatus('Professional Tax (PT)'),
        "isTDS": this.checkDeductionsStatus('TDS'),
        "Basic": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Basic')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'Basic')[0]?.value : 0,
        "HRA": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'House Rent Allowance (HRA)')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'House Rent Allowance (HRA)')[0]?.value : 0,
        "DA": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Dearness Allowance (DA)')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'Dearness Allowance (DA)')[0]?.value : 0,
        "TA": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Travel Allowance (TA)')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'Travel Allowance (TA)')[0]?.value : 0,
        "MA": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Medical Allowance (MA)')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'Medical Allowance (MA)')[0]?.value : 0,
        "ShiftAmount": 0,
        "OtAmount": 0,
        "Incentive": 0,
        "Others": 0
      },
      "CreatedByID": this.UserID.toString()
    }
    console.log({ json }, "first json");
    if (this.edit == true) {
      json['ID'] = this.data.row.ID
    }

    let salaryCalculationJson: any = {
      "EmployeeList": [],
      "DepartmentList": [],
      "BranchList": [],
      "ConfigFields": this.SalaryFormulae.map((sf: any) => {
        let sfJson: any = {
          "SalaryType": sf.type,
          "Value": sf.Percent,
          "isAmount": sf.isAmount == true ? true : false,
          "Min": sf.minAmt,
          "Max": sf.maxAmt,
          "isBasic": sf.isBasic,
          "isHRA": sf.isHRA,
          "isDA": sf.isDA,
          "isTA": sf.isTA,
          "isMA": sf.isMA,
          "isShiftAmount": false,
          "isOTAmount": false,
          "isIncentive": false,
          "Others": false
        }
        if (sf.ID) sfJson['ID'] = sf.ID
        if (sf.FieldID) sfJson['FieldID'] = sf.FieldID

        return sfJson
      }),
      "CreatedByID": this.UserID.toString()
    }

    if (this.selectedEmployees.length > 0) {
      json['Employeelist'] = this.selectedEmployees.map((e: any) => e.Value)
      salaryCalculationJson['EmployeeList'] = this.selectedEmployees.map((e: any) => e.Value)
    } else if (this.selectedDepartment.length > 0) {
      json['DepartmentList'] = this.selectedDepartment.map((e: any) => e.Value)
      salaryCalculationJson['DepartmentList'] = this.selectedDepartment.map((e: any) => e.Value)
    } else if (this.selectedBranch.length > 0) {
      json['BranchList'] = this.selectedBranch.map((e: any) => e.Value)
      salaryCalculationJson['BranchList'] = this.selectedBranch.map((e: any) => e.Value)
    }
    this.spinnerService.show()
    this.spinnerService.hide()



    console.log({ salaryCalculationJson }, "second json");
    // this._commonservice.ApiUsingPost("SalaryCalculation/AddSalaryConfiguration",json).subscribe(
    //   (configResponse) => {
    //     salaryCalculationJson['ConfigID']= configResponse.ConfigID
    //     this._commonservice.ApiUsingPost("SalaryCalculation/AddSalaryCalculationConfig",salaryCalculationJson).subscribe(
    //       (calculateResponse) => {
    //         console.log(calculateResponse);
    //         if(this.edit == false)  this.ShowToast("Salary configuration added","success")
    //           // this.globalToastService.success("Salary configuration added","Success")
    //         if(this.edit == true)  this.ShowToast("Salary configuration Updated","success")
    //           // this.globalToastService.success("Salary configuration Updated","Success")
    //         this.spinnerService.hide();
    //         this.close()
    //       },
    //       (error) => {
    //         this.spinnerService.hide();
    //         // this.globalToastService.error(error.message);
    //         this.ShowToast(error.message,"error")
    //       }
    //     );

    //   },
    //   (error) => {
    //     this.spinnerService.hide();
    //     // this.globalToastService.error(error.message);
    //     this.ShowToast(error.message,"error")
    //   }
    // );

  }


  // -----------------------------------------------------
  // -----------------------------------------------------
  isStepValid(step: number) {
    return this.steps[step] || false;
  }

  validateSteps(step: number) {
    this.cdr.detectChanges()
    if (step == 0) {
      this.steps[0] = this.validateBranch()// && this.validateEmployee()
      console.log(this.steps[0]);
      if (this.steps[0] == true) this.stepper.selectedIndex = 1
    }

    else if (step == 1) {
      this.steps[1] = this.validateEarnings() && this.validateDeductions() && this.validateGross()
      console.log(this.steps[0]);
      if (this.steps[1] == true) {
        this.stepper.selectedIndex = 2
        this.refreshSalaryCalculation()
      }
    }
  }

  goToPreviousStep() {
    this.stepper.previous();
  }

  onSubmit() {
    this.addSalaySetting()
    // console.log('All steps completed!');

  }

  // -----------------------------------------------------
  // -----------------------------------------------------

  validateSalaryFormula(formulaData: any): boolean {
    console.log({ formulaData });
    if (!this.tempSalaryTypes.map((tst: any) => tst.Text).includes(formulaData.type)) {
      // this.globalToastService.warning("Please select salary type")
      this.ShowToast("Please select salary type", "warning")
      return false
    }

    if (formulaData.Percent <= 0 && formulaData.isAmount == true) {
      // this.globalToastService.warning("Value must be greater than 0")
      this.ShowToast("Value must be greater than 0", "warning")
      return false
    }
    if ((formulaData.Percent <= 0 || formulaData.Percent > 100) && formulaData.isPercent == true) {
      // this.globalToastService.warning("Value must be greater than 0 and less than 100. Percent is selected.")
      this.ShowToast("Value must be greater than 0 and less than 100. Percent is selected.", "warning")
      return false
    }
    if (!(formulaData.isAmount == true || formulaData.isPercent == true)) {
      // this.globalToastService.warning("Please select Amount or Percent")
      this.ShowToast("Please select Amount or Percent", "warning")
      return false
    }

    if (!(formulaData.isBasic || formulaData.isDA || formulaData.isHRA || formulaData.isMA || formulaData.isTA)) {
      // this.globalToastService.warning("Please select Any one of salary type()")
      this.ShowToast("Please select Any one of salary type", "warning")
      return false
    }

    let validSalaryFormulaes = this.SalaryFormulae.filter((sf: any) => {
      sf.type == formulaData.type
    })

    let typesalary = this.SalaryFormulae.filter(((sf: any) => sf.type == formulaData.type))
    let rangeStatus = this.checkRange(formulaData.minAmt, formulaData.maxAmt, typesalary)

    if (rangeStatus == false) return false
    return true
  }

  addSalaryFormula() {
    this.salaryFormulaLoading = true
    this.spinnerService.show()
    this.cdr.detectChanges()
    console.log({ salaryFormulaRow: this.salaryFormulaRow });

    let formulaData = {
      Index: this.SalaryFormulae.length,
      Percent: this.salaryFormulaRow.Percent,
      isAmount: this.salaryFormulaRow.isAmount,
      isPercent: this.salaryFormulaRow.isPercent,
      isBasic: this.salaryFormulaRow.isBasic,
      isDA: this.salaryFormulaRow.isDA,
      isHRA: this.salaryFormulaRow.isHRA,
      isMA: this.salaryFormulaRow.isMA,
      isTA: this.salaryFormulaRow.isTA,
      maxAmt: this.salaryFormulaRow.maxAmt || null,
      minAmt: this.salaryFormulaRow.minAmt || null,
      type: this.salaryFormulaRow.type[0]?.Value,
    }
    if (!this.validateSalaryFormula(formulaData)) {
      this.SalaryFormulae = JSON.parse(JSON.stringify(this.SalaryFormulae))
      this.salaryFormulaLoading = false
      this.spinnerService.hide()
      return
    }


    this.SalaryFormulae.push(formulaData)
    // this.salaryFormulaRow = {
    //   type:[],
    //   Percent:0,
    //   isAmount:false,
    //   isPercent:true,
    //   minAmt:undefined,
    //   maxAmt:undefined,
    //   isBasic:false,
    //   isHRA:false,
    //   isDA:false,
    //   isTA:false,
    //   isMA:false
    // }
    this.SalaryFormulae = JSON.parse(JSON.stringify(this.SalaryFormulae))
    this.salaryFormulaLoading = false
    this.spinnerService.hide()
  }


  editColumn(row: any) {
    let data = row.data;
    let column = row.column;
    let value = row.value;
    // let index = this.SalaryFormulae.findIndex((e: any) => e.Index == data.Index);
    let index = 'Index' in data
      ? this.SalaryFormulae.findIndex((e: any) => e.Index === data.Index)
      : this.SalaryFormulae.findIndex((e: any) => e.ID === data.ID);

    if (column === 'isPercent') {
      this.SalaryFormulae[index]['isPercent'] = value
      this.SalaryFormulae[index]['isAmount'] = !value
    }
    if (column === 'isAmount') {
      this.SalaryFormulae[index]['isPercent'] = !value
      this.SalaryFormulae[index]['isAmount'] = value
    }
    if (column === 'minAmt' && (this.SalaryFormulae[index]['maxAmt'] != null && value > this.SalaryFormulae[index]['maxAmt'])) {
      // this.globalToastService.warning("Min Amount cannot be greater than Max Amount")
      this.ShowToast("Min Amount cannot be greater than Max Amount", "warning")
      value = null
    }

    if (index != -1) this.SalaryFormulae[index][column] = Number(value);
  }

  checkRange(newMin: any, newMax: any, a: any): boolean {
    newMin = newMin === null ? -Infinity : newMin;
    newMax = newMax === null ? Infinity : newMax;

    for (let i = 0; i < a.length; i++) {
      let existingMin = a[i].minAmt === null ? -Infinity : a[i].minAmt;
      // let existingMax = a[i].maxAmt === null ? Infinity : a[i].maxAmt;
      let existingMax = a[i].maxAmt === null || a[i].maxAmt === 0 ? Infinity : a[i].maxAmt;
      if (a[i].minAmt < 0) {
        // this.globalToastService.warning("Please Enter Minimum amount");
        this.ShowToast("Please Enter Minimum amount", "warning")
        return false;
      }
      if (a[i].maxAmt < 0) {
        // this.globalToastService.warning("Please Enter Maxmimum amount");
        this.ShowToast("Please Enter Maxmimum amount", "warning")
        return false;
      }
      //anoops code ---------------------------------------
      // if (newMin <= existingMax && newMax >= existingMin) {
      //   console.log(`Overlap detected: existingMin=${existingMin}, existingMax=${existingMax}, newMin=${newMin}, newMax=${newMax}`);
      //   this.globalToastService.warning("Minimun value or Maximun Range Already Exist For The Salary type")
      //   return false
      // }
      //anoop code ends here -----------------------------
      //mohits code---------------------------------------
      if (newMin <= existingMax && newMax >= existingMin) {
        if (existingMax === Infinity && newMin > existingMin) {
          continue;
        }
        console.log(`Overlap detected: existingMin=${existingMin}, existingMax=${existingMax}, newMin=${newMin}, newMax=${newMax}`);
        // this.globalToastService.warning("Minimum value or Maximum Range Already Exists for the Salary Type");
        this.ShowToast("Minimum value or Maximum Range Already Exists for the Salary Type", "warning")
        return false;
      }
      //mohit code ends here -----------------------------
    }
    // this.globalToastService.success("Added")
    this.ShowToast("Added", "success")
    this.salaryFormulaRow = {
      type: [],
      Percent: 0,
      isAmount: false,
      isPercent: true,
      minAmt: undefined,
      maxAmt: undefined,
      isBasic: false,
      isHRA: false,
      isDA: false,
      isTA: false,
      isMA: false
    }
    return true
  }

  actionEmitter(data: any) {
    if (data.action.name == "Edit") {
    } else if (data.action.name == "View Details") {
      // this.ViewDetails(data.row);
    } else if (data.action.name == "editColumn") {
      this.editColumn(data.row);
    } else if (data.action.name == "updatedSelectedRows") {
      // this.selectedRows = data.row;
    } else if (data.action.name == "Approve Payslip") {
      // this.Pay(data.row);
    }
    else if (data.action.name == "Delete") {
      this.deleteSalaryFormula(data.row);
    }
  }
  deleteSalaryFormula(row: any) {
    let index = this.SalaryFormulae.findIndex((e: any) => e.Index === row.Index)
    if (index > -1) {
      this.salaryFormulaLoading = true
      this.SalaryFormulae.splice(index, 1);
      this.SalaryFormulae = JSON.parse(JSON.stringify(this.SalaryFormulae))
      this.salaryFormulaLoading = false
    }
  }


  refreshSalaryCalculation() {

    this.salaryFormulaLoading = true

    this.displayedColumns = this.originalDisplayedColumns.filter((odc: any) => {
      if (odc == "isBasic" && !this.checkEarningsStatus('Basic')) return false
      else if (odc == "isHRA" && !this.checkEarningsStatus('House Rent Allowance (HRA)')) return false
      else if (odc == "isDA" && !this.checkEarningsStatus('Dearness Allowance (DA)')) return false
      else if (odc == "isTA" && !this.checkEarningsStatus('Travel Allowance (TA)')) return false
      else if (odc == "isMA" && !this.checkEarningsStatus('Medical Allowance (MA)')) return false
      return true
    })

    console.log({ displayedColumns: this.displayedColumns });
    if (this.edit == false) {
      // this.SalaryFormulae = [
      //   {
      //     "Index":0,
      //     "Percent": 0.75,
      //     "isAmount": null,
      //     "isPercent": true,
      //     "isBasic": true && this.checkEarningsStatus('Basic'),
      //     "isDA": true && this.checkEarningsStatus('Dearness Allowance (DA)'),
      //     "isHRA": false && this.checkEarningsStatus('House Rent Allowance (HRA)'),
      //     "isMA": false && this.checkEarningsStatus('Medical Allowance (MA)'),
      //     "isTA": true && this.checkEarningsStatus('Travel Allowance (TA)'),
      //     "maxAmt": 21000,
      //     "minAmt": null,
      //     "type": "ESI",
      //     "isBasicEnabled": this.checkEarningsStatus('Basic'),
      //     "isDAEnabled": this.checkEarningsStatus('Dearness Allowance (DA)'),
      //     "isHRAEnabled": this.checkEarningsStatus('House Rent Allowance (HRA)'),
      //     "isMAEnabled": this.checkEarningsStatus('Medical Allowance (MA)'),
      //     "isTAEnabled": this.checkEarningsStatus('Travel Allowance (TA)'),
      //   },
      //   {
      //     "Index":1,
      //     "Percent": 1800,
      //     "isAmount": true,
      //     "isPercent": null,
      //     "isBasic": true && this.checkEarningsStatus('Basic'),
      //     "isDA": true && this.checkEarningsStatus('Dearness Allowance (DA)'),
      //     "isHRA": false && this.checkEarningsStatus('House Rent Allowance (HRA)'),
      //     "isMA": false && this.checkEarningsStatus('Medical Allowance (MA)'),
      //     "isTA": false && this.checkEarningsStatus('Travel Allowance (TA)'),
      //     "maxAmt": null,
      //     "minAmt": 15000,
      //     "type": "PF",
      //     "isBasicEnabled": this.checkEarningsStatus('Basic'),
      //     "isDAEnabled": this.checkEarningsStatus('Dearness Allowance (DA)'),
      //     "isHRAEnabled": this.checkEarningsStatus('House Rent Allowance (HRA)'),
      //     "isMAEnabled": this.checkEarningsStatus('Medical Allowance (MA)'),
      //     "isTAEnabled": this.checkEarningsStatus('Travel Allowance (TA)'),
      //   },
      //   {
      //     "Index":2,
      //     "Percent": 12,
      //     "isAmount": null,
      //     "isPercent": true,
      //     "isBasic": true && this.checkEarningsStatus('Basic'),
      //     "isDA": true && this.checkEarningsStatus('Dearness Allowance (DA)'),
      //     "isHRA": false && this.checkEarningsStatus('House Rent Allowance (HRA)'),
      //     "isMA": false && this.checkEarningsStatus('Medical Allowance (MA)'),
      //     "isTA": false && this.checkEarningsStatus('Travel Allowance (TA)'),
      //     "maxAmt": 14999,
      //     "minAmt": null,
      //     "type": "PF",
      //     "isBasicEnabled": this.checkEarningsStatus('Basic'),
      //     "isDAEnabled": this.checkEarningsStatus('Dearness Allowance (DA)'),
      //     "isHRAEnabled": this.checkEarningsStatus('House Rent Allowance (HRA)'),
      //     "isMAEnabled": this.checkEarningsStatus('Medical Allowance (MA)'),
      //     "isTAEnabled": this.checkEarningsStatus('Travel Allowance (TA)'),
      //   },
      //   {
      //     "Index":3,
      //     "Percent": 200,
      //     "isAmount": true,
      //     "isPercent": null,
      //     "isBasic": true && this.checkEarningsStatus('Basic'),
      //     "isDA": false && this.checkEarningsStatus('Dearness Allowance (DA)'),
      //     "isHRA": false && this.checkEarningsStatus('House Rent Allowance (HRA)'),
      //     "isMA": false && this.checkEarningsStatus('Medical Allowance (MA)'),
      //     "isTA": false && this.checkEarningsStatus('Travel Allowance (TA)'),
      //     "maxAmt": null,
      //     "minAmt": 25000,
      //     "type": "PT",
      //     "isBasicEnabled": this.checkEarningsStatus('Basic'),
      //     "isDAEnabled": this.checkEarningsStatus('Dearness Allowance (DA)'),
      //     "isHRAEnabled": this.checkEarningsStatus('House Rent Allowance (HRA)'),
      //     "isMAEnabled": this.checkEarningsStatus('Medical Allowance (MA)'),
      //     "isTAEnabled": this.checkEarningsStatus('Travel Allowance (TA)'),
      //   }
      // ]
    }
    this.salaryFormulaLoading = false
  }

  loadValuesEdit() {
    if (this.data.row) {
      console.log(this.data.row);
      this.earnings.subtasks?.map((s: any) => {
        if (s.name == 'Basic') {
          s.completed = this.data.row.isBasic
        }
        if (s.name == 'House Rent Allowance (HRA)') {
          s.completed = this.data.row.isHRA
        }
        if (s.name == 'Dearness Allowance (DA)') {
          s.completed = this.data.row.isDA
        }
        if (s.name == 'Travel Allowance (TA)') {
          s.completed = this.data.row.isTA
        }
        if (s.name == 'Medical Allowance (MA)') {
          s.completed = this.data.row.isMA
        }
        if (s.name == 'Shift Amount') {
          s.completed = this.data.row.isShiftAmount
        }
        if (s.name == 'OverTime (OT) Amount') {
          s.completed = this.data.row.isOTAmount
        }
        if (s.name == 'Incentive') {
          s.completed = this.data.row.isIncentive
        }
        if (s.name == 'Others') {
          s.completed = this.data.row.isEarningsOthers
        }
        return s
      })
      this.deductions.subtasks?.map((s: any) => {
        if (s.name == 'Employees State Insurance (ESI)') {
          s.completed = this.data.row.isESI
        }
        if (s.name == 'Provident Fund (PF)') {
          s.completed = this.data.row.isPF
        }
        if (s.name == 'Professional Tax (PT)') {
          s.completed = this.data.row.isPT
        }
        if (s.name == 'Others') {
          s.completed = this.data.row.isDeductionOthers
        }
        if (s.name == 'Penalty') {
          s.completed = this.data.row.ispenalty
        }
        if (s.name == 'TDS') {
          s.completed = this.data.row.isTDS
        }
        return s
      })
      this.grossOptions.map((go: any) => {
        if (go.title == "Basic") {
          go.value = this.data.row.Basic
          go.status = !!this.data.row.isBasic
        }
        if (go.title == "House Rent Allowance (HRA)") {
          go.value = this.data.row.HRA
          go.status = !!this.data.row.isHRA
        }
        if (go.title == "Dearness Allowance (DA)") {
          go.value = this.data.row.DA
          go.status = !!this.data.row.isDA
        }
        if (go.title == "Travel Allowance (TA)") {
          go.value = this.data.row.TA
          go.status = !!this.data.row.isTA
        }
        if (go.title == "Medical Allowance (MA)") {
          go.value = this.data.row.MA
          go.status = !!this.data.row.isMA
        }
        return go
      })
      console.log(this.data);
      console.log(this.selectedBranch, this.selectedDepartment, this.selectedEmployees);
      console.log();
      this.selectedBranch = this.data.row.Branch?.map((b: any) => { return { "Value": b.ID, "Text": b.Name } })
      this.selectedDepartment = this.data.row.Department?.map((d: any) => { return { "Value": d.ID, "Text": d.Name } })
      this.selectedEmployees = this.data.row.Employee?.map((e: any) => { return { "Value": e.ID, "Text": e.Name } })
      this.GetBranches()

      let json = {
        Employeelist: this.selectedEmployees.map((e) => e.Value) || [],
        BranchList: this.selectedBranch.map((e) => e.Value) || [],
        DepartmentList: this.selectedDepartment.map((e) => e.Value) || [],
      };

      if (json.Employeelist.length > 0 || json.BranchList.length > 0 || json.DepartmentList.length > 0) {
        this._commonservice
          .ApiUsingGetWithOneParam("SalaryCalculation/getcalculationonfieldID?Fieldid=" + this.data.row.ID)
          .subscribe(
            (calData) => {
              console.log({ calData });
              this.SalaryFormulae = calData.calculations?.map((cf: any) => {
                return {
                  "Percent": cf.Value,
                  "isAmount": cf.isAmount,
                  "isPercent": !cf.isAmount,
                  "isBasic": cf.isBasic,
                  "isDA": cf.isDA,
                  "isHRA": cf.isHRA,
                  "isMA": cf.isMA,
                  "isTA": cf.isTA,
                  "maxAmt": cf.Max,
                  "minAmt": cf.Min,
                  "type": cf.SalaryType,
                  "isBasicEnabled": this.checkEarningsStatus('Basic'),
                  "isDAEnabled": this.checkEarningsStatus('Dearness Allowance (DA)'),
                  "isHRAEnabled": this.checkEarningsStatus('House Rent Allowance (HRA)'),
                  "isMAEnabled": this.checkEarningsStatus('Medical Allowance (MA)'),
                  "isTAEnabled": this.checkEarningsStatus('Travel Allowance (TA)'),
                  FieldID: cf.FieldID,
                  ID: cf.ID
                }
              }
              )
              this.spinnerService.hide();
              this.salaryFormulaLoading = false;
            },
            (error) => {
              this.spinnerService.hide();
              this.salaryFormulaLoading = false;
              // this.globalToastService.error(error.message);
              this.ShowToast(error.message, "error")
            }
          );
      }

    }
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

