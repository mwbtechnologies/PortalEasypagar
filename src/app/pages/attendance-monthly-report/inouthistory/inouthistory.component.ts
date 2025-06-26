import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-inouthistory',
  templateUrl: './inouthistory.component.html',
  styleUrls: ['./inouthistory.component.css']
})
export class InouthistoryComponent {
  @Input()
  employeeData:any
  InOutHistoryList:any[]=[]
 //common table
 actionOptions: any
 displayColumns: any
 displayedColumns: any
 employeeLoading:any=undefined;
 editdata: any
 editableColumns: any = []
 topHeaders: any = []
 headerColors: any = []
 smallHeaders: any = []
 ReportTitles: any = {}
 selectedRows: any = []
 commonTableOptions: any = {}
 tableDataColors: any = {}
 showReportWise: boolean = false
 BankSlip:any[]=[]

 @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
 //ends here
constructor( 
 private _router: Router,private dialog:MatDialog,
 private _commonservice: HttpCommonService,
 private globalToastService: ToastrService){
   //common table
   this.actionOptions = [
     {
       name: "Save details",
       icon: "fa fa-pencil",
     },
   ]

   this.displayColumns = {
     "SelectAll":"SelectAll",
     "SLno":"SL NO",
     "LoginDate":"LOGIN DATE",
     "SessionType":"SESSION TYPE",
     "Transaction":"STATUS",
     "LoginDevice":"LOGIN DEVICE",
   },


   this.displayedColumns= [
     "SelectAll",
     "SLno",
     "LoginDate",
     "SessionType",
     "Transaction",
     "LoginDevice",
   ]

   this.editableColumns = {
   }

   this.topHeaders = [
     // {
     //   id:"blank1",
     //   name:"",
     //   colspan:2
     // }
   ]

   this.headerColors = {
     // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
   }
   this.tableDataColors = {

   }
   //ends here
  

}
ngOnInit(){
this.getInOutHistory()
}

getInOutHistory(){
  this.employeeLoading = true
  this._commonservice.ApiUsingGetWithOneParam("Attendance/GetEmployeeInoutHistory?EmployeeID="+this.employeeData.empid+"&Date="+this.employeeData.date+"").subscribe((data:any)=>{
    if(data.Status == true){
      this.InOutHistoryList = data.List.map((l: any, i: any) => { return { "SLno": i + 1, ...l,"Transaction":l.Status } })
      this.employeeLoading = false
    }else if (data.Status == false){
      // this.globalToastService.error(data.Message)
      this.ShowToast(data.Message,"error")  
      false
    }
    else{
      // this.globalToastService.error('An error occurred while fetching data.')
      this.ShowToast("An error occurred while fetching data.","error")  
    }
  },(error)=>{
    // this.globalToastService.error(error.error.Message)
    this.ShowToast(error.error.Message,"error") 
    this.employeeLoading = false
  })
}

//common table
actionEmitter(data: any) {

}
downloadReport(){
  let selectedColumns = this.displayedColumns
  this.commonTableChild.downloadReport(selectedColumns)
 }
// ShowShiftDetails(row:any){
// }
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
