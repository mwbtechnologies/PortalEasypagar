import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../common-table/common-table.component';
import { AssignComponent } from './assign/assign.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { UpdateComponent } from './update/update.component';
import { getBranchList } from 'src/app/Redux/selectors/branch_list.selectors';
import { ConfirmationpopupComponent } from 'src/app/layout/admin/confirmationpopup/confirmationpopup.component';

@Component({
  selector: 'app-rolesassignment',
  templateUrl: './rolesassignment.component.html',
  styleUrls: ['./rolesassignment.component.css']
})
export class RolesassignmentComponent {
  AssignedList: any[] = []
  filteredList: any[] = []
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
  AdminID: any
  ApiURL: any
  OrgID: any
  trainerlist = []
  selectedBranch: any[] = [];
  selectedDepartment: any[] = [];
  branchSettings: IDropdownSettings = {};
  departmentSettings: IDropdownSettings = {};
  UserID: any;
  feSelectedStatus: any[] = []
  StatusList: any[] = ["Pending", "Complete", "On-Going"]
  selectedStatus: any[] = []
  statusSettings: IDropdownSettings = {}
  fromDate: any
  toDate: any
  trainerWise: boolean = false
  trainerWiseList: any
  showFilter: boolean = false
  constructor(private spinnerService: NgxSpinnerService, private _route: Router, private _commonservice: HttpCommonService, private globalToastService: ToastrService, private dialog: MatDialog
  ) {
    this.branchSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.departmentSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.statusSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye"
      },
      {
        name: "Edit",
        icon: "fa fa-edit",
        filter: [
          { field: 'IsEdit', value: true }
        ],
      },
      {
        name: "Bulk Update",
        icon: "fa fa-pencil",
        filter: [
          { field: 'IsEdit', value: true }
        ],
      },
      {
        name: "Delete",
        icon: "fa fa-trash",
          filter: [
          { field: 'IsEdit', value: true }
        ],
      },
    ]

    this.displayColumns = {
      "Actions": "ACTIONS",
      "StatusByTrainee": "STATUS",
      "SLno": "SL NO",
      "TrainerName": "TRAINER NAME",
      "TrainingHeading": "TITLE",
      "Training_Description": "DESCRIPTION",
      "StartDateByAdmin": "ASSIGNED START DATE",
      "EndDateByAdmin": "ASSIGNED END DATE",
      "TrainerStartDate": "TRAINER START DATE",
      "TrainerEndDate": "TRAINER END DATE",
      "EmployeeCount": "TRAINEES",
      "Ratings":"AVERAGE RATINGS"
    }

    this.displayedColumns = [
      "Actions",
      "StatusByTrainee",
      "SLno",
      "TrainerName",
      "TrainingHeading",
      "Training_Description",
      "StartDateByAdmin",
      "EndDateByAdmin",
      "TrainerStartDate",
      "TrainerEndDate",
      "EmployeeCount",
      "Ratings"
    ]

  }
  ngOnInit() {
    this.OrgID = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.GetOrganization()
    this.GetList(true)
  }
  GetOrganization() {
    this.ApiURL = "Admin/GetSuborgList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List;
      if (data.List.length == 1) {
        this.selectedOrganization = [{ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text }]
        this.onselectedOrg({ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text })
      }
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      console.log(error);
    });
  }

  getTraineeList(status: any) {
    this.feSelectedStatus = []
    if (this.selectedOrganization.length == 0 || this.selectedOrganization == undefined) {
      this.ShowAlert("Please Select Organization", "warning")
    }
    else if (this.selectedBranch.length == 0 || this.selectedBranch == undefined) {
      this.ShowAlert("Please Select Branch", "warning")
    }
    else if (this.fromDate == null || this.fromDate == '' || this.fromDate == undefined) {
      this.ShowAlert("Please Select From Date", "warning")
    }
    else if (this.toDate == null || this.toDate == '' || this.toDate == undefined) {
      this.ShowAlert("Please Select To Date", "warning")
    }
    else if (this.fromDate > this.toDate) {
      this.ShowAlert("From Date Cannot be greater than End Date", "warning")
    }
    else {
      this.GetList(status)
    }
  }

  GetList(status: any) {
    this.spinnerService.show()
    let branch = this.selectedBranch?.map((se: any) => { return { "BranchId": se.Value } });
    let deptarray = this.selectedDepartment?.map((se: any) => { return { "DeptId": se.Value } });
    let json: any = {
      "UserId": this.UserID,
      "SubOrgId": this.selectedOrganization.map(res => res.Value)[0] || null,
      "FromDate": this.fromDate || null,
      "EndDate": this.toDate || null,
      "BranchList": branch,
      "DeptList": deptarray,
    }
    if (status == true) {
      json["Date"] = "30"
    }
    if (this.selectedStatus.length == 0) {
      json["Status"] = ""
    }
    if (this.selectedStatus.length > 0) {
      json["Status"] = this.selectedStatus[0]
    }
    console.log(json, "get json");
    this._commonservice.ApiUsingPost("TraniningMaster/TrainerList", json).subscribe((data) => {
      if(data.Status == true){
        this.AssignedList = data.data.List.map((l: any, i: any) => {
          return {
            SLno: i + 1, ...l,
            CreatedDate: l.AssignedOn,
            Ratings:l.RatingAvg+' Stars'
          }
        });
        this.showFilter = true
        this.filteredList = [...this.AssignedList]
        this.employeeLoading = false
        this.spinnerService.hide()
      }else if(data.Status == false){
          this.ShowAlert(data.message, "error")
           this.employeeLoading = false
           this.spinnerService.hide()
      }
      else{
          this.ShowAlert("Somethig Went Wrong!..", "error")
         this.employeeLoading = false
        this.spinnerService.hide()
      }
    }, (error) => {
      this.ShowAlert("Somethig Went Wrong!..", "error")
      this.showFilter = true
      this.employeeLoading = false
      this.spinnerService.hide()
    });
  }
  onDepartmentSelect(item: any) {
  }
  onDeselectDepartment(item: any) {
  }
  onstatusSelect(item: any) {
  }
  onDeselectstatus(item: any) {
  }
  feOnstatusSelect(item: any) {
    this.getFeFilters(item)
  }
  feOnDeselectstatus(item: any) {
    this.getFeFilters(item)
  }
  getFeFilters(fitem: any) {
    this.AssignedList = this.filteredList.filter(item => {
      return (
        item.StatusByTrainee.toLowerCase().includes(fitem.toLowerCase())
      );
    });
    if (this.feSelectedStatus.length == 0) {
      this.AssignedList = [...this.filteredList]
    }
  }
  assignTrainee(isEdit: boolean, data?: any) {
    this.dialog.open(AssignComponent, {
      data: { isEdit, data }
    }).afterClosed().subscribe(res => {
      if (res) {
        if (this.AssignedList.length > 0) {
          this.GetList(false)
        }
        if (this.AssignedList.length == 0) {
          this.GetList(true)
        }
      }
    })
  }
  //common table
  actionEmitter(data: any) {
    if (data.action.name == "View") {
      this.trainerWise = true
      let branch = this.selectedBranch?.map((se: any) => { return { "BranchId": se.Value } });
      let deptarray = this.selectedDepartment?.map((se: any) => { return { "DeptId": se.Value } });
      this.trainerWiseList = {
        selectedorg: data.row.suborgId || null,
        selectedbranch: data.row.BranchId,
        selecteddept: data.row.DeptId,
        trainerID: data.row.TrainerID,
        trainingID: data.row.TrainingID,
        selectedstatus: data.row.StatusByTrainee,
        fromdate: this.fromDate,
        todate: this.toDate,
        trainerName: data.row.TrainerName,
        title: data.row.TrainingHeading,
        description: data.row.Training_Description,
        assignedby:data.row.AssignedByName,
        trainerstartdate:data.row.TrainerStartDate,
        trainerenddate:data.row.TrainerEndDate
      }
    }
    if (data.action.name == "Edit") {
      this.assignTrainee(true, data.row)
    }
    if (data.action.name == "Bulk Update") {
      this.update(data.row)
    }
    if (data.action.name == "Delete") {
      this.delete(data.row)
    }
  }
  update(row: any) {
    this.dialog.open(UpdateComponent, {
      data: { row },
    }).afterClosed().subscribe(res => {
      if (res) {
         if (this.AssignedList.length > 0) {
          this.GetList(false)
        }
        if (this.AssignedList.length == 0) {
          this.GetList(true)
        }
        this.feSelectedStatus = []
      }
    })
  }

  delete(row: any) {
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      data: "Are You Sure Want To Delete "+row.TrainerName+"'s "+row.TrainingHeading+" training",
    });
    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.confirmDelete(row);
      dialogRef.close();
    });
    return true;
  }
  confirmDelete(row: any) {
    let json = {
    "TrainingId":row.TrainingID,
    "UserID":this.UserID
  }
    this.spinnerService.show()
    this._commonservice.ApiUsingPost("TraniningMaster/TrainigDeleteByAdmin", json).subscribe(res => {
      this.ShowAlert(res.message, "success")
        if (this.AssignedList.length > 0) {
          this.GetList(false)
        }
        if (this.AssignedList.length == 0) {
          this.GetList(true)
        }
      this.spinnerService.hide()
    }, (error) => {
      this.ShowAlert(error.error.Message, "error")
      this.spinnerService.hide()
    })
  }
  downloadReport() {
    let selectedSub = this.selectedOrganization.map(res => res.Text)[0] || ""
    let SelectedBr = this.selectedBranch.map(res => res.Text)[0] ||""
    localStorage.setItem("SubOrganization", selectedSub)
    localStorage.setItem("BranchName", SelectedBr)
    let selectedColumns = this.displayedColumns
    this.commonTableChild.downloadReport(selectedColumns)
  }
  //ends here
  backToList() {
    this.trainerWise = false
    this.GetOrganization()
    this.GetBranches()
    // this.getTraineeList()
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
  getDepartment() {
    const json = {
      "OrgID": this.OrgID,
      "AdminID": this.AdminID,
      "Branches": this.selectedBranch.map(res => {
        return {
          "id": res.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe((data) => {
      this.DepartmentList = data.List;
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      console.log(error);
    });
  }
  onBranchSelect(item: any) {
    this.selectedDepartment = []
    this.getDepartment()

  }
  onBranchDeSelect(item: any) {
    this.selectedDepartment = []
    this.getDepartment()
  }
  onallbranchselect(selecteditems: any) {
    // this.temparray=[];
    // for (let i = 0; i < this.Columns.length; i++) {
    //   this.temparray.push({ id: this.Columns[i].id, text: this.Columns[i].text });
    // }
    this.selectedBranch = selecteditems
    this.selectedDepartment = []
    this.getDepartment()
  }
  onallbranchdeselect(selecteditems: any) {
    this.selectedDepartment = []
    this.getDepartment()
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      console.log(error, "error");
    });
  }
  onalldeptselect(selecteditems: any) {
    this.selectedDepartment = selecteditems
  }
  onalldeptdeselect(selecteditems: any) {
    this.selectedDepartment = []
  }
  onselectedOrg(item: any) {
    this.selectedBranch = []
    this.GetBranches()
  }
  onDeselectedOrg(item: any) {
    this.selectedBranch = [];
    this.selectedDepartment = [];
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
}
