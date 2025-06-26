import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClient } from '@angular/common/http';
import * as saveAs from 'file-saver';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

export class Emp{
  EmployeeID:any;
}

@Component({
  selector: 'app-security-deduction-reports',
  templateUrl: './security-deduction-reports.component.html',
  styleUrls: ['./security-deduction-reports.component.css']
})
export class SecurityDeductionReportsComponent {
 EmployeeList:any;
  EmpClass:Array<Emp> = [];
  BranchList:any[]=[];
  DepartmentList:any; YearList:any;MonthList:any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  file:any;
  EmployeeId:any;
  ShowDownload=false;
  showMonthWise=false;
  selectedDepartmentIds: string[] | any;
  selectedBranch:any[]=[];
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  selectedMonthId: string[] | any;
  selectedEmployeeId: string[] | any;
  OrgID:any;
  SalaryList:any;
  NewApiURL:any;
userselectedfromdate:any;
  index=0;pdfSrc:any;
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
  selectedEmployees:any[]=[];
  UserID:any;
  TypeList:any[]=["Weekly","Monthly","Custom"]
  selectedType:any
  typeSettings:IDropdownSettings = {}
  fromSummary:boolean = true
  selectedWeeklyDate:any
  selectedFromDate:any;
  selectedToDate:any
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
    reporttype:any;
    //ends here
    selectedOrganization:any[]=[]
    OrgList:any[]=[]
    orgSettings:IDropdownSettings = {}
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private dialog:MatDialog,
    private _commonservice: HttpCommonService, private globalToastService:ToastrService,private _httpClient:HttpClient){ 
    this.isSubmit=false
    this.branchSettings = {
      singleSelection: true,
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
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50
    };
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };

    //common table
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye",
      },
          {
        name: "Stop Deductions",
        icon: "fa fa-stop",
         filter: [
          { field:'DeductionStatus',value : 'Active'}
        ],
      }
    ];

    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"SL No",
      "MappedEmpID":"EMP ID",
      "EmployeeName":"NAME",
      "Department":"DEPARTMENT",
      "Gross":"GROSS",
      "TotalSD":"TOTAL SD",
      "MonthlyDeduction":"MONTHLY DEDUCTION",
      "LastDeductionDate":"LAST DEDUCTION DATE",
      "Balance":" BALANCE",
      "FirstDeductionDate":"START DATE",
      // "DeductionType":"DEDUCTION START DATE",
      "LastEstimatedDate":"ESTIMATED COMPLETION DATE",
      // "Status":"DEDUCTION STATUS", 
      "Actions":"ACTIONS"
    },


    this.displayedColumns= [
      "SLno",
      "MappedEmpID",
      "EmployeeName",
      "Department",
      "Gross",
      "TotalSD",
      "MonthlyDeduction",
      "LastDeductionDate",
      "Balance",
      "FirstDeductionDate",
      // "DeductionType",
      "LastEstimatedDate",
      // "Status",
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
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID=localStorage.getItem("UserID");
    this.GetOrganization();
     this.GetBranches()
         const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
const day = today.getDate().toString().padStart(2, '0');
const fromDate = `${year}-${month}-01`;
const toDate = `${year}-${month}-${day}`;
this.selectedFromDate = fromDate;
this.selectedToDate = toDate;

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
      this.ShowToast(error,"error")
       console.log(error);
    });
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowToast(error,"error")
      console.log(error);
    });

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
 
  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json={
      AdminID:loggedinuserid,
      OrgID:this.OrgID,
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

  onBranchSelect(item:any){
   console.log(item,"item");
   this.temparray.push({id:item.Value,text:item.Text });
   this.selectedDepartment = []
   this.DepartmentList = []
   this.GetDepartments();
   this.selectedEmployees = []
  }
  onBranchDeSelect(item:any){
   console.log(item,"item");
   this.temparray.splice(this.temparray.indexOf(item), 1);
   this.selectedDepartment = []
   this.DepartmentList = []
   this.GetDepartments();
   this.selectedEmployees = []
  }

  OnYearChange(event:any){
    this.spinnerService.show();
    this.spinnerService.hide();
  }
  onyearDeSelect(event:any){
    this.spinnerService.show();
    this.spinnerService.hide();
  }
  OnMonthChange(event:any)
  {
    this.spinnerService.show();
    this.spinnerService.hide();
  }
  onMonthDeSelect(event:any)
  {
    this.spinnerService.show();
    this.spinnerService.hide();
  }
  OnEmployeesChange(_event:any){
  }
  OnEmployeesChangeDeSelect(event:any){ 
  }
  ViewDetails(row:any){
    localStorage.setItem("EmployeeID",row.EmployeeID);
       localStorage.setItem("EmployeeName",row.EmployeeName);
          localStorage.setItem("FromDate",this.selectedFromDate);
             localStorage.setItem("ToDate",this.selectedToDate);
                 localStorage.setItem("Balance",row.Balance);
                     localStorage.setItem("TotalSD",row.TotalSD);
                         localStorage.setItem("MonthlyDeduction",row.MonthlyDeduction);
    this.showMonthWise = true
  }
  backToAttendance(){
    this.showMonthWise = false
    this.GetBranches()
    this.GetYearList()
    this.GetMonthList()
    this.GetDepartments()
  }

  GetReport(){
   if(this.selectedBranch.length==0){
      this.ShowToast("Please Select Branch","warning")
      this.spinnerService.hide();
    }
      else if(!this.selectedFromDate){
      this.ShowToast("Please Select From Date","warning")
      this.spinnerService.hide();
    }
      else if(!this.selectedToDate){
      this.ShowToast("Please Select To Date","warning")   
      this.spinnerService.hide();
    }
    else if (new Date(this.selectedToDate) < new Date(this.selectedFromDate))
       {
      this.ShowToast("To date should be greater than from date","warning") 
      this.spinnerService.hide();
    }
  else
  {
  if(this.selectedType == 'Weekly'){this.userselectedfromdate=this.selectedWeeklyDate;}
  else
  {
this.userselectedfromdate=this.selectedFromDate;
  }
   const json:any={
      FromDate:this.selectedFromDate,
       ToDate:this.selectedToDate,
      BranchID:this.selectedBranch?.map((y:any) => y.Value)[0],
      AdminID:this.AdminID
    }
    this.spinnerService.show();
    this.employeeLoading = false;
       this._commonservice.ApiUsingPost("Performance/GetSDReport",json).subscribe((data) => { 
        if(data.Status==true)
        {
          this.employeeLoading = true;
          this.SalaryList = data.List.map((l: any, i: any) => {return { SLno: i + 1, ...l } 
            })
            this.ShowDownload = true;
            this.spinnerService.hide();
        }
        else{
          this.ShowToast(data.Message,"warning")
          this.spinnerService.hide();
        } 
    
      // this.dtTrigger.next(null);
      this.spinnerService.hide();
      this.employeeLoading = false
    }, (error) => {
      this.spinnerService.hide();
      this.employeeLoading = false
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });
      }
 
}
onTypeSelect(item:any){
 this.reporttype=item;
 if(item=="Custom")
 {
  this.reporttype="Customized";
 }
 this.GetYearList()
 this.GetMonthList()
}
onTypeDeSelect(item:any){
  this.GetYearList()
  this.GetMonthList()
}

GetAllEmployeeReport(){
  const json = {
      "AdminID": this.AdminID,
      "Employee":this.selectedEmployees?.map((se:any)=>{
        return {
          "EmployeeID":se.ID,
          "EmployeeName":se.Name
        }
      }),
      "Month":this.selectedMonth?.map((y:any) => y.Value)[0],
      "Year":this.selectedyear?.map((y:any) => y.Text)[0],
  }
    this.ApiURL="ReportsNew/GetAllEmployeAttendanceReport";
    this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
      if(res)
      {
       this.pdfSrc = res;
       window.open(res,'_blank')
      }
      else{
        // this.globalToastService.warning("Sorry Failed to Generate");
        this.ShowToast("Sorry Failed to Generate","warning")
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });
 
}
  GetReportInPDF(){
    this.ApiURL="ReportsNew/GetAttendanceReport";
    this._commonservice.ApiUsingPostNew(this.ApiURL,this.SalaryList,{ responseType: 'text' }).subscribe((res:any) => {
      if(res)
      {
       this.pdfSrc = res;
       window.open(res,'_blank')
      }
      else{
        // this.globalToastService.warning("Sorry Failed to Generate");
        this.ShowToast("Sorry Failed to Generate","warning")
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });
 
}
GetReportInExcel(){
  this.ApiURL="ExReports/GetAttendanceReport ";
  this._commonservice.ApiUsingPostNew(this.ApiURL,this.SalaryList,{ responseType: 'text' }).subscribe((res:any) => {
    if(res)
      {
        // this.downloadExcelFile(res);

        window.open(res,'_blank')
                // this.globalToastService.success("Downloaded");
                this.ShowToast("Downloaded","success")
      }
      else{
        // this.globalToastService.warning("Sorry Failed to Generate");
        this.ShowToast("Sorry Failed to Generate","warning")
      }
}, (error) => {
    this.spinnerService.hide();
    // this.globalToastService.error(error.message);
    this.ShowToast(error.message,"error")
  });
}
downloadExcelFile(url: string) {
  this._httpClient.get(url, { responseType: 'blob' }).subscribe(
    (response: Blob) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'AttendanceReport.xlsx'); // Save the file with a desired name
    },
    (error) => {
      console.error("Error downloading the file:", error);
    }
  );
}

 //common table
 actionEmitter(data:any){
  if(data.action.name == "View"){
    this.ViewDetails(data.row);
  }
  if(data.action.name=="Stop Deductions")
  {
this.StopDeductions(data.row.EmployeeID);
  }
  

}

  StopDeductions(EmpID:any){
    this.ApiURL="Performance/StopSDDeduction?StopSDDeduction="+EmpID+"&UserID="+this.UserID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      if(res.Status==true)
      {
    this.ShowToast(res.Message,"success");
      }
      else{
        // this.globalToastService.warning("Sorry Failed to Generate");
        this.ShowToast(res.Message,"warning")
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });
 
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

