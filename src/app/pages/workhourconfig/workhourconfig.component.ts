import { Component, ViewChild } from '@angular/core';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ConfigComponent } from './config/config.component';

@Component({
  selector: 'app-workhourconfig',
  templateUrl: './workhourconfig.component.html',
  styleUrls: ['./workhourconfig.component.css']
})
export class WorkhourconfigComponent {
  AdminID: any
  ORGId: any
  UserID: any
  HourConfigList: any[] = []
  //common table
  actionOptions: any
  orginalValues: any = {}
  displayColumns: any
  displayedColumns: any
  Loading: any;
  editableColumns: any = []
  ReportTitles: any = {}
  selectedRows: any = [];
  commonTableDataSource: any
  commonTableOptions: any = {}
  tableDataColors: any;
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here

  constructor(private spinnerService: NgxSpinnerService, private _route: Router, private _commonservice: HttpCommonService, private globalToastService: ToastrService, private dialog: MatDialog
  ) {
    this.actionOptions = [
      {
        name: "Edit",
        icon: "fa fa-edit",
      },
    ]
    this.displayColumns = {
      "SLno":"SL NO",
      "OrgName": "ORGANIZATION",
      "SubOrgName": "SUBORGANIZATION",
      "BranchName": "BRANCH",
      "DepartmentName": "DEPARTMENT",
      "FirstHalf": "FIRST HALF",
      "SecondHalf": "SECOND HALF",
      "WholeDay": "WHOLE DAY",
      "Status": "STATUS",
      "Hours": "HOUR STATUS",
      "CreatedDate": "CREATED DATE",
      "Actions":"ACTIONS"
    },
      this.displayedColumns = [
        "SLno",
        "OrgName",
        "SubOrgName",
        "BranchName",
        "DepartmentName",
        "FirstHalf",
        "SecondHalf",
        "WholeDay",
        "Status",
        "Hours",
        "CreatedDate",
        "Actions"
      ]
  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.getHourConfigList()
  }
  getHourConfigList() {
    this.Loading = true
    this.spinnerService.show()
    this._commonservice.ApiUsingGetWithOneParam("TraniningMaster/GetWorkingHourConfig?Id=" + this.UserID).subscribe((data) => {
      this.HourConfigList = data.List.map((l: any, i: any) => {
        return { 
         SLno: i + 1,
         "Hours":l.IsHours == 1 ? 'Yes' : 'No',
         "Status":l.IsActive,
         ...l ,
       } 
     });
    this.Loading = false
      this.spinnerService.hide()
    }, (error) => {
      this.ShowAlert("Something Went Wrong!..", "error")
      this.Loading = false
      this.spinnerService.hide()
    });
  }

  actionEmitter(data: any) {
    if(data.action.name == 'Edit'){
      this.addConfig(true,data.row)
    }
  }

  addConfig(isEdit:boolean,row?:any){
    this.dialog.open(ConfigComponent,{
      data:{isEdit,row}
    }).afterClosed().subscribe(res=>{
      if(res){
        this.getHourConfigList()
      }
    })
  }

  ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
    this.dialog.open(ShowalertComponent, {
      data: { message, type },
      panelClass: 'custom-dialog',
      disableClose: true
    }).afterClosed().subscribe((res) => {
      if (res) {
        console.log("Dialog closed");
      }
    });
  }
}
