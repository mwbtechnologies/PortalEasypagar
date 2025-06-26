import { Component, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subject } from 'rxjs';
import { Emp } from '../generate-payslip/generate-payslip.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationpopupComponent } from 'src/app/layout/admin/confirmationpopup/confirmationpopup.component';

@Component({
  selector: 'app-easytrackermapping',
  templateUrl: './easytrackermapping.component.html',
  styleUrls: ['./easytrackermapping.component.css']
})
export class EasytrackermappingComponent {
  EmployeeList:any;
  EmpClass:Array<Emp> = [];
  BranchList:any[]=[];
  DepartmentList:any; YearList:any;MonthList:any;
  AdminID: any;
  ApiURL:any;
  OrgID:any;
  SalaryList:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  ViewPermission:any;
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  monthSettings :IDropdownSettings = {}
  yearSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  temparray:any=[]; tempdeparray:any=[];
  selectedDepartment:any[]=[];
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  selectedEmployees:any;
  selectedBranch:any[]=[]
  UserID:any;
  featureCount:any
  ESMappingList:any[]=[]
      //common table
      actionOptions:any
      displayColumns:any
      displayedColumns:any
      employeeLoading:any=undefined;
      editableColumns:any =[]
      topHeaders:any = []
      headerColors:any = []
      smallHeaders:any = []
      ReportTitles:any = {}
      selectedRows:any = []
      commonTableOptions :any = {}
      @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
      //ends here
      selectedOrganization:any[]=[]
      OrgList:any[]=[]
      orgSettings:IDropdownSettings = {}
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private dialog:MatDialog,
    private _commonservice: HttpCommonService, private globalToastService:ToastrService,private _httpClient:HttpClient){ 
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
        enableCheckAll: false,
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
        name: "Delete",
        icon: "fa fa-trash",
      }
    ];

    this.displayColumns= {
      "SLno":"Sl No",
      "MappedEmpId":"EMPLOYEE ID",
      "EmployeeName":"EMPLOYEE",
      "AssignedDate":"ASSIGNED DATE",
      "Username":"Phone Number",
      "Message":"MESSAGE",
      "Actions":"ACTION"
    },


    this.displayedColumns= [
      "SLno",
      "MappedEmpId",
      "EmployeeName",
      "AssignedDate",
      "Username",
      "Message",
      "Actions"
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
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
    this.GetOrganization();
     this.GetBranches()
    //  this.getFeatureCount()
     this.GetList()
     this.getEmployeeList()
  }

  GetList(){
    this.employeeLoading = true;
    this.spinnerService.show();
    this._commonservice.ApiUsingPostWithOneParam("Tracker/GetTrackerEmployeeList?AdminID="+this.AdminID+"").subscribe((res:any)=>{
      if(res.Status == true){
        this.ESMappingList = res.List.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
        this.employeeLoading = false
         this.spinnerService.hide();
      }else if (res.Status == false){
        // this.globalToastService.error(res.message); 
        this.ShowAlert(res.Message,"error")
         this.spinnerService.hide();
        this.employeeLoading = false
      }else{
        // this.globalToastService.error("An Error Occured .Please Try Again Later"); 
        this.ShowAlert("An Error Occured .Please Try Again Later","error")
        this.employeeLoading = false
         this.spinnerService.hide();
      }
     },(error)=>{
      // this.globalToastService.error(error.error.message); 
      this.ShowAlert(error.error.message,"error")
      this.employeeLoading = false
       this.spinnerService.hide();
     })
     }
  // getFeatureCount(){
  // const url = "http://192.168.1.36/MasterPortalv2/subscription/feature/count";
  // const json = {"feature":"easytracker","SoftwareID":8,"UserId":parseInt(this.AdminID),"Version":"1"}
  // this._commonservice.MasterApiUsingPost(url,json).subscribe((res:any)=>{
  //  this.featureCount = res.data.AvailableCount

  // })
  // }
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
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json={
      OrgID:this.OrgID,
      AdminID:loggedinuserid,
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
  let BranchID = this.selectedBranch?.map((y:any) => y.Value)[0] || 0
  let deptID = this.selectedDepartment?.map((y:any) => y.Value)[0] || 0
   this.ApiURL="Tracker/GetEmployees?AdminID="+this.AdminID+"&BranchID="+BranchID+"&DeptId="+deptID+"&Year="+0+"&Month="+0+"&Key=en";
   this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
    this.EmployeeList = data.data
    this.featureCount = data.RemainingCount
    this.selectedEmployees = this.EmployeeList.filter((emp:any) => emp.IsTrackerUser === true);
    this.EmployeeList = this.EmployeeList.map((emp:any) => ({
      ...emp,
      isDisabled: this.selectedEmployees.some((selected:any) => selected.Value === emp.Value),
    }));
    this.employeeSettings = {
    limitSelection: this.featureCount,
    disabledField: 'isDisabled',
    }
  }, (error) => {
      console.log(error);this.spinnerService.hide();
   });
  
 }
 
  onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.push({id:item.Value, text:item.Text });
    if(this.tempdeparray.length  == this.DepartmentList.length) this.onDeptDeSelectAll()
    this.selectedEmployees = []
    this.getEmployeeList()
   }
   onDeptSelectAll(){
     this.tempdeparray = [...this.DepartmentList]
     this.selectedEmployees = []
     this.tempdeparray = [];
    this.getEmployeeList()
   }
   onDeptDeSelectAll(){
    this.tempdeparray = [];
    this.selectedEmployees = []
    this.getEmployeeList()
   }
   onDeptDeSelect(item:any){
    console.log(item,"item");
    console.log(this.tempdeparray,"tempdeparray");
    console.log(this.tempdeparray.findIndex((sd:any)=>sd == item));
    
    if(this.tempdeparray.findIndex((sd:any)=>sd == item) != -1){
      this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    }else{
      this.tempdeparray = this.DepartmentList.map((dl:any)=>{return {id:dl.Value, text:dl.Text }}).filter((dl:any)=>dl.id != item.Value && dl.text != item.Text)
    }

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
   this.DepartmentList = []
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  }
  OnEmployeesChange(_event:any){
 
  }
  OnEmployeesChangeDeSelect(event:any){ 
  }
  RemoveMapping(empid:any){
    this.spinnerService.show()
    this._commonservice.ApiUsingGetWithOneParam("Tracker/RemoveTrackerEmp?EmployeeID="+empid+"&AdminID="+this.AdminID+"").subscribe((res:any)=>{
      if(res.Status == true){
        // this.globalToastService.success(res.Message)
        this.ShowAlert(res.Message,"success")
         this.spinnerService.hide()
        this.GetList()
      }else if (res.Status == false){
        // this.globalToastService.error(res.Message)
        this.ShowAlert(res.Message,"error")
         this.spinnerService.hide()
      }
    },(error)=>{
      // this.globalToastService.error(error.error.Message)
      this.ShowAlert(error.error.Message,"error")
       this.spinnerService.hide()
    })
  }
  MapEmployees(){
  if(this.selectedBranch.length==0){
      // this.globalToastService.warning("Please select Branch");
      this.ShowAlert("Please select Branch","warning")
       this.employeeLoading = false
      this.spinnerService.hide();
    }
      else if(this.selectedEmployees.length==0){
      // this.globalToastService.warning("Please select Employee");
      this.ShowAlert("Please select Employee","warning")
       this.employeeLoading = false
      this.spinnerService.hide();
    }
  else{
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      data: "Are You Sure Want To Map Employees!",
    });
    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.submit();
      dialogRef.close();
  
    },(error):any=>{
      // this.globalToastService.error(error.error.message)
      this.ShowAlert(error.error.message,"error")
    });
  }
  }
  submit(){
    const json = {
      "AdminID":2902,
      "Employee":this.selectedEmployees.map((br: any) => {
        return {
          "EmployeeID":br.Value
        }
      })
    }
    console.log(json,"sdsds");
    
  this._commonservice.ApiUsingPost("Tracker/MapTrackerEmployee",json).subscribe((res:any)=>{
    if(res.Status == true){
      // this.globalToastService.success(res.Message)
      this.ShowAlert(res.Message,"success")
      this.GetList()
      this.selectedBranch = []
      this.selectedEmployees= []
    }else if (res.Status == false){
      // this.globalToastService.error(res.Message)
      this.ShowAlert(res.Message,"error")
    }
  },(error)=>{
    // this.globalToastService.error(error.error.Message)
    this.ShowAlert(error.error.Message,"error")
  })
  }

   //common table
 actionEmitter(data:any){
  if(data.action.name == "Delete"){
    this.RemoveMapping(data.row.EmployeeID);
  }  
}

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
