import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonTableComponent } from 'src/app/pages/common-table/common-table.component';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ExpenseComponent } from './expense/expense.component';
import * as moment from 'moment';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
 ORGId:any
  BranchList: any[] = [];
 DepartmentList: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  selectedDepartment: any[] = [];
  selectedBranch: any[] = []
  AdminID: any
  //common table
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
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  currentMonth: any;
  currentYear: any;
  EmpWiseList:any[]=[]
  //ends here
  Branch:any
Department:any
UserId:any
constructor(
private spinnerService: NgxSpinnerService,
 private _route: Router,
private _commonservice: HttpCommonService,
private globalToastService: ToastrService,@Inject(MAT_DIALOG_DATA) public data: any,
public dialogRef: MatDialogRef<EmployeeComponent>,private dialog:MatDialog
) {
  this.Branch = this.data.branchname
  this.Department = this.data.deaptname
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
//common table
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye",
      },
    ]
    this.displayColumns = {
      "SelectAll":"SELECT ALL",
      "MappedEmpId":"EMPLOYEE ID",
      "EmployeeName":"EMPLOYEE NAME",
      "Branch":"BRANCH",
      "Department":"DEPARTMENT",
      "Requested":"REQUESTED",
      "Approved":"APPROVED",
      "Pending":"PENDING",
      "Rejected":"REJECTED",
      "Actions":"ACTIONS"
    },
      this.displayedColumns = [
        "SelectAll",
        "MappedEmpId",
        "EmployeeName",
        "Branch",
        "Department",
        "Requested",
        "Approved",
        "Pending",
        "Rejected",
        "Actions"
     ]

  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserId = localStorage.getItem("UserID");
    // this.GetBranches()
    this.getExpenseEmpWise()
  }
  close(){
    this.dialogRef.close()
  }

  getExpenseEmpWise(){
    this.Loading = true
    let json:any = {
      // "BranchID":[this.data.branchid],
      // "DeptID":[this.data.deptid],
      "UserID":this.UserId,
      "FromDate": moment(this.data.fromdate).format('YYYY-MM-DD'),
      "Todate": moment(this.data.todate).format('YYYY-MM-DD')
    }
    if(this.data.deptid){
      json["BranchID"] = []
      json["DeptID"] = [this.data.deptid]
    }
    if(!this.data.deptid){
      json["BranchID"] = [this.data.branchid]
      json["DeptID"] = []
    }
    console.log(json,"get empwise");
    this._commonservice.ApiUsingPost("Admin/GetExpensesMainscreen", json).subscribe((res: any) => {
      this.EmpWiseList = res.groupedExpenses.map((l: any, i: any) => {
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
  
  //common table
  actionEmitter(data: any) {
    if (data.action.name == 'View') {
       this.dialog.open(ExpenseComponent, {
          data: {
            employee:data.row.EmployeeName,
            empid:data.row.EmployeeID,
            branch:this.Branch,
            dept:this.Department,
            fromdate:this.data.fromdate,
          }
        }).afterClosed().subscribe(res=>{
          this.getExpenseEmpWise()
        })
    }
    else if (data.action.name == "updatedSelectedRows") {
      this.updatedSelectedRows(data)
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

  approveExpense(){
    this.updatedSelectedRows
      this.dialog.open(ConfirmationComponent,{
        data:{row:this.selectedRows,type:'Approve'}
      }).afterClosed().subscribe(res=>{
        if(res){
          this.getExpenseEmpWise()
        }
      })
    }
    rejectExpense(){
      this.updatedSelectedRows
      this.dialog.open(ConfirmationComponent,{
        data:{row:this.selectedRows,type:'Reject'}
      }).afterClosed().subscribe(res=>{
        if(res){
          this.getExpenseEmpWise()
        }
      })
    }

}

