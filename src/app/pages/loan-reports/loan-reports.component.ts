import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

export class Emp{
  EmployeeID:any;
}
@Component({
  selector: 'app-loan-reports',
  templateUrl: './loan-reports.component.html',
  styleUrls: ['./loan-reports.component.css']
})
export class LoanReportsComponent implements AfterViewInit, OnInit {
  EmployeeList:any;
  EmpClass:Array<Emp> = [];
  BranchList:any;
  DepartmentList:any; YearList:any;MonthList:any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  file:any;
  EmployeeId:any;
  showReportWise = false
  selectedDepartmentIds: string[] | any;
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  selectedMonthId: string[] | any;
  selectedEmployeeId: string[] | any;
  OrgID:any;
  LoanList:any;
  NewApiURL:any;
  index=0;
  pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject();
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any; 
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  monthSettings :IDropdownSettings = {}
  yearSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  temparray:any=[]; tempdeparray:any=[];
  typeSettings:IDropdownSettings = {}
  selectedDepartment:any[]=[];
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  selectedEmployees:any[]=[]
  selectedBranch:any[]=[];  
  TypeList:any[]=['All','Loan','Advance']
  selectedType:any[]=[]; 
  showBtn:boolean=false
  dataTable: any;
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
   commonTableOptions :any = {};UserID:any
   @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
   //ends here
   selectedOrganization:any[]=[]
   OrgList:any[]=[]
   orgSettings:IDropdownSettings = {}
  constructor(private globalToastService:ToastrService,private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private toastr:ToastrService,private dialog:MatDialog){ 
    this.isSubmit=false
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.yearSettings = {
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
    };
    this.monthSettings = {
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
    this.typeSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
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
      }
    ];

    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"SL No",
      "MappedEmpId":"EmployeeId",
      "EmployeeName":"EMPLOYEE NAME",
      "Branch":"BRANCH",
      "Department":"DEPARTMENT",
      "TotalLoanTaken":"LOAN/ADVANCE AMOUNT",
      "TotalDeduction":"DEDUCTION",
      "TotalPendingLoan":"BALANCE",
      "Actions":"ACTIONS"
    },


    this.displayedColumns= [
      "SLno",
      "MappedEmpId",
      "EmployeeName",
      // "Branch",
      "Department",
      "TotalLoanTaken",
      "TotalDeduction",
      "TotalPendingLoan",
      "Actions"
    ]

    this.editableColumns = {
      // "HRA":{
      //   filters:{}
      // },
    }

    this.headerColors ={
    }
    //ends here
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID=localStorage.getItem("UserID");
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
    }

    this.GetOrganization();
     this.GetBranches()
     this.getEmployeeList()
     this.GetYearList()
this.GetMonthList()

 
 this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
 
  this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
    const now = new Date();
    const currentMonth = now.getMonth() + 1; 
    const currentYear = now.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = currentMonth - 1;

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
  }

  ngAfterViewInit() {
    this.dtTrigger.subscribe(() => {
        this.initializeDataTable();
    });
}

initializeDataTable() {
    if (this.dataTable) {
        this.dataTable.destroy();
    }
    this.dataTable = $('#DataTables_Table_0').DataTable({
    paging: true,   
    searching: true,   
    info: true,   
    ordering: true  
    });
}

ngOnDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy();
     }
    this.dtTrigger.unsubscribe();
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
  this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.UserID
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
    this.OrgList = data.List
    if(data.List.length == 1){
      this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
    }
  }, (error) => {
    this.ShowToast(error,"error")
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
      this.ShowToast(error,"error")
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
      this.ShowToast(error,"error")
       console.log(error);
    });
  }

  getEmployeeList(){
    const json:any = {
      AdminID:this.AdminID
    }
    if (this.selectedBranch.length>0) {
      json["BranchID"] =  this.selectedBranch.map((br:any)=>{return br.Value});
      if (this.selectedDepartment) {
        json["DepartmentID"] =  this.tempdeparray.map((br:any)=>{ return br.id})
       }
       if (this.selectedyear) {
        json["Year"] =  this.selectedyear.map((sy:any)=>{ return sy.Text})[0]
       }
      if (this.selectedMonth) {
        json["Month"] =  this.selectedMonth.map((sm:any)=>{ return sm.Value})[0]
       }
      this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch",json).subscribe((data) => {
      this.EmployeeList = data.List
      this.selectedEmployees = [...data.List]
      }
      ,(error) => {
      console.log(error);this.spinnerService.hide();
    });
     }
   
   }

   onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.push({id:item.Value, text:item.Text });
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
   this.DepartmentList = []
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  //  this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+item.Value+"&DeptId=0&Year=0&Month="+0+"&Key=en";
  //  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
  //     console.log(error);this.spinnerService.hide();
  //  });
  }
  // onDeptSelect(item:any){
  //   console.log(item,"item");
  //   this.tempdeparray.push({id:item.Value, text:item.Text });
  //  }
  //  onDeptSelectAll(item:any){
  //   console.log(item,"item");
  //   this.tempdeparray = item;
  //  }
  //  onDeptDeSelectAll(){
  //   this.tempdeparray = [];
  //  }
  //  onDeptDeSelect(item:any){
  //   console.log(item,"item");
  //   this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
  //  }
  // onBranchSelect(item:any){
  //  console.log(item,"item");
  //  this.temparray.push({id:item.Value,text:item.Text });
  //  this.GetDepartments();
  //  this.getEmployeeList()
  // }
  // onBranchDeSelect(item:any){
  //  console.log(item,"item");
  //  this.temparray.splice(this.temparray.indexOf(item), 1);
  //  this.GetDepartments();
  //  this.getEmployeeList()
  // }

  OnYearChange(event:any){
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  onyearDeSelect(event:any){
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  OnMonthChange(event:any)
  {
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  onMonthDeSelect(event:any)
  {
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  OnEmployeesChange(_event:any){
  }
  OnEmployeesChangeDeSelect(event:any){ 
  }
  OnTypeChange(event:any){
    this.spinnerService.hide();
  }
  OnTypeChangeDeSelect(event:any){
    this.spinnerService.hide();
  }
  GetReport(){
    if(this.selectedyear.length==0)
        {
          // this.globalToastService.warning("Please Select Year");
          this.ShowToast("Please Select Year","warning")
          this.spinnerService.hide();
          this.employeeLoading = false
        }
        else if(this.selectedMonth.length==0)
          {
            // this.globalToastService.warning("Please Select Month");
            this.ShowToast("Please Select Month","warning")
            this.spinnerService.hide();
            this.employeeLoading = false
          }
          else if(this.selectedBranch.length==0){
            // this.globalToastService.warning("Please select Branch");
            this.ShowToast("Please Select Branch","warning")
             this.employeeLoading = false
            this.spinnerService.hide();
          }
      else if(this.selectedEmployees.length==0)
    {
      // this.globalToastService.warning("Please select Employee");
      this.ShowToast("Please Select Employee","warning")
      this.spinnerService.hide();
      this.employeeLoading = false
    }
  else{
    this.spinnerService.show();
    this.employeeLoading = true
    const json={
          Month:this.selectedMonth?.map((y:any) => y.Value)[0],
          LoanType:this.selectedType[0],
          Year:this.selectedyear?.map((y:any) => y.Text)[0],
          Employee:this.selectedEmployees?.map((se:any)=>{
            return {
              "EmployeeID":se.ID,
              "EmployeeName":se.Name
            }
          }),
          AdminID:this.AdminID,
    
        }
   this._commonservice.ApiUsingPost("Admin/GetLoanReportList",json).subscribe((data) =>{
    if(data.data.length > 0){
      this.LoanList = data.data.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
      this.showBtn = true
       this.spinnerService.hide();
       this.employeeLoading = false
    }
    else{
      // this.globalToastService.warning("No Data Found");
      // this.ShowToast("No Data Found","warning")
      this.LoanList = []      
      this.spinnerService.hide();
      this.employeeLoading = false
    }
  //  this.dtTrigger.next(null);
 }, (error) => {
   this.spinnerService.hide();
   this.employeeLoading = false
  //  this.globalToastService.error(error.message);
  this.ShowToast(error.message,"error")
 });
   }
 
}

  ViewDetails(_ID:any){
    let seleectedmonth = this.selectedMonth.map(res=>res.Value)[0]
    let seleectedyear = this.selectedyear.map(res=>res.Text)[0]
    let selectedbranch = this.selectedBranch?.map((y:any) => y.Value)[0] || 0
    localStorage.setItem("Month",seleectedmonth);
    localStorage.setItem("Year",seleectedyear);
    localStorage.setItem("Branch",selectedbranch);
    localStorage.setItem("Employee",_ID.EmployeeName);
    this.spinnerService.hide();
    this.showReportWise = true
  }
  backToLoan(){
    this.showReportWise = false
    this.GetBranches()
    this.getEmployeeList()
    this.GetYearList()
    this.GetMonthList()
    this.GetDepartments()
  }
  GetReportInPDF(){
  if(this.LoanList.length>0)
  {
    this.ApiURL="PortalReports/GetSharableLoanReport";
    this._commonservice.ApiUsingPost(this.ApiURL,this.LoanList).subscribe((res:any) => {
      if(res.Status==true)
      {
       this.pdfSrc = res.URL;
       window.open(res.URL,"_blank");
      }
      else{
        // this.toastr.warning("Sorry Failed to Generate");
        this.ShowToast("Sorry Failed to Generate","warning")
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      // this.toastr.error(error.message);
    });
  }
  else{
    this.spinnerService.hide();
    // this.toastr.warning("No Records Found");
    this.ShowToast("No Records Found","warning")
  }


}
 //common table
 actionEmitter(data:any){
  if(data.action.name == "View"){
    this.ViewDetails(data.row);
  }
  
}
backToDashboard()
{
  this._router.navigate(["appdashboard"]);
}
//ends here

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