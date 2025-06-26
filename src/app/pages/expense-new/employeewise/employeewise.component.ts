import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { MatDialog } from '@angular/material/dialog';
import { DatewiseComponent } from './datewise/datewise.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { PaymentsummaryComponent } from '../paymentsummary/paymentsummary.component';

@Component({
  selector: 'app-employeewise',
  templateUrl: './employeewise.component.html',
  styleUrls: ['./employeewise.component.css']
})
export class EmployeewiseComponent {
  ORGId: any
  EmployeeList: any[] = [];
  BranchList: any[] = [];
  DepartmentList: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  temparray: any = []; tempdeparray: any = [];
  selectedDepartment: any[] = [];
  selectedEmployees: any[] = []
  selectedBranch: any[] = []
  FromDate:any
  ToDate:any
  AdminID: any
  //common table
  commonTableDataSource : any
  actionOptions: any
  orginalValues: any = {}
  displayColumns: any
  displayedColumns: any
  Loading: any;
  editableColumns: any = []
  ReportTitles: any = {}
  selectedRows: any = [];
  commonTableOptions: any = {}
  tableDataColors: any;
  UserID:any;
  ShowPayButton:any
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  currentMonth: any;
  currentYear: any;
  employeeWiseList: any[] = []
  //ends here
  ApiURL:any
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  UserId:any
  constructor(
    private spinnerService: NgxSpinnerService,
    private _route: Router,
    private _commonservice: HttpCommonService,
    private globalToastService: ToastrService,
    private dialog: MatDialog
  ) {
 
    this.ShowPayButton = true
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.employeeSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      enableCheckAll: true
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
    //common table
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye",
      },
    ]
    this.displayColumns = {
      "SelectAll": "SELECT ALL",
      "MappedEmpId": "EMPLOYEE ID",
      "EmployeeName": "EMPLOYEE",
      "Branch": "BRANCH",
      "Department": "DEPARTMENT",
      "Requested": "REQUESTED",
      "Approved": "APPROVED",
      "Pending": "PENDING",
      "Rejected": "REJECT",
      "Actions": "ACTIONS"
    },
      this.displayedColumns = [
        "SelectAll",
        "MappedEmpId",
        "EmployeeName",
        "Branch",
        "Department",
        "Requested",
        "Pending",
        "Approved",
        "Rejected",
        "Actions"
      ]

  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.ShowPayButton = localStorage.getItem("PayButton");
   if(this.ShowPayButton == "true"){
    this.actionOptions.push({
      name: "Pay",
      icon: "fa fa-money",
      filter: [
        { field:'IsPayable',value : true}
      ],
    })
   }
    this.GetOrganization();
    this.GetBranches()
    // this.getEmployeeList()
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
    this.ApiURL = "Admin/GetSuborgList?OrgID="+this.ORGId+"&AdminId="+this.UserID;
    
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
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.ORGId+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });

  }

  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json = {
      OrgID: this.ORGId,
      AdminID:loggedinuserid,
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
      this.globalToastService.error(error);
      console.log(error);
    });
  }

  getEmployeeList() {
    let BranchID = this.selectedBranch?.map((y: any) => y.Value)[0] || 0;
    let deptID = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0;
    let ApiURL = `Admin/GetMyEmployees?AdminID=${this.AdminID}&BranchId=${BranchID}&DeptId=${deptID}&ListType=All`;
    this._commonservice.ApiUsingGetWithOneParam(ApiURL).subscribe((response: any) => {
      this.EmployeeList = response.List;
      if (this.EmployeeList.length > 0) {
        this.selectedEmployees = [...this.EmployeeList]; // using spread operator to copy all employees
      }
    }, (error: any) => {
      this.globalToastService.error("Something went wrong..");
    })
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
    this.selectedDepartment = []
    this.GetDepartments();
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onBranchDeSelect(item: any) {
    console.log(item, "item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.selectedDepartment = []
    this.GetDepartments();
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  OnEmployeesChange(_event: any) {
    console.log(_event, "emp details");

  }
  OnEmployeesChangeDeSelect(event: any) {
  }

  OnEmployeesSelectAll(event: any) {
    this.selectedEmployees = [...event]
  }
  OnEmployeesDeSelectAll(event: any) {
    this.selectedEmployees = []
  }

  getExpenseEmpWise() {
    if(this.selectedBranch.length==0){
      this.ShowToast("Please select branch","warning")
    }
    else if(this.selectedEmployees.length==0){
      this.ShowToast("Please select employees","warning")
    }
    else if(this.FromDate == undefined || this.FromDate == null || this.FromDate == '' ){
      this.ShowToast("Please Select From Date","warning")
    }
    else if(this.ToDate == null || this.ToDate == undefined || this.ToDate == '' ){
      this.ShowToast("Please Select ToDate","warning")
    }else{
      this.Loading = true
      let empids = this.selectedEmployees.map((res:any)=>res.ID) || []
      if(empids.length==0)
        {
          empids = this.EmployeeList.map((res:any)=>res.ID) || []
        }
      let json = {
        "UserID":this.UserID,
      "Employeeid": empids,
        "FromDate": this.FromDate,
        "Todate": this.ToDate,
      }
      console.log(json,"get empwise");
      this._commonservice.ApiUsingPost("Admin/GetExpensesMainscreen", json).subscribe((res: any) => {
        this.employeeWiseList = res.groupedExpenses.map((l: any, i: any) => {
           return { 
            SLno: i + 1, ...l 
          } 
        });
        this.Loading = false
        this.spinnerService.hide();
      }, (error) => {
        this.spinnerService.hide();
        this.Loading = false
      });
    }

  }

     ShowToast(message: string, type: 'success' | 'warning' | 'error'): void {
        this.dialog.open(ShowalertComponent, {
          data: { message, type },
          panelClass: 'custom-dialog',
          disableClose: true
        }).afterClosed().subscribe((res) => {
          if (res) {
            console.log("Dialog closed");
          }
        });
      }

  //common table
  actionEmitter(data: any) {
    if (data.action.name == 'View') {
      this.dialog.open(DatewiseComponent, {
        data: {
          employee:data.row.EmployeeName,
          branch:data.row.Branch,
          dept:data.row.Department,
          fromdate:this.FromDate,
          todate:this.ToDate,
          empid:data.row.EmployeeID
        }
      }).afterClosed().subscribe(res=>{
        // if(res){
          this.getExpenseEmpWise()
        // }
      })
    }
     if (data.action.name == "updatedSelectedRows") {
      this.updatedSelectedRows(data)
    }
    if (data.action.name == 'Pay') {
      this.dialog.open(PaymentsummaryComponent, {
        data: { row: data.row.ExpenseIDs}
      }).afterClosed().subscribe(res => {
        if(res){
          this.getExpenseEmpWise()
        }
      })
    }
  }

  //ends here
  updatedSelectedRows(data: any) {
    this.selectedRows = []; 
    let rows = data?.row;
    if (rows?.length > 0) {
        for (let i = 0; i < rows.length; i++) {
          const ri = rows[i];
          if (ri.isSelected === true) {
            this.selectedRows.push(ri); 
          }
        }
    }
}

clearSelect(){
  this.commonTableChild.clearSelectAll()
  this.selectedRows = []
  this.employeeWiseList.forEach(element => {
    element.isSelected = false
  });
}

approveExpense(){
  this.updatedSelectedRows
    this.dialog.open(ConfirmationComponent,{
      data:{row:this.selectedRows,type:'Approve'}
    }).afterClosed().subscribe(res=>{
      // if(res){
        this.clearSelect() 
        this.getExpenseEmpWise()
      // }
    })
  }
  rejectExpense(){
    this.updatedSelectedRows
    this.dialog.open(ConfirmationComponent,{
      data:{row:this.selectedRows,type:'Reject'}
    }).afterClosed().subscribe(res=>{
      // if(res){
        this.clearSelect() 
        this.getExpenseEmpWise()
      // }
    })
  }

}
