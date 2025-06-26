import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { environment } from 'src/environments/environment';
import { TrainerwiseupdateComponent } from '../trainerwiseupdate/trainerwiseupdate.component';

@Component({
  selector: 'app-trainerwise',
  templateUrl: './trainerwise.component.html',
  styleUrls: ['./trainerwise.component.css']
})
export class TrainerwiseComponent {
  @Input() trainerWiseList: any
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
  OrgID: any
  AdminID: any
  UserID: any
  pdfSrc: any;
  TrainerWiseLiting: any[] = []
onestar: number = 0;
twostars: number = 0;
threestars: number = 0;
fourstars: number = 0;
fivestars: number = 0;
  filteredList: any[] = []
  showFilter: boolean = false
  feSelectedStatus: any[] = []
  StatusList: any[] = ["Pending", "Complete", "On-Going"]
  statusSettings: IDropdownSettings = {}

  constructor(
    private spinnerService: NgxSpinnerService,
    private _route: Router,
    private _commonservice: HttpCommonService,
    private globalToastService: ToastrService,
    private dialog: MatDialog
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
        name: "Update",
        icon: "fa fa-edit",
        filter: [
          { field: 'IsEditable', value: true }
        ],
      }
    ]

    this.displayColumns = {
      "Actions": "ACTIONS",
      "SLno": "SL NO",
      // "TrainerID":"TRAINER ID",
      "TrainerName": "TRAINER",
      // "EmployeeID":"EMP ID",
      "EmployeeName": "TRAINEE",
      "TrainingHeading": "TITLE",
      "Training_Description": "DESCRIPTION",
      "CreatedDate": "ASSIGNED ON",
      "SessionStartDate": "TRAINER START DATE",
      "SessionEndDate": "TRAINER END DATE",
      "AssignedByName": "ASSIGNED BY",
      "StatusByTrainee": "TRAINER STATUS",
      "RemarksByTrainee": "TRAINER REMARKS",
      "StatusByEmployee": "TRAINEE STATUS",
      // "RatingbyEmployeForTrainer":"TRAINEE REMARKS",
      "RemarksByEmployee": "TRAINEE REMARKS",
      // "RemarksSubmittedOn":"SUBMITTED ON",
    }

    this.displayedColumns = [
      "Actions",
      "SLno",
      // "TrainerID",
      // "TrainerName",
      // "EmployeeID",
      "EmployeeName",
      // "TrainingHeading",
      // "Training_Description",
      "CreatedDate",
      "SessionStartDate",
      "SessionEndDate",
      // "AssignedByName",
      "StatusByTrainee",
      "RemarksByTrainee",
      // "RemarksSubmittedOn",
      "StatusByEmployee",
      //  "RatingbyEmployeForTrainer",
      "RemarksByEmployee"
    ]

  }
  ngOnInit() {
    this.OrgID = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.getTrainerWiseList()
  }
  feOnstatusSelect(item: any) {
    this.getFeFilters(item)
  }
  feOnDeselectstatus(item: any) {
    this.getFeFilters(item)
  }

  getFeFilters(fitem: any) {
    this.TrainerWiseLiting = this.filteredList.filter(item => {
      return (
        item.StatusByTrainee.toLowerCase().includes(fitem.toLowerCase())
      );
    });
    if (this.feSelectedStatus.length == 0) {
      this.TrainerWiseLiting = [...this.filteredList]
    }
  }
  getTrainerWiseList() {
    this.employeeLoading = true
    this.spinnerService.show()
    let json = {
      "UserId": this.UserID,
      "SubOrgId": this.trainerWiseList?.selectedorg,
      "FromDate": this.trainerWiseList?.fromdate,
      "EndDate": this.trainerWiseList?.todate,
      "Status": this.trainerWiseList?.selectedstatus,
      "TrainingId": this.trainerWiseList?.trainingID,
      "TrainerId": this.trainerWiseList?.trainerID,
      "BranchList": this.trainerWiseList?.selectedbranch,
      "DeptList": this.trainerWiseList?.selecteddept,
      "Date": "1"
    }
    this._commonservice.ApiUsingPost("TraniningMaster/TrainingListForAdmin", json).subscribe((res: any) => {
      this.TrainerWiseLiting = res.data.List.map((l: any, i: any) => {
        return {
          SLno: i + 1, ...l,
        }
      })

      this.TrainerWiseLiting.map(item => {
        switch (item.RatingForTrainerByEmployee) {
          case "1":
            this.onestar++;
            break;
          case "2":
            this.twostars++;
            break;
          case "3":
            this.threestars++;
            break;
          case "4":
            this.fourstars++;
            break;
          case "5":
            this.fivestars++;
            break;
        }
      });
      this.showFilter = true
      this.filteredList = [...this.TrainerWiseLiting]
      this.employeeLoading = false
      this.spinnerService.hide()
    }, (error) => {
      this.ShowAlert("Something went wrong", "error")
      this.employeeLoading = false
      this.spinnerService.hide()
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
  updateRemarks(row: any) {
    this.dialog.open(TrainerwiseupdateComponent, {
      data: { row },
    }).afterClosed().subscribe(res => {
      if (res) {
        this.getTrainerWiseList()
        this.feSelectedStatus = []
      }
    })
  }
  actionEmitter(data: any) {
    if (data.action.name == "Update") {
      this.updateRemarks(data.row)
    }
  }
  downloadPDF() {
    this.openReport("api/TraniningMaster/GenerateBranchwiseAdminPDF")
  }
  downloadExcel() {
    this.openReport("api/TraniningMaster/GenerateBranchwiseAdminExcel")
  }

  openReport(data: any) {
    this._commonservice.ApiUsingPostNew(data, this.TrainerWiseLiting, { responseType: 'text' }).subscribe((res: any) => {
      res = JSON.parse(res)
      if (res.Status == true) {
        this.pdfSrc = res;
        window.open(res.Link, "_blank");
        this.spinnerService.hide();
      } else if (res.Status == false) {
        this.ShowAlert(res.Message, "warning")
        this.spinnerService.hide();
      }
      else {
        this.ShowAlert("Sorry Failed to Generate", "warning")
        this.spinnerService.hide();
      }
    }, (error) => {
      this.ShowAlert(error.message, "error")
      this.spinnerService.hide();
    });
  }
}
