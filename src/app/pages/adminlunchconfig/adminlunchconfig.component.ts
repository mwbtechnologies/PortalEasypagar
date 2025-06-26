import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { AddlunchtimingsComponent } from '../addlunchtimings/addlunchtimings.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../common-table/common-table.component';
import { NavigationExtras, Router } from '@angular/router';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-adminlunchconfig',
  templateUrl: './adminlunchconfig.component.html',
  styleUrls: ['./adminlunchconfig.component.css']
})
export class AdminlunchconfigComponent {
  ORGId:any
  AllLunchList:any[]=[]
  EmployeeList:any;
  BranchList:any[]=[];
  DepartmentList:any;
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  temparray:any=[]; tempdeparray:any=[];
  selectedDepartment:any[]=[];
  selectedEmployees:any[]=[]
  selectdate:any
  selectedBranch:any[]=[]
  ApiURL:any
  AdminID:any
  //common table
actionOptions:any
displayColumns:any
displayedColumns:any
employeeLoading:any;
editdata:any
editableColumns:any =[]
topHeaders:any = []
headerColors:any = []
smallHeaders:any = []
ReportTitles:any = {}
selectedRows:any = []
commonTableOptions :any = {}
tableDataColors: any = {}
showReportWise :boolean= false;
UserID:any;
selectedOrganization:any[]=[]
OrgList:any[]=[]
orgSettings:IDropdownSettings = {}

@ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
//ends here
  constructor(private spinnerService: NgxSpinnerService,
    private _route: Router,private _commonservice: HttpCommonService, private globalToastService:ToastrService,private _httpClient:HttpClient,private dialog: MatDialog){ 
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
        name: "Edit",
        icon: "fa fa-edit",
        // rowClick: true,
      },
      {
        name: "Delete",
        icon: "fa fa-trash",
        filter: [
          { field:'IsDeletable',value : true}
        ],
      }
      // {
      //   name: "Activate",
      //   icon: "fa fa-plus",
      //   filter: [
      //     { field:'Status',value : false}
      //   ],
      // }
      
    ];

    this.displayColumns= {
      SelectAll: "SelectAll",
      "SLno":"SL No",
      "BranchName":"BRANCH",
      "DepartmentsStrings":"DEPARTMENTS",
      "BreaksStrings":"NO OF BREAKS",
      "Actions":"ACTIONS",
    },


    this.displayedColumns= [
      // "SelectAll",
      "SLno",
      "BranchName",
      "DepartmentsStrings",
      "BreaksStrings",
      "Actions"
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
      // }
    ]

    this.headerColors ={
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    this.tableDataColors = {
      "BreaksStrings": [
        { styleClass: "breakLine", filter: [{}] }
      ]
    }
    //ends here
  }


  ngOnInit(){
this.ORGId = localStorage.getItem('OrgID')
this.AdminID = localStorage.getItem("AdminID");
this.UserID=localStorage.getItem("UserID");
this.GetOrganization()
this.GetBranches()
this.getEmployeeList()
this.getAllLunchList()

  }
  GetReport(){
    this.getAllLunchList()
  }
  getAllLunchList(){
    this.spinnerService.show()
    this.employeeLoading = true
this._commonservice.ApiUsingGetWithOneParam("Breaks/GetBreakList?AdminID="+this.AdminID).subscribe((data:any) => {
  this.AllLunchList = data.BreaksList?.map((dataList:any,i:any)=>{
    const toggledItem = {...dataList,
    "SLno": i + 1, ...dataList,
    "DepartmentsStrings":dataList.Departments?.map((d:any)=>d.Name).join(", "),
    "BreaksStrings":dataList.Breaks.length
    // "BreaksStrings":dataList.Breaks.map((b:any)=>{
    //   return "Duration:"+b.Duration+
    //          "\nStartTime:"+b.StartTime+
    //          "\nEndTime:"+b.EndTime+
    //          "\nBreakName:"+b.BreakName
    // }).join('\n\n')
};
console.log(toggledItem);

return toggledItem;
})
  this.spinnerService.hide()
  this.employeeLoading = false
},(error)=>{
  this.spinnerService.hide()
  this.employeeLoading = false
  // this.globalToastService.error(error)
  this.ShowAlert(error,"error")
})
  }
  addLunchReports(){
    this._route.navigate(['/Breaks-Report'])
  }

  addLunchConfig(){
    this.showReportWise = true
    this.editdata = []
  }
  editLunchConfig(row:any){
    this.showReportWise = true
    this.editdata = row
  }
  backToList(){
    this.showReportWise = false
    this.GetBranches()
    this.GetDepartments()
    this.getAllLunchList()
    this.editdata = []
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
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetSuborgList?OrgID="+this.ORGId+"&AdminId="+this.AdminID).subscribe((data) => {
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
    
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetBranchListupdated?OrgID="+this.ORGId+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error")
       console.log(error);
    });

  }
 
  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json={
      AdminID:loggedinuserid,
      OrgID:this.ORGId,
      Branches:this.selectedBranch.map((br: any) => {
        return {
          "id":br.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments",json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        console.log(this.DepartmentList,"department list");
      }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error")
       console.log(error);
    });
  }

  getEmployeeList(){
    const now = new Date();
    const currentYear = now.getFullYear();
   let BranchID = this.selectedBranch?.map((y:any) => y.Value)[0] || 0
   let deptID = this.selectedDepartment?.map((y:any) => y.Value)[0] || 0
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+BranchID+"&DeptId="+deptID+"&Year="+currentYear+"&Month="+0+"&Key=en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
       console.log(error);this.spinnerService.hide();
    });
  }
  onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.push({id:item.Value, text:item.Text });
    this.selectedEmployees = []
    this.getEmployeeList()
   }
   onDeptSelectAll(item:any){
    console.log(item,"item");
    this.tempdeparray = item;
   }
   onDeptDeSelectAll(){
    this.tempdeparray = [];
   }
   onDeptDeSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    this.selectedEmployees = []
    this.getEmployeeList()
   }
  onBranchSelect(item:any){
   console.log(item,"item");
   this.temparray.push({id:item.Value,text:item.Text });
   this.selectedDepartment = []
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  }
  onBranchDeSelect(item:any){
   console.log(item,"item");
   this.temparray.splice(this.temparray.indexOf(item), 1);
   this.selectedDepartment = []
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  //  this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+item.Value+"&DeptId=0&Year=0&Month="+0+"&Key=en";
  //  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
  //     console.log(error);this.spinnerService.hide();
  //  });
  }

  OnEmployeesChange(_event:any){
  }
  OnEmployeesChangeDeSelect(event:any){ 
  }
  DeleteBreak(row:any){
    this._commonservice.ApiUsingGetWithOneParam("Breaks/DeleteBreakData?BranchID="+row.BranchID+"&DepartmentID="+row.Departments[0].ID).subscribe(data =>{
    // this.globalToastService.success(data.Message);
    this.ShowAlert(data.Message,"success")
    this.getAllLunchList();
    },(error)=>{
      // this.globalToastService.error(error.Message)
      this.ShowAlert(error.Message,"error")
    })
  }

  //common table
actionEmitter(data:any){
  if(data.action.name == "Edit"){
    this.editLunchConfig(data.row)
  }
  if(data.action.name == "Delete"){
    this.DeleteBreak(data.row);
  }
}

// ShowShiftDetails(row:any){
// }
//ends here

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
