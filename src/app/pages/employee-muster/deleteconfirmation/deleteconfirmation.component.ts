import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent {
  userid:any
  confirm:boolean=false
  AdminID:any;Comment:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<DeleteconfirmationComponent>)
  {
  this.userid = this.data.row.ID
  }
  ngOnInit(): void{
    this.AdminID = localStorage.getItem("AdminID");
    console.log(this.data.row,"poppppppo");
    
  }
  onConfirmClick() {
    if(this.Comment=="" || this.Comment==null || this.Comment== '' || this.Comment==undefined)
    {
      // this.toastr.warning("Please Enter the Reason");
      this.ShowAlert("Please Enter the Reason","warning")
    }
    else
    {
    this._commonservice.ApiUsingGetWithOneParam("Admin/PermanentUserDetailsDelete?UserID="+this.userid+"&DeletedByID="+this.AdminID+"&Comment="+this.Comment).subscribe((res:any)=>{
      if(res.Status==true)
        {
          // this.toastr.success(res.Message)
          this.ShowAlert(res.Message,"success")
          const json={UserID:this.userid}
          this.dialogRef.close({...json});
        
        } 
        else{
          // this.toastr.warning(res.Message)
          this.ShowAlert(res.Message,"warning")
          this.dialogRef.close(false);
        } 
   
    },(error)=>{
        //  this.toastr.error("Something Went Wrong. Please Try Again...")
         this.ShowAlert("Something Went Wrong. Please Try Again...","warning")
         this.dialogRef.close(false)
    })
  }
  }

  onCancelClick(){
    this.dialogRef.close()
  }

  
         ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
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
