import { ChangeDetectorRef, Component, inject, Inject, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
 
export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
    disabled: boolean;
    description: string;
}

@Component({
  selector: 'app-add-edit-salary-setting',
  templateUrl: './add-edit-salary-setting.component.html',
  styleUrls: ['./add-edit-salary-setting.component.css']
})
export class AddEditSalarySettingComponent {
  selectedFileType:string;
  selectedColumns:any = []
  excludedColumns:any = ['SelectAll']
  dragDropHelp : boolean = false
  totalGross : number = 0
    is_second_step_valid: Boolean = false;
  
  
  earnings: Task = {
    name: 'Earnings',
    completed: false,
      color: 'primary',
      description:'',
    subtasks: [
        { name: 'Basic', completed: true, color: 'primary', disabled: false, description:'Basic Salary'},
        { name: 'Dearness Allowance (DA)', completed: true, color: 'primary', disabled: false, description: 'Dearness Allowance (DA)' },
        { name: 'Basic + DA', completed: false, color: 'primary', disabled: false, description: 'Basic + DA' },
        { name: 'House Rent Allowance (HRA)', completed: true, color: 'primary', disabled: false, description: 'House Rent Allowance (HRA)' },
    
        { name: 'Travel Allowance (TA)', completed: false, color: 'primary', disabled: false, description: 'Travel Allowance (TA)' },
        { name: 'Medical Allowance (MA)', completed: false, color: 'primary', disabled: false, description: 'Medical Allowance (MA)' },
        { name: 'Conveyance', completed: false, color: 'primary', disabled: false, description: 'Conveyance' },
        { name: 'LTA', completed: false, color: 'primary', disabled: false, description: 'Leave Travel Allowance' },
        { name: 'PSA', completed: false, color: 'primary', disabled: false, description: 'Personal Skill Allowance' },
        { name: 'FI', completed: false, color: 'primary', disabled: false, description: 'Fixed Incentive' },
        { name: 'Shift Amount', completed: false, color: 'primary', disabled: false, description: 'Shift Amount' },
        { name: 'OT Amount', completed: false, color: 'primary', disabled: false, description: 'OT Amount' },
        { name: 'Last Month Incentive', completed: false, color: 'primary', disabled: false, description: 'Last Month Incentive' },
        { name: 'Performance Incentive', completed: false, color: 'primary', disabled: false, description: 'Performance Incentive' },
        { name: 'Bonus', completed: false, color: 'primary', disabled: false, description: 'Bonus' },
        { name: 'Attendance Bonus', completed: false, color: 'primary', disabled: false, description: 'Attendance Bonus' },
        { name: 'Washing Allowance', completed: false, color: 'primary', disabled: false, description: 'Washing Allowance' },
        { name: 'Fuel Allowance', completed: false, color: 'primary', disabled: false, description: 'Fuel Allowance' },
        { name: 'Special Allowance', completed: false, color: 'primary', disabled: false, description: 'Special Allowance' },
        { name: 'Incentive', completed: false, color: 'primary', disabled: false, description: 'Incentive' },
      
    ],
    disabled:false
  };
  
  deductions: Task = {
    name: 'Deductions',
    completed: false,
      color: 'primary',
    description:'',
    subtasks: [
      {name: 'Employees State Insurance (ESI)', completed: true, color: 'primary', disabled:false,description:''},
        { name: 'Provident Fund (PF)', completed: true, color: 'primary', disabled: false, description: '' },
        { name: 'Professional Tax (PT)', completed: true, color: 'primary', disabled: false, description: '' },
        { name: 'Others', completed: false, color: 'primary', disabled: false, description: '' },
        { name: 'Penalty', completed: false, color: 'primary', disabled: false, description: '' },
        { name: 'TDS', completed: false, color: 'primary', disabled: false, description: '' },
        { name: 'Deduction', completed: false, color: 'primary', disabled: false, description: '' },
        { name: 'Security Deposit', completed: false, color: 'primary', disabled: false, description: '' },
        { name: 'Penalty points', completed: false, color: 'primary', disabled: false, description: '' },

    ],
    disabled:false
  };
  
  grossOptions :any = {}
  BranchList: any
  DepartmentList: any
  EmployeeList: any
  SalaryTypes: any
  AdminID: any
  UserID: any
  OrgID:any
  
  ApiURL:any
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  salaryTypeSettings :IDropdownSettings = {}
  
  
  selectedBranch:any[]=[]
  selectedDepartment:any[]=[]
  selectedEmployees:any[]=[]
  selectedSalaryType:any = []
  
  SalaryFormulae:any = []
  temparray:any=[]
  tempdeparray:any=[]
  List:any=[]
  errorMessages:any={}
  salaryFormulaRow:any = {}
  
  steps:any = []
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
  salaryFormulaLoading:any = undefined
  originalDisplayedColumns:any = []
  // common table
  tempSalaryTypes : any = []
  edit:boolean;
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
    orgSettings: IDropdownSettings = {}



    // dyanmic salary settings

