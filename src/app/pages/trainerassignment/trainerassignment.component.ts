import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../common-table/common-table.component';
import * as moment from 'moment';
import { UpdateComponent } from './update/update.component';

@Component({
  selector: 'app-trainerassignment',
  templateUrl: './trainerassignment.component.html',
  styleUrls: ['./trainerassignment.component.css']
})
export class TrainerassignmentComponent {
  AdminID: any
  ORGId: any
  UserID: any
  EmployeeTrackerList: any[] = []
  StatusList: any[] = ["Pending", "Complete", "On-Going"]
  selectedStatus: any[] = []
  statusSettings: IDropdownSettings = {}
  fromDate: any
  toDate: any
  employeeWise:boolean = false
  EmployeeWiseList:any
  filteredList:any[]=[]
  showFilter:boolean = false
  feSelectedStatus:any[]=[]
    //common table
    actionOptions: any
    displayColumns: any
    displayedColumns: any
    employeeLoading: any;
    editableColumns: any = []
    topHeaders: any = []
    headerColors: any = []
    smallHeaders: any = []
    ReportTitles: any = {}
    selectedRows: any = []
    commonTableOptions: any = {}
    ShowBtn: boolean = false
    selectedOrganization: any[] = []
    OrgList: any[] = []
    BranchList: any; DepartmentList: any[] = [];
    orgSettings: IDropdownSettings = {}
    @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
    //ends here

  constructor(private pdfExportService: PdfExportService, private spinnerService: NgxSpinnerService, private _route: Router, private _commonservice: HttpCommonService, private globalToastService: ToastrService, private dialog: MatDialog
  ) {
    this.statusSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    
    this.actionOptions = [
      {
        name:"View",
        icon:"fa fa-eye"
      },
      {
        name:"Bulk Update",
        icon:"fa fa-edit",
        filter: [
          { field:'IsEdit',value : true}
        ],
      }

    ]

    this.displayColumns = {
      "Actions":"ACTIONS",
      "StatusByTrainee":"STATUS",
      "SLno": "SL NO",
      "TrainingHeading":"TITLE",
      "Training_Description":"DESCRIPTION",
      "AssignedOn":"ASSIGNED ON",
      "TrainerStartDate":"TRAINER START DATE",
      "TrainerEndDate":"TRAINER END DATE",
      "EmployeeCount":"TRAINEE COUNT",
    }

    this.displayedColumns = [
      "Actions",
      "StatusByTrainee",
      "SLno",
      "TrainingHeading",
      "Training_Description",
      "AssignedOn",
      "TrainerStartDate",
      "TrainerEndDate",
      "EmployeeCount",
    ]
  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");;
    this.getTrainerList(true)
  }

  feOnstatusSelect(item:any){
    this.getFeFilters(item)
  }
  feOnDeselectstatus(item:any){
    this.getFeFilters(item)
  }
  
  getFeFilters(fitem:any){
    this.EmployeeTrackerList = this.filteredList.filter(item => {
      return (
          item.StatusByTrainee.toLowerCase().includes(fitem.toLowerCase())
      );
    });
    if(this.feSelectedStatus.length == 0){
      this.EmployeeTrackerList = [...this.filteredList]
    }
  }

  getTrainerList(status:any) {
    this.feSelectedStatus = []
   if(status == false && (this.fromDate == null || this.fromDate == '' || this.fromDate == undefined)){
      this.ShowAlert("Please Select From Date", "warning")
    }
    else if(status == false && (this.toDate == null || this.toDate == '' || this.toDate == undefined)){
      this.ShowAlert("Please Select To Date", "warning")
    }
    else if(status == false && (this.fromDate > this.toDate)){
      this.ShowAlert("From Date Cannot be greater than End Date", "warning")
    }
    else {
    this.employeeLoading = true
    this.spinnerService.show()
    let json:any = {
      "FromDate": this.fromDate,
      "EndDate": this.toDate,
      "Status": this.selectedStatus[0],
      "TrainerId": this.UserID,
    }
      if (status == true) {
      json["Date"] = "30"
    }
    this._commonservice.ApiUsingPost("TraniningMaster/TraineeListForTrainer",json).subscribe((data) => {
      this.EmployeeTrackerList = data.data.List.map((l: any, i: any) => {
        return {
          SLno: i + 1, ...l,
          AssignedOn:moment(l.AssignedOn).format('LL')
        }
      });
      this.showFilter = true
      this.filteredList = [...this.EmployeeTrackerList]
      this.employeeLoading = false
      this.spinnerService.hide()
    }, (error) => {
      this.ShowAlert("Something Went Wrong!..", "error")
      this.employeeLoading = false
      this.spinnerService.hide()
    });
  }
  }

