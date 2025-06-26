import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpCommonService } from "src/app/services/httpcommon.service";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonTableComponent } from "../common-table/common-table.component";
import { ShowalertComponent } from "../create-employee/showalert/showalert.component";
import { MatDialog } from "@angular/material/dialog";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-emp-salary-config",
  templateUrl: "./emp-salary-config.component.html",
  styleUrls: ["./emp-salary-config.component.css"],
})
export class EmpSalaryConfigComponent implements OnInit {
  
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
  BranchList: any
  DepartmentList: any
  EmployeeList:any
  SelectedBranches: any
  SelectedDepartments:any
  temparray: any
  tempdeparray:any
  AdminID: any
  UserID:any
  OrgID:any
  selectedBranch:any[]=[]
  Columns: any[]=[]
  ApiURL:any
  displayColumns:any
  displayedColumns:any
  editableColumns:any
  actionOptions:any
  topHeaders:any
  employeeLoading:any;  
  selectedRows:any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  headerColors:any
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  employeeSettings:IDropdownSettings = {}
  EmployeeListFilter:any[]=[]
  SelectedEmployees:any[]=[]
  selectedFile: File | null = null;
  constructor(private _commonservice: HttpCommonService,private globalToastService:ToastrService,private spinnerService: NgxSpinnerService,private cdr: ChangeDetectorRef,private dialog:MatDialog) {
    this.BranchList = []
    this.DepartmentList = []
    this.EmployeeList = []
    this.temparray = []
    this.tempdeparray = []
    this.actionOptions = []
    this.selectedRows = []

    this.employeeSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.headerColors ={
      Deductions : {text:"#ff2d2d",bg:"#fff1f1"},
      // TDS : {text:"#ff2d2d",bg:"#fff1f1"},
      TotalDeduction : {text:"#ff2d2d",bg:"#fff1f1"},
      leaveDeduction : {text:"#ff2d2d",bg:"#fff1f1"},
      LoanDeduction : {text:"#ff2d2d",bg:"#fff1f1"},
      AdvanceDeduction : {text:"#ff2d2d",bg:"#fff1f1"},
      ESI : {text:"#ff2d2d",bg:"#fff1f1"},
      PF : {text:"#ff2d2d",bg:"#fff1f1"},
      PT : {text:"#ff2d2d",bg:"#fff1f1"},
      Earnings : {text:"#00a927",bg:"#daffe2"},
      HRA : {text:"#00a927",bg:"#daffe2"},
      BasicSalary : {text:"#00a927",bg:"#daffe2"},
       BasicAndDA : {text:"#00a927",bg:"#daffe2"},
      TA : {text:"#00a927",bg:"#daffe2"},
      FI : {text:"#00a927",bg:"#daffe2"},
      PSA : {text:"#00a927",bg:"#daffe2"},
      DA : {text:"#00a927",bg:"#daffe2"},
      MA : {text:"#00a927",bg:"#daffe2"},
       LTA : {text:"#00a927",bg:"#daffe2"},
        Conveyance : {text:"#00a927",bg:"#daffe2"},
          WA : {text:"#00a927",bg:"#daffe2"},
            FA : {text:"#00a927",bg:"#daffe2"},
              SA : {text:"#00a927",bg:"#daffe2"},
      TotalEarnings : {text:"#00a927",bg:"#daffe2"},
      Incentive : {text:"#00a927",bg:"#daffe2"},
      ShiftAmount : {text:"#00a927",bg:"#daffe2"},
      "Basic" : {text:"#00a927",bg:"#daffe2"},
      "Gross" : {text:"#00a927",bg:"#daffe2"},
    }

    
    this.topHeaders = [
      {
        id:"blank1",
        name:"",
        colspan:7
      },
      {
        id:"Gross Earnings",
        name:"Earnings",
        colspan:12
      },
      {
        id:"Other Earnings",
        name:"Earnings",
        colspan:2
      },
      {
        id:"Deductions",
        name:"Deductions",
        colspan:2
      }
      ,{
        id:"Leave",
        name:"Leave",
        colspan:2
      }
      ,{
        id:"blank2",
        name:"",
        colspan:2
      },
    ]

    this.branchSettings = {
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
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.actionOptions = [
      {
        name: "Submit Salary Configuration",
        icon: "fa fa-money",
        filter: [
          
        ],
      },
    ];
    
    this.displayColumns= {
      SelectAll: "SelectAll",
      "SLno": "SL No",
      "MappedEmpId": "Emp ID",
      "EmployeeName": "Employee Name",
      "Branch": "Branch",
      "Department": "Department",
      "IsPerDay": "Is Per Day",    
      "Gross": "Gross",
       "BasicAndDA":"Basic+DA",
      "Basic": "Basic",  
       "DA": "DA",   
      "HRA": "HRA",
     
      "MA": "MA",
      "TA": "TA"  ,
      "LTA": "LTA",
      "Conveyance" : "Conveyance",
      "WA" : "WA",
      "FA" : "FA",
      "SA": "SA",
      "FI":"Fixed Incentive", 
      "PSA":"PSA",
      "ESI": "ESI",
      "PF": "PF",
      "PaidLeave": "Paid Leave",
      "SickLeave":  "Sick Leave"
    },

    this.displayedColumns= [
      "SelectAll",
      "SLno",
      "MappedEmpId",
      "EmployeeName",
      "Branch",
      "Department",
      "IsPerDay",   
      "Gross",
      "BasicAndDA",
      "Basic",
        "DA",
      "HRA",    
      "MA",
      "TA",
      "LTA",
      "Conveyance",
      "WA",
      "FA",
      "SA",
      "FI",
      "PSA",
      "ESI",
      "PF",
      "PaidLeave",
      "SickLeave",
      "Actions",
    ]

    this.editableColumns = {
      "Gross":{
        filters:{IsPerDay:false,ConfigIDStatus:true},
        regex:'^\\d{1,8}(\\.\\d{1,2})?$', 
        errorMessage:'Gross must be greater than 0 less than 100000000',
      },
      "HRA":{
        filters:{IsPerDay:false},
        regex:'^\\d{1,6}(\.\d{1,2})?$', 
        errorMessage:'HRA must be greater than equal to 0 and less than 100000',
      },
      "DA":{
        filters:{IsPerDay:false},
        regex:'^\\d{1,6}(\\.\\d{1,2})?$', 
        errorMessage:'DA must be greater than equal to 0 and less than 100000',
      },
      "MA":{
        filters:{IsPerDay:false},
        regex:'^\\d{1,5}(\\.\\d{1,2})?$', 
        errorMessage:'MA must be greater than equal to 0 and less than 100000',
      },
      "TA":{
        filters:{IsPerDay:false},
        regex:'^\\d{1,5}(\\.\\d{1,2})?$', 
        errorMessage:'TA must be greater than equal to 0 and less than 100000',
      },
       "LTA":{
        filters:{IsPerDay:false},
        regex:'^\\d{1,5}(\\.\\d{1,2})?$', 
        errorMessage:'TA must be greater than equal to 0 and less than 100000',
      },
       "Conveyance":{
        filters:{IsPerDay:false},
        regex:'^\\d{1,5}(\\.\\d{1,2})?$', 
        errorMessage:'TA must be greater than equal to 0 and less than 100000',
      },
         "WA":{
        filters:{IsPerDay:false},
        regex:'^\\d{1,5}(\\.\\d{1,2})?$', 
        errorMessage:'Washing Allowance must be greater than equal to 0 and less than 100000',
      },
         "FA":{
        filters:{IsPerDay:false},
        regex:'^\\d{1,5}(\\.\\d{1,2})?$', 
        errorMessage:'Fuel Allowance must be greater than equal to 0 and less than 100000',
      },
          "SA":{
        filters:{IsPerDay:false},
        regex:'^\\d{1,5}(\\.\\d{1,2})?$', 
        errorMessage:'Special Allowance must be greater than equal to 0 and less than 100000',
      },
      "ESI":{
        regex:'^\\d{1,3}(\\.\\d{1,2})?$', 
        errorMessage:'ESI must be less than 1000',
        filters:{IsPerDay:false,ConfigIDStatus:false}
      },
      "PF":{
        regex:'^\\d{1,4}(\\.\\d{1,2})?$', 
        errorMessage:'EPF must be less than 10000',
        filters:{IsPerDay:false,ConfigIDStatus:false}
      },
      "PaidLeave":{
        regex:'^(30|[0-2]?\\d)$', 
        errorMessage:'Paid leave must be less than equal to 30',
        filters:{IsPerDay:false}
      },
      "FI":{
        regex:'^\\d{1,8}(\\.\\d{1,2})?$', 
        errorMessage:'FI must be greater than 0 less than 100000',
        filters:{IsPerDay:false}
      },
          "PSA":{
        regex:'^\\d{1,8}(\\.\\d{1,2})?$', 
        errorMessage:'PSA must be greater than 0 less than 100000',
        filters:{IsPerDay:false}
      },
      "SDmonthlydeduction":{
        regex:'^\\d{1,5}(\\.\\d{1,2})?$', 
        errorMessage:'SD Monthly Deduction be greater than 0 less than 100000',
        filters:{IsPerDay:false}
      },
      "SickLeave":{
        regex:'^(30|[0-2]?\\d)$', 
        errorMessage:'Sick leave must be less than equal to 30',
        filters:{IsPerDay:false}
      },
      "IsPerDay":{
        default:false,
        type:'Boolean',
        filters:{}
      },
      "TDS":{
        filters:{IsPerDay:false},
        regex:'^\\d{1,6}(\.\d{1,2})?$', 
        errorMessage:'TDS must be greater than equal to 0 and less than 100000',
      },
      "Basic":{
        filters:{},
        regex:'^[1-9]\\d{0,5}(\\.\\d{1,2})?$', 
        errorMessage:'Basic salary must be greater than 0 and less than 100000',
      },
     "BasicAndDA": {
        filters:{},
        regex:'^[1-9]\\d{0,5}(\\.\\d{1,2})?$', 
        errorMessage:'Basic + DA together must be greater than 0 and less than 200000',
      },

      
    }
  }

  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
    this.GetOrganization()
    this.GetBranches()
  }
downloadSample(){
  if(this.SelectedEmployees.length == 0){
    this.ShowToast("Please Select Employee","warning")
  }else{
    let employees = this.SelectedEmployees.map(res=>res.ID) || []
    let json = {
      EmpIDs : employees  
    }
    this._commonservice.ApiUsingPostNew("api/Account/DownloadExcelIncentive", json, { responseType: 'blob' })
    .subscribe((res: Blob) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'EmployeeIncentiveTemplate.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
}
onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
  }
}
uploadExcel(): void {
  if (!this.selectedFile) {
    this.ShowToast("Please select a file first","warning")
    return;
  }
  const formData = new FormData();
  formData.append('file', this.selectedFile, this.selectedFile.name);    
  const apiUrl = 'Account/UploadExcelIncentive';
  this._commonservice.ApiUsingPost(apiUrl,formData).subscribe(data =>{
    if(data.Status == true){
      this.ShowToast(data.Message,"success")
      if(data.ErrorFilePath){
        window.open(environment.Url+data.ErrorFilePath,'_blank')
      }
    }
    else if(data.Status == false){
      this.ShowToast(data.Message,"error")
    }else{
      this.ShowToast("An Error Occurred","error")
    }
  },(error)=>{
    this.ShowToast(error.error.message,"error")
  })
 
}

