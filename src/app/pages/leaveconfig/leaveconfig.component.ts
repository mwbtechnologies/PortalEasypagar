import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { AddconfigComponent } from './addconfig/addconfig.component';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-leaveconfig',
  templateUrl: './leaveconfig.component.html',
  styleUrls: ['./leaveconfig.component.css']
})
export class LeaveconfigComponent {

  LeaveConfigList:any[]=[]
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
   commonTableOptions :any = {};UserID:any
   @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
   //ends here
   OrgID:any


  constructor(private _router: Router, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private toastr: ToastrService, private dialog: MatDialog) {
         //common table
         this.actionOptions = [
          {
            name: "Edit",
            icon: "fa fa-edit",
          },
          {
            name: "Delete",
            icon: "fa fa-trash",
           class: "danger-button"
          }
        ];
    
        this.displayColumns= {
          "SLno":"SL NO",
          "LeaveTypeName":"LEAVE TYPE",
          "CreatedDate":"CREATED DATE",
          "Status":"STATUS",
          "ModifiedDate":"MODIFIED DATE",
          "Actions":"ACTIONS"
        },
    
    
        this.displayedColumns= [
          "SLno",
          "LeaveTypeName",
          "CreatedDate",
          "Status",
          "ModifiedDate",
          "Actions"
        ] 
        this.topHeaders = [
          // {
          //   id:"blank1",
          //   name:"",
          //   colspan:5
          // }
        ]
        this.headerColors ={
          // Deductions : {text:"#ff2d2d",bg:"#fff1f1"},
        }
        //ends here
  }
ngOnInit(){
  this.OrgID = localStorage.getItem("OrgID");
this.getLeaveList()
}

getLeaveList(){
  this.employeeLoading = true
  this.spinnerService.show()
  this._commonservice.ApiUsingGetWithOneParam("/LeaveMaster/GetLeaveMasterTypes?OrgID="+this.OrgID).subscribe((res:any)=>{
    
    this.LeaveConfigList = res.data.LeaveMasterTypes.map((l: any, i: any) => {
       return { 
        "SLno": i + 1, ...l ,
        "Status":l.IsActive
      }
     })
     console.log(this.LeaveConfigList,"what is the response");
     
    this.employeeLoading = false
    this.spinnerService.hide()
  },(error)=>{
    this.ShowToast("Something Went Wrong!..","error")
    this.employeeLoading = false
    this.spinnerService.hide()
  })
}

addLeaveType(isEdit:any,row?:any){
  this.dialog.open(AddconfigComponent,{
      data: {isEdit,row }
   }).afterClosed().subscribe((res)=>{
    if(res){
      this.getLeaveList()
    }
   })

}

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
 //common table
 actionEmitter(data:any){
  if(data.action.name == "Edit"){
    this.addLeaveType('true',data.row);
  }
  if(data.action.name == "Delete"){
    this.deleteLeave(data.row);
  }
  
}

deleteLeave(row:any){
  this._commonservice.ApiUsingGetNew("api/LeaveMaster/DeleteLeaveMasterTypes?ID="+row.Id).subscribe(res=>{
    this.ShowToast(res.message,"success")
    this.getLeaveList()
  },(error)=>{
    this.ShowToast("Something went wrong!..","error")
  })
}
backToDashboard()
{
  this._router.navigate(["appdashboard"]);
}
//ends here




}
