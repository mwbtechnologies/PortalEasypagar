import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ShowdetailComponent } from '../../employeeattendancereport/showdetail/showdetail.component';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-showpayslip',
  templateUrl: './showpayslip.component.html',
  styleUrls: ['./showpayslip.component.css']
})
export class ShowpayslipComponent {
  SalaryDetails:any[]=[]
  ApiURL:any
  UserID:any
  EmployeeName:any
  LoanList:any
  DatewiseList:any
  constructor(private globalToastService : ToastrService,private _commonservice:HttpCommonService,@Inject(MAT_DIALOG_DATA) public data: any,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ShowdetailComponent>){
    this.EmployeeName = this.data.IL.Employee
  }
  ngOnInit(): void {
    this.UserID = localStorage.getItem("UserID");
    this.getPaySlip()
  }
  getPaySlip(){
    const year = parseInt(this.data.IL.Year)
     this.ApiURL="Performance/GetPayslipDetails?EmployeeID="+this.data.IL.EmployeeID+"&Month="+this.data.IL.MonthID+"&Year="+year;
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
    this.SalaryDetails = res.SalaryDetails;
    this.LoanList = this.SalaryDetails[0].LoanList;
    this.DatewiseList = this.SalaryDetails[0].DateWiseInfo;
    this.spinnerService.hide();
  }, (error) => {
    this.spinnerService.hide();
  }); 
  }

  DownloadSlip(){
    const year = parseInt(this.data.IL.Year)
    this._commonservice.ApiUsingPostNew("ReportsNew/GeneratePay?Admin="+this.data.IL.EmployeeID+"&Month="+this.data.IL.MonthID+"&Year="+year,{ responseType: 'text' }).subscribe((res:any)=>{
      if(res){
        window.open(res,'_blank')
     }
    else{
     this.globalToastService.error("Something went wrong");
    }
  })
  }
}