  onselectedOrg(item:any){
    this.selectedBranch = []
    this.SelectedDepartments = []
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranch = []
    this.SelectedDepartments = []
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
    this.selectedBranch=[];
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
     this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
       this.BranchList = data.List
       this.GetDepartmentsList()
     }, (error) => {
      this.ShowToast(error.message,"error")
     });
   }

  onBranchtextSelect(item: any) {
    this.temparray = [];
    this.temparray.push({ id: item.Value, text: item.Text });
    this.GetDepartmentsList();
    this.SelectedEmployees = []
  }

  onBranchDeSelect(item:any){
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.SelectedDepartments = []
    this.SelectedEmployees = []
    this.tempdeparray = []
    this.GetDepartmentsList();
  }
  
  onDeptSelect(item:any){
    this.tempdeparray = []
    this.tempdeparray.push({id:item.Value, text:item.Text });
    this.SelectedEmployees = []
  }
  
  onDeptSelectAll(item:any){
    this.tempdeparray = item;
    this.SelectedEmployees = []
  }

  onDeptDeSelectAll(){
   this.tempdeparray = [];
   this.SelectedEmployees = []
  }

  onDeptDeSelect(item:any){
   this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
   this.SelectedEmployees = []
  }

  GetDepartmentsList() {
    this.SelectedDepartments=[];
    var loggedinuserid=localStorage.getItem("UserID");
    let arr = this.temparray.length>0 ? this.temparray : this.BranchList
    const json = {
      OrgID:this.OrgID,
      AdminID:loggedinuserid,
      Branches: arr.map((br: any) => {
        return {
          id: br.id || br.Value,
        };
      }),
    } 

    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe(
      (data) => {
        if (data.DepartmentList.length > 0) {
          this.DepartmentList = data.List;
        }
        this.tempdeparray = this.tempdeparray?.filter((td:any)=>{
          let res = this.DepartmentList?.findIndex((dl:any)=>dl.id == td.id)
          return res>=0
        })
        this.SelectedDepartments = this.SelectedDepartments?.filter((td:any)=>{
          let res = this.DepartmentList?.findIndex((dl:any)=>dl.id == td.Value)
          return res>=0
        })
      },
      (error) => {
        this.ShowToast(error,"error")
      }
    );
  }

  GetEmployeeList()
  {
   this.spinnerService.show();
    this.employeeLoading = true
    let Branch = this.temparray.map((y:any) => y.id)[0] || 0
    let Dept = this.tempdeparray.map((y:any) => y.id)[0] || 0
    this.ApiURL="Portal/GetEmployeeSalary?AdminID="+this.AdminID+"&BranchID="+Branch+"&DepartmentID="+Dept
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any)  => {    
        this.spinnerService.hide();
        this.employeeLoading = false
        var table = $('#DataTables_Table_0').DataTable();
        table.destroy();
        this.EmployeeList = res.SalaryList.map((l:any,i:any)=>{return {
          SLno:i+1,
          ...l,
          ConfigIDStatus:l.ConfigID>0?true:false
        }})
        
        this.spinnerService.hide();
        this.employeeLoading = false
      }, (error) => {
        this.spinnerService.hide();
        this.employeeLoading = false
        this.ShowToast(error.message,"error")
      })
  // }
 
  }

  downloadReport(){
    let selectedColumns = ["SLno","EmployeeID","FI","PSA","SDmonthlydeduction","Gross","Basic","HRA","DA","LTA","Conveyance","WA","FA","SA","ESI","PF","PaidLeave","SickLeave"]
    this.commonTableChild.downloadReport(selectedColumns)
  }


  updateEmployeSalary(empDetails:any){
    let Branch = this.temparray.map((y:any) => y.id)[0] || 0
    let Dept = this.tempdeparray.map((y:any) => y.id)[0] || 0
    this.ApiURL="Portal/UpdateEmployeeSalary"
    let data = {AdminID:this.AdminID,"SalaryDetails":empDetails.map((emp:any)=>{
      return {
        EmployeeID: emp.EmployeeID,
        HRA: emp.HRA ,
        DA: emp.DA ,
        TA: emp.TA ,
        MA: emp.MA ,
        ESI: emp.ESI ,
        PF: emp.PF ,
         LTA: emp.LTA ,
          Conveyance: emp.Conveyance ,
        FI:emp.FI,
        PSA:emp.PSA,
         WA: emp.WA ,
          FA: emp.FA ,
           SA: emp.SA ,
        SDmonthlydeduction:emp.SDmonthlydeduction,
        PaidLeave: emp.PaidLeave ,
        SickLeave: emp.SickLeave ,
        IsPerDay: emp.IsPerDay ,
        Basic: emp.Basic ,
        BasicAndDA: emp.BasicAndDA ,
        Gross: emp.Gross ,
      };
    })}    
    this._commonservice.ApiUsingPost(this.ApiURL,data).subscribe((res:any)  => {    
      this.spinnerService.hide();
      this.ShowToast(res.Message,"success")
    }, (error) => {
      this.spinnerService.hide();
      this.ShowToast(error.message,"error")
    });
  }
