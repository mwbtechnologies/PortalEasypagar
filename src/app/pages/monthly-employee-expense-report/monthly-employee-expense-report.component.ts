import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-monthly-employee-expense-report',
  templateUrl: './monthly-employee-expense-report.component.html',
  styleUrls: ['./monthly-employee-expense-report.component.css']
})
export class MonthlyEmployeeExpenseReportComponent  implements OnInit  {
  BranchList:any;
  DepartmentList:any; YearList:any;MonthList:any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  file:any;UserID:any
  EmployeeId:any;
  selectedMonthId: string[] | any;
  selectedDepartmentIds: string[] | any;
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  OrgID:any;
  ExpenseList:any;
  NewApiURL:any;
  index=0;
  Month:any;
  Year:any;
  pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   


  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService){ this.isSubmit=false}
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

    this.selectedDepartmentIds=[];
    this.selectedBranchId=[];
    this.selectedYearId=[];
this.ApiURL="Admin/GetBranchList?OrgID="+this.OrgID+"&AdminId="+this.UserID;
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.BranchList = data.List, (error) => {
    this.globalToastService.error(error); console.log(error);
  });

  this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
    this.globalToastService.error(error); console.log(error);
  });
  this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
    this.globalToastService.error(error); console.log(error);
  });
  this.NewApiURL="Admin/GetAdminDepartments?AdminID="+this.AdminID;
  this._commonservice.ApiUsingGetWithOneParam(this.NewApiURL).subscribe((data) => this.DepartmentList = data.List, (error) => {
    this.globalToastService.error(error); console.log(error);
  });
this.Month=localStorage.getItem("Month");
this.Year=localStorage.getItem("Year");
this.selectedMonthId=this.Month;
this.selectedYearId=this.Year;

  this.selectedBranchId=localStorage.getItem("Branch");
  this.selectedDepartmentIds=localStorage.getItem("Department");
  this.GetExpenseList();
  
this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}

  }
  OnBranchChange(event:any)
  {
    this.selectedDepartmentIds=[];
    this.selectedYearId=[];
    if(this.selectedBranchId.length==0){this.selectedBranchId=0;}
  }
  OnDepartmentChange(event:any)
  {
    this.selectedYearId=[];
    if(this.selectedBranchId.length==0){this.selectedBranchId=0;}
  }
  OnYearChange(event:any)
  {
    if(this.selectedDepartmentIds.length==0){this.selectedDepartmentIds=0;}
  }
 
  ViewDetails(_ID:any)
  {
    localStorage.setItem("EmployeeID",_ID);
    localStorage.setItem("Month",this.selectedMonthId);
    localStorage.setItem("Year",this.selectedYearId);
    this._router.navigate(['DatewiseEmpExpenses']);
  }
  GetReport()
  {
   
  if(this.selectedBranchId.length==0)
  {
    this.globalToastService.warning("Please Select Branch");
  }
  else if(this.selectedYearId.length==0)
  {
    this.globalToastService.warning("Please Select Year");
  }
  else
  {
    this.GetExpenseList();
}

  }
  GetExpenseList()
  {
    this.spinnerService.show();
    const json={
      Month:this.selectedMonthId,
      BranchID:this.selectedBranchId,
      DepartmentID:this.selectedDepartmentIds,
      Year:this.selectedYearId,
      Employee:[],
      AdminID:this.AdminID
    }
    
      this._commonservice.ApiUsingPost("Admin/GetExpenseReport",json).subscribe((res:any) => {
        this.ExpenseList = res.ExpenseList;   this.dtTrigger.next(null);this.spinnerService.hide();
      }, (error) => {
        this.globalToastService.error(error.message);this.spinnerService.hide();
         
      });
}
GetReportInPDF()
{
  if(this.ExpenseList.length>0)
  {
    const json={
      AttendanceList:this.ExpenseList
    }
    this.ApiURL="PortalReports/GetEmployeeExpenseReport";
    this._commonservice.ApiUsingPost(this.ApiURL,json).subscribe((res:any) => {
      if(res.Status==true)
      {
       this.pdfSrc = res.URL;
        localStorage.setItem("PdfURL",this.pdfSrc);
        localStorage.setItem("RouterPath","DaywiseEmpAttendance");
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
  else{
    this.spinnerService.hide();
    this.globalToastService.warning("No Records Found");
  }


}
}
