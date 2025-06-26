import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-employee-daywise-expense-report',
  templateUrl: './employee-daywise-expense-report.component.html',
  styleUrls: ['./employee-daywise-expense-report.component.css']
})
export class EmployeeDaywiseExpenseReportComponent  implements OnInit {
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
  Year:any;
  Month:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService){ this.isSubmit=false}
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.Year = localStorage.getItem("Year");
    this.EmployeeId = localStorage.getItem("EmployeeID");
    this.Month = localStorage.getItem("Month");
    if (this.AdminID==null) {

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
    this.ApiURL="Admin/GetDailyExpenseReport?EmployeeID="+this.AdminID+"&Month="+this.Month+"&Year="+this.Year;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
        this.ExpenseList = res.ExpenseList[0].Expenses;        
   this.dtTrigger.next(null);
      }, (error) => {
        this.globalToastService.error(error.message);this.spinnerService.hide();
      });
      this.spinnerService.hide();
}
}