editColumn(row: any) {
  let data = row.data;
  let column = row.column;
  let value = row.value;
  let index = this.EmployeeList.findIndex((e: any) => e.EmployeeID == data.EmployeeID);

  if (!this.editableColumns[column].type)
    this.EmployeeList[index][column] = Number(value);

  if (this.editableColumns[column].type == 'Boolean')
    this.EmployeeList[index][column] = Boolean(value);

  // === MUTUAL EXCLUSIVITY HANDLING ===
  if (column === 'Basic' || column === 'DA') {
    this.EmployeeList[index]['BasicAndDA'] = 0;
  }
  if (column === 'BasicAndDA') {
    this.EmployeeList[index]['Basic'] = 0;
    this.EmployeeList[index]['DA'] = 0;
  }

  // === ISPERDAY MODE HANDLING ===
  if (column == 'IsPerDay') {
    if (value == true) {
      this.EmployeeList[index]['salaryTemp'] = {
        PaidLeave: Number(this.EmployeeList[index]['PaidLeave']),
        SickLeave: Number(this.EmployeeList[index]['SickLeave']),
        FI: Number(this.EmployeeList[index]['FI']),
        PSA: Number(this.EmployeeList[index]['PSA']),
        SDmonthlydeduction: Number(this.EmployeeList[index]['SDmonthlydeduction']),
        ESI: Number(this.EmployeeList[index]['ESI']),
        PF: Number(this.EmployeeList[index]['PF']),
        PT: Number(this.EmployeeList[index]['PT']),
        Gross: Number(this.EmployeeList[index]['Gross']),
        Basic: Number(this.EmployeeList[index]['Basic']),
        BasicAndDA: Number(this.EmployeeList[index]['BasicAndDA']),
        HRA: Number(this.EmployeeList[index]['HRA']),
        DA: Number(this.EmployeeList[index]['DA']),
        MA: Number(this.EmployeeList[index]['MA']),
        TA: Number(this.EmployeeList[index]['TA']),
        LTA: Number(this.EmployeeList[index]['LTA']),
        Conveyance: Number(this.EmployeeList[index]['Conveyance']),
        WA: Number(this.EmployeeList[index]['WA']),
        FA: Number(this.EmployeeList[index]['FA']),
        SA: Number(this.EmployeeList[index]['SA']),
      };

      // Set per-day logic values
      this.EmployeeList[index]['FI'] = 0;
      this.EmployeeList[index]['PSA'] = 0;
      this.EmployeeList[index]['PaidLeave'] = 0;
      this.EmployeeList[index]['SickLeave'] = 0;
      this.EmployeeList[index]['ESI'] = 0;
      this.EmployeeList[index]['PF'] = 0;
      this.EmployeeList[index]['PT'] = 0;
      this.EmployeeList[index]['Gross'] = Math.floor((this.EmployeeList[index]['Gross'] > 0 ? this.formatNumber(this.EmployeeList[index]['Gross']) : this.formatNumber(this.EmployeeList[index]['Basic'])) / 30);
      this.EmployeeList[index]['Basic'] = this.formatNumber(this.EmployeeList[index]['Gross']);
      this.EmployeeList[index]['BasicAndDA'] = this.formatNumber(this.EmployeeList[index]['Gross']);
      this.EmployeeList[index]['HRA'] = 0;
      this.EmployeeList[index]['DA'] = 0;
      this.EmployeeList[index]['MA'] = 0;
      this.EmployeeList[index]['TA'] = 0;
      this.EmployeeList[index]['LTA'] = 0;
      this.EmployeeList[index]['Conveyance'] = 0;
      this.EmployeeList[index]['WA'] = 0;
      this.EmployeeList[index]['FA'] = 0;
      this.EmployeeList[index]['SA'] = 0;
    } else {
      const temp = this.EmployeeList[index]['salaryTemp'];
      this.EmployeeList[index]['FI'] = Number(temp['FI']);
      this.EmployeeList[index]['PSA'] = Number(temp['PSA']);
      this.EmployeeList[index]['PaidLeave'] = Number(temp['PaidLeave']);
      this.EmployeeList[index]['SickLeave'] = Number(temp['SickLeave']);
      this.EmployeeList[index]['ESI'] = Number(temp['ESI']);
      this.EmployeeList[index]['PF'] = Number(temp['PF']);
      this.EmployeeList[index]['PT'] = Number(temp['PT']);
      this.EmployeeList[index]['Gross'] = Number(temp['Gross']);
      this.EmployeeList[index]['Basic'] = Number(temp['Basic']);
      this.EmployeeList[index]['BasicAndDA'] = Number(temp['BasicAndDA']);
      this.EmployeeList[index]['HRA'] = Number(temp['HRA']);
      this.EmployeeList[index]['DA'] = Number(temp['DA']);
      this.EmployeeList[index]['MA'] = Number(temp['MA']);
      this.EmployeeList[index]['TA'] = Number(temp['TA']);
      this.EmployeeList[index]['LTA'] = Number(temp['LTA']);
      this.EmployeeList[index]['Conveyance'] = Number(temp['Conveyance']);
      this.EmployeeList[index]['WA'] = Number(temp['WA']);
      this.EmployeeList[index]['FA'] = Number(temp['FA']);
      this.EmployeeList[index]['SA'] = Number(temp['SA']);
    }
  }

  // === SALARY CALCULATION IF NOT PER-DAY ===
  if (!(this.EmployeeList[index]['IsPerDay'] === true)) {
    if (['Gross'].includes(column)) {
      this.calculateSalary(index, true, true);
    } else {
      this.calculateSalary(index, false, true);
    }
  }

  // === GROSS CALCULATION ===
  if (["Basic", "BasicAndDA", "HRA", "DA", "MA", "TA", "LTA", "Conveyance", "WA", "FA", "SA", "FI", "PSA"].includes(column)) {
    if (this.EmployeeList[index]['Basic'] > 0) {
      this.EmployeeList[index]['Gross'] =
        this.EmployeeList[index]['Basic'] +
        this.EmployeeList[index]['HRA'] +
        this.EmployeeList[index]['DA'] +
        this.EmployeeList[index]['MA'] +
        this.EmployeeList[index]['TA'] +
        this.EmployeeList[index]['LTA'] +
        this.EmployeeList[index]['Conveyance'] +
        this.EmployeeList[index]['WA'] +
        this.EmployeeList[index]['FA'] +
        this.EmployeeList[index]['SA'] 
        // this.EmployeeList[index]['PSA'] +
        // this.EmployeeList[index]['FI'];
    } else {
      this.EmployeeList[index]['Gross'] =
        this.EmployeeList[index]['HRA'] +
        this.EmployeeList[index]['MA'] +
        this.EmployeeList[index]['TA'] +
        this.EmployeeList[index]['LTA'] +
        this.EmployeeList[index]['Conveyance'] +
        this.EmployeeList[index]['WA'] +
        this.EmployeeList[index]['FA'] +
        this.EmployeeList[index]['SA'] +
        // this.EmployeeList[index]['PSA'] +
        // this.EmployeeList[index]['FI'] +
        this.EmployeeList[index]['BasicAndDA'];
    }
  }

  // === COLUMN DISABLE/ENABLE ===
  if (this.EmployeeList[index]['BasicAndDA'] > 0) {
    this.editableColumns['Basic'].disabled = true;
    this.editableColumns['DA'].disabled = true;
  } else {
    this.editableColumns['Basic'].disabled = false;
    this.editableColumns['DA'].disabled = false;
  }

  if (this.EmployeeList[index]['Basic'] > 0 || this.EmployeeList[index]['DA'] > 0) {
    this.editableColumns['BasicAndDA'].disabled = true;
  } else {
    this.editableColumns['BasicAndDA'].disabled = false;
  }
}

  
// editColumn(row:any){
//   let data = row.data
//   let column = row.column
//   let value = row.value
//   let index = this.EmployeeList.findIndex((e:any)=>e.EmployeeID == data.EmployeeID)  
//   if(!this.editableColumns[column].type)
//   this.EmployeeList[index][column] = Number(value)
//   if(this.editableColumns[column].type == 'Boolean')
//   this.EmployeeList[index][column] = Boolean(value)  
//   if(column == 'IsPerDay'){
//     if(value == true){
//       this.EmployeeList[index]['salaryTemp'] = {
//         PaidLeave:Number(this.EmployeeList[index]['PaidLeave']),
//         SickLeave:Number(this.EmployeeList[index]['SickLeave']),
//         FI:Number(this.EmployeeList[index]['FI']),
//            PSA:Number(this.EmployeeList[index]['PSA']),
//         // Securitydeposit:Number(this.EmployeeList[index]['Securitydeposit']),
//         SDmonthlydeduction:Number(this.EmployeeList[index]['SDmonthlydeduction']),
//         ESI:Number(this.EmployeeList[index]['ESI']),
//         PF:Number(this.EmployeeList[index]['PF']),
//         PT:Number(this.EmployeeList[index]['PT']),
//         // TDS:Number(this.EmployeeList[index]['TDS']),
//         Gross:Number(this.EmployeeList[index]['Gross']),
//         Basic:Number(this.EmployeeList[index]['Basic']),
//           BasicAndDA:Number(this.EmployeeList[index]['BasicAndDA']),
//         HRA:Number(this.EmployeeList[index]['HRA']),
//         DA:Number(this.EmployeeList[index]['DA']),
//         MA:Number(this.EmployeeList[index]['MA']),
//         TA:Number(this.EmployeeList[index]['TA']),
//           LTA:Number(this.EmployeeList[index]['LTA']),
//             Conveyance:Number(this.EmployeeList[index]['Conveyance']),
//             WA:Number(this.EmployeeList[index]['WA']),
//             FA:Number(this.EmployeeList[index]['FA']),
//             SA:Number(this.EmployeeList[index]['SA']),
//       }
//       this.EmployeeList[index]['FI'] = 0
//          this.EmployeeList[index]['PSA'] = 0
//       this.EmployeeList[index]['PaidLeave'] = 0
//       this.EmployeeList[index]['SickLeave'] = 0
//       this.EmployeeList[index]['ESI'] = 0
//       this.EmployeeList[index]['PF'] = 0
//       this.EmployeeList[index]['PT'] = 0
//       this.EmployeeList[index]['Gross'] =  Math.floor((this.EmployeeList[index]['Gross'] > 0 ? this.formatNumber(this.EmployeeList[index]['Gross']) : this.formatNumber(this.EmployeeList[index]['Basic']))/30)
//       this.EmployeeList[index]['Basic'] = this.formatNumber(this.EmployeeList[index]['Gross'])
//        this.EmployeeList[index]['BasicAndDA'] = this.formatNumber(this.EmployeeList[index]['Gross'])
//       this.EmployeeList[index]['HRA'] = 0
//       this.EmployeeList[index]['DA'] = 0
//       this.EmployeeList[index]['MA'] = 0
//       this.EmployeeList[index]['TA'] = 0
//       this.EmployeeList[index]['LTA'] = 0
//             this.EmployeeList[index]['PSA'] = 0
//       this.EmployeeList[index]['Conveyance'] = 0
//           this.EmployeeList[index]['WA'] = 0
//               this.EmployeeList[index]['FA'] = 0
//                   this.EmployeeList[index]['SA'] = 0
//     }
//     else
//     {
//      this.EmployeeList[index]['FI'] = Number(this.EmployeeList[index]['salaryTemp']['FI'])
//       this.EmployeeList[index]['PSA'] = Number(this.EmployeeList[index]['salaryTemp']['PSA'])
//       this.EmployeeList[index]['PaidLeave'] = Number(this.EmployeeList[index]['salaryTemp']['PaidLeave'])
//       this.EmployeeList[index]['SickLeave'] = Number(this.EmployeeList[index]['salaryTemp']['SickLeave'])
//       this.EmployeeList[index]['ESI']       = Number(this.EmployeeList[index]['salaryTemp']['ESI'])
//       this.EmployeeList[index]['PF']        = Number(this.EmployeeList[index]['salaryTemp']['PF'])
//       this.EmployeeList[index]['PT']        = Number(this.EmployeeList[index]['salaryTemp']['PT'])
//       // this.EmployeeList[index]['TDS']       = Number(this.EmployeeList[index]['salaryTemp']['TDS'])
//       this.EmployeeList[index]['Gross']     = Number(this.EmployeeList[index]['salaryTemp']['Gross'])
//        this.EmployeeList[index]['PSA']     = Number(this.EmployeeList[index]['salaryTemp']['PSA'])
//       this.EmployeeList[index]['Basic']     = Number(this.EmployeeList[index]['salaryTemp']['Basic'])
//        this.EmployeeList[index]['BasicAndDA']     = Number(this.EmployeeList[index]['salaryTemp']['BasicAndDA'])
//       this.EmployeeList[index]['HRA']       = Number(this.EmployeeList[index]['salaryTemp']['HRA'])
//       this.EmployeeList[index]['DA']        = Number(this.EmployeeList[index]['salaryTemp']['DA'])
//       this.EmployeeList[index]['MA']        = Number(this.EmployeeList[index]['salaryTemp']['MA'])
//       this.EmployeeList[index]['TA']        = Number(this.EmployeeList[index]['salaryTemp']['TA'])
//         this.EmployeeList[index]['LTA']        = Number(this.EmployeeList[index]['salaryTemp']['LTA'])
//           this.EmployeeList[index]['Conveyance']        = Number(this.EmployeeList[index]['salaryTemp']['Conveyance'])
//            this.EmployeeList[index]['WA']        = Number(this.EmployeeList[index]['salaryTemp']['WA'])
//                   this.EmployeeList[index]['FA']        = Number(this.EmployeeList[index]['salaryTemp']['FA'])
//                          this.EmployeeList[index]['SA']        = Number(this.EmployeeList[index]['salaryTemp']['SA'])
//         }
//   }
  
