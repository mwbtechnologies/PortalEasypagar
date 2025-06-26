import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-daywise-expense-report',
  templateUrl: './daywise-expense-report.component.html',
  styleUrls: ['./daywise-expense-report.component.css']
})
export class DaywiseExpenseReportComponent  implements OnInit {
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  file:any;
  EmployeeId:any;
  OrgID:any;
  ExpenseList:any;
  NewApiURL:any;
  index=0;
  Date:any;
  pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   


  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService){ this.isSubmit=false}
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.Date = localStorage.getItem("Date");
    this.OrgID = localStorage.getItem("OrgID");
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
    this.GetExpenseList();
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }
 
  GetExpenseList()
  {this.spinnerService.show();
    this.ApiURL="Admin/GetDaywiseExpenseReport?AdminID="+this.AdminID+"&Date="+this.Date;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
        this.ExpenseList = res.ExpenseList[0].Expenses;
        this.dtTrigger.next(null);
        this.spinnerService.hide();
      }, (error) => {
        this.globalToastService.error(error.message); this.spinnerService.hide();     });
}
GetReportInPDF()
{
  if(this.ExpenseList.length>0)
  {
    const json={
      AttendanceList:this.ExpenseList
    }
    this.ApiURL="PortalReports/GetOrgDateWiseExpenseReport";
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

