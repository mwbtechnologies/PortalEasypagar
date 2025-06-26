import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { AddtrainerComponent } from '../addtrainer/addtrainer.component';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css']
})
export class AssignComponent {
  ORGId: any
  EmployeeList: any[] = [];
  BranchList: any[] = [];
  branchSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  selectedEmployees: any[] = []
  selectedBranch: any[] = []
  selectedOrganization: any[] = []
  OrgList: any[] = []
  orgSettings: IDropdownSettings = {}
  TraineeList: any[] = []
  selectedTrainer: any[] = []
  TrainerSettings: IDropdownSettings = {}
  AdminID: any
  ApiURL: any
  Description: any
  Title: any
  StartDate: any
  EndDate: any
  Address: any
  UserID: any
  today: any
  error: any = {}
  isEdit: boolean
  UnAssignedEmployees: any[] = []
  selectedUnAssignedEmployees: any[] = []
  UnAssignedempSettings: IDropdownSettings = {}
  constructor(
    private spinnerService: NgxSpinnerService,
    private _route: Router,
    private _commonservice: HttpCommonService,
    private globalToastService: ToastrService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AssignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isEdit = this.data.isEdit || false;
    if (this.isEdit == true) {
      this.selectedOrganization = [{ Value: this.data.data.suborgId, Text: this.data.data.SubOrgName }]
      this.selectedBranch = [{ Value: this.data.data.BranchId, Text: this.data.data.BranchName }]
      this.selectedTrainer = [{ ID: this.data.data.TrainerID, Name: this.data.data.TrainerName }]
      this.Title = this.data.data.TrainingHeading
      this.Description = this.data.data.Training_Description
      this.Address = this.data.data.TrainingSessionAddress
      // this.StartDate = this.data.data.StartDateByAdmin
      // const ST = this.data.data.StartDateByAdmin;
      // const SD = ST.split('-');
      // this.StartDate = `${SD[2]}-${SD[1]}-${SD[0]}`;

      const ST = this.data.data.StartDateByAdmin || "";
      const datePartST = ST.split('T')[0];
      this.StartDate = datePartST;

      // const ET = this.data.data.EndDateByAdmin;
      // const ED = ET.split('-');
      // this.EndDate = `${ED[2]}-${ED[1]}-${ED[0]}`;
      // this.EndDate = this.data.data.EndDateByAdmin
      const ET = this.data.data.EndDateByAdmin || "";
      const datePart = ET.split('T')[0];
      this.EndDate = datePart;
    }

    this.branchSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.employeeSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      enableCheckAll: false
    };
    this.UnAssignedempSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'EmployeeName',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      enableCheckAll: false
    };
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.TrainerSettings = {
      singleSelection: true,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
  }


  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.GetTrainerList()
    this.GetOrganization();
    this.GetBranches()
    console.log(this.data.data, "data");
    if(this.isEdit == true){
      this.onTraineeSelect({ ID: this.data.data.TrainerID, Name: this.data.data.TrainerName })
    }

  }
  onselectedOrg(item: any) {
    this.selectedBranch = []
    this.GetBranches()
  }
  onDeselectedOrg(item: any) {
    this.selectedBranch = []
    this.GetBranches()
  }
  GetOrganization() {
    this.ApiURL = "Admin/GetSuborgList?OrgID=" + this.ORGId + "&AdminId=" + this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List
      if (data.List.length == 1) {
        this.selectedOrganization = [{ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text }]
        this.onselectedOrg({ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text })
      }
    }, (error) => {
      console.log(error);
    });
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.ORGId + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });

  }
  getEmployeeList() {
    const json: any = {
      AdminID: this.AdminID
    }
    if (this.selectedBranch) {
      json["BranchID"] = this.selectedBranch.map((br: any) => { return br.Value })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch", json).subscribe((data) => {
      this.EmployeeList = data.List
      this.EmployeeList = this.EmployeeList.map((emp: any) => ({
        ...emp,
        isDisabled: this.selectedTrainer.some(trainer => trainer.Name === emp.Name)
      }));
    }, (error) => {
      console.log(error); this.spinnerService.hide();
    });
  }

  getUnAssignedTrainees() {
    let userid = localStorage.getItem("AdminID");
    let json: any = {
      UserId: userid,
      BranchList: [],
      DeptList: [],
      TrainingId: this.data.data.TrainingID,
      TrainerID:this.data.data.TrainerID,
    }
    if (this.selectedBranch) {
      json["BranchList"] = this.selectedBranch.map((br: any) => {
        return {
          BranchId: br.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("TraniningMaster/UnAssignedTrainees", json).subscribe((data) => {
      this.UnAssignedEmployees = data.data.List
      this.UnAssignedEmployees = this.UnAssignedEmployees.map((uaemp: any) => ({
        ...uaemp,
        isDisabled: this.selectedTrainer.some(trainer => trainer.Name === uaemp.EmployeeName)
      }));
    }, (error) => {
      console.log(error); this.spinnerService.hide();
    });
  }

  onBranchSelect(item: any) {
    this.selectedEmployees = []
    if(this.isEdit == false){
      this.getEmployeeList()
    }

  }
  onBranchDeSelect(item: any) {
    this.selectedEmployees = []
    if(this.isEdit == false){
      this.getEmployeeList()
    }

  }
  OnEmployeesChange(_event: any) {
    console.log(_event, "emp details");

  }
  OnEmployeesChangeDeSelect(event: any) {
  }
  OnUnAssignedEmpChange(_event: any) {

  }
  OnUnAssignedEmpChangeDeSelect(event: any) {
  }
  onTraineeSelect(event: any) {
       if(this.isEdit == false){
      this.getEmployeeList()
    }
    if (this.isEdit == true) {
      this.getUnAssignedTrainees()
    }
  }
  onTraineeDeSelect(event: any) {
       if(this.isEdit == false){
      this.getEmployeeList()
    }
    if (this.isEdit == true) {
      this.getUnAssignedTrainees()
    }
  }

  GetTrainerList() {
    // let org = this.selectedOrganization.map(res => res.Value)[0]
    this._commonservice.ApiUsingGetWithOneParam("TraniningMaster/TrainerList?OrgId=" + this.ORGId).subscribe((res) => {
      this.TraineeList = res.data.EmpList;
    }, (error) => {
    });
  }

  assign() {
    let paramerror: any = {}
    let hasError = false;
    let trainerid = this.selectedTrainer.map(res => res.ID)[0]
    const isTrainerAlsoEmployee = this.selectedEmployees.some(emp => emp.ID === trainerid);

    if (this.selectedOrganization.length == 0 || this.selectedOrganization == undefined) {
      paramerror[`organization`] = "Please Select Organization"
      hasError = true;
    }
    if (this.selectedBranch.length == 0 || this.selectedBranch == undefined) {
      paramerror[`branch`] = "Please Select Branch"
      hasError = true;
    }
    if (this.selectedTrainer.length == 0 || this.selectedTrainer == undefined) {
      paramerror[`trainer`] = "Please Select Trainer"
      hasError = true;
    }
    if (this.selectedEmployees.length == 0 || this.selectedEmployees == undefined) {
      paramerror[`employee`] = "Please Select Trainees"
      hasError = true;
    }
    if (this.Title == undefined || this.Title == "") {
      paramerror[`title`] = "Please Enter Title"
      hasError = true;
    }
    if (this.Description == undefined || this.Description == "") {
      paramerror[`description`] = "Please Enter Description"
      hasError = true;
    }
    if (this.StartDate == undefined || this.StartDate == "") {
      paramerror[`startdate`] = "Please Select Start Date"
      hasError = true;
    }
    if (this.EndDate == undefined || this.EndDate == "") {
      paramerror[`enddate`] = "Please Select End Date"
      hasError = true;
    }
    if (this.Address == undefined || this.Address == "") {
      paramerror[`address`] = "Please Select Address"
      hasError = true;
    }
    if (this.EndDate < this.StartDate) {
      this.ShowAlert("End Date Should Be Greater Than Start Date", "warning")
      hasError = true;
    }

    if (isTrainerAlsoEmployee) {
      this.ShowAlert("Trainer and Employee cannot be the same", "warning");
      hasError = true;
    }

    this.error = paramerror;
    if (hasError) {
      return;
    }
    this.spinnerService.show()
    let json = {
      "TrainerID": trainerid,
      "UserID": parseInt(this.AdminID),
      "Training_Description": this.Description,
      "TrainingHeading": this.Title,
      "StartDateByAdmin": this.StartDate,
      "EndDateByAdmin": this.EndDate,
      "TrainingSessionAddress": this.Address,
      "EmployeeList": this.selectedEmployees.map(res => {
        return {
          "EmployeeID": res.ID
        }
      })
    }
    console.log(json, "json");
    this._commonservice.ApiUsingPost("TraniningMaster/TrainingEmplyeeAllocation", json).subscribe((data: any) => {
      this.ShowAlert(data.message, "success")
      this.spinnerService.hide()
      this.dialogRef.close(data)
    }, (error) => {
      this.ShowAlert("Something Went Wrong!..", "error")
    })
  }
  update() {
    let userid = localStorage.getItem("AdminID");
    let paramerror: any = {}
    let hasError = false;
    let trainerid = this.selectedTrainer.map(res => res.ID)[0]
    const isTrainerAlsoEmployee = this.selectedEmployees.some(emp => emp.ID === trainerid);

    if (this.selectedOrganization.length == 0 || this.selectedOrganization == undefined) {
      paramerror[`organization`] = "Please Select Organization"
      hasError = true;
    }
    if (this.selectedBranch.length == 0 || this.selectedBranch == undefined) {
      paramerror[`branch`] = "Please Select Branch"
      hasError = true;
    }
        if (this.selectedTrainer.length == 0 || this.selectedTrainer == undefined) {
      paramerror[`trainer`] = "Please Select Trainer"
      hasError = true;
    }
    if (this.Title == undefined || this.Title == "") {
      paramerror[`title`] = "Please Enter Title"
      hasError = true;
    }
    if (this.Description == undefined || this.Description == "") {
      paramerror[`description`] = "Please Enter Description"
      hasError = true;
    }
    if (this.StartDate == undefined || this.StartDate == "") {
      paramerror[`startdate`] = "Please Select Start Date"
      hasError = true;
    }
    if (this.EndDate == undefined || this.EndDate == "") {
      paramerror[`enddate`] = "Please Select End Date"
      hasError = true;
    }
    if (this.Address == undefined || this.Address == "") {
      paramerror[`address`] = "Please Select Address"
      hasError = true;
    }
    if (this.EndDate < this.StartDate) {
      this.ShowAlert("End Date Should Be Greater Than Start Date", "warning")
      hasError = true;
    }

    if (isTrainerAlsoEmployee) {
      this.ShowAlert("Trainer and Employee cannot be the same", "warning");
      hasError = true;
    }

    this.error = paramerror;
    if (hasError) {
      return;
    }
    if(this.selectedUnAssignedEmployees.length > 0){
      this.allocateNewTrainee()
    }
    let json = {
      "Training_Description": this.Description,
      "TrainingHeading": this.Title,
      "SessionStartDate": this.StartDate,
      "SessionEndDate": this.EndDate,
      "CreatedByID": userid,
      "TrainingSessionAddress": this.Address,
      "ModifiedByID": userid,
      "TrainingId": this.data.data.TrainingID,
      "TrainerId": trainerid
    }
    console.log(json, "json");
    this._commonservice.ApiUsingPost("TraniningMaster/ListUpdateByAdmin", json).subscribe((data: any) => {
      this.ShowAlert(data.message, "success")
      this.dialogRef.close(data)
    }, (error) => {
      this.ShowAlert("Something Went Wrong!..", "error")
    });
  }
  allocateNewTrainee(){
    let userid = localStorage.getItem("AdminID");
    let json = {
    "UserID": userid,
    "TrainingId": this.data.data.TrainingID,  
    "EmployeeList": this.selectedUnAssignedEmployees.map((br: any) => { 
      return {
       "EmployeeID": br.ID 
      }
    })
  }
    this._commonservice.ApiUsingPost("TraniningMaster/AddTraineeToTraining", json).subscribe((data: any) => {
    }, (error) => {
      this.ShowAlert("Something Went Wrong!..", "error")
    });
  }

  addTrainer(){
      this.dialog.open(AddtrainerComponent,{
      panelClass: 'add-trainer',
      disableClose: true
    }).afterClosed().subscribe((res) => {
      if(res){
        this.GetTrainerList()
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

  cancel() {
    this.dialogRef.close()
  }

}
