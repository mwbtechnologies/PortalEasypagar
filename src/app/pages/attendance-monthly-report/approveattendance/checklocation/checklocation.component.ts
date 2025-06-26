import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
      this.globalToastService.success(data.Message)
    }
    else {
      this.globalToastService.warning("Failed to update address. Try again later...");
      this.CloseTab();
    }
},(error)=>{
})
}
close(){
  this.dialogRef.close();
}

CloseTab()
{
  this.dialogRef.close({})
}
}
