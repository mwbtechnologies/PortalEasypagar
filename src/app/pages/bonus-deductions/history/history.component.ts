import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  AdminID:any
  OrgID:any
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
  ApiURL:any
  BDEmpWise:any[]=[]
  ModuleTypeList:any[]=['Attendance','Lunch']
  ListType:any[]=['Bonus','Deduction']
  moduleTypeSettings:IDropdownSettings = {}
  selectedModuleType:any
  selectedListType:any
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
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService,private dialog:MatDialog){
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
          // {
          //   name: "View Details",
          //   icon: "fa fa-edit",
          // },
        ];
    
        this.displayColumns = {
          "Employeeid":"EMPLOYEE ID",
          "Employeename":"EMPLOYEE",
          "Type":"TYPE",
          "Module":"MODULE",
          "BranchName":"BRANCH",
          "DeptName":"DEPARTMENT",
          "Logintype":"LOGIN TYPE",
          "Salarytype":"SALARY TYPE",
          "valuetype":"VALUE TYPE",
          "Noofdays":"NO OF DAYS",
          "Days":"DAYS WORKED",
          "Value":"Bonus/Deduction VALUE",
          "banddType":"Bonus/Deduction TYPE",
          "perday":"PER DAY SALARY",
          "Startdate":"START DATE",
          // "Status":"STATUS" 
        },
    
    
          this.displayedColumns = [
            "Employeeid",
            "Employeename",
            "Type",
            "Module",
            "BranchName",
            "DeptName",
            "Logintype",
            "Startdate",
            "valuetype",
            "Noofdays",
            "Days",
            "Value",
            "banddType",
            "perday",
            "Salarytype",
            // "Status"
          ]
    
        this.editableColumns = {
        }
    
        this.topHeaders = [
        ]
    
        this.headerColors = {
        }
        //ends here
   }
   ngOnInit(){
     this.AdminID = localStorage.getItem("AdminID");
     this.OrgID = localStorage.getItem("OrgID");
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
    const json = {
      OrgID: this.OrgID,
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
    this.tempdeparray = [...this.DepartmentList]
    this.tempdeparray = [];
    this.selectedEmployees = []
    this.getEmployeeList()
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
    this.tempdeparray = []
    this.DepartmentList = []
    this.selectedEmployees = []
    this.EmployeeList = []
    this.selectedDepartment = []
  }
  OnEmployeesChange(_event: any) {
  }
  OnEmployeesChangeDeSelect(event: any) {
  }

  getBDEmpWise(){
    let json = {
     "Branch": [
        {
          "BranchID": this.selectedBranch.map(sb=>sb.Value)[0] || 0,
           "DepartmentIDs": this.selectedDepartment && this.selectedDepartment.length > 0 
             ? this.selectedDepartment.map((sd: any) => sd.Value): [0]
        },
      ],
    "AdminID": this.AdminID,
    "Employeeids": this.selectedEmployees.map(se=>se.Value) || [],
    "Module": this.selectedModuleType?.toString() || "",
    "Type": this.selectedListType?.toString() || "",
    }
    console.log(json,"history");
    
    this.employeeLoading = true
    this._commonservice.ApiUsingPost("Bonusdeduction/Getbonusanddeductionreport",json).subscribe((res:any)=>{
      if(res.Status == true){
       this.BDEmpWise = res.response.map((l: any,i:any) => {
         return { 
          banddType:l.ispercentage ? "Percentage" : "Amount",
          valuetype:l.isdayspercentage ? "Percent" : "Days",
          perday:l.isperday ? 'Yes' : 'No',
          ...l
         } 
        })
        this.employeeLoading = false
      }else if(res.Status == false){
        // this.globalToastService.error(res.Message)
        this.ShowAlert(res.Message,"error")
        this.employeeLoading = false
      }
      else{
        // this.globalToastService.error("An error occurred please try again later")
        this.ShowAlert("An error occurred please try again later","error")
        this.employeeLoading = false
      }
    },(error)=>{
      // this.globalToastService.error(error.error.Message)
      this.ShowAlert(error.error.Message,"error")
      this.employeeLoading = false
    })
  }
    //common table
    actionEmitter(data: any) {
      // if (data.action.name == "View Details") {
      //   this.bonusDeduction(data.row.Type, true, data.row);
      // }
      // if (data.action.name == "Delete") {
      //   this.deletebonusdeduction(data.row);
      // }
    }
    downloadReport() {
      let selectedColumns = this.displayedColumns
      this.commonTableChild.downloadReport(selectedColumns)
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