//   if(!(this.EmployeeList[index]['IsPerDay'] == true)){
//     if(['Gross'].includes(column)){
//       this.calculateSalary(index,true,true)
//     }else{
//       this.calculateSalary(index,false,true)
//     }
//   }
//     if(["Basic","BasicAndDA","HRA","DA","MA","TA","LTA","Conveyance","WA","FA","SA","FI","PSA"].includes(column))
//     {
//       if(this.EmployeeList[index]['Basic']>0){
//              this.EmployeeList[index]['Gross'] = this.EmployeeList[index]['Basic'] +this.EmployeeList[index]['HRA'] +this.EmployeeList[index]['DA'] +this.EmployeeList[index]['MA'] +this.EmployeeList[index]['TA']+this.EmployeeList[index]['LTA']+this.EmployeeList[index]['Conveyance']+this.EmployeeList[index]['WA']+this.EmployeeList[index]['FA']+this.EmployeeList[index]['SA']+this.EmployeeList[index]['PSA']+this.EmployeeList[index]['FI'];
   
//       }
//       else{
//      this.EmployeeList[index]['Gross'] = this.EmployeeList[index]['HRA'] +this.EmployeeList[index]['MA'] +this.EmployeeList[index]['TA']+this.EmployeeList[index]['LTA']+this.EmployeeList[index]['Conveyance']+this.EmployeeList[index]['WA']+this.EmployeeList[index]['FA']+this.EmployeeList[index]['SA']+this.EmployeeList[index]['PSA']+this.EmployeeList[index]['FI']+this.EmployeeList[index]['BasicAndDA'];
   
