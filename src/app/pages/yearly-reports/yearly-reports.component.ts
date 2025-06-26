import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

export class Emp{
  EmployeeID:any;
}

@Component({
  selector: 'app-yearly-reports',
  templateUrl: './yearly-reports.component.html',
  styleUrls: ['./yearly-reports.component.css']
})
export class YearlyReportsComponent  implements OnInit {
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
  ReportsList:any;
  selectedReportIds: string[] | any;
  selectedDepartmentIds: string[] | any;
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  selectedMonthId: string[] | any;
  selectedEmployeeId: string[] | any;
  OrgID:any;
  SalaryList:any;
  DownloadURL:any;
  NewApiURL:any;
  index=0;
  pdfSrc:any; ShowPDF=false;UserID:any;
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService){ this.isSubmit=false}
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID=localStorage.getItem("UserID");
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
    }

    this.ShowPDF=true;
    //  this.pdfSrc = res.URL;
    this.pdfSrc="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

    this.selectedDepartmentIds=[];
    this.selectedBranchId=[];
    this.selectedYearId=[];
    this.selectedMonthId=[];
    this.selectedEmployeeId=[];
this.ApiURL="Admin/GetBranchList?OrgID="+this.OrgID+"&AdminId="+this.UserID;
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.BranchList = data.List, (error) => {
     console.log(error);
  });

  this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
     console.log(error);
  });

  this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
     console.log(error);
  });
  this._commonservice.ApiUsingGetWithOneParam("Admin/GetForms").subscribe((data) => this.ReportsList = data.Requests[0].Forms, (error) => {
     console.log(error);
  });
  this.NewApiURL="Admin/GetAdminDepartments?AdminID="+this.AdminID;
  this._commonservice.ApiUsingGetWithOneParam(this.NewApiURL).subscribe((data) => this.DepartmentList = data.List, (error) => {
     console.log(error);
  });

  this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   

  }
  OnBranchChange(event:any)
  {this.spinnerService.show();
    this.selectedDepartmentIds=[];
    this.selectedYearId=[];
    this.selectedMonthId=[];
    this.selectedEmployeeId=[];
    if(this.selectedBranchId.length==0){this.selectedBranchId=0;}
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+event.Value+"&DeptId=0&Year=0&Month="+0;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
       console.log(error);
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }
  OnDepartmentChange(event:any)
  {this.spinnerService.show();
    this.selectedYearId=[];
    this.selectedMonthId=[];
    this.selectedEmployeeId=[];
    if(this.selectedBranchId.length==0){this.selectedBranchId=0;}
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranchId+"&DeptId="+event.Value+"&Year=0&Month="+0;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
       console.log(error);this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }
  OnYearChange(event:any)
  {this.spinnerService.show();
    this.selectedMonthId=[];
    this.selectedEmployeeId=[];
    if(this.selectedDepartmentIds.length==0){this.selectedDepartmentIds=0;}
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranchId+"&DeptId="+this.selectedDepartmentIds+"&Year="+event.Value+"&Month="+0;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
       console.log(error);this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }
  OnMonthChange(event:any)
  {
    this.spinnerService.show();
    this.selectedEmployeeId=[];
    if(this.selectedYearId.length==0){this.selectedYearId=0;}
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranchId+"&DeptId="+this.selectedDepartmentIds+"&Year="+this.selectedYearId+"&Month="+event.Value;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
       console.log(error);
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }
 
  OnEmployeesChange(_event:any)
  {
    if(this.selectedMonthId.length==0){this.selectedMonthId=0;}
    var employees=this.selectedEmployeeId;
  }
  ViewDetails(_ID:any)
  {
    localStorage.setItem("EmployeeID",_ID);
    localStorage.setItem("Month",this.selectedMonthId);
    localStorage.setItem("Year",this.selectedYearId);
    this._router.navigate(['DaywiseEmpAttendance']);
  }
  download(url:any, downloadName:any) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = downloadName;
    a.click();
    document.body.removeChild(a);
  }
  GetReportInPDF()
  {
    this.spinnerService.show();
if(this.selectedEmployeeId.length==0)
{
  this.globalToastService.warning("Please Select Employees");
  this.spinnerService.hide();
}
else{
  for(this.index=0;this.index<this.selectedEmployeeId.length;this.index++){
    let customObj = new Emp();
    customObj.EmployeeID=this.selectedEmployeeId[this.index];    
    this.EmpClass.push(customObj);
  }
  if(this.selectedBranchId.length==0)
  {
    this.globalToastService.warning("Please Select Branch");
this.spinnerService.hide();
  }
  else if(this.selectedMonthId.length==0)
  {
    this.globalToastService.warning("Please Select Month");
    this.spinnerService.hide();
  }
  else if(this.selectedYearId.length==0)
  {
    this.globalToastService.warning("Please Select Year");
    this.spinnerService.hide();
  }
  else
  {
    const json={
      Month:this.selectedMonthId,
      BranchID:this.selectedBranchId,
      DepartmentID:this.selectedDepartmentIds,
      Year:this.selectedYearId,
      Employee:this.EmpClass,
      AdminID:this.AdminID
    }
    this.ApiURL="PortalReports/"+this.selectedReportIds;
    this._commonservice.ApiUsingPost(this.ApiURL,json).subscribe((res:any) => {
      this.DownloadURL = res.URL;
      if(res.Status==true)
      {
        this.ShowPDF=true;
       this.pdfSrc = res.URL;
       this.ApiURL="Admin/DownloadFile?Url="+this.pdfSrc;
      //  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      //  });
        localStorage.setItem("PdfURL",this.pdfSrc);
        localStorage.setItem("RouterPath","AnnualReports");
        this._router.navigate(['PdfViewer']);
      }
      else{
        this.globalToastService.warning("Sorry Failed to Generate");
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      this.globalToastService.error(error.message);
    });
  }
 
}
  }
  GetReportInExcel()
  {
if(this.selectedEmployeeId.length==0)
{
  alert("Please select Employee");
}
else{
  for(this.index=0;this.index<this.selectedEmployeeId.length;this.index++){
    let customObj = new Emp();
    customObj.EmployeeID=this.selectedEmployeeId[this.index];  
    this.EmpClass.push(customObj);
  }
  if(this.selectedBranchId.length==0)
  {
this.globalToastService.warning("Please Select Branch");
  }
  else if(this.selectedMonthId.length==0)
  {
    this.globalToastService.warning("Please Select Month");
  }
  else if(this.selectedYearId.length==0)
  {
    this.globalToastService.warning("Please Select Year");
  }
  else
  {
    const json={
      Month:this.selectedMonthId,
      BranchID:this.selectedBranchId,
      DepartmentID:this.selectedDepartmentIds,
      Year:this.selectedYearId,
      Employee:this.EmpClass,
      AdminID:this.AdminID
    }
    this.ApiURL="ExReports/"+this.selectedReportIds;
    this._commonservice.ApiUsingPost(this.ApiURL,json).subscribe((res:any) => {
      this.DownloadURL = res.URL;
    }, (error) => {
      this.globalToastService.error(error.message);
    });
  }
 
}
  }
}
