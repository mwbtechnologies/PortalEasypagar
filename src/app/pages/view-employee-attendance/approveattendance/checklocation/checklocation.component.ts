import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ShowalertComponent } from 'src/app/pages/create-employee/showalert/showalert.component';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-checklocation',
  templateUrl: './checklocation.component.html',
  styleUrls: ['./checklocation.component.css']
})
export class ChecklocationComponent {
  selectedAddressdetails: any[] = []
  AdminID:any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private dialog: MatDialog,
        private spinnerService: NgxSpinnerService,private http: HttpClient,private globalToastService: ToastrService,public dialogRef: MatDialogRef<ChecklocationComponent>) {
    }
ngOnInit(){
  this.AdminID = localStorage.getItem("AdminID");
}
selectedAddress(ad:any){
    this.selectedAddressdetails.push(ad);
}
Submit(){
  const json = {
    "Loginid": this.AdminID,
    "Employeeid": this.data.empid,
     "Address": this.selectedAddressdetails
  }
  console.log(json,"json for address");
  
  this._commonservice.ApiUsingPost("Admin/saveallowedLocations",json).subscribe(data => {
    if(data.Status == true){
      // this.globalToastService.success(data.Message)
      this.ShowToast(data.Message,"success")
    }
    else if(data.Status == false){
      // this.globalToastService.error(data.Message)
      this.ShowToast(data.Message,"error")
    }
    else{
      // this.globalToastService.error("An Error Occurred")
      this.ShowToast("An Error Occurred","error")
    }
},(error)=>{
  // this.globalToastService.error(error.error.Message)
  this.ShowToast(error.error.Message,"error")
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
}
