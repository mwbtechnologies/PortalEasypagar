import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeComponent } from './employee/employee.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { PaymentsummaryComponent } from '../paymentsummary/paymentsummary.component';
@Component({
  selector: 'app-datewise',
  templateUrl: './datewise.component.html',
  styleUrls: ['./datewise.component.css']
})
export class DatewiseComponent { 
  ORGId:any
  BranchList: any[] = [];
 DepartmentList: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  selectedDepartment: any[] = [];
  selectedBranch: any[] = []
  AdminID: any
  showEmployeeWise:boolean = false
  //common table
  actionOptions: any
  orginalValues: any = {}
  displayColumns: any
  displayedColumns: any
  Loading: any;
  editableColumns: any = []
  ReportTitles: any = {}
  selectedRows: any = [];
  commonTableDataSource : any
  commonTableOptions: any = {}
  tableDataColors: any;
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  currentMonth: any;
  currentYear: any;
  dateWiseList:any[]=[]
  //ends here
  FromDate:any
  ToDate:any
  ApiURL:any
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  UserId:any;
constructor(
private spinnerService: NgxSpinnerService,
 private _route: Router,private dialog:MatDialog,
private _commonservice: HttpCommonService,
private globalToastService: ToastrService,
) {
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
//common table
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye",
      },
      {
        name: "Pay",
        icon: "fa fa-money",
        filter: [
          { field:'IsPayable',value : true}
        ],
      },
    ]
    this.displayColumns = {
      "SelectAll":"SELECT ALL",
      "SLno":"SL NO",
      "CreatedDate":"DATE",
      "BranchName":"BRANCH",
      "DepartmentName":"DEPARTMENT",
      "Requested":"REQUESTED",
      "Approved":"APPROVED",
      "Pending":"PENDING",
      "Rejected":"REJECTED",
      "Actions":"ACTIONS"
    },
      this.displayedColumns = [
      "SelectAll",
      "SLno",
      "CreatedDate",
      "BranchName",
      "DepartmentName",
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
    this.UserId = localStorage.getItem("UserID");
    this.GetOrganization();
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
    this.ApiURL = "Admin/GetSuborgList?OrgID="+this.ORGId+"&AdminId="+this.UserId
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
      // this.globalToastService.error(error);
       console.log(error);
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
      // this.globalToastService.error(error);
       console.log(error);
    });
  }

onDeptSelect(item: any) {
  }
  onDeptSelectAll(item: any) {
  }
  onDeptDeSelectAll() {
  }
 onDeptDeSelect(item: any) {
  }
  onBranchSelect(item: any) {
    console.log(item, "item");
    this.selectedDepartment = []
    this.GetDepartments();
  }
 onBranchDeSelect(item: any) {
    console.log(item, "item");
    this.selectedDepartment = []
    this.GetDepartments();
  }

  getExpenseDateWise(){
    if(this.selectedBranch.length==0){
      this.ShowToast("Please select branch","warning")
    }
    else if(this.FromDate == undefined || this.FromDate == null || this.FromDate == '' ){
      this.ShowToast("Please Select From Date","warning")
    }
    else if(this.ToDate == null || this.ToDate == undefined || this.ToDate == '' ){
      this.ShowToast("Please Select ToDate","warning")
    }else{
    this.Loading = true
    let branchid = this.selectedBranch.map((res:any)=>res.Value) || []
    let json = {
     "BranchID": branchid,
      "FromDate": this.FromDate,
      "Todate": this.ToDate,
      "UserID":this.UserId,
    }
    this._commonservice.ApiUsingPost("Admin/GetDateWiseExpensesMainscreen", json).subscribe((res: any) => {
      this.dateWiseList = res.groupedExpenses.map((l: any, i: any) => {
         return { 
          SLno: i + 1, ...l ,
          "CreatedDate":l.Date
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
  
  //common table
  actionEmitter(data: any) {
     if(data.action.name == 'View'){

       this.dialog.open(EmployeeComponent, {
                data: {
                  branchid:data.row.BranchID,
                  branchname:data.row.BranchName,
                  deptid:data.row.DepartmentID,
                  deaptname:data.row.DepartmentName,
                  fromdate:data.row.Date,
                  todate:data.row.Date,
                  empid:data.row.EmployeeID
                }
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
           this.getExpenseDateWise()
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
    this.dateWiseList.forEach(element => {
      element.isSelected = false
    });
  }

  approveExpense(){
    this.updatedSelectedRows
    this.dialog.open(ConfirmationComponent,{
      data:{row:this.selectedRows,type:'Approve'}
    }).afterClosed().subscribe(res=>{
      // if(res){
        this.clearSelect(); 
        this.getExpenseDateWise()
      // }
    })
  }
  rejectExpense(){
    this.updatedSelectedRows
    this.dialog.open(ConfirmationComponent,{
      data:{row:this.selectedRows,type:'Reject'}
    }).afterClosed().subscribe(res=>{
      // if(res){
        this.clearSelect(); 
        this.getExpenseDateWise()
      // }
    })
  }
  
  backToList(){
    this.showEmployeeWise = false
    this.getExpenseDateWise()
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
