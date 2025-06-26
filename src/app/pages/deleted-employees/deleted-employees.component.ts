import { Component, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-deleted-employees',
  templateUrl: './deleted-employees.component.html',
  styleUrls: ['./deleted-employees.component.css']
})
export class DeletedEmployeesComponent {
  BranchList:any[]=[];
  DepartmentList:any;
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  temparray:any=[]; tempdeparray:any=[];
  selectedDepartment:any[]=[];
  selectedBranch:any[]=[]
  DeletedData:any[]=[]
  ORGId:any
  AdminID:any;UserID:any
    //common table
    actionOptions:any
    displayColumns:any
    displayedColumns:any
    employeeLoading:any;
    editableColumns:any =[]
    topHeaders:any = []
    headerColors:any = []
    smallHeaders:any = []
    ReportTitles:any = {}
    selectedRows:any = []
    commonTableOptions :any = {}
    @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
    //ends here
    ApiURL:any
    selectedOrganization:any[]=[]
    OrgList:any[]=[]
    orgSettings:IDropdownSettings = {}
  constructor(private commonservice:HttpCommonService,private toast:ToastrService,private dialog:MatDialog){
     this.branchSettings = {
      singleSelection: true,
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
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
     //common table
     this.actionOptions = [
      // {
      //   name: "View",
      //   icon: "fa fa-eye",
      // }
    ];

    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"SL NO",
      "MappedEmpId":"EMPLOYEE ID",
      "EmployeeName":"EMPLOYEE",
      "orgname":"ORGANIZATION",
      "BranchName":"BRANCH",
      "DepartmentName":"DEPARTMENT",
      "Mobilenumber":"MOBILE",
      "EmplooyeeCreatedDate":"CREATED DATE",
      "EmployeeDeletedDate":"DELETED DATE",
      "Deletedbyname":"DELETED BY",
      "Reason":"Comment"
    },


    this.displayedColumns= [
      "SLno",
      "MappedEmpId",
      "EmployeeName",
      "orgname",
      "BranchName",
      "DepartmentName",
      "Mobilenumber",
      "EmplooyeeCreatedDate",
      "EmployeeDeletedDate",
      "Deletedbyname",
      "Reason"
      // "Actions"
    ]

    this.editableColumns = {
      // "HRA":{
      //   filters:{}
      // },
    }

    // this.topHeaders = [
      // {
      //   id:"blank1",
      //   name:"",
      //   colspan:5
      // },
    // ]

    this.headerColors ={
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    //ends here
  }
ngOnInit(){
this.ORGId = localStorage.getItem('OrgID')
this.AdminID = localStorage.getItem("AdminID");
this.UserID=localStorage.getItem("UserID");
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
  this.ApiURL = "Admin/GetSuborgList?OrgID="+this.ORGId+"&AdminId="+this.UserID
  this.commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
    this.OrgList = data.List
    if(data.List.length == 1){
      this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
    }
  }, (error) => {
     console.log(error);
  });
}
GetBranches() {
  let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
  this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.ORGId+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
  this.commonservice.ApiUsingGetWithOneParam( this.ApiURL).subscribe((data) => {
    this.BranchList = data.List;
    console.log(this.BranchList, "branchlist");
  }, (error) => {
    // this.toast.error(error); 
    this.ShowAlert(error,"error")
    console.log(error);
  });
}

GetDepartments() {
  this.selectedDepartment=[];
  var loggedinuserid=localStorage.getItem("UserID");
  const json={
    OrgID:this.ORGId,
    AdminID:loggedinuserid,
    Branches:this.selectedBranch.map((br: any) => {
      return {
        "id":br.Value
      }
    })
  }
  this.commonservice.ApiUsingPost("Portal/GetEmployeeDepartments",json).subscribe((data) => {
    console.log(data);
    if (data.DepartmentList.length > 0) {
      this.DepartmentList = data.List;
      console.log(this.DepartmentList,"department list");
    }
  }, (error) => {
    // this.toast.error(error);
    this.ShowAlert(error,"error")
     console.log(error);
  });
}
onDeptSelect(item:any){
  console.log(item,"item");
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
 }
onBranchSelect(item:any){
 console.log(item,"item");
 this.selectedDepartment = []
 this.GetDepartments();
}
onBranchDeSelect(item:any){
 console.log(item,"item");
 this.selectedDepartment = []
 this.GetDepartments();
}

getDeletedEmp(){

  if(this.selectedBranch.length == 0){
    // this.toast.warning("Please Select Branch")
    this.ShowAlert("Please Select Branch","error")
    return
  }else{
    this.employeeLoading = true
    const json:any = {
    }
if(this.selectedBranch.length>0){
  json["BranchID"]=this.selectedBranch.map((sb:any)=>sb.Value)
  json["DepartmentID"]=[]
}
if(this.selectedDepartment.length>0){
  json["BranchID"]=[]
  json["DepartmentID"]=this.selectedDepartment.map((sb:any)=>sb.Value)
}
this.commonservice.ApiUsingPost('Admin/GetDeletedUserDetails',json).subscribe((data: any) => {
  if (data) {
    this.DeletedData = data.List.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
    // this.toast.success(data.Message);
  this.employeeLoading = false
  } else {
    // this.toast.error("Something Went Wrong!");
    this.ShowAlert("Something Went Wrong!","error")
  this.employeeLoading = false
  }
},(error)=>{
  if (error.error) {
    // this.toast.error(error.error.Message);
    this.ShowAlert(error.error.Message,"error")
  this.employeeLoading = false
  } else {
    // this.toast.error("An unexpected error occurred.");
    this.ShowAlert("An unexpected error occurred.","error")
    this.employeeLoading = false
  }
})
  }

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
 //common table
 actionEmitter(data:any){
  // if(data.action.name == "View"){
  // }
  
}

//ends here
}