    salary_component_list: any[] = [];
    salary_earnings_list: any[] = [];
    salary_deduction_list: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddEditSalarySettingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _commonservice: HttpCommonService,
    private spinnerService: NgxSpinnerService, 
    private globalToastService:ToastrService,
    private cdr: ChangeDetectorRef,private dialog:MatDialog
  ){
    this.AdminID = localStorage.getItem("AdminID")
    this.UserID = localStorage.getItem("UserID")
    this.OrgID = localStorage.getItem("OrgID")

   
    
    this.tempSalaryTypes = [
      {Text:"ESI", Value:"ESI", key:"Employees State Insurance (ESI)"},
      {Text:"PF", Value:"PF", key:"Provident Fund (PF)"},
      {Text:"PT", Value:"PT", key:"Professional Tax (PT)"}
    ]

   
      this.edit = data.edit || false;

      if (this.edit == true) {
          console.log("data from main_page");
          console.log(this.data);


      }
    
    if(this.edit != true) this.GetBranches()
    
    this.branchSettings = {
      singleSelection: true,
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
      singleSelection: true,
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

    this.grossOptions = [
      {
        title:"Basic",
        value:60,
        status: true,
            isAmount: false,
            min: 0,
            max:100,
            Priority:1
      },
      {
        title:"House Rent Allowance (HRA)",
        value:30,
          status: true,
          isAmount: false,
          min: 0,
          max: 100,
          Priority: 2
      },
      {
        title:"Dearness Allowance (DA)",
        value:10,
          status: true,
          isAmount: false,
          min: 0,
          max: 100,
          Priority: 3
      },
      {
        title:"Travel Allowance (TA)",
        value:0,
          status: false,
          isAmount: false,
          min: 0,
          max: 100,
          Priority: 4
      },
      {
        title:"Medical Allowance (MA)",
        value:0,
          status: false,
          isAmount: false,
          min: 0,
          max: 100,
          Priority: 5
      },
      {
            title: "Conveyance",
            value: 0,
          status: false,
          isAmount: false,
          min: 0,
          max: 100,
          Priority: 6
      },
      {
            title: "LTA",
            value: 0,
          status: false,
          isAmount: false,
          min: 0,
          max: 100,
          Priority: 7
        },
        {
            title: "Basic + DA",
            value: 60,
            status: false,
            isAmount: false,
            min: 0,
            max: 100,
            Priority: 1
        },
        {
            title: "Washing Allowance",
            value: 0,
            status: false,
            isAmount: false,
            min: 0,
            max: 100,
            Priority: 9
        },
        {
            title: "Fuel Allowance",
            value: 0,
            status: false,
            isAmount: false,
            min: 0,
            max: 100,
            Priority: 10
        },
        {
            title: "Special Allowance",
            value: 0,
            status: false,
            isAmount: false,
            min: 0,
            max: 100,
            Priority: 11
        }

      
    ]
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
      type:[],
      Percent:0,
      isAmount:false,
      isPercent:true,
      minAmt:undefined,
      maxAmt:undefined,
      isBasic:false,
      isHRA:false,
      isDA:false,
      isTA:false,
        isMA: false,
        isConveyance: false,
        isPSA: false,
        isFI: false,
        isSA: false,
        isOTA: false,
        isLMI: false,
        isPI: false,
        isBonus: false,
        isAttendanceBonus: false,
        isFuelAllowance: false,
        isWashingAllowance: false,
        isBasicAndDA: false,
        isSpecialAllowance:false
       
    }
    

    this.steps = [false,false,false]



    //------------------common table ------------------
    
    this.actionOptions = [
      {
        name: "Delete",
        icon: "fa fa-trash",
        class:"danger-button"
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
        type:"Salary Type",
        isAmount:"Amount",
        isPercent:"Percent",
        Percent:"Value",
        minAmt:"Min Amt in ₹",
        maxAmt:"Max Amt in ₹",
          isBasic: "Basic",
          isBasicAndDA: "Basic + DA",
        isHRA:"HRA",
        isDA:"DA",
        isTA:"TA",
        isMA: "MA",
        isLTA: "LTA",
        isConveyance: "Conveyance",
    
        isWashingAllowance: "Washing Allowance",
        isFuelAllowance: "Fuel Allowance",
        isSpecialAllowance: "Special Allowance",

         isOther:"isOther",
        "Actions":"Actions"
    }
      this.originalDisplayedColumns = [
        "type",
        "Percent",
        "isAmount",
        "isPercent",
        "minAmt",
        "maxAmt",
          "isBasic",
          "isBasicAndDA",
        "isHRA",
        "isDA",
        "isTA",
          "isMA",
          "isLTA",
          
          "isConveyance",
          
          "isWashingAllowance",
          "isFuelAllowance",
          "isSpecialAllowance",
        "isOther",
        "Actions"
      ];

    this.editableColumns = {
      Percent: {
        filters: {},
      },
      isAmount: {
        default:false,
        type:'Boolean',
        filters: {},
      },
      isPercent: {
        default:false,
        type:'Boolean',
        filters: {},
      },
      minAmt: {
        filters: {},
      },
      maxAmt: {
        filters: {},
      },
      isBasic: {
        default:false,
        type:'Boolean',
        filters: {isBasicEnabled:true},
        },
        isBasicAndDA: {
            default: false,
            type: 'Boolean',
            filters: { isBasicAndDAEnabled: true },
        },
      isHRA: {
        default:false,
        type:'Boolean',
        filters: {isHRAEnabled:true},
      },
      isDA: {
        default:false,
        type:'Boolean',
        filters: {isDAEnabled:true},
      },
      isTA: {
        default:false,
        type:'Boolean',
        filters: {isTAEnabled:true},
      },
      isMA: {
        default:false,
        type:'Boolean',
        filters: {isMAEnabled:true},
        },
      isLTA: {
          default: false,
          type: 'Boolean',
          filters: { isLTAEnabled: true },
        },
        isConveyance: {
            default: false,
            type: 'Boolean',
            filters: { isConveyanceEnabled: true },
        },
     
     
        isWashingAllowance: {
            default: false,
            type: 'Boolean',
            filters: { isWashingAllowanceEnabled: true },
        },
        isFuelAllowance: {
            default: false,
            type: 'Boolean',
            filters: { isFuelAllowanceEnabled: true },
        },
        isSpecialAllowance: {
            default: false,
            type: 'Boolean',
            filters: { isSpecialAllowanceEnabled: true },
        }


    };

    // this.topHeaders = [
    //   {
    //     id: "blank1",
    //     name: "",
    //     colspan: 4,
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
    //     name: "Gross",
    //     colspan: 6,
    //   },
    //   {
    //     id: "OtherEarnings",
    //     name: "Other Earnings",
    //     colspan: 5,
    //   },
    //   {
    //     id: "Deductions",
    //     name: "Deductions",
    //     colspan: 9,
    //   },
    // ];
    // this.smallHeaders = ["TotalWokingDays", "NoOfPresentDays"];
    // this.tableDataColors = {
    //   "Employee": [
    //     { styleClass: "greenBold", filter: [{ col: "IsPayslipExist", value: true }] },
    //   ],
    //   "NetSalary": [
    //     { styleClass: "greenBold", filter: [{ col: "IsPayslipExist", value: true }] },
    //   ]
    // }
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

    if(this.edit == true) this.loadValuesEdit()
    }


 get_active_gross_options():any[]{
     return this.grossOptions.filter((item: any) => item.status == true);

 }
  ngOnInit(): void {        
    this.GetOrganization()
    }

    AmountTypeChanged(title_value:string) {
        let item_gross_type = this.grossOptions.find((item: any) => item.title == title_value);
        if (item_gross_type != undefined) {
            if (item_gross_type.isAmount) {
                item_gross_type.min = 0;
                item_gross_type.max = 9999999;

            } else {
                item_gross_type.min = 0;
                item_gross_type.max = 100;
            }
        }
    }

  validateAmount(amount:any){
    if(amount == true){
      this.salaryFormulaRow.isPercent = false
    }else{
      this.salaryFormulaRow.isPercent = true
    }
  }
  validatePercent(percent:any){
    if(percent == true){
      this.salaryFormulaRow.isAmount = false
    }else{
      this.salaryFormulaRow.isAmount = true
    }
  }
  minMaxValidationAmount(min:any,max:any){
   if(min!=0 && min!=null && min!=undefined && max!=0 && max!=null && max!=undefined){
     if( min > max){
      // this.globalToastService.warning("Minimun Amount Cannot Be Grater Than Maximum Amount")
      this.ShowToast("Minimun Amount Cannot Be Grater Than Maximum Amount","warning")
      this.salaryFormulaRow.minAmt = null
      this.salaryFormulaRow.maxAmt = null
    }
    else if(max < min){
      // this.globalToastService.warning("Maximum Amount Cannot Be Lesser Than Minimun Amount")
      this.ShowToast("Maximum Amount Cannot Be Grater Than Maximum Amount","warning")
      this.salaryFormulaRow.maxAmt = null
      this.salaryFormulaRow.minAmt = null
    }
   }
  }

  earningAllComplete:boolean = false
  deductionAllComplete:boolean = false

  updateAllComplete(task:Task,allComplete:boolean) {
      allComplete = task.subtasks != null && task.subtasks.every(t => t.completed);
      
    this.updateTotalGross()
      this.updateSalaryTypes();
     
    }

    onEarningChanged(changedItem: any) {
        const basic = this.earnings.subtasks?.find((item: any) => item.name === 'Basic');
        const da = this.earnings.subtasks?.find((item: any) => item.name === 'Dearness Allowance (DA)');
        const basicDA = this.earnings.subtasks?.find((item: any) => item.name === 'Basic + DA');

        if (changedItem.name === 'Basic + DA' && changedItem.completed) {
            // Uncheck Basic and DA if Basic + DA is checked
            if (basic) basic.completed = false;
            if (da) da.completed = false;
        }

        if ((changedItem.name === 'Basic' || changedItem.name === 'Dearness Allowance (DA)') && changedItem.completed) {
            // Uncheck Basic + DA if either Basic or DA is checked
            if (basicDA) basicDA.completed = false;
        }
    }

     findDuplicatePriorities(options: any[]): any[] {
    const priorityMap = new Map<number, any[]>();

    for (const item of options) {
        const list = priorityMap.get(item.Priority) || [];
        list.push(item);
        priorityMap.set(item.Priority, list);
    }

    // Filter and return only those priorities with duplicates
    const duplicates: any[] = [];
    priorityMap.forEach((items, priority) => {
        if (items.length > 1) {
            duplicates.push(...items);
        }
    });

    return duplicates;
}

    DoesItContainDuplicateProrities():Boolean {
        let result: Boolean = false;
        let duplicates = this.findDuplicatePriorities(this.grossOptions.filter((item:any)=>item.status==true));
        if (duplicates.length == 0) {
            return false;
        } else {
            return true;
        }
        return result;
    }


    RequiredValidations():Boolean {
        const basic = this.earnings.subtasks?.find((item: any) => item.name === 'Basic');
        const da = this.earnings.subtasks?.find((item: any) => item.name === 'Dearness Allowance (DA)');
        const basicDA = this.earnings.subtasks?.find((item: any) => item.name === 'Basic + DA');

        if (basic!.completed == false && basicDA!.completed == false) {

            return false;
        } else {
            

            return true;
        }
    }



  
  someComplete(task:Task,allComplete:boolean): boolean {
    if (task.subtasks == null) {
      return false;
    }
    this.updateTotalGross()
    this.updateSalaryTypes()
    return task.subtasks.filter(t => t.completed).length > 0 && !allComplete;
    
    }

    onBranchSelect_All(item: any) {
        // console.log(this.selectedBranch)

        //  console.log(item,"item")
        this.selectedBranch = item;
        this.GetDepartments();
        this.selectedEmployees = [];
        
    }
    onBranchDeSelect_All(item: any) {
        //  console.log(item,"item")

        this.selectedBranch = [];
        this.DepartmentList = [];
        this.temparray.splice(this.temparray.indexOf(item), 1);
        this.selectedDepartment = [];
        this.selectedEmployees = [];
        
    }

    onDepartmentSelect_All(item: any) {
        // console.log(this.selectedBranch)

        //  console.log(item,"item")
        this.selectedDepartment = item;
        this.getEmployeeList();
    }
    onDepartmentDeSelect_All(item: any) {
        //  console.log(item,"item")
        
        this.selectedDepartment = [];

      
        this.temparray.splice(this.temparray.indexOf(item), 1);
        this.selectedDepartment = [];
        this.selectedEmployees = [];
        this.EmployeeList = [];
    }
  
  setAll(completed: boolean,task:Task,allComplete:boolean) {
    console.log('setAll',task,allComplete);
    allComplete = completed;
    if(task.subtasks)
    for (let index = 0; index < task.subtasks.length; index++) {
      const element = task.subtasks[index]
      if(element.disabled == false){
        task.subtasks[index].completed = completed
      }else{
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

  
  updateSalaryTypes(){
    this.SalaryTypes = []
    for (let i = 0; i < this.tempSalaryTypes.length; i++) {
      const st = this.tempSalaryTypes[i];
      let stMatch = this.deductions.subtasks?.filter((dSt:any)=>dSt.name == st.key)[0]
      if(stMatch && stMatch?.completed == true){
        this.SalaryTypes.push({Text:st.Text, Value:st.Value})
      }
    }
  }

  getHeaderBorderColor(title:string){
    let borderColor:string = this.headerColors[title]?.text
    if(!borderColor)  borderColor = "1px solid #c3b6de"
    else borderColor = '1px solid '+ borderColor
    return borderColor      
  }

  getHeaderBgColor(title:string){
    let bgColor:string = this.headerColors[title]?.bg
    if(!bgColor)  bgColor = "#e7e0f6"
    return bgColor
  }
  
  getHeaderTextColor(title:string){
    let textColor:string = this.headerColors[title]?.text
    if(!textColor) textColor = "#000000"
    return textColor
  }

  getColumnDiaplayName(name:any){
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
    const dialogData = {  };
    this.dialogRef.close(dialogData);
  }

  showDragDropHelp(){
    this.dragDropHelp = true
  }
  
  hideDragDropHelp(){
    this.dragDropHelp = false
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

        if (this.edit == true) {
            if (this.data.row != null && this.data.row.SubOrg !=null) {
                this.selectedOrganization = [{ Value: this.data.row.SubOrg[0].ID, Text: this.data.row.SubOrg[0].Name }];
            }
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
          this.BranchList = data.List
          // console.log(this.BranchList, "branchlist")
          // if(this.edit != true){
              //   this.selectedBranch = [this.BranchList[0]]

              // }
            

           if (this.edit == true) {
               if (this.data.row != null) {
                   this.selectedBranch = [{Value : this.data.row.Branch[0].ID,Text:this.data.row.Branch[0].Name}];
               }
            }
          this.GetDepartments()
          this.getEmployeeList()
          
        },
        (error) => {
          // this.globalToastService.error(error)
          this.ShowToast(error,"error")
          console.log(error)
        }
      )
  }

  GetDepartments() {
    var loggedinuserid=localStorage.getItem("UserID");
    this.DepartmentList=[];
    if(!this.selectedBranch || this.selectedBranch?.length==0) return
    const json ={
      AdminID:loggedinuserid,
      OrgID:this.OrgID,
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

            if (this.edit == true) {
             
                if (this.data.row != null && this.data.row.Department != null) {
                    this.selectedDepartment = [];
                    for (let i = 0; i < this.data.row.Department.length; i++) {
                        this.selectedDepartment.push({ Value: this.data.row.Department[i].ID, Text: this.data.row.Department[i].Name });

                    }
                }
            }
          
        }
      },
      (error) => {
        // this.globalToastService.error(error)
        this.ShowToast(error,"error")
        console.log(error)
      }
    )
  }

  validateBranch() : boolean{
    if(this.selectedBranch.length <=0) {
      this.errorMessages['branch'] = {message:"Please select a Branch."}
      return false
    }
    if(this.errorMessages['branch']) delete this.errorMessages['branch']
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
  
  validateEarnings(){
    let earningsStatus = this.earnings.completed || (this.earnings?.subtasks ? this.earnings?.subtasks.filter((e:any)=>e.completed==true)?.length>0 : false)
    if (!earningsStatus) this.errorMessages['earnings'] = {message:"Please select minimum one of the above given Earnings"}
    else if( this.errorMessages['earnings']) delete this.errorMessages['earnings']
    return earningsStatus
  }

  validateDeductions(){
    let deductionsStatus = this.deductions.completed || (this.deductions.subtasks ? this.deductions.subtasks.filter((e:any)=>e.completed==true)?.length>0 : false)
    if (!deductionsStatus) this.errorMessages['deductions'] = {message:"Please select minimum one of the above given Deductions"}
    else if( this.errorMessages['deductions']) delete this.errorMessages['deductions']
    return deductionsStatus
  }

    validateGross() {
    
        let isValid = false;
        this.errorMessages['grossError'] = {message:''};
        let gross_options: any[] = this.get_active_gross_options();
        for (let i = 0; i < gross_options.length; i++) {
            if (gross_options[i].value ==false ||  Number(gross_options[i].value) <= 0) {
                this.errorMessages['grossError']['message'] +='| '+ gross_options[i].title + ' is Required *';
            }

            if (gross_options[i].Priority == false || Number(gross_options[i].Priority) <= 0) {
                this.errorMessages['grossError']['message'] += '| ' + gross_options[i].title + ' Priority is Required *';

            }
        }

        if (this.errorMessages['grossError'].message == '') {
            delete this.errorMessages['grossError'];
            isValid = true;
            this.is_second_step_valid = true;
            return true;
          
        } else {
            this.is_second_step_valid = false;
            return false;
        }

  
 
  }

  getEmployeeList() {
    this.selectedEmployees = []
    this.EmployeeList=[];
    if(!(this.selectedBranch?.length>0)) return
    if(this.selectedBranch){
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
            // this.selectedEmployees = this.EmployeeList.map((e: any) => {
            //   return { Value: e.Value, Text: e.Text }
            // })

                // this.GetReport()
              
                if (this.edit == true) {
                    if (this.data.row != null && this.data.row.Employee) {
                        debugger;
                        this.selectedEmployees = [];
                        for (let i = 0; i < this.data.row.Employee.length; i++) {
                            this.selectedEmployees.push({ Value: this.data.row.Employee[i].ID, Text: this.data.row.Employee[i].Name });
                        }
                    }
                }
          },
          (error) => {
            console.log(error)
            this.spinnerService.hide()
          }
        )
    }
  
  }

  
  onDeptSelect(item:any){
    // console.log(item,"item")
    this.tempdeparray.push({id:item.Value, text:item.Text })
    this.getEmployeeList()
  }
  onDeptSelectAll(item:any){
    // console.log(item,"item")
    this.tempdeparray = item
    this.getEmployeeList()
  }
  onDeptDeSelectAll(){
    this.tempdeparray = []
    this.getEmployeeList()
  }
  onDeptDeSelect(item:any){
    // console.log(item,"item")
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1)
    this.getEmployeeList()
  }
  onBranchSelect(item:any){
    // console.log(this.selectedBranch)
    
  //  console.log(item,"item")
   this.temparray.push({id:item.Value,text:item.Text })
   this.GetDepartments()
   this.selectedEmployees = []
 

    }


  onBranchDeSelect(item:any){
  //  console.log(item,"item")
   this.temparray.splice(this.temparray.indexOf(item), 1)
   this.GetDepartments()
   this.selectedEmployees = []
      this.getEmployeeList();
      this.DepartmentList = [];
    }


  OnEmployeesChange(_event:any){
    // this.validateEmployee()
  }
  OnEmployeesChangeDeSelect(event:any){
    // this.validateEmployee()
  }

  onSalaryTypeSelect(item:any){

  }

  onSalaryTypeDeSelect(item:any){

  }

  GetReport(){
    this.List = [
      {
        id:1,
        name:"setting 1",
      }
    ]
  }

  updateTotalGross(){
    
   

    for (let i = 0; i < this.grossOptions.length; i++) {
      const grossType = this.grossOptions[i];
      if(this.earnings.subtasks?.filter((es:any) => es.name == grossType.title)[0]?.completed == true){
        this.grossOptions[i].status = true
      
      }
      else{
        this.grossOptions[i].status = false
        this.grossOptions[i].value = false

      }

    }

      this.validateGross();
   
  }

  checkEarningsStatus(option:string){
    return !!(this.earnings.subtasks? this.earnings.subtasks.filter((e:any)=>e.name == option)[0]?.completed : false)
  }
  checkDeductionsStatus(option:string){
    return !!(this.deductions.subtasks? this.deductions.subtasks.filter((e:any)=>e.name == option)[0]?.completed : false)
  }

  addSalaySetting(){
    this.errorMessages = {}
    this.validateBranch()
    // this.validateEmployee()
    this.validateEarnings()
    this.validateDeductions()
    this.validateGross()

    
    if(Object.keys(this.errorMessages).length>0){
      return
    }

    let json:any = {
      "Employeelist":[],
      "DepartmentList":[],
      "BranchList":[],
      "configfields": {
          "isBasic": this.checkEarningsStatus('Basic'),
          "isHRA": this.checkEarningsStatus('House Rent Allowance (HRA)'),
          "isDA": this.checkEarningsStatus('Dearness Allowance (DA)'),
          "isTA": this.checkEarningsStatus('Travel Allowance (TA)'),
          "isMA": this.checkEarningsStatus('Medical Allowance (MA)'),
          "isShiftAmount": this.checkEarningsStatus('Shift Amount'),
          
          "IsPercentage": true,
          "isIncentive": this.checkEarningsStatus('Incentive'),
          "isEarningsOthers": this.checkEarningsStatus('Others'),
          "isLTA": this.checkEarningsStatus('LTA'),
          "isConveyance": this.checkEarningsStatus("Conveyance"),
          


          "isPSA": this.checkEarningsStatus("PSA"),
          "isFixedIncentive": this.checkEarningsStatus("FI"),
          
          "isOTAmount": this.checkEarningsStatus("OT Amount"),
          "isLastMonthIncentive": this.checkEarningsStatus("Last Month Incentive"),
          "isPerformanceIncentive": this.checkEarningsStatus("Performance Incentive"),
          "isBonus": this.checkEarningsStatus("Bonus"),
          "isAttendanceBonus": this.checkEarningsStatus("Attendance Bonus"),
          "isFuelAllowance": this.checkEarningsStatus("Fuel Allowance"),
          "isWashingAllowance": this.checkEarningsStatus("Washing Allowance"),
          "isSpecialAllowance": this.checkEarningsStatus("Special Allowance"),
          "isESI": this.checkDeductionsStatus('Employees State Insurance (ESI)'),
          "isPF": this.checkDeductionsStatus('Provident Fund (PF)'),
          "isDeductionOthers": this.checkDeductionsStatus('Others'),
          "ispenalty": this.checkDeductionsStatus('Penalty'),
          "isPT": this.checkDeductionsStatus('Professional Tax (PT)'),
          "isTDS": this.checkDeductionsStatus('TDS'),
          "isDeductions": this.checkDeductionsStatus("Deduction"),
          "isSD": this.checkDeductionsStatus("Security Deposit"),
          "isFinePoints": this.checkDeductionsStatus("Penalty points"),
          "isBasicAndDA": this.checkEarningsStatus("Basic + DA"),
       

          "Basic": this.grossOptions && this.grossOptions.filter((e:any)=>e.title == 'Basic')[0]?.value != false ? this.grossOptions.filter((e:any)=>e.title == 'Basic')[0]?.value : 0,
          "HRA": this.grossOptions && this.grossOptions.filter((e:any)=>e.title == 'House Rent Allowance (HRA)')[0]?.value != false ? this.grossOptions.filter((e:any)=>e.title == 'House Rent Allowance (HRA)')[0]?.value : 0,
          "DA": this.grossOptions && this.grossOptions.filter((e:any)=>e.title == 'Dearness Allowance (DA)')[0]?.value != false ? this.grossOptions.filter((e:any)=>e.title == 'Dearness Allowance (DA)')[0]?.value : 0,
          "TA": this.grossOptions && this.grossOptions.filter((e:any)=>e.title == 'Travel Allowance (TA)')[0]?.value != false ? this.grossOptions.filter((e:any)=>e.title == 'Travel Allowance (TA)')[0]?.value : 0,
          "MA": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Medical Allowance (MA)')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'Medical Allowance (MA)')[0]?.value : 0,
          "Conveyance": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Conveyance')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'Conveyance')[0]?.value : 0,
          "LTA": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'LTA')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'LTA')[0]?.value : 0,
          "BasicAndDA": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Basic + DA')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'Basic + DA')[0]?.value : 0,
          "WashingAllowance": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Washing Allowance')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'Washing Allowance')[0]?.value : 0,
          "SpecialAllowance": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Special Allowance')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'Special Allowance')[0]?.value : 0,
          "FuelAllowance": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Fuel Allowance')[0]?.value != false ? this.grossOptions.filter((e: any) => e.title == 'Fuel Allowance')[0]?.value : 0,


          "isBasicAmount": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Basic')[0]?.isAmount != false ? this.grossOptions.filter((e: any) => e.title == 'Basic')[0]?.isAmount : false,
          "isHRAAmount": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'House Rent Allowance (HRA)')[0]?.isAmount != false ? this.grossOptions.filter((e: any) => e.title == 'House Rent Allowance (HRA)')[0]?.isAmount : false,
          "isBasicAndDAAmount": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Basic + DA')[0]?.isAmount != false ? this.grossOptions.filter((e: any) => e.title == 'Basic + DA')[0]?.isAmount : false,
          "isDAAmount": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Dearness Allowance (DA)')[0]?.isAmount != false ? this.grossOptions.filter((e: any) => e.title == 'Dearness Allowance (DA)')[0]?.isAmount : false,
          "isTAAmount": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Travel Allowance (TA)')[0]?.isAmount != false ? this.grossOptions.filter((e: any) => e.title == 'Travel Allowance (TA)')[0]?.isAmount : false,
          "isMAAmount": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Medical Allowance (MA)')[0]?.isAmount != false ? this.grossOptions.filter((e: any) => e.title == 'Medical Allowance (MA)')[0]?.isAmount : false,
          "isConveyanceAmount": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Conveyance')[0]?.isAmount != false ? this.grossOptions.filter((e: any) => e.title == 'Conveyance')[0]?.isAmount : false,
          "isLTAAmount": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'LTA')[0]?.isAmount != false ? this.grossOptions.filter((e: any) => e.title == 'LTA')[0]?.isAmount : false,
          "isWashingAllowanceAmount": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Washing Allowance')[0]?.isAmount != false ? this.grossOptions.filter((e: any) => e.title == 'Washing Allowance')[0]?.isAmount : false,
          "isSpecialAllowanceAmount": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Special Allowance')[0]?.isAmount != false ? this.grossOptions.filter((e: any) => e.title == 'Special Allowance')[0]?.isAmount : false,
          "isFuelAllownceAmount": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Fuel Allowance')[0]?.isAmount != false ? this.grossOptions.filter((e: any) => e.title == 'Fuel Allowance')[0]?.isAmount : false,


          "BasicPriority": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Basic')[0]?.Priority != false ? this.grossOptions.filter((e: any) => e.title == 'Basic')[0]?.Priority : false,
          "HRAPriority": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'House Rent Allowance (HRA)')[0]?.Priority != false ? this.grossOptions.filter((e: any) => e.title == 'House Rent Allowance (HRA)')[0]?.Priority : false,
          "BasicAndDAPriority": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Basic + DA')[0]?.Priority != false ? this.grossOptions.filter((e: any) => e.title == 'Basic + DA')[0]?.Priority : false,
          "DAPriority": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Dearness Allowance (DA)')[0]?.Priority != false ? this.grossOptions.filter((e: any) => e.title == 'Dearness Allowance (DA)')[0]?.Priority : false,
          "TAPriority": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Travel Allowance (TA)')[0]?.Priority != false ? this.grossOptions.filter((e: any) => e.title == 'Travel Allowance (TA)')[0]?.Priority : false,
          "MAPriority": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Medical Allowance (MA)')[0]?.Priority != false ? this.grossOptions.filter((e: any) => e.title == 'Medical Allowance (MA)')[0]?.Priority : false,
          "ConveyancePriority": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Conveyance')[0]?.Priority != false ? this.grossOptions.filter((e: any) => e.title == 'Conveyance')[0]?.Priority : false,
          "LTAPriority": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'LTA')[0]?.Priority != false ? this.grossOptions.filter((e: any) => e.title == 'LTA')[0]?.Priority : false,
          "WashingAllowancePriority": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Washing Allowance')[0]?.Priority != false ? this.grossOptions.filter((e: any) => e.title == 'Washing Allowance')[0]?.Priority : false,
          "SpecialAllowancePriority": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Special Allowance')[0]?.Priority != false ? this.grossOptions.filter((e: any) => e.title == 'Special Allowance')[0]?.Priority : false,
          "FuelAllowancePriority": this.grossOptions && this.grossOptions.filter((e: any) => e.title == 'Fuel Allowance')[0]?.Priority != false ? this.grossOptions.filter((e: any) => e.title == 'Fuel Allowance')[0]?.Priority : false,
         

          "ShiftAmount": 0,
          "OtAmount": 0,
          "Incentive": 0,
          "Others": 0
      },
      "CreatedByID": this.UserID.toString()
    }

    if(this.edit == true){
      json['ID'] = this.data.row.ID
    }

    let salaryCalculationJson : any = {
      "EmployeeList":[],
      "DepartmentList":[],
      "BranchList":[],
      "ConfigFields":this.SalaryFormulae.map((sf:any)=>{
        let sfJson:any = {
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
            "isLTA": sf.isLTA,
            "isConveyance": sf.isConveyance,
            "isPSA": sf.isPSA,
            "isFI": sf.isFI,
            "isSA": sf.isSA,
            "isOTA": sf.isOTA,
            "isLMI": sf.isLMI,
            "isPI": sf.isPI,
            "isBonus": sf.isBonus,
            "isAttendanceBonus": sf.isAttendanceBonus,
            "isFuelAllowance": sf.isFuelAllowance,
            "isWashingAllowance": sf.isWashingAllowance,
          "isShiftAmount": false,
          "isOTAmount": false,
          "isIncentive": false,
          "Others": false
        }
        if(sf.ID) sfJson['ID'] = sf.ID
        if(sf.FieldID) sfJson['FieldID'] = sf.FieldID

        return sfJson
      }),
      "CreatedByID": this.UserID.toString()
    }

    if(this.selectedEmployees.length>0){
      json['Employeelist']=this.selectedEmployees.map((e:any)=>e.Value)
      salaryCalculationJson['EmployeeList']=this.selectedEmployees.map((e:any)=>e.Value)
    }else if(this.selectedDepartment.length>0){
      json['DepartmentList']=this.selectedDepartment.map((e:any)=>e.Value)
      salaryCalculationJson['DepartmentList']=this.selectedDepartment.map((e:any)=>e.Value)
    }else if(this.selectedBranch.length>0){
      json['BranchList']=this.selectedBranch.map((e:any)=>e.Value)
      salaryCalculationJson['BranchList']=this.selectedBranch.map((e:any)=>e.Value)
    }
    this.spinnerService.show()
    this.spinnerService.hide()

    console.log({json});        
    
    console.log({salaryCalculationJson});
    this._commonservice.ApiUsingPost("SalaryCalculation/AddSalaryConfiguration",json).subscribe(
      (configResponse) => {
        salaryCalculationJson['ConfigID']= configResponse.ConfigID
        this._commonservice.ApiUsingPost("SalaryCalculation/AddSalaryCalculationConfig",salaryCalculationJson).subscribe(
          (calculateResponse) => {
            console.log(calculateResponse);
            if(this.edit == false)  this.ShowToast("Salary configuration added","success")
              // this.globalToastService.success("Salary configuration added","Success")
            if(this.edit == true)  this.ShowToast("Salary configuration Updated","success")
              // this.globalToastService.success("Salary configuration Updated","Success")
            this.spinnerService.hide();
            this.close()
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


    // -----------------------------------------------------
  // -----------------------------------------------------
  isStepValid(step: number) {
    return this.steps[step] || false;
  }

    validateSteps(step: number) {
      

     
    this.cdr.detectChanges()
    if(step == 0){
      this.steps[0] = this.validateBranch()// && this.validateEmployee()
      console.log(this.steps[0]);
      if(this.steps[0] == true) this.stepper.selectedIndex = 1
      }
    
    else if (step == 1) {
        let go_to_next = this.RequiredValidations();
        let does_it_contain_duplicate = this.DoesItContainDuplicateProrities();
        if (does_it_contain_duplicate) {
            this.ShowToast('Duplicate priorities found. <br/>Priority values must be unique.!', 'warning');
            return;
        }
        else if (go_to_next) {
            this.steps[1] = this.validateEarnings() && this.validateDeductions() && this.validateGross()
            console.log(this.steps[0]);
            if (this.steps[1] == true) {
                this.stepper.selectedIndex = 2
                this.refreshSalaryCalculation()
            }
        } else {
            this.stepper.selectedIndex = 1;
            this.ShowToast('Please Select Atleast Basic Or Basic + DA to proceed !', 'warning');
            return;
        }
      
    }
  }

  goToPreviousStep() {
    this.stepper.previous();
  }

    onSubmit() {
        let does_it_contain_duplicate = this.DoesItContainDuplicateProrities();
        if (does_it_contain_duplicate) {
            this.ShowToast('Duplicate priorities found. <br/>Priority values must be unique.!', 'warning');
            return;
        }

    this.addSalaySetting()
    // console.log('All steps completed!');

  }

  // -----------------------------------------------------
  // -----------------------------------------------------

  validateSalaryFormula(formulaData:any):boolean{
    console.log({formulaData});
    if(!this.tempSalaryTypes.map((tst:any)=>tst.Text).includes(formulaData.type)){
      // this.globalToastService.warning("Please select salary type")
      this.ShowToast("Please select salary type","warning")
      return false
    }
    
    if(formulaData.Percent <=0 && formulaData.isAmount == true){
      // this.globalToastService.warning("Value must be greater than 0")
      this.ShowToast("Value must be greater than 0","warning")
      return false
    }

    //commented by Ashwini
    // if((formulaData.Percent <=0 || formulaData.Percent >100) && formulaData.isPercent == true){
    //   // this.globalToastService.warning("Value must be greater than 0 and less than 100. Percent is selected.")
    //   this.ShowToast("Value must be greater than 0 and less than 100. Percent is selected.","warning")
    //   return false
    // }
    if(!(formulaData.isAmount == true || formulaData.isPercent == true)){
      // this.globalToastService.warning("Please select Amount or Percent")
      this.ShowToast("Please select Amount or Percent","warning")
      return false
    }
    
      if (!(formulaData.isBasic || formulaData.isDA || formulaData.isHRA || formulaData.isMA || formulaData.isTA || formulaData.isBasicAndDA || formulaData.isWashingAllowance || formulaData.isFuelAllowance || formulaData.isSpecialAllowance)){
      // this.globalToastService.warning("Please select Any one of salary type()")
      this.ShowToast("Please select Any one of salary type","warning")
      return false
    }
    
    let validSalaryFormulaes = this.SalaryFormulae.filter((sf:any)=>{
      sf.type == formulaData.type
    })

    let typesalary = this.SalaryFormulae.filter(((sf:any)=>sf.type == formulaData.type))
    let rangeStatus = this.checkRange(formulaData.minAmt,formulaData.maxAmt,typesalary)
    
    if(rangeStatus == false) return false
    return true
  }

    private reset_salary_formula_row() {
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
            isMA: false,
            isConveyance: false,
            isPSA: false,
            isFI: false,
            isSA: false,
            isOTA: false,
            isLMI: false,
            isPI: false,
            isBonus: false,
            isAttendanceBonus: false,
            isFuelAllowance: false,
            isWashingAllowance:false

        }
    }

    addSalaryFormula() {
       
    this.salaryFormulaLoading = true
    this.spinnerService.show()
    this.cdr.detectChanges()
    console.log({salaryFormulaRow:this.salaryFormulaRow});
    
    let formulaData = {
      Index:this.SalaryFormulae.length,
      Percent:this.salaryFormulaRow.Percent,
      isAmount:this.salaryFormulaRow.isAmount ,
      isPercent:this.salaryFormulaRow.isPercent,
      isBasic:this.salaryFormulaRow.isBasic,
      isDA:this.salaryFormulaRow.isDA,
      isHRA:this.salaryFormulaRow.isHRA,
      isMA:this.salaryFormulaRow.isMA,
      isTA: this.salaryFormulaRow.isTA,
      isLTA: this.salaryFormulaRow.isLTA,
        isConveyance: this.salaryFormulaRow.isConveyance,
        isPSA: this.salaryFormulaRow.isPSA,
        isFI: this.salaryFormulaRow.isFI,
        isSA: this.salaryFormulaRow.isSA,
        isOTA: this.salaryFormulaRow.isOTA,
        isLMI: this.salaryFormulaRow.isLMI,
        isPI: this.salaryFormulaRow.isPI,
        isBonus: this.salaryFormulaRow.isBonus,
        isAttendanceBonus: this.salaryFormulaRow.isAttendanceBonus,
        isFuelAllowance: this.salaryFormulaRow.isFuelAllowance,
        isWashingAllowance: this.salaryFormulaRow.isWashingAllowance,
      maxAmt:this.salaryFormulaRow.maxAmt || null,
      minAmt:this.salaryFormulaRow.minAmt || null,
        type: this.salaryFormulaRow.type[0]?.Value,
        isBasicEnabled: this.salaryFormulaRow.isBasic,
        isHRAEnabled: this.salaryFormulaRow.isHRA,
        isDAEnabled: this.salaryFormulaRow.isDA,
        isTAEnabled: this.salaryFormulaRow.isTA,
        isMAEnabled: this.salaryFormulaRow.isMA,
        isLTAEnabled: this.salaryFormulaRow.isLTA,
        isConveyanceEnabled: this.salaryFormulaRow.isConveyance,
        isBasicAndDAEnabled: this.salaryFormulaRow.isBasicAndDA,
        isWashingAllowanceEnabled: this.salaryFormulaRow.isWashingAllowance,
        isFuelAllowanceEnabled: this.salaryFormulaRow.isFuelAllowance,
        isSpecialAllowanceEnabled: this.salaryFormulaRow.isSpecialAllowance,



    }
    if(!this.validateSalaryFormula(formulaData)) {
        this.SalaryFormulae = JSON.parse(JSON.stringify(this.SalaryFormulae))
        this.salaryFormulaLoading = false
        this.spinnerService.hide()
        return
    }


        this.SalaryFormulae.push(formulaData);
        this.reset_salary_formula_row();
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

    if(column === 'isPercent'){
      this.SalaryFormulae[index]['isPercent'] = value
      this.SalaryFormulae[index]['isAmount'] = !value 
    }
    if(column === 'isAmount'){
      this.SalaryFormulae[index]['isPercent'] = !value
      this.SalaryFormulae[index]['isAmount'] = value
    }
    if(column === 'minAmt' && (this.SalaryFormulae[index]['maxAmt'] != null && value > this.SalaryFormulae[index]['maxAmt'] ) ){
      // this.globalToastService.warning("Min Amount cannot be greater than Max Amount")
      this.ShowToast("Min Amount cannot be greater than Max Amount","warning")
      value = null
    }

    if (index != -1) this.SalaryFormulae[index][column] = Number(value);
  }

 checkRange(newMin:any, newMax:any,a:any):boolean{
    newMin = newMin === null ? -Infinity : newMin;
    newMax = newMax === null ? Infinity : newMax;
  
    for (let i = 0; i < a.length; i++) {
      let existingMin = a[i].minAmt === null ? -Infinity : a[i].minAmt;
      // let existingMax = a[i].maxAmt === null ? Infinity : a[i].maxAmt;
      let existingMax = a[i].maxAmt === null || a[i].maxAmt === 0 ? Infinity : a[i].maxAmt;
if(a[i].minAmt<0){
  // this.globalToastService.warning("Please Enter Minimum amount");
  this.ShowToast("Please Enter Minimum amount","warning")
  return false;
}
if(a[i].maxAmt<0){
  // this.globalToastService.warning("Please Enter Maxmimum amount");
  this.ShowToast("Please Enter Maxmimum amount","warning")
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
        this.ShowToast("Minimum value or Maximum Range Already Exists for the Salary Type","warning")
        return false;
      }
      //mohit code ends here -----------------------------


    }
    // this.globalToastService.success("Added")
    this.ShowToast("Added","success")
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
  deleteSalaryFormula(row:any){
    let index = this.SalaryFormulae.findIndex((e: any) => e.Index === row.Index)
    if (index > -1) {
      this.salaryFormulaLoading = true
      this.SalaryFormulae.splice(index, 1);
      this.SalaryFormulae = JSON.parse(JSON.stringify(this.SalaryFormulae))
      this.salaryFormulaLoading = false
    }
  }


  refreshSalaryCalculation(){
    
    this.salaryFormulaLoading = true

    this.displayedColumns = this.originalDisplayedColumns.filter((odc:any)=>{
        if (odc == "isBasic" && !this.checkEarningsStatus('Basic')) return false
        else if (odc == "isBasicAndDA" && !this.checkEarningsStatus('Basic + DA')) return false

      else if(odc == "isHRA" && !this.checkEarningsStatus('House Rent Allowance (HRA)')) return false
      else if(odc == "isDA" && !this.checkEarningsStatus('Dearness Allowance (DA)')) return false
      else if(odc == "isTA" && !this.checkEarningsStatus('Travel Allowance (TA)')) return false
      else if (odc == "isMA" && !this.checkEarningsStatus('Medical Allowance (MA)')) return false
      else if (odc == "isConveyance" && !this.checkEarningsStatus('Conveyance')) return false
      else if (odc == "isLTA" && !this.checkEarningsStatus('LTA')) return false
      else if (odc == "isOther" && !this.checkEarningsStatus('Others')) return false
      else if (odc == "isPSA" && !this.checkEarningsStatus('PSA')) return false
      else if (odc == "isFI" && !this.checkEarningsStatus('FI')) return false
      else if (odc == "isSA" && !this.checkEarningsStatus('Shift Amount')) return false
      else if (odc == "isOTA" && !this.checkEarningsStatus('OT Amount')) return false
      else if (odc == "isLMI" && !this.checkEarningsStatus('Last Month Incentive')) return false
      else if (odc == "isPI" && !this.checkEarningsStatus('Performance Incentive')) return false
      else if (odc == "isBonus" && !this.checkEarningsStatus('Bonus')) return false
      else if (odc == "isAttendanceBonus" && !this.checkEarningsStatus('Attendance Bonus')) return false
      else if (odc == "isFuelAllowance" && !this.checkEarningsStatus('Fuel Allowance')) return false
        else if (odc == "isWashingAllowance" && !this.checkEarningsStatus('Washing Allowance')) return false
    
      return true
    })
    console.log(this.displayedColumns);
    console.log({displayedColumns:this.displayedColumns});
      if (this.edit != true) {
          this.SalaryFormulae = [
              {
                  "Index": 0,
                  "Percent": 0.75,
                  "isAmount": null,
                  "isPercent": true,
                  "isBasic": true && this.checkEarningsStatus('Basic'),
                  "isBasicAndDA": false && this.checkEarningsStatus("Basic + DA"),
                  "isDA": true && this.checkEarningsStatus('Dearness Allowance (DA)'),
                  "isHRA": false && this.checkEarningsStatus('House Rent Allowance (HRA)'),
                  "isMA": false && this.checkEarningsStatus('Medical Allowance (MA)'),
                  "isTA": true && this.checkEarningsStatus('Travel Allowance (TA)'),
                  "isLTA": false && this.checkEarningsStatus("LTA"),
                  "isConveyance": false && this.checkEarningsStatus("Conveyance"),

                  "isPSA": false && this.checkEarningsStatus("PSA"),
                  "isFI": false && this.checkEarningsStatus("FI"),
                  "isSA": false && this.checkEarningsStatus("Shift Amount"),
                  "isOTA": false && this.checkEarningsStatus("OT Amount"),
                  "isLMI": false && this.checkEarningsStatus("Last Month Incentive"),
                  "isPI": false && this.checkEarningsStatus("Performance Incentive"),
                  "isBonus": false && this.checkEarningsStatus("Bonus"),
                  "isAttendanceBonus": false && this.checkEarningsStatus("Attendance Bonus"),
                  "isFuelAllowance": false && this.checkEarningsStatus("Fuel Allowance"),
                  "isWashingAllowance": false && this.checkEarningsStatus("Washing Allowance"),
                  "isOther": false && this.checkEarningsStatus("Others"),

                
                  "isSpecialAllowance": false && this.checkEarningsStatus("Special Allowance"),



                  "maxAmt": 21000,
                  "minAmt": null,
                  "type": "ESI",
                  "isBasicEnabled": this.checkEarningsStatus('Basic'),
                  "isDAEnabled": this.checkEarningsStatus('Dearness Allowance (DA)'),
                  "isHRAEnabled": this.checkEarningsStatus('House Rent Allowance (HRA)'),
                  "isMAEnabled": this.checkEarningsStatus('Medical Allowance (MA)'),
                  "isTAEnabled": this.checkEarningsStatus('Travel Allowance (TA)'),
                  "isLTAEnabled": this.checkEarningsStatus("LTA"),
                  "isConveyanceEnabled": this.checkEarningsStatus("Conveyance"),

                  "isPSAEnabled": this.checkEarningsStatus("PSA"),
                  "isFIEnabled":  this.checkEarningsStatus("FI"),
                  "isSAEnabled": this.checkEarningsStatus("Shift Amount"),
                  "isOTAEnabled": this.checkEarningsStatus("OT Amount"),
                  "isLMIEnabled":  this.checkEarningsStatus("Last Month Incentive"),
                  "isPIEnabled":  this.checkEarningsStatus("Performance Incentive"),
                  "isBonusEnabled":  this.checkEarningsStatus("Bonus"),
                  "isAttendanceBonusEnabled": this.checkEarningsStatus("Attendance Bonus"),
               
                  "isOtherEnabled": this.checkEarningsStatus("Others"),

                  "isBasicAndDAEnabled": this.checkEarningsStatus("Basic + DA"),
                  "isSpecialAllowanceEnabled": this.checkEarningsStatus("Special Allowance"),
                  "isFuelAllowanceEnabled": this.checkEarningsStatus("Fuel Allowance"),
                  "isWashingAllowanceEnabled": this.checkEarningsStatus("Washing Allowance"),

              },
              {
                  "Index": 1,
                  "Percent": 1800,
                  "isAmount": true,
                  "isPercent": null,
                  "isBasic": true && this.checkEarningsStatus('Basic'),
                  "isBasicAndDA": false && this.checkEarningsStatus("Basic + DA"),
                  "isDA": true && this.checkEarningsStatus('Dearness Allowance (DA)'),
                  "isHRA": false && this.checkEarningsStatus('House Rent Allowance (HRA)'),
                  "isMA": false && this.checkEarningsStatus('Medical Allowance (MA)'),
                  "isTA": false && this.checkEarningsStatus('Travel Allowance (TA)'),
                  "isLTA": false && this.checkEarningsStatus("LTA"),

                  "isConveyance": false && this.checkEarningsStatus("Conveyance"),
                  "isPSA": false && this.checkEarningsStatus("PSA"),
                  "isFI": false && this.checkEarningsStatus("FI"),
                  "isSA": false && this.checkEarningsStatus("Shift Amount"),
                  "isOTA": false && this.checkEarningsStatus("OT Amount"),
                  "isLMI": false && this.checkEarningsStatus("Last Month Incentive"),
                  "isPI": false && this.checkEarningsStatus("Performance Incentive"),
                  "isBonus": false && this.checkEarningsStatus("Bonus"),
                  "isAttendanceBonus": this.checkEarningsStatus("Attendance Bonus"),
                  "isFuelAllowance": false && this.checkEarningsStatus("Fuel Allowance"),
                  "isWashingAllowance": false && this.checkEarningsStatus("Washing Allowance"),
                  "isSpecialAllowance": false && this.checkEarningsStatus("Special Allowance"),
          
                

                  "isOther": false && this.checkEarningsStatus("Others"),
                  "maxAmt": null,
                  "minAmt": 15000,
                  "type": "PF",
                  "isBasicEnabled": this.checkEarningsStatus('Basic'),
                  "isDAEnabled": this.checkEarningsStatus('Dearness Allowance (DA)'),
                  "isHRAEnabled": this.checkEarningsStatus('House Rent Allowance (HRA)'),
                  "isMAEnabled": this.checkEarningsStatus('Medical Allowance (MA)'),
                  "isTAEnabled": this.checkEarningsStatus('Travel Allowance (TA)'),
                  "isLTAEnabled": this.checkEarningsStatus("LTA"),
                  "isConveyanceEnabled": this.checkEarningsStatus("Conveyance"),
                  "isOtherEnabled": this.checkEarningsStatus("Others"),
                  "isPSAEnabled": this.checkEarningsStatus("PSA"),
                  "isFIEnabled": this.checkEarningsStatus("FI"),
                  "isSAEnabled": this.checkEarningsStatus("Shift Amount"),
                  "isOTAEnabled": this.checkEarningsStatus("OT Amount"),
                  "isLMIEnabled": this.checkEarningsStatus("Last Month Incentive"),
                  "isPIEnabled": this.checkEarningsStatus("Performance Incentive"),
                  "isBonusEnabled": this.checkEarningsStatus("Bonus"),
                  "isAttendanceBonusEnabled": this.checkEarningsStatus("Attendance Bonus"),
                  "isFuelAllowanceEnabled": this.checkEarningsStatus("Fuel Allowance"),
                  "isWashingAllowanceEnabled": this.checkEarningsStatus("Washing Allowance"),
                  "isBasicAndDAEnabled": this.checkEarningsStatus("Basic + DA"),
                  "isSpecialAllowanceEnabled": this.checkEarningsStatus("Special Allowance"),




              },
              {
                  "Index": 2,
                  "Percent": 12,
                  "isAmount": null,
                  "isPercent": true,
                  "isBasic": true && this.checkEarningsStatus('Basic'),
                  "isDA": true && this.checkEarningsStatus('Dearness Allowance (DA)'),
                  "isHRA": false && this.checkEarningsStatus('House Rent Allowance (HRA)'),
                  "isMA": false && this.checkEarningsStatus('Medical Allowance (MA)'),
                  "isTA": false && this.checkEarningsStatus('Travel Allowance (TA)'),
                  "isLTA": false && this.checkEarningsStatus("LTA"),
                  "isConveyance": false && this.checkEarningsStatus("Conveyance"),
                  "isPSA": false && this.checkEarningsStatus("PSA"),
                  "isFI": false && this.checkEarningsStatus("FI"),
                  "isSA": false && this.checkEarningsStatus("Shift Amount"),
                  "isOTA": false && this.checkEarningsStatus("OT Amount"),
                  "isLMI": false && this.checkEarningsStatus("Last Month Incentive"),
                  "isPI": false && this.checkEarningsStatus("Performance Incentive"),
                  "isBonus": false && this.checkEarningsStatus("Bonus"),
                  "isAttendanceBonus": this.checkEarningsStatus("Attendance Bonus"),
                  "isFuelAllowance": false && this.checkEarningsStatus("Fuel Allowance"),
                  "isWashingAllowance": false && this.checkEarningsStatus("Washing Allowance"),
                  "isBasicAndDA": false && this.checkEarningsStatus("Basic + DA"),
                  "isSpecialAllowance": false && this.checkEarningsStatus("Special Allowance"),
                  "isOther": false && this.checkEarningsStatus("Others"),
                  "maxAmt": 14999,
                  "minAmt": null,
                  "type": "PF",
                  "isBasicEnabled": this.checkEarningsStatus('Basic'),
                  "isDAEnabled": this.checkEarningsStatus('Dearness Allowance (DA)'),
                  "isHRAEnabled": this.checkEarningsStatus('House Rent Allowance (HRA)'),
                  "isMAEnabled": this.checkEarningsStatus('Medical Allowance (MA)'),
                  "isTAEnabled": this.checkEarningsStatus('Travel Allowance (TA)'),
                  "isLTAEnabled": this.checkEarningsStatus("LTA"),
                  "isConveyanceEnabled": this.checkEarningsStatus("Conveyance"),
                  "isOtherEnabled": this.checkEarningsStatus("Others"),
                  "isPSAEnabled": this.checkEarningsStatus("PSA"),
                  "isFIEnabled": this.checkEarningsStatus("FI"),
                  "isSAEnabled": this.checkEarningsStatus("Shift Amount"),
                  "isOTAEnabled": this.checkEarningsStatus("OT Amount"),
                  "isLMIEnabled": this.checkEarningsStatus("Last Month Incentive"),
                  "isPIEnabled": this.checkEarningsStatus("Performance Incentive"),
                  "isBonusEnabled": this.checkEarningsStatus("Bonus"),
                  "isAttendanceBonusEnabled": this.checkEarningsStatus("Attendance Bonus"),
                  "isFuelAllowanceEnabled": this.checkEarningsStatus("Fuel Allowance"),
                  "isWashingAllowanceEnabled": this.checkEarningsStatus("Washing Allowance"),
                  "isBasicAndDAEnabled": this.checkEarningsStatus("Basic + DA"),
                  "isSpecialAllowanceEnabled": this.checkEarningsStatus("Special Allowance"),



               
              },
              {
                  "Index": 3,
                  "Percent": 200,
                  "isAmount": true,
                  "isPercent": null,
                  "isBasic": true && this.checkEarningsStatus('Basic'),
                  "isDA": false && this.checkEarningsStatus('Dearness Allowance (DA)'),
                  "isHRA": false && this.checkEarningsStatus('House Rent Allowance (HRA)'),
                  "isMA": false && this.checkEarningsStatus('Medical Allowance (MA)'),
                  "isTA": false && this.checkEarningsStatus('Travel Allowance (TA)'),
                  "isLTA": false && this.checkEarningsStatus("LTA"),
                  "isConveyance": false && this.checkEarningsStatus("Conveyance"),
                  "isPSA": false && this.checkEarningsStatus("PSA"),
                  "isFI": false && this.checkEarningsStatus("FI"),
                  "isSA": false && this.checkEarningsStatus("Shift Amount"),
                  "isOTA": false && this.checkEarningsStatus("OT Amount"),
                  "isLMI": false && this.checkEarningsStatus("Last Month Incentive"),
                  "isPI": false && this.checkEarningsStatus("Performance Incentive"),
                  "isBonus": false && this.checkEarningsStatus("Bonus"),
                  "isAttendanceBonus": this.checkEarningsStatus("Attendance Bonus"),
                  "isFuelAllowance": false && this.checkEarningsStatus("Fuel Allowance"),
                  "isWashingAllowance": false && this.checkEarningsStatus("Washing Allowance"),
                  "isBasicAndDA": false && this.checkEarningsStatus("Basic + DA"),
                  "isSpecialAllowance": false && this.checkEarningsStatus("Special Allowance"),
                  "isOther": false && this.checkEarningsStatus("Others"),
                  "maxAmt": null,
                  "minAmt": 25000,
                  "type": "PT",
                  "isBasicEnabled": this.checkEarningsStatus('Basic'),
                  "isDAEnabled": this.checkEarningsStatus('Dearness Allowance (DA)'),
                  "isHRAEnabled": this.checkEarningsStatus('House Rent Allowance (HRA)'),
                  "isMAEnabled": this.checkEarningsStatus('Medical Allowance (MA)'),
                  "isTAEnabled": this.checkEarningsStatus('Travel Allowance (TA)'),
                  "isLTAEnabled": this.checkEarningsStatus("LTA"),
                  "isConveyanceEnabled": this.checkEarningsStatus("Conveyance"),
                  "isOtherEnabled": this.checkEarningsStatus("Others"),
                  "isPSAEnabled": this.checkEarningsStatus("PSA"),
                  "isFIEnabled": this.checkEarningsStatus("FI"),
                  "isSAEnabled": this.checkEarningsStatus("Shift Amount"),
                  "isOTAEnabled": this.checkEarningsStatus("OT Amount"),
                  "isLMIEnabled": this.checkEarningsStatus("Last Month Incentive"),
                  "isPIEnabled": this.checkEarningsStatus("Performance Incentive"),
                  "isBonusEnabled": this.checkEarningsStatus("Bonus"),
                  "isAttendanceBonusEnabled": this.checkEarningsStatus("Attendance Bonus"),
                  "isFuelAllowanceEnabled": this.checkEarningsStatus("Fuel Allowance"),
                  "isWashingAllowanceEnabled": this.checkEarningsStatus("Washing Allowance"),
                  "isBasicAndDAEnabled": this.checkEarningsStatus("Basic + DA"),
                  "isSpecialAllowanceEnabled": this.checkEarningsStatus("Special Allowance"),

                 
              }
          ]
      } else {
          this.loadSalaryFormula();
      }
    this.salaryFormulaLoading = false
    }

    loadSalaryFormula() {
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
                                "isLTA": cf.isLTA,
                                "isConveyance": cf.isConveyance,
                                "isPSA": cf.isPSA,
                                "isFI": cf.isFI,
                                "isSA": cf.isSA,
                                "isOTA": cf.isOTA,
                                "isLMI": cf.isLMI,
                                "isPI": cf.isPI,
                                "isBonus": cf.isBonus,
                                "isAttendanceBonus": cf.isAttendanceBonus,
                                "isFuelAllowance": cf.isFuelAllowance,
                                "isWashingAllowance": cf.isWashingAllowance,
                                "isSpecialAllowance": cf.isSpecialAllowance,
                                "isBasicAndDA": cf.isBasicAndDA,
                                "maxAmt": cf.Max,
                                "minAmt": cf.Min,
                                "type": cf.SalaryType,
                                "isBasicEnabled": this.checkEarningsStatus('Basic'),
                                "isDAEnabled": this.checkEarningsStatus('Dearness Allowance (DA)'),
                                "isHRAEnabled": this.checkEarningsStatus('House Rent Allowance (HRA)'),
                                "isMAEnabled": this.checkEarningsStatus('Medical Allowance (MA)'),
                                "isTAEnabled": this.checkEarningsStatus('Travel Allowance (TA)'),
                                "isLTAEnabled": this.checkEarningsStatus('LTA'),
                                "isConveyanceEnabled": this.checkEarningsStatus('Conveyance'),
                                "isPSAEnabled": this.checkEarningsStatus('PSA'),
                                "isFIEnabled": this.checkEarningsStatus('FI'),
                                "isSAEnabled": this.checkEarningsStatus('Shift Amount'),
                                "isOTAEnabled": this.checkEarningsStatus('OT Amount'),
                                "isLMIEnabled": this.checkEarningsStatus('Last Month Incentive'),
                                "isPIEnabled": this.checkEarningsStatus('Performance Incentive'),
                                "isBonusEnabled": this.checkEarningsStatus('Bonus'),
                                "isAttendanceBonusEnabled": this.checkEarningsStatus("Attendance Bonus"),
                                "isFuelAllowanceEnabled": this.checkEarningsStatus("Fuel Allowance"),
                                "isWashingAllowanceEnabled": this.checkEarningsStatus("Washing Allowance"),
                                "isSpecialAllowanceEnabled": this.checkEarningsStatus("Special Allowance"),
                                "isBasicAndDAEnabled": this.checkEarningsStatus("Basic + DA"),
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
   

    loadValuesEdit() {
      
    if(this.data.row){
        console.log(this.data.row);
        this.data.row.Basic = this.data.row.Basic.toString().replace('%', '').replace('₹','');
        this.data.row.HRA = this.data.row.HRA.toString().replace('%', '').replace('₹', '');
        this.data.row.DA = this.data.row.DA.toString().replace('%', '').replace('₹', '');
        this.data.row.TA = this.data.row.TA.toString().replace('%', '').replace('₹', '');
        this.data.row.MA = this.data.row.MA.toString().replace('%', '').replace('₹', '');
        this.data.row.LTA = this.data.row.LTA.toString().replace('%', '').replace('₹', '');
        this.data.row.Conveyance = this.data.row.Conveyance.toString().replace('%', '').replace('₹', '');
        this.data.row.BasicAndDA = this.data.row.BasicAndDA.toString().replace('%', '').replace('₹', '');
        this.data.row.WashingAllowance = this.data.row.WashingAllowance.toString().replace('%', '').replace('₹', '');
        this.data.row.FuelAllowance = this.data.row.FuelAllowance.toString().replace('%', '').replace('₹', '');
        this.data.row.SpecialAllowance = this.data.row.SpecialAllowance.toString().replace('%', '').replace('₹', '');


      this.earnings.subtasks?.map((s:any)=>{
        if(s.name == 'Basic'){ 
          s.completed = this.data.row.isBasic
        }
        if(s.name == 'House Rent Allowance (HRA)'){ 
          s.completed = this.data.row.isHRA
        }
        if(s.name == 'Dearness Allowance (DA)'){ 
          s.completed = this.data.row.isDA
        }
        if(s.name == 'Travel Allowance (TA)'){ 
          s.completed = this.data.row.isTA
        }
        if(s.name == 'Medical Allowance (MA)'){ 
          s.completed = this.data.row.isMA
        }
        if(s.name == 'Shift Amount'){ 
            s.completed = this.data.row.isShiftAmount
        }
        if(s.name == 'OverTime (OT) Amount'){ 
          s.completed = this.data.row.isOTAmount
        }
        if(s.name == 'Incentive'){ 
          s.completed = this.data.row.isIncentive
        }
        if(s.name == 'Others'){ 
          s.completed = this.data.row.isEarningsOthers
          }
          if (s.name == 'Conveyance') {
              s.completed = this.data.row.isConveyance
          }
          if (s.name == 'LTA') {
              s.completed = this.data.row.isLTA
          }
          if (s.name == 'PSA') {
              s.completed = this.data.row.isPSA
          }
          if (s.name == 'FI') {
              s.completed = this.data.row.isFixedIncentive
          }
        
          if (s.name == 'OT Amount') {
              s.completed = this.data.row.isOTAmount
          }
          if (s.name == 'Last Month Incentive') {
              s.completed = this.data.row.isLastMonthIncentive
          }
          if (s.name == 'Performance Incentive') {
              s.completed = this.data.row.isPerformanceIncentive
          }
          if (s.name == 'Bonus') {
              s.completed = this.data.row.isBonus
          }
          if (s.name == 'Attendance Bonus') {
              s.completed = this.data.row.isAttendanceBonus
          }
          if (s.name == 'Washing Allowance') {
              s.completed = this.data.row.isWashingAllowance
             
          }
          if (s.name == 'Fuel Allowance') {
              s.completed = this.data.row.isFuelAllowance
          }
          if (s.name == 'Special Allowance') {
              s.completed = this.data.row.isSpecialAllowance
          }
          if (s.name == 'Basic + DA') {
              s.completed = this.data.row.isBasicAndDA
          }


        return s
      })
        console.log(this.earnings);



      this.deductions.subtasks?.map((s:any)=>{
        if(s.name == 'Employees State Insurance (ESI)'){ 
          s.completed = this.data.row.isESI
        }
        if(s.name == 'Provident Fund (PF)'){ 
          s.completed = this.data.row.isPF
        }
        if(s.name == 'Professional Tax (PT)'){ 
          s.completed = this.data.row.isPT
        }
        if(s.name == 'Others'){ 
          s.completed = this.data.row.isDeductionOthers
        }
        if(s.name == 'Penalty'){ 
          s.completed = this.data.row.ispenalty
        }
        if(s.name == 'TDS'){ 
          s.completed = this.data.row.isTDS
          }
          if (s.name == 'Deduction') {
              s.completed = this.data.row.isDeductions
          }

          if (s.name == 'Security Deposit') {
              s.completed = this.data.row.isSD
          }

          if (s.name == 'Penalty points') {
              s.completed = this.data.row.isFinePoints
          }
        return s
      })

      console.log(this.deductions);
      this.grossOptions.map((go:any)=>{
        if(go.title == "Basic"){
            go.value = this.data.row.Basic;
            go.status = !!this.data.row.isBasic;
            go.isAmount = !!this.data.row.isBasicAmount;
            go.Priority = this.data.row.BasicPriority;


        }
        if(go.title == "House Rent Allowance (HRA)"){
            go.value = this.data.row.HRA;
            go.status = !!this.data.row.isHRA;
            go.isAmount = !!this.data.row.isHRAAmount;
            go.Priority = this.data.row.HRAPriority;
        }
        if(go.title == "Dearness Allowance (DA)"){
            go.value = this.data.row.DA;
            go.status = !!this.data.row.isDA;
            go.isAmount = !!this.data.row.isDAAmount;
            go.Priority = this.data.row.DAPriority;


        }
        if(go.title == "Travel Allowance (TA)"){
            go.value = this.data.row.TA;
            go.status = !!this.data.row.isTA;
            go.isAmount = !!this.data.row.isTAAmount;
            go.Priority = this.data.row.TAPriority;

        }
        if(go.title == "Medical Allowance (MA)"){
            go.value = this.data.row.MA;
            go.status = !!this.data.row.isMA;
            go.isAmount = !!this.data.row.isMAAmount;
            go.Priority = this.data.row.MAPriority;

        }
          if (go.title == "Conveyance") {
              go.value = this.data.row.Conveyance;
              go.status = !!this.data.row.isConveyance;
              go.isAmount = !!this.data.row.isConveyanceAmount;
              go.Priority = this.data.row.ConveyancePriority;

          }
          if (go.title == "LTA") {
              go.value = this.data.row.LTA;
              go.status = !!this.data.row.isLTA;
              go.isAmount = !!this.data.row.isLTAAmount;
              go.Priority = this.data.row.LTAPriority;

          }
          if (go.title == "Basic + DA") {
              go.value = this.data.row.BasicAndDA;
              go.status = !!this.data.row.isBasicAndDA;
              go.isAmount = !!this.data.row.isBasicAndDAAmount;
              go.Priority = this.data.row.BasicAndDAPriority;

          }

          if (go.title == "Washing Allowance") {
              go.value = this.data.row.WashingAllowance;
              go.status = !!this.data.row.isWashingAllowance;
              go.isAmount = !!this.data.row.isWashingAllowanceAmount;
              go.Priority = this.data.row.WashingAllowancePriority;

          }

          if (go.title == "Fuel Allowance") {
              go.value = this.data.row.FuelAllowance;
              go.status = !!this.data.row.isFuelAllowance;
              go.isAmount = !!this.data.row.isFuelAllownceAmount;
              go.Priority = this.data.row.FuelAllowancePriority;

          }
          if (go.title == "Special Allowance") {
              go.value = this.data.row.SpecialAllowance;
              go.status = !!this.data.row.isSpecialAllowance;
              go.isAmount = !!this.data.row.isSpecialAllowanceAmount;
              go.Priority = this.data.row.SpecialAllowancePriority;

          }
        return go
      }) 
        console.log("gross options data");
        console.log(this.grossOptions);
      this.selectedBranch = this.data.row.Branch?.map((b:any)=> {return {"Value":b.ID,"Text":b.Name}})
      this.selectedDepartment = this.data.row.Department?.map((d:any)=> {return {"Value":d.ID,"Text":d.Name}})
      this.selectedEmployees = this.data.row.Employee?.map((e:any)=> {return {"Value":e.ID,"Text":e.Name}})
      this.GetBranches()
      
      let json = {
        Employeelist: this.selectedEmployees.map((e) => e.Value) || [],
        BranchList: this.selectedBranch.map((e) => e.Value) || [],
        DepartmentList: this.selectedDepartment.map((e) => e.Value) || [],
      };
  
      if(json.Employeelist.length > 0 || json.BranchList.length > 0 || json.DepartmentList.length > 0){
        this._commonservice
        .ApiUsingGetWithOneParam("SalaryCalculation/getcalculationonfieldID?Fieldid="+this.data.row.ID)
        .subscribe(
          (calData) => {
            console.log({calData});
            this.SalaryFormulae = calData.calculations?.map((cf:any)=>{
              return {
                "Percent": cf.Value,
                "isAmount": cf.isAmount,
                "isPercent": !cf.isAmount,
                "isBasic":cf.isBasic,
                "isDA":cf.isDA,
                "isHRA":cf.isHRA,
                "isMA":cf.isMA,
                "isTA": cf.isTA,
                "isLTA": cf.isLTA,
                  "isConveyance": cf.isConveyance,
                  "isPSA": cf.isPSA,
                  "isFI": cf.isFI,
                  "isSA": cf.isSA,
                  "isOTA": cf.isOTA,
                  "isLMI": cf.isLMI,
                  "isPI": cf.isPI,
                  "isBonus": cf.isBonus,
                  "isAttendanceBonus": cf.isAttendanceBonus,
                  "isFuelAllowance": cf.isFuelAllowance,
                  "isWashingAllowance": cf.isWashingAllowance,
                  "isSpecialAllowance": cf.isSpecialAllowance,
                  "isBasicAndDA": cf.isBasicAndDA,

                "maxAmt": cf.Max,
                "minAmt": cf.Min,
                "type": cf.SalaryType,
                "isBasicEnabled": this.checkEarningsStatus('Basic'),
                "isDAEnabled": this.checkEarningsStatus('Dearness Allowance (DA)'),
                "isHRAEnabled": this.checkEarningsStatus('House Rent Allowance (HRA)'),
                "isMAEnabled": this.checkEarningsStatus('Medical Allowance (MA)'),
                  "isTAEnabled": this.checkEarningsStatus('Travel Allowance (TA)'),
                  "isLTAEnabled": this.checkEarningsStatus('LTA'),
                  "isConveyanceEnabled": this.checkEarningsStatus('Conveyance'),

                  "isPSAEnabled": this.checkEarningsStatus('PSA'),
                  "isFIEnabled": this.checkEarningsStatus('FI'),
                  "isSAEnabled": this.checkEarningsStatus('Shift Amount'),
                  "isOTAEnabled": this.checkEarningsStatus('OT Amount'),
                  "isLMIEnabled": this.checkEarningsStatus('Last Month Incentive'),
                  "isPIEnabled": this.checkEarningsStatus('Performance Incentive'),
                  "isBonusEnabled": this.checkEarningsStatus('Bonus'),
                  "isAttendanceBonusEnabled": this.checkEarningsStatus('Attendance Bonus'),
                  "isFuelAllowanceEnabled": this.checkEarningsStatus("Fuel Allowance"),
                  "isWashingAllowanceEnabled": this.checkEarningsStatus("Washing Allowance"),

                  "isBasicAndDAEnabled": this.checkEarningsStatus("Basic + DA"),
                  "isSpecialAllowanceEnabled": this.checkEarningsStatus("Special Allowance"),

                FieldID:cf.FieldID,
                ID:cf.ID
              }
            }
                )
           
            this.spinnerService.hide();
                this.salaryFormulaLoading = false;
                console.log("SalaryFormula");
                console.log(this.SalaryFormulae);
          },
          (error) => {
            this.spinnerService.hide();
            this.salaryFormulaLoading = false;
            // this.globalToastService.error(error.message);
            this.ShowToast(error.message,"error")
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


    // dyanmic salary settings

    private load_salary_components() {
        let api_url = "Salary/GetGrossComponents?OrgID=" + this.OrgID + "";
        this._commonservice.GetWithOneParam(api_url)
        .subscribe({
            next: (result) => {
                if (result.Status) {
                    this.salary_component_list = result.ComponentList;
                    this.salary_earnings_list =  result.ComponentList.filter((i:any) => i.Type == "Earnings");
                    this.salary_deduction_list = result.ComponentList.filter((i: any) => i.Type == "Deduction");
                }
            },
            error: (error) => {
                if (error instanceof Error) {
                    this.ShowToast(error.message,'error');
                } else {
                    this.ShowToast("unexcepted error==>" + error, 'error');
                }
            }
        });

    }
   
}
