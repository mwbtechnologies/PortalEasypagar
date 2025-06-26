import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationpopupComponent } from 'src/app/layout/admin/confirmationpopup/confirmationpopup.component';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  comment:any
  constructor(
  private spinnerService: NgxSpinnerService,
   private _route: Router,
  private _commonservice: HttpCommonService,
  private globalToastService: ToastrService,@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ConfirmationComponent>,private dialog:MatDialog
  ){

  }

  ngOnInit(){
    console.log(this.data.row,"dsd");
  }

  save(){
  const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
    data: "Are You Sure Want To " +this.data.type,
  });
  dialogRef.componentInstance.confirmClick.subscribe(() => {
    this.Submit();
    dialogRef.close();
  })
}
  Submit(){
      let expenseDetails: any[] = [];
  
      if (this.data?.row?.length > 0) {
          this.data.row.forEach((row: any) => {
              if (row.ExpenseIDs && row.ExpenseIDs.length > 0) {
                  row.ExpenseIDs.forEach((expenseId: number) => {
                      expenseDetails.push({
                          ExpenseID: expenseId,
                          Amount: 0,
                          Comment: this.comment
                      });
                  });
              }
          });
      }
  
      let finalJson = {
          ExpenseDetails: expenseDetails,
          Actiontype: this.data?.type === "Approve" ? true : false
      };
      this._commonservice.ApiUsingPost("Admin/ApproveRejectExpense", finalJson).subscribe((res: any) => {
        this.ShowAlert(res.Message,"success")
        this.dialogRef.close()
      }, (error) => {
        this.ShowAlert("Something Went Wrong","error")
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
}
