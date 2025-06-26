import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClient } from '@angular/common/http';
import * as saveAs from 'file-saver';
import { CommonTableComponent } from '../common-table/common-table.component';

export class Emp{
  EmployeeID:any;
}

@Component({
  selector: 'app-overall-attendance-report',
  templateUrl: './overall-attendance-report.component.html',
  styleUrls: ['./overall-attendance-report.component.css']
})
export class OverallAttendanceReportComponent implements OnInit {
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
    //ends here
    selectedOrganization:any[]=[]
    OrgList:any[]=[]
    orgSettings:IDropdownSettings = {}
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,
    private _commonservice: HttpCommonService, private globalToastService:ToastrService,private _httpClient:HttpClient){ 
    this.isSubmit=false
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
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID=localStorage.getItem("UserID");
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
    }
    

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
    //  this.getEmployeeList()
     this.GetYearList()
     this.GetMonthList()
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
      this.globalToastService.error(error); console.log(error);
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
    this.DepartmentList=[];
    const json={
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
      this.globalToastService.error(error); console.log(error);
    });
  }

  getEmployeeList(){
    const json:any = { AdminID:this.AdminID }
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
  ViewDetails(_ID:any){
    let seleectedmonth = this.selectedMonth.map(res=>res.Value)[0]
    let seleectedyear = this.selectedyear.map(res=>res.Text)[0]
    localStorage.setItem("EmployeeID",_ID);
    localStorage.setItem("Month",seleectedmonth);
    localStorage.setItem("Year",seleectedyear);
    this.showMonthWise = true
    // this._router.navigate(['DaywiseEmpAttendance']);
  }
  backToAttendance(){
    this.showMonthWise = false
    // this.GetBranches()
    // this.getEmployeeList()
    // this.GetYearList()
    // this.GetMonthList()
    // this.GetDepartments()
    // this.GetReport()
  }

GetReport(){
        if(this.selectedyear.length==0){
    this.globalToastService.warning("Please Select Year");
    this.spinnerService.hide();
        }
        else if(this.selectedMonth.length==0){
          this.globalToastService.warning("Please Select Month");
          this.spinnerService.hide();
        }
          else if(this.selectedBranch.length==0){
          this.globalToastService.warning("Please select Branch");
          this.spinnerService.hide();
        }
          else if(this.selectedEmployees.length==0){
          this.globalToastService.warning("Please select Employee");
          
          this.spinnerService.hide();
        }
      else{
       this.spinnerService.show();
       const json={
          Month:this.selectedMonth?.map((y:any) => y.Value)[0],
          AdminID:this.AdminID,
          Year:this.selectedyear?.map((y:any) => y.Text)[0],
          Employee:this.selectedEmployees?.map((se:any)=>{
            return {
              "EmployeeID":se.ID,
              "EmployeeName":se.Name
            }
          }),
        }
   this.GetReportInPDF(json);
      }
 
}

GetInOutReport(){
  if(this.selectedyear.length==0){
this.globalToastService.warning("Please Select Year");
this.spinnerService.hide();
  }
  else if(this.selectedMonth.length==0){
    this.globalToastService.warning("Please Select Month");
    
    this.spinnerService.hide();
  }
    else if(this.selectedBranch.length==0){
    this.globalToastService.warning("Please select Branch");
    
    this.spinnerService.hide();
  }
    else if(this.selectedEmployees.length==0){
    this.globalToastService.warning("Please select Employee");
    
    this.spinnerService.hide();
  }
else{
 this.spinnerService.show();
 const json={
    Month:this.selectedMonth?.map((y:any) => y.Value)[0],
    AdminID:this.AdminID,
    Year:this.selectedyear?.map((y:any) => y.Text)[0],
    Employee:this.selectedEmployees?.map((se:any)=>{
      return {
        "EmployeeID":se.ID,
        "EmployeeName":se.Name
      }
    }),
  }
this.GetReportInPDFNew(json);
}

}

  GetReportInPDF(json:any){
    this.spinnerService.show();
    this.ApiURL="ReportsNew/GetAllEmployeAttendanceReport";
    this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
      if(res)
      {
        if(res!="No Data")
        {
          this.pdfSrc = res;
          window.open(res,'_blank')
        }
        else{
          this.globalToastService.warning("No Data Found");
        }
        this.spinnerService.hide();
      }
      else{
        this.spinnerService.hide();
        this.globalToastService.warning("Sorry Failed to Generate");
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
    });
 
}

