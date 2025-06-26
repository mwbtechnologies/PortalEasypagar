import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-deatiledviewupdate',
  templateUrl: './deatiledviewupdate.component.html',
  styleUrls: ['./deatiledviewupdate.component.css']
})
export class DeatiledviewupdateComponent {
  SessionStartDate: any
  SessionEndDate: any
  Status: any
  ORGId: any
  AdminID: any
  UserID: any
  Remarks: any
  SDdisableDates: any
  EDdisableDates: any
  today: string = new Date().toISOString().split('T')[0];
  constructor(
    private spinnerService: NgxSpinnerService,
    private _route: Router,
    private _commonservice: HttpCommonService,
    private globalToastService: ToastrService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DeatiledviewupdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.Status = this.data.row?.StatusByTrainee || ""
    this.Remarks = this.data.row?.RemarksByTrainee || ""

    const ST = this.data.row?.SessionStartDate || new Date().toISOString();;
    const STdatePart = ST.split('T')[0];
    this.SessionStartDate = STdatePart;
    if (STdatePart.length > 0) {
      this.SDdisableDates = true
    }
    const ET = this.data.row?.SessionEndDate || "";
    const datePart = ET.split('T')[0];
    this.SessionEndDate = datePart
    if (datePart.length > 0) {
      this.EDdisableDates = true
    }
  }

  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    // this.getTrainerList()
  }

  updateStatus() {
    if (this.Status == 'Pending') {
      this.ShowAlert("You Are Not Allowed To Update On Pending Status", "warning")
    }
    else if (this.Status == 'On-Going' && (this.SessionStartDate == null || this.SessionStartDate == '')) {
      this.ShowAlert("Please Select Start Date", "warning")
    }
    else if (this.Status == 'Complete' && (this.SessionStartDate == null || this.SessionStartDate == '')) {
      this.ShowAlert("Please Select Start Date", "warning")
    }
    else if (this.Status == 'Complete' && (this.SessionEndDate == null || this.SessionEndDate == '')) {
      this.ShowAlert("Please Select End Date", "warning")
    }
    else if (this.Status == 'Complete' && (this.SessionStartDate > this.SessionEndDate)) {
      this.ShowAlert("Start Date Cannot be greater than End date", "warning")
    }
    else if (this.Status == 'Complete' && (this.SessionEndDate < this.SessionStartDate)) {
      this.ShowAlert("End Date Cannot be lesser than Start date", "warning")
    }
    else if (this.Remarks == '' || this.Remarks == null) {
      this.ShowAlert("Please Enter Remarks", "warning")
    }
    else {
      this.spinnerService.show()
      let json = {
        "ID": this.data.row.ID,
        "RemarksByTrainee": this.Remarks,
        "Status": this.Status,
        "TrainerID": this.data.row.TrainerID,
        "SessionEndDate": this.SessionEndDate,
        "SessionStartDate": this.SessionStartDate
      }
      console.log(json, "sidvdyw");
      this._commonservice.ApiUsingPost("TraniningMaster/TrainesListUpDateByTrainer", json).subscribe((data) => {
        this.ShowAlert(data.message, "success")
        this.spinnerService.hide()
        this.dialogRef.close({ data })
      }, (error) => {
        this.ShowAlert("Something Went Wrong!..", "error")
      });
    }
  }
  cancel() {
    this.dialogRef.close()
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

