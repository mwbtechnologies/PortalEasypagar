import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';
@Component({
  selector: 'app-monthwise',
  templateUrl: './monthwise.component.html',
  styleUrls: ['./monthwise.component.css']
})
export class MonthwiseComponent {
 ORGId:any
  BranchList: any[] = [];
  selectedMonth: any[] = [];
  selectedyear: any[] = [];
 DepartmentList: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  selectedDepartment: any[] = [];
  selectedBranch: any[] = []
  AdminID: any
  YearList: any;
  MonthList: any;
  monthSettings: IDropdownSettings = {};
  yearSettings: IDropdownSettings = {};
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
  UserID:any;
  ApiURL: any;
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  monthWiseList:any[]=[
  {
    "Month":"Jan",
    "Branch":"MWB Tech",
    "Department":"Front End",
    "Requested":"5000",
    "Approved":"3300",
    "Pending":"2000",
    "Reject":"1000"
  },
  {
    "Month":"Feb",
    "Branch":"MWB Tech",
    "Department":"Back End",
    "Requested":"5000",
    "Approved":"3300",
    "Pending":"2000",
    "Reject":"1000"
  },
  {
    "Month":"March",
    "Branch":"MWB Tech",
    "Department":"Back End",
    "Requested":"5000",
    "Approved":"3300",
    "Pending":"2000",
    "Reject":"1000"
  }
]
  //ends here
constructor(
private spinnerService: NgxSpinnerService,
 private _route: Router,
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
    this.yearSettings = {
      singleSelection: true,
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
//common table
    this.actionOptions = [
      {
      },
    ]
    this.displayColumns = {
      "SelectAll":"Select All",
      "Month":"Month",
      "Branch":"Branch",
      "Department":"Department",
      "Requested":"Requested",
      "Approved":"Approved",
      "Pending":"pending",
      "Reject":"Reject"
    },
      this.displayedColumns = [
      "SelectAll",
      "Month",
      "Branch",
      "Department",
      "Requested",
      "Approved",
      "Pending",
      "Reject"
     ]

  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.GetOrganization();
    this.GetBranches()
    this.GetYearList()
this.GetMonthList()
  }
  GetYearList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
    console.log(error);
 });
  }
  GetMonthList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
    console.log(error);
 });
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
  OnYearChange(event: any) {
  }
  onyearDeSelect(event: any) {
  }
  OnMonthChange(event: any) {
  }
  onMonthDeSelect(event: any) {
  }
  getExpenseMonthWise(){
    this.Loading = true
    this.monthWiseList
    this.Loading = false
  }
  
  //common table
  actionEmitter(data: any) {
  }

  //ends here

}