//       }
//   }

//     if (row.BasicAndDA) {
//   this.editableColumns['Basic'].disabled = true;
//   this.editableColumns['DA'].disabled = true;
// } else {
//   this.editableColumns['Basic'].disabled = false;
//   this.editableColumns['DA'].disabled = false;
// }

// if (row.Basic || row.DA) {
//   this.editableColumns['BasicAndDA'].disabled = true;
// } else {
//   this.editableColumns['BasicAndDA'].disabled = false;
// }

// }

formatNumber(num: number) {
  return num % 1 === 0 ? num : parseFloat(num.toFixed(2));
}

// calculate(type:string,SalaryFormulae:any,empList:any,){
//   for (let i = 0; i < SalaryFormulae.length; i++) {
//     const sf = SalaryFormulae[i];
//     if(sf.SalaryType == type){
//       let value =0;value+= empList.FI;value+= empList.PSA;
//       if(sf.isBasic) value += empList.Basic
//         if(sf.isBasic) value += empList.BasicAndDA
//       if(sf.isHRA) value += empList.HRA
//       if(sf.isDA) value += empList.DA
//       if(sf.isTA) value += empList.TA
//       if(sf.isMA) value += empList.MA
//         if(sf.isLTA) value += empList.LTA
//           if(sf.isConveyance) value += empList.Conveyance
//             if(sf.isWashingAllowance) value += empList.WA
//               if(sf.isFuelAllowance) value += empList.FA
//                 if(sf.isSpecialAllowance) value += empList.SA
//       value = this.formatNumber(Number(value))
//       if((sf.Min == null || value >= sf.Min) && (sf.Max == null || value <= sf.Max)){
//         if(sf.isAmount == true){
//           return this.formatNumber(Number(sf.Value))
//         }else{
//           return this.formatNumber(Number(value * (sf.Value/100)))
// }
// }
//     }
//   }
//   return 0
// }

  // calculateSalary(index: any, total: boolean, deductions: boolean) {
  //   if (this.EmployeeList[index].SalaryCalculation) {
  //     console.log(this.EmployeeList[index]);
  //     let config = this.EmployeeList[index].SalaryCalculation.config;
  //     let formula = this.EmployeeList[index].SalaryCalculation.formula;

  //     if (total === true && config) {
  //       this.EmployeeList[index]['FI'] = this.EmployeeList[index].FI;
  //       this.EmployeeList[index]['PSA'] = this.EmployeeList[index].PSA;

  //       this.EmployeeList[index]['Basic'] = config.isBasic ? config.IsBasicAmount
  //         ? this.formatNumber(config.Basic)
  //         : this.formatNumber(this.EmployeeList[index].Gross * (config.Basic / 100)) : 0;

          
  //       this.EmployeeList[index]['BasicAndDA'] = config.isBasicAndDA ? config.isBasicAndDAAmount
  //         ? this.formatNumber(config.BasicAndDA)
  //         : this.formatNumber(this.EmployeeList[index].Gross * (config.BasicAndDA / 100)) : 0;

  //       this.EmployeeList[index]['HRA'] = config.isHRA ? config.IsHRAAmount
  //         ? this.formatNumber(config.HRA)
  //         : this.formatNumber(this.EmployeeList[index].Gross * (config.HRA / 100)) : 0;

  //       this.EmployeeList[index]['DA'] = config.isDA ? config.IsDAAmount
  //         ? this.formatNumber(config.DA)
  //         : this.formatNumber(this.EmployeeList[index].Gross * (config.DA / 100)) : 0;

  //       this.EmployeeList[index]['TA'] = config.isTA ? config.IsTAAmount
  //         ? this.formatNumber(config.TA)
  //         : this.formatNumber(this.EmployeeList[index].Gross * (config.TA / 100)) : 0;

  //       this.EmployeeList[index]['MA'] = config.isMA ? config.IsMAAmount
  //         ? this.formatNumber(config.MA)
  //         : this.formatNumber(this.EmployeeList[index].Gross * (config.MA / 100)) : 0;

  //       this.EmployeeList[index]['LTA'] = config.isLTA ? config.IsLTAAmount
  //         ? this.formatNumber(config.LTA)
  //         : this.formatNumber(this.EmployeeList[index].Gross * (config.LTA / 100)) : 0;

  //       this.EmployeeList[index]['Conveyance'] = config.isConveyance ? config.isConveyanceAmount
  //         ? this.formatNumber(config.Conveyance)
  //         : this.formatNumber(this.EmployeeList[index].Gross * (config.Conveyance / 100)) : 0;

  //       this.EmployeeList[index]['WA'] = config.isWashingAllowance ? config.isWashingAllowanceAmount
  //         ? this.formatNumber(config.WashingAllowance)
  //         : this.formatNumber(this.EmployeeList[index].Gross * (config.WashingAllowance / 100)) : 0;

  //       this.EmployeeList[index]['FA'] = config.isFuelAllowance ? config.isFuelAllowanceAmount
  //         ? this.formatNumber(config.FuelAllowance)
  //         : this.formatNumber(this.EmployeeList[index].Gross * (config.FuelAllowance / 100)) : 0;

  //       this.EmployeeList[index]['SA'] = config.isSpecialAllowance ? config.isSpecialAllowanceAmount
  //         ? this.formatNumber(config.SpecialAllowance)
  //         : this.formatNumber(this.EmployeeList[index].Gross * (config.SpecialAllowance / 100)) : 0;
  //     }

  //     if (deductions === true && config) {
  //       this.EmployeeList[index]['ESI'] = config.isESI
  //         ? this.formatNumber(this.calculate('ESI', formula, this.EmployeeList[index]))
  //         : 0;

  //       this.EmployeeList[index]['PF'] = config.isPF
  //         ? this.formatNumber(this.calculate('EPF', formula, this.EmployeeList[index]))
  //         : 0;
  //     }
  //   } else {
  //     this.GetSalaryConfigs(this.EmployeeList, index, total, deductions);
  //   }
  // }

  calculate(type: string, SalaryFormulae: any, empList: any) {
  for (let i = 0; i < SalaryFormulae.length; i++) {
    const sf = SalaryFormulae[i];
    if (sf.SalaryType == type) {
      let value = 0;
      value += empList.FI || 0;
      value += empList.PSA || 0;

      // Handle Basic/DA/BasicAndDA mutual exclusion
      const isBasicDAEnabled = sf.isBasicAndDA;
      const isBasicEnabled = sf.isBasic;
      const isDAEnabled = sf.isDA;

      if (isBasicDAEnabled) {
        value += empList.BasicAndDA || 0;
      } else {
        if (isBasicEnabled) value += empList.Basic || 0;
        if (isDAEnabled) value += empList.DA || 0;
      }

      if (sf.isHRA) value += empList.HRA || 0;
      if (sf.isTA) value += empList.TA || 0;
      if (sf.isMA) value += empList.MA || 0;
      if (sf.isLTA) value += empList.LTA || 0;
      if (sf.isConveyance) value += empList.Conveyance || 0;
      if (sf.isWashingAllowance) value += empList.WA || 0;
      if (sf.isFuelAllowance) value += empList.FA || 0;
      if (sf.isSpecialAllowance) value += empList.SA || 0;

      value = this.formatNumber(Number(value));

      if ((sf.Min == null || value >= sf.Min) && (sf.Max == null || value <= sf.Max)) {
        if (sf.isAmount === true) {
          return this.formatNumber(Number(sf.Value));
        } else {
          return this.formatNumber(Number(value * (sf.Value / 100)));
        }
      }
    }
  }
  return 0;
}



