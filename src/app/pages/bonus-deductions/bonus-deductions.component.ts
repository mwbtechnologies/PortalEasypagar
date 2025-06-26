import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { AddeditbonusdeductionComponent } from './addeditbonusdeduction/addeditbonusdeduction.component';
import { CommonTableComponent } from '../common-table/common-table.component';
import { DeleteconfirmationComponent } from 'src/app/layout/admin/deleteconfirmation/deleteconfirmation.component';
import { ViewComponent } from './view/view.component';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-bonus-deductions',
  templateUrl: './bonus-deductions.component.html',
  styleUrls: ['./bonus-deductions.component.css']
})
export class BonusDeductionsComponent {
  EmployeeList: any;
  DepartmentList: any;
  BranchList: any[] = [];
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  temparray: any = []; tempdeparray: any = [];
  selectedDepartment: any[] = [];
  selectedEmployees: any[] = []
  selectedBranch: any[] = [];
  AdminID: any
  OrgID: any
  ApiURL: any
  BonusAttendanceList: any[] = []
  showEmpWise = false
  ModuleTypeList:any[]=['Attendance','Lunch']
  ListType:any[]=['Bonus','Deduction']
  selectedModuleType:any
  selectedListType:any
  moduleTypeSettings:IDropdownSettings = {}
  //common table
  actionOptions: any
  displayColumns: any
  displayedColumns: any
  employeeLoading: any;
  editableColumns: any = []
  topHeaders: any = []
  headerColors: any = []
  smallHeaders: any = []
  ReportTitles: any = {}
  selectedRows: any = []
  commonTableOptions: any = {}
  UserID: any
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  constructor(public dialog: MatDialog, private _router: Router,private pdfExportService:PdfExportService, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private globalToastService: ToastrService) {
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.employeeSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.departmentSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.moduleTypeSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
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
    //common table
    this.actionOptions = [
      {
        name: "View Details",
        icon: "fa fa-edit",
        // rowClick: true,
      },
      {
        name: "View",
        icon: "fa fa-eye",
        // rowClick: true,
      },
      {
        name: "Delete",
        icon: "fa fa-trash",
        filter: [
          { field:'IsDeletable',value : true}
        ],
      }
    ];

    this.displayColumns = {
      // SelectAll: "SelectAll",
      "SLno":"SL NO",
      "Type":"TYPE",
      "Module":"MODULE",
      // "EmployeeName":"EMPLOYEE",
      "BranchName":"BRANCH",
      // "DepartmentName":"DEPARTMENT",
      "LoginType":"LOGIN TYPE",
      "NoOfDays":"NO OF DAYS",
      "Days":"DAYS WORKED",
      // "ExtraHours":"EXTRA HOURS",
      // "Status":"STATUS",
      "SalaryType":"SALARY TYPE",
      "Actions":"ACTIONS",
    },


    this.displayedColumns= [
      // "SelectAll",
      "SLno",
      "Type",
      "Module",
      // "EmployeeName",
      "BranchName",
      // "DepartmentName",
      "LoginType",
      "NoOfDays",
      "Days",
      // "Status",
      // "ExtraHours",
      "SalaryType",
      "Actions",
      // "Actions"
    ]

    this.editableColumns = {
      // "HRA":{
      //   filters:{}
      // },
    }

    this.topHeaders = [
      // {
      //   id:"blank1",
      //   name:"",
      //   colspan:2
      // },
    ]

    this.headerColors = {
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    //ends here
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
    this.GetOrganization();
    this.GetBranches()
    this.GetList();
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
      this.ShowAlert(error,"error")
       console.log(error);
    });
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error,"error")
      console.log(error);
    });

  }
  GetDepartments() {
    this.DepartmentList=[];
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json = {
      AdminID:loggedinuserid,
      OrgID: this.OrgID,
      Branches: this.selectedBranch.map((br: any) => {
        return {
          "id": br.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        console.log(this.DepartmentList, "department list");
      }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error")
       console.log(error);
    });
  }
  getEmployeeList() {
    let BranchID = this.selectedBranch?.map((y: any) => y.Value)[0] || 0
    let deptID = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0
    this.ApiURL = "Admin/GetEmployees?AdminID=" + this.AdminID + "&BranchID=" + BranchID + "&DeptId=" + deptID + "&Year=" + 0 + "&Month=" + 0 + "&Key=en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
      console.log(error); this.spinnerService.hide();
    });
  }
  onDeptSelect(item: any) {
    console.log(item, "item");
    this.tempdeparray.push({ id: item.Value, text: item.Text });
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onDeptSelectAll(item: any) {
    console.log(item, "item");
    this.tempdeparray = item;
  }
  onDeptDeSelectAll() {
    this.tempdeparray = [];
  }
  onDeptDeSelect(item: any) {
    console.log(item, "item");
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onBranchSelect(item: any) {
    console.log(item, "item");
    this.temparray.push({ id: item.Value, text: item.Text });
    this.GetDepartments();
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onBranchDeSelect(item: any) {
    console.log(item, "item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.GetDepartments();
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  OnEmployeesChange(_event: any) {
  }
  OnEmployeesChangeDeSelect(event: any) {
  }

  bonusDeduction(type: any, isEdit: boolean, row?: any) {
    this.dialog.open(AddeditbonusdeductionComponent, {
      data: { type, isEdit, row }
    }).afterClosed().subscribe(data => {
      this.GetList()
    })
  }
  GetList() {
    if(this.selectedListType==null||this.selectedListType==""||this.selectedListType==0 || this.selectedListType==undefined)
    {
      this.selectedListType=["All"];
    }
        this.employeeLoading = true
    const json = {
      "AdminID": this.UserID,
      "Employeeid":[],
      "BranchID": this.selectedBranch.map((se: any) => se.Value)[0] || 0,
      "ListType":this.selectedListType?.toString() || "",
      "ModuleType":this.selectedModuleType?.toString() || ""
    }
    console.log(json,"getlist bd");
   this._commonservice.ApiUsingPost("Bonusdeduction/getBonusandadvanceList",json).subscribe((res:any)=>{
    this.BonusAttendanceList = res.response.map((l: any, i: any) => { 
      return {
         SLno: i + 1, ...l ,
        "Status":l.IsActive
        }
     });;
    this.employeeLoading = false
   },(error)=>{
    // this.globalToastService.error(error.error.Message)
    this.ShowAlert(error.error.Message,"error")
   })  
    // }
   }
   //common table
  actionEmitter(data:any){
    if(data.action.name == "View Details"){
      this.bonusDeduction(data.row.Type,true,data.row);
    }
    if(data.action.name == "View"){
      this.ViewDetails(data.row);
    }
    if(data.action.name == "Delete"){
      this.DeleteBonus(data.row);
    }
  }
  DeleteBonus(row:any){
    this._commonservice.ApiUsingGetWithOneParam("Bonusdeduction/DeleteBonusAndAdvance?BonusID="+row.ID+"").subscribe(data =>{
      if(data.Status == true){
        // this.globalToastService.success(data.Message)
        this.ShowAlert(data.Message,"success")
        this.GetList()
      }else if (data.Status == false){
        // this.globalToastService.error(data.Message)
        this.ShowAlert(data.Message,"error")
      }else{
        // this.globalToastService.error("An error occurred. PLease try later")
        this.ShowAlert("An error occurred. Please try later","error")
      }
     },(error)=>{
      // this.globalToastService.error(error.error.Message)
      this.ShowAlert(error.error.Message,"error")
     }
    )
  }

  ViewDetails(row:any){
   this.dialog.open(ViewComponent, {
      data: { row }
    }).afterClosed().subscribe(result =>{
       this.GetList()
    }) 
  }
  deletebonusdeduction(row: any) {
    const dialogRef = this.dialog.open(DeleteconfirmationComponent, {
      data: row,
    });
    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.confirmed(row);
      dialogRef.close();
    }, (error): any => {
      // this.globalToastService.error(error.message)
      this.ShowAlert(error.message,"error")
    });
  }

confirmed(row:any){
 this._commonservice.ApiUsingPostWithOneParam("Bonusdeduction/DeleteBonusAndAdvanceDetails?Employeeid="+row.EmployeeID+"&BonusID="+row.ActionID).subscribe(data =>{
  // this.globalToastService.success(data.Message)
  this.ShowAlert(data.Message,"success")
  this.GetList()
 })
}

// downloadReport(){
//   let selectedColumns = this.displayedColumns
//   this.commonTableChild.downloadReport(selectedColumns)
// }

downloadReport() {
  const columns = [
    'Employee',
    'Type',
    'Module', 
    'Branch',
    'LoginType', 
    'NoOfDays', 
    'Days',
    'SalaryType',
    'Department', 
    'StartDate',
    'Status',
  ];

  const header = '';
  const title = 'Bonus And Deduction Report';

  const data = this.BonusAttendanceList.flatMap((item: any) => {
    if (item.MappingDetails && item.MappingDetails.length > 0) {
      return item.MappingDetails.map((mapping: any) => {
        return [
          mapping.EmployeeName,
          item.Type,
          item.Module,
          item.BranchName,
          item.LoginType, 
          item.NoOfDays, 
          item.Days,
          item.SalaryType,
          mapping.DepartmentName,
          mapping.StartDate ? new Date(mapping.StartDate).toLocaleDateString() : 'N/A',
          mapping.IsActive ? 'Active' : 'Disabled'
        ];
      });
    } else {
    }
  });
  data.sort((a: any[], b: any[]) => {
    const nameA = a[0] ? a[0].toLowerCase() : ''; 
    const nameB = b[0] ? b[0].toLowerCase() : ''; 
    const typeA = a[1] ? a[1].toLowerCase() : ''; 
    const typeB = b[1] ? b[1].toLowerCase() : '';
    const nameComparison = nameA.localeCompare(nameB);
    if (nameComparison !== 0) return nameComparison;

    return typeA.localeCompare(typeB);
  });
  this.pdfExportService.generatePDF(header, title, columns, data);
}

  

//ends here


viewEmpWise(){
  this.showEmpWise = true
}

backToList(){
  this.showEmpWise = false
  this.GetBranches()
}

  ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
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