  onstatusSelect(item:any){
  }
  onDeselectstatus(item:any){
  }

  updateRemarks(row: any) {
    if (row.StatusByTrainee == 'Pending') {
      this.ShowAlert("Please Select Status For " + row.EmployeeName, "warning")
    }
    else if (row.RemarksByTrainee == '' || row.RemarksByTrainee == null) {
      this.ShowAlert("Please Enter Remarks For " + row.EmployeeName, "warning")
    }
    else {
      let json = {
        "ID": row.ID,
        "RemarksByTrainee": row.RemarksByTrainee,
        "Status": row.StatusByTrainee,
        "TrainerID": this.UserID,
        "IsCertificate": row.IsCertificateExist,
        "GradeByTrainee": row.Grade
      }
      console.log(json, "sidvdyw");
      this._commonservice.ApiUsingPost("TraniningMaster/TrainesListUpDateByTrainer", json).subscribe((data) => {
        this.ShowAlert(data.message, "success")
      }, (error) => {
        this.ShowAlert("Something Went Wrong!..", "error")
      });
    }
  }

  getStatusClass(Status: string): string {
    return Status.replace(/ /g, '');
  }

  View(row:any){
    this.employeeWise = true
    this.EmployeeWiseList = {
      trainerID:row.TrainerID,
      selectedstatus:row.StatusByTrainee,
      title:row.TrainingHeading,
      desccription:row.Training_Description,
      startdate:row.StartDateByAdmin,
      enddate:row.EndDateByAdmin,
      assignedon:row.AssignedOn,
      createddate:row.CreatedDate,
      fromdate:this.fromDate,
      todate:this.toDate,
      trainingID:row.TrainingID
    }
  }
  // downloadReport() {
  //   let columns = ['EmployeeName', 'Training_Description', 'AssignedOn', 'Status', 'RemarksByTrainee']
  //   const header = ''
  //   const title = 'Employee Tracker List'
  //   let data = this.EmployeeTrackerList.map((item: any) => {
  //     const rowData: any[] = [];
  //     for (let column of columns) {
  //       rowData.push(item[column]);
  //     }
  //     return rowData;
  //   });
  //   console.log(data, "data");
  //   this.pdfExportService.generatePDF(header, title, columns, data);
  // }

  downloadReport() {
    let selectedSub = this.selectedOrganization.map(res => res.Text)[0] || ""
    let SelectedBr:any = localStorage.getItem("Branch") || ""
    localStorage.setItem("SubOrganization",selectedSub)
    localStorage.setItem("BranchName",SelectedBr)
    let selectedColumns = this.displayedColumns
    this.commonTableChild.downloadReport(selectedColumns)
  }

  backToList(){
    this.employeeWise = false
       if (this.EmployeeTrackerList.length > 0) {
            this.getTrainerList(true)
          this.feSelectedStatus = []
        }
        if (this.EmployeeTrackerList.length == 0) {
           this.getTrainerList(false)
            this.feSelectedStatus = []
        }
  }


    //common table
    actionEmitter(data: any) {
      if(data.action.name == "View"){
        this.View(data.row)
      }
      if(data.action.name == "Bulk Update"){
        this.update(data.row)
      }
    }
    //ends here
    update(row:any){
      this.dialog.open(UpdateComponent, {
        data: {row},
      }).afterClosed().subscribe(res=>{
        if (res) {
        if (this.EmployeeTrackerList.length > 0) {
            this.getTrainerList(true)
          this.feSelectedStatus = []
        }
        if (this.EmployeeTrackerList.length == 0) {
           this.getTrainerList(false)
            this.feSelectedStatus = []
        }
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