GetReportInPDFNew(json:any){
  this.spinnerService.show();
  this.ApiURL="ReportsNew/GetMonthlyInOutAttendanceReport";
  this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
    if(res)
    {
      if(res!="No Data")
      {
        this.spinnerService.hide();
        this.pdfSrc = res;
        window.open(res,'_blank')
      }
      else{
        this.spinnerService.hide();
        this.globalToastService.warning("No Data Found");
      }
      this.spinnerService.hide();
    }
    else{
      this.spinnerService.hide();
      this.globalToastService.warning("Sorry Failed to Generate");
    }
    this.spinnerService.hide();
  }, (error) => {
    this.spinnerService.hide();
    this.globalToastService.error(error.message);
  });

}
GetReportInExcel(){
  this.ApiURL="ExReports/GetAttendanceReport ";
  this._commonservice.ApiUsingPostNew(this.ApiURL,this.SalaryList,{ responseType: 'text' }).subscribe((res:any) => {
    if(res)
      {
        // this.downloadExcelFile(res);

        window.open(res,'_blank')
                this.globalToastService.success("Downloaded");
      }
      else{
        this.globalToastService.warning("Sorry Failed to Generate");
      }
}, (error) => {
    this.spinnerService.hide();
    this.globalToastService.error(error.message);
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
    this.ViewDetails(data.row.EmployeeID);
  }
  
}
GetInOutReportExcel(){
  if(this.selectedyear.length==0){
this.globalToastService.warning("Please Select Year");
this.spinnerService.hide();
  }
  else if(this.selectedMonth.length==0){
    this.globalToastService.warning("Please Select Month");
    
    this.spinnerService.hide();
  }
    else if(this.selectedBranch.length==0){
    this.globalToastService.warning("Please select Branch");
    
    this.spinnerService.hide();
  }
    else if(this.selectedEmployees.length==0){
    this.globalToastService.warning("Please select Employee");
    
    this.spinnerService.hide();
  }
else{
 this.spinnerService.show();
 const json={
    Month:this.selectedMonth?.map((y:any) => y.Value)[0],
    AdminID:this.AdminID,
    Year:this.selectedyear?.map((y:any) => y.Text)[0],
    Employee:this.selectedEmployees?.map((se:any)=>{
      return {
        "EmployeeID":se.ID,
        "EmployeeName":se.Name
      }
    }),
  }
this.GetReportInExcelNew(json);
}

}
GetReportInExcelNew(json:any){
  this.spinnerService.show();
  this.ApiURL="ReportsNew/GetMonthlyInOutAttendanceReportExcel";
  this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
    if(res)
    {
      if(res!="No Data")
      {
        this.spinnerService.hide();
        this.pdfSrc = res;
        window.open(res,'_blank')
      }
      else{
        this.spinnerService.hide();
        this.globalToastService.warning("No Data Found");
      }
      this.spinnerService.hide();
    }
    else{
      this.spinnerService.hide();
      this.globalToastService.warning("Sorry Failed to Generate");
    }
    this.spinnerService.hide();
  }, (error) => {
    this.spinnerService.hide();
    this.globalToastService.error(error.message);
  });

}
backToDashboard()
{
  this._router.navigate(["appdashboard"]);
}
//ends here


GetReportExcel(){
        if(this.selectedyear.length==0){
    this.globalToastService.warning("Please Select Year");
    this.spinnerService.hide();
        }
        else if(this.selectedMonth.length==0){
          this.globalToastService.warning("Please Select Month");
          this.spinnerService.hide();
        }
          else if(this.selectedBranch.length==0){
          this.globalToastService.warning("Please select Branch");
          this.spinnerService.hide();
        }
          else if(this.selectedEmployees.length==0){
          this.globalToastService.warning("Please select Employee");
          
          this.spinnerService.hide();
        }
      else{
       this.spinnerService.show();
       const json={
          Month:this.selectedMonth?.map((y:any) => y.Value)[0],
          AdminID:this.AdminID,
          Year:this.selectedyear?.map((y:any) => y.Text)[0],
          Employee:this.selectedEmployees?.map((se:any)=>{
            return {
              "EmployeeID":se.ID,
              "EmployeeName":se.Name
            }
          }),
        }

            this.spinnerService.show();
    this.ApiURL="ExReports/GetAllEmployeAttendanceReportExcel";
    this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
      if(res)
      {
        if(res!="No Data")
        {
          this.pdfSrc = res;
          window.open(res,'_blank')
        }
        else{
          this.globalToastService.warning("No Data Found");
        }
        this.spinnerService.hide();
      }
      else{
        this.spinnerService.hide();
        this.globalToastService.warning("Sorry Failed to Generate");
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
    });
  
      }
 
}
}
