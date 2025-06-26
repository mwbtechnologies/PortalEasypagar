import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

export class Emp{
  EmployeeID:any;
}

@Component({
  selector: 'app-annual-reports',
  templateUrl: './annual-reports.component.html',
  styleUrls: ['./annual-reports.component.css']
})
export class AnnualReportsComponent  implements OnInit {
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
  index=0;UserID:any;
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;
  pdfSrc:any; ShowPDF=false;ShowDownload=true;
    selectedOrganization:any[]=[]
    OrgList:any[]=[]
    orgSettings:IDropdownSettings = {}
  constructor(private httpclient:HttpClient,private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService, private downlodfileservice:DownloadFileService){ 
    this.isSubmit=false
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

    this.ShowPDF=true;
    //  this.pdfSrc = res.URL;
    this.pdfSrc="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

    this.selectedDepartmentIds=[];
    this.selectedBranchId=[];
    this.selectedYearId=[];
    this.selectedMonthId=[];
    this.selectedEmployeeId=[];
    this.GetOrganization()
let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.BranchList = data.List, (error) => {
     console.log(error);
  });

  this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
     console.log(error);
  });

  this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
     console.log(error);
  });
  this._commonservice.ApiUsingGetWithOneParam("Admin/GetForms/en").subscribe((data) => this.ReportsList = data.Requests[0].Forms, (error) => {
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
    this.ShowDownload=true;
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
    this.ShowDownload=true;
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
    this.ShowDownload=true;
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
    this.ShowDownload=true;
  }
 
  OnEmployeesChange(_event:any)
  {
    if(this.selectedMonthId.length==0){this.selectedMonthId=0;}
    var employees=this.selectedEmployeeId;
    this.ShowDownload=true;
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
  onselectedOrg(item:any){
  }
  onDeselectedOrg(item:any){
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
    this.ApiURL="ReportsNew/"+this.selectedReportIds;
    this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
      this.DownloadURL = res.URL;

      this.globalToastService.success("Generated Successfully");
      if(res.Status==true){
        this.ShowPDF=true;
       this.pdfSrc = res.URL;
       this.downloadPDFFile(this.pdfSrc);
      // //  window.location.href=this.pdfSrc;
      //  this.ApiURL="Admin/DownloadFile?Url="+this.pdfSrc;
      // //  window.open(this.pdfSrc, '_blank');
      // console.log(this.pdfSrc);
      // this.ShowDownload=false;
      // // this.downloadfile(this.pdfSrc);
      

      //  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      //  });
        // localStorage.setItem("PdfURL",this.pdfSrc);
        // localStorage.setItem("RouterPath","AnnualReports");
        // this._router.navigate(['PdfViewer']);
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


  downloadPDFFile(url: string) {
    this.httpclient.get(url, { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'EmployeeReport.pdf'; // Specify the desired filename and extension
        link.click();
        URL.revokeObjectURL(link.href);
      });
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
    this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
      this.DownloadURL = res.URL;
    }, (error) => {
      this.globalToastService.error(error.message);
    });
  }
 
}
  }

//   downLoadFile(data: any, type: string) {
//     let blob = new Blob([data], { type: type});
//     let url = window.URL.createObjectURL(blob);
//     let pwa = window.open(url);
//     if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
//         alert( 'Please disable your Pop-up blocker and try again.');
//     }
// }


public downloadfile(URL:any):void{
  this.downlodfileservice.DownloadFile(URL).subscribe(response=>{
    let filename:string=response.headers.get('content-disposition')?.split(';')[1].split('=')[1] as string;
    let blob:Blob=response.body as Blob;
    let a = document.createElement('a');
    a.download=filename;
    a.href=window.URL.createObjectURL(blob);
    a.click();
  })

}
}
