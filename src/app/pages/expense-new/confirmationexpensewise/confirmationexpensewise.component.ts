import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationpopupComponent } from 'src/app/layout/admin/confirmationpopup/confirmationpopup.component';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-confirmationexpensewise',
  templateUrl: './confirmationexpensewise.component.html',
  styleUrls: ['./confirmationexpensewise.component.css']
})
export class ConfirmationexpensewiseComponent {
  comment: any
  CashierList:any[]=[]
  selectedCashier:any
  CashierSettings:IDropdownSettings={}
  UserId:any
  constructor(
    private spinnerService: NgxSpinnerService,
    private _route: Router,
    private _commonservice: HttpCommonService,
    private globalToastService: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmationexpensewiseComponent>, private dialog: MatDialog
  ) {
    this.CashierSettings = {
      singleSelection: true,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }

  ngOnInit() {
    console.log(this.data.row, "dsd");
    this.UserId = localStorage.getItem("UserID");
    this.getCashierList()
  }

  onCashierSelect(item: any) {

  }
  onCashierDeSelect(item: any) {

  }
  getCashierList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetCashierDropdown?Loggedinuserid="+this.UserId).subscribe((res: any) => {
      this.CashierList = res.Data
    }, (error) => {
      this.ShowAlert("Something Went Wrong", "error")
    })
  }

  save() {
    if(this.comment =="" || this.comment == undefined){
      this.ShowAlert("Please Enter Comment","warning")
    } else {
      const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
        data: "Are You Sure Want To " + this.data.type,
      });
      dialogRef.componentInstance.confirmClick.subscribe(() => {
        this.Submit();
        dialogRef.close();
      })
    }
  }
  Submit() {
    this.spinnerService.show();
    let roleid = this.selectedCashier.map((item: any) => item.ID)[0]
    let json = {
      "ExpenseDetails": this.data.row.map((row: any) => {
        return {
          "ExpenseID": row.ExpenseId,
          "Amount": row.ApprovedAmount,
          "Comment": this.comment
        }
      }),
      "CashierID": roleid,
      "UserId":this.UserId,
      "Actiontype": this.data?.type === "Approve" ? true : false
    }
    console.log(json, "approve expense");

    this._commonservice.ApiUsingPost("Admin/ApproveRejectExpense", json).subscribe((res: any) => {
      this.ShowAlert(res.Message, "success")
      this.spinnerService.hide();
      this.dialogRef.close({ res })
    }, (error) => {
      this.ShowAlert("Something Went Wrong", "error")
      this.spinnerService.hide();
    });
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
  close() {
    this.dialogRef.close();
  }
}
