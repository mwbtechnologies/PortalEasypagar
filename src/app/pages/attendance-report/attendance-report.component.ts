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
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent implements OnInit {
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
      }
    ];

    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"SL No",
      "MappedEmpId":"EMP ID",
      "Employee":"NAME",
      // "Branch":"BRANCH",
      "Department":"DEPARTMENT",
      "WorkingDays":"WORKING DAYS",
      "ActualPresent":"PRESENT",
      "ExtraDays":"EXTRA DAYS",
      "ActualLeaves":"ABSENT",
      "ActualWeekOff":"WEEK OFF",
      "OfficialHolidays":" HOLIDAYS",
      "PaidLeave":"PAID LEAVES",
      "totalHours":"TOTAL HOURS",
      "Efficiency":"EFFICIENCY", 
      "Actions":"ACTIONS"
    },


    this.displayedColumns= [
      "SLno",
      "MappedEmpId",
      "Employee",
      // "Branch",
      "Department",
      "WorkingDays",
      "ActualPresent",
      "ExtraDays",
      "ActualLeaves",
      "ActualWeekOff",
      "OfficialHolidays",
      "PaidLeave",
      "totalHours",
      "Efficiency",
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
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
    }
    
this.reporttype="Customized";
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
    this.GetOrganization();
     this.GetBranches()
     this.getEmployeeList()
     this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
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

  getEmployeeList(){
    const json:any = {
        ReportType:"attendance",
        AdminID:this.AdminID
    }
    if (this.selectedBranch) {
      json["BranchID"] =  this.selectedBranch.map((br:any)=>{return br.Value})
     }
     var branchid=this.selectedBranch.map((sy:any)=>{ return sy.Value})[0];
     if(branchid>0)
     {
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
   this.DepartmentList = []
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

  OnYearChange(event:any){
    this.spinnerService.show();
    this.getEmployeeList()
    // this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+this.selectedDepartment+"&Year="+event.Value+"&Month="+0+"&Key=en";
    // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    //    console.log(error);this.spinnerService.hide();
    // });
    this.spinnerService.hide();
  }
  onyearDeSelect(event:any){
    this.spinnerService.show();
    this.getEmployeeList()
    // this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+this.selectedDepartment+"&Year="+event.Value+"&Month="+0+"&Key=en";
    // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    //    console.log(error);this.spinnerService.hide();
    // });
    this.spinnerService.hide();
  }
  OnMonthChange(event:any)
  {
    this.spinnerService.show();
    this.getEmployeeList()
    // this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+this.selectedDepartment+"&Year="+this.selectedyear+"&Month="+event.Value+"&Key=en";
    // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    //    console.log(error);this.spinnerService.hide();
    // });
    this.spinnerService.hide();
  }
  onMonthDeSelect(event:any)
  {
    this.spinnerService.show();
    this.getEmployeeList()
    // this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+this.selectedDepartment+"&Year="+this.selectedyear+"&Month="+event.Value+"&Key=en";
    // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    //    console.log(error);this.spinnerService.hide();
    // });
    this.spinnerService.hide();
  }
  OnEmployeesChange(_event:any){
  }
  OnEmployeesChangeDeSelect(event:any){ 
  }
  ViewDetails(_ID:any,Name:any){
    let seleectedmonth = this.selectedMonth.map(res=>res.Value)[0]
    let seleectedyear = this.selectedyear.map(res=>res.Text)[0]
    localStorage.setItem("EmployeeID",_ID);
    localStorage.setItem("Month",seleectedmonth);
    localStorage.setItem("Year",seleectedyear);
    localStorage.setItem("StartDate",this.userselectedfromdate);
     localStorage.setItem("EndDate",this.selectedToDate);
     localStorage.setItem("ReportType",this.reporttype);
     localStorage.setItem("EmployeeName",Name);
    this.showMonthWise = true
    // this._router.navigate(['DaywiseEmpAttendance']);
  }
  backToAttendance(){
    this.showMonthWise = false
    this.GetBranches()
    this.getEmployeeList()
    this.GetYearList()
    this.GetMonthList()
    this.GetDepartments()
  }

  GetReport(){
if((this.selectedType == 'Monthly') && this.selectedyear.length==0){
// this.globalToastService.warning("Please Select Year");
this.ShowToast("Please Select Year","warning")
this.spinnerService.hide();
    }
    else if((this.selectedType == 'Monthly') && this.selectedMonth.length==0){
      // this.globalToastService.warning("Please Select Month");
      this.ShowToast("Please Select Month","warning")

      this.spinnerService.hide();
    }
      else if(this.selectedBranch.length==0){
      // this.globalToastService.warning("Please select Branch");
      this.ShowToast("Please Select Branch","warning")

      this.spinnerService.hide();
    }
      else if(this.selectedEmployees.length==0){
      // this.globalToastService.warning("Please select Employee");
      this.ShowToast("Please Select Employee","warning")

      this.spinnerService.hide();
    }
      else if(this.selectedType ==undefined){
      // this.globalToastService.warning("Please select report type");
      this.ShowToast("Please Select Report Type","warning")

      this.spinnerService.hide();
    }
      else if((this.selectedType == 'Weekly') && !this.selectedWeeklyDate){
      // this.globalToastService.warning("Please select From Date");
      this.ShowToast("Please Select From Date","warning")

      this.spinnerService.hide();
    }
      else if((this.selectedType == 'Custom') && !this.selectedFromDate){
      // this.globalToastService.warning("Please select From Date");
      this.ShowToast("Please Select From Date","warning")

      this.spinnerService.hide();
    }
      else if((this.selectedType == 'Custom') && !this.selectedToDate){
      // this.globalToastService.warning("Please select To Date");
      this.ShowToast("Please Select To Date","warning")
   
      this.spinnerService.hide();
    }
    else if (new Date(this.selectedToDate) < new Date(this.selectedFromDate)) {
      // this.globalToastService.warning("To date should be greater than from date");
      this.ShowToast("To date should be greater than from date","warning")
 
      this.spinnerService.hide();
    }
  else{
if(this.selectedType == 'Weekly'){this.userselectedfromdate=this.selectedWeeklyDate;}
  else{
this.userselectedfromdate=this.selectedFromDate;
  }
   const json:any={
      Month:this.selectedMonth?.map((y:any) => y.Value)[0],
      BranchID:this.selectedBranch?.map((y:any) => y.Value)[0],
      Year:this.selectedyear?.map((y:any) => y.Text)[0],
      AdminID:this.AdminID,
      Employee:this.selectedEmployees?.map((se:any)=>{
        return {
          "EmployeeID":se.ID,
          "EmployeeName":se.Name
        }
      }),
    }
    if(this.selectedType == 'Weekly'){
      json["FromDate"] = this.selectedWeeklyDate
    }
    if(this.selectedType == 'Custom'){
      json["FromDate"] = this.selectedFromDate
      json["ToDate"] = this.selectedToDate
    }
    this.spinnerService.show();
    this.employeeLoading = false;
       this._commonservice.ApiUsingPost("Performance/GetAttendanceReport",json).subscribe((data) => { 
        if(data.Status==true)
        {
          // var table = $('#DataTables_Table_0').DataTable();
          // table.destroy();
          this.employeeLoading = true;
          this.SalaryList = data.Attendance.map((l: any, i: any) => {
             return { 
              SLno: i + 1, ...l ,
              "WeekOff":l.ActualWeekOff
            } })
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
    this.ViewDetails(data.row.EmployeeID, data.row.Employee);
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
