import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { DialogData } from '../../leave-list/leave-list.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-show-banner',
  templateUrl: './show-banner.component.html',
  styleUrls: ['./show-banner.component.css']
})
export class ShowBannerComponent {
  UserID: any;
  ApiURL: any;AdminID:any;
  constructor(public dialogRef: MatDialogRef<Dialog>,private _commonservice: HttpCommonService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private _router: Router,private spinnerService: NgxSpinnerService,private globalToastService: ToastrService, ) {
  
  }

  Navigate(Type:any)
  {
    this.UserID = localStorage.getItem("UserID");
    this.AdminID = localStorage.getItem("AdminID");
  if(this.UserID>0)
  {
    this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=messages&editType=create";
    if(Type=="Banners")
    {
      this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=banner&editType=create";
    }
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if(data.Status==true)
        {
          if(Type=="Banners")
            {
              this._router.navigate(['/banner']);
            }
            if(Type=="Messages")
              {
                this._router.navigate(['/chat']);
              }
              this.dialogRef.close();
  }
  else
  {
this.globalToastService.warning(data.Message);
  }
}, (error: any) => {
    this.spinnerService.hide();
    this.globalToastService.error("Failed to Validate the Access. Please refresh page and try again");
   
  });
  }
  else{
    this.globalToastService.error("Failed to Validate the Access. Please refresh page");
  }

  }
  close(){
    this.dialogRef.close();
  }
}

        
