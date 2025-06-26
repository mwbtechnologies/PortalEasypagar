import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';

export class FormInput {
  FromDate:any;
  ToDate:any;
}
@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.css']
})
export class ViewAttendanceComponent implements OnInit {
  formInput: FormInput | any;
  OrgID:any;
  AdminID:any;
  isSubmit:boolean;
  AttendanceList:any;
  ApiURL:any;
  Month:any;
  Year:any;
  EmployeeID:any;
  EmployeeName:any;
  MonthName:any;
  pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService){ this.isSubmit=false}
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
    }
    this.formInput={
      FormDate:'',
      ToDate:''
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
    this.EmployeeID=localStorage.getItem("UserID");
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }

  GetAttendanceList()
{
if(this.formInput.FromDate==null||this.formInput.FromDate==undefined||this.formInput.FromDate=="")
{
this.globalToastService.warning("Please Select FromDate");
}
else if(this.formInput.ToDate==null||this.formInput.ToDate==undefined||this.formInput.ToDate=="")
{
  this.globalToastService.warning("Please Select ToDate");
}
else{
  this.spinnerService.show();
  this.ApiURL="SalaryCalculation/GetEmpAttendance?UserID="+this.EmployeeID+"&StartDate="+this.formInput.FromDate+"&EndDate="+this.formInput.ToDate;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.AttendanceList = res.List[0].LoginData;
      this.dtTrigger.next(null);
      this.EmployeeName=res.List[0].EmployeeName;
      this.spinnerService.hide();
    }, (error) => {
      this.globalToastService.error(error.message);this.spinnerService.hide();
        
    });
}
}
}
