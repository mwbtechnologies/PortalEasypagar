import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';

@Component({
  selector: 'app-monthwise',
  templateUrl: './monthwise.component.html',
  styleUrls: ['./monthwise.component.css']
})
export class MonthwiseComponent {
@Input()
MonthlyParams:any

monthlyData:any
EmpName:any
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
//ends here
SelectedMonth:any
Selecteddate:any
Selectedbranch:any

constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService){ 
 //common table
 this.actionOptions = [
  // {
  //   name: "View",
  //   icon: "fa fa-eye",
  // }
];

this.displayColumns= {
  // SelectAll: "SelectAll",
  "SLno":"SL No",
  "OT":"OT",
  "FormattedOTHours":"OT HOURS",
   "OTAmount":"OT AMOUNT",
  "WorkStartTime":"WORK-START-TIME",
  "WorkEndTime":"WORK-END-TIME",
  "WorkDuration":"WORK-DURATION",
  "EmployeeStartTime":"EMPLOYEE-START-TIME",
  "EmployeeEndTime":"EMPLOYEE-END-TIME",
  "EmpDuration":"EMPLOYEE-DURATION",
},


this.displayedColumns= [
  "SLno",
  "OT",
  "FormattedOTHours",
   "OTAmount",
  "WorkStartTime",
  "WorkEndTime",
  "WorkDuration",
  "EmployeeStartTime",
  "EmployeeEndTime",
  "EmpDuration",
]

this.editableColumns = {
  // "HRA":{
  //   filters:{}
  // },
}

// this.topHeaders = [
// ]

this.headerColors ={
  // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
}
//ends here
}

ngOnInit(){
  console.log(this.MonthlyParams,"what are here");
  this.EmpName = this.MonthlyParams.EmployeeName
    this.SelectedMonth =  localStorage.getItem("OTMonth")
    this.Selecteddate =  localStorage.getItem("OTYear")
    this.Selectedbranch =  localStorage.getItem("OTBranch")

  this.getMonthWiseData()

}
getMonthWiseData(){
  this.employeeLoading = true
  this.spinnerService.show();
  // this._commonservice.ApiUsingGetWithOneParam("ShiftMaster/GetEmployeeOtReport?EmployeeID="+this.MonthlyParams.employeeid+"&Month="+this.MonthlyParams.month+"&Year="+this.MonthlyParams.year+"").subscribe((res: any) => {
  //   if(res.Status == true){
  //     this.monthlyData = res.SalaryDetails.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
  //     this.employeeLoading = false
  //     this.spinnerService.hide();
  //   }else if(res.Status == false){
  //     this.globalToastService.error(res.message)
  //     this.employeeLoading = false
  //   }else{
  //     this.globalToastService.error("An Error Occured.")
  //     this.employeeLoading = false
  //   }
  // }, (err) => {
  //   this.spinnerService.hide();
  //   this.employeeLoading = false
  //   this.globalToastService.error('Something went wrong')
  // })
  this.monthlyData = this.MonthlyParams.DaywiseDetails.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
  this.employeeLoading = false
  this.spinnerService.hide();
}
actionEmitter(data:any){
  
}
downloadReport() {
  let selectedColumns = this.displayedColumns
  this.commonTableChild.downloadReport(selectedColumns)
}
}