calculateSalary(index: any, total: boolean, deductions: boolean) {
  if (this.EmployeeList[index].SalaryCalculation) {
    console.log(this.EmployeeList[index]);
    let config = this.EmployeeList[index].SalaryCalculation.config;
    let formula = this.EmployeeList[index].SalaryCalculation.formula;

    if (total === true && config) {


      this.EmployeeList[index]['FI'] = this.EmployeeList[index].FI;
      this.EmployeeList[index]['PSA'] = this.EmployeeList[index].PSA;

      let gross = this.EmployeeList[index].Gross;
      let remaining = gross;
      let calculatedKeys: Set<string> = new Set();

      const priorityComponents = [
        { key: 'Basic', isEnabled: config.isBasic, isFixed: config.IsBasicAmount, value: config.Basic, priority: config.BasicPriority || 99 },
        { key: 'BasicAndDA', isEnabled: config.isBasicAndDA, isFixed: config.isBasicAndDAAmount, value: config.BasicAndDA, priority: config.BasicAndDAPriority || 99 },
        { key: 'HRA', isEnabled: config.isHRA, isFixed: config.IsHRAAmount, value: config.HRA, priority: config.HRAPriority || 99 },
        { key: 'DA', isEnabled: config.isDA, isFixed: config.IsDAAmount, value: config.DA, priority: config.DAPriority || 99 },
        { key: 'TA', isEnabled: config.isTA, isFixed: config.IsTAAmount, value: config.TA, priority: config.TAPriority || 99 },
        { key: 'MA', isEnabled: config.isMA, isFixed: config.IsMAAmount, value: config.MA, priority: config.MAPriority || 99 },
        { key: 'LTA', isEnabled: config.isLTA, isFixed: config.IsLTAAmount, value: config.LTA, priority: config.LTAPriority || 99 },
        { key: 'Conveyance', isEnabled: config.isConveyance, isFixed: config.isConveyanceAmount, value: config.Conveyance, priority: config.ConveyancePriority || 99 },
        { key: 'WA', isEnabled: config.isWashingAllowance, isFixed: config.isWashingAllowanceAmount, value: config.WashingAllowance, priority: config.WashingAllowancePriority || 99 },
        { key: 'FA', isEnabled: config.isFuelAllowance, isFixed: config.isFuelAllowanceAmount, value: config.FuelAllowance, priority: config.FuelAllowancePriority || 99 },
        { key: 'SA', isEnabled: config.isSpecialAllowance, isFixed: config.isSpecialAllowanceAmount, value: config.SpecialAllowance, priority: config.SpecialAllowancePriority || 99 },
      ];
      if (!config.isBasicAndDA) {this.EmployeeList[index]['BasicAndDA'] = 0;}
            if (!config.isBasic) {this.EmployeeList[index]['Basic'] = 0;}
                  if (!config.isDA) {this.EmployeeList[index]['DA'] = 0;}
                        if (!config.isHRA) {this.EmployeeList[index]['HRA'] = 0;}
                              if (!config.isDA) {this.EmployeeList[index]['DA'] = 0;}
                                    if (!config.isTA) {this.EmployeeList[index]['TA'] = 0;}
                                          if (!config.isMA) {this.EmployeeList[index]['MA'] = 0;}
                                             if (!config.isLTA) {this.EmployeeList[index]['LTA'] = 0;}
                                                if (!config.isWashingAllowance) {this.EmployeeList[index]['WA'] = 0;}
                                                   if (!config.isFuelAllowance) {this.EmployeeList[index]['FA'] = 0;}
                                                    if (!config.isConveyance) {this.EmployeeList[index]['Conveyance'] = 0;}
                                                     if (!config.isSpecialAllowance) {this.EmployeeList[index]['SA'] = 0;}



  if (config.isBasicAndDA) {
    config.isBasic = false;
    config.isDA = false;
     this.EmployeeList[index]['Basic'] = 0;
      this.EmployeeList[index]['DA'] = 0;

  }
  if (config.isBasic || config.isDA) {
    config.isBasicAndDA = false;
     this.EmployeeList[index]['BasicAndDA'] = 0;
  }
      const sortedComponents = priorityComponents
        .filter(c => c.isEnabled)
        .sort((a, b) => a.priority - b.priority);

      for (const comp of sortedComponents) {
        let amount = 0;
        if (comp.isFixed) {
          amount = Number(comp.value);
        } else {
          amount = this.formatNumber(gross * (Number(comp.value) / 100));
          if (amount > remaining) {

            this.EmployeeList[index][comp.key] = remaining;
            continue;
          }
        }

        this.EmployeeList[index][comp.key] = amount;
        calculatedKeys.add(comp.key);
        if (remaining >= amount) {
          remaining -= amount;
        }
      
      }
         // Recalculate Gross after earnings
      let earnings = [
        'Basic', 'DA', 'BasicAndDA', 'HRA', 'TA', 'MA', 'LTA',
        'Conveyance', 'WA', 'FA', 'SA'
      ];

      let newGross = 0;
      for (let key of earnings) {
        newGross += Number(this.EmployeeList[index][key] || 0);
      }
      this.EmployeeList[index].Gross = this.formatNumber(newGross);
    }

    if (deductions === true && config) {
      this.EmployeeList[index]['ESI'] = config.isESI
        ? this.formatNumber(this.calculate('ESI', formula, this.EmployeeList[index]))
        : 0;

      this.EmployeeList[index]['PF'] = config.isPF
        ? this.formatNumber(this.calculate('EPF', formula, this.EmployeeList[index]))
        : 0;
    }
  } else {
    this.GetSalaryConfigs(this.EmployeeList, index, total, deductions);
  }
}



GetSalaryConfigs(empList:any,index:any,total:boolean,deductions:boolean) {
  let Branch = empList[index].BranchID || 0;
  let Dept = empList[index].DepartmentID || 0;
  if (Branch == 0 && Dept == 0) return;
  let json = {
    Employeelist: [],
    BranchList: Branch != 0 ? [Branch] : [],
    DepartmentList: Dept != 0 ? [Dept] : [],
  };

  if (
    json.Employeelist.length == 0 &&
    json.BranchList.length == 0 &&
    json.DepartmentList.length == 0
  ) {
    this.ShowToast( "Please select a Branch or a Department or an Employee","warning")
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
              this.ShowToast(error.message,"error")
            }
          );
      },
      (error) => {
        this.spinnerService.hide();
        this.ShowToast(error.message,"error")
      }
    );
}
actionEmitter(data:any){
  if(data.action.name == 'editColumn'){
    this.editColumn(data.row)
  }
  else if(data.action.name == 'updatedSelectedRows'){
    this.selectedRows = data.row
  }
  else 
  if(data.action.name == 'Submit Salary Configuration'){
    this.updateEmployeSalary([data.row])
  }  
}

SubmitBulkSalaryConfiguration(){this.updateEmployeSalary(this.selectedRows)}

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
