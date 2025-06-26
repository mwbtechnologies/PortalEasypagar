import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { DialogData } from '../../leave-list/leave-list.component';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ShowpopupComponent } from '../../department-master/showpopup/showpopup.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-show-update-popup',
  templateUrl: './show-update-popup.component.html',
  styleUrls: ['./show-update-popup.component.css']
})
export class ShowUpdatePopupComponent {
  Message:SafeHtml;Overalldata:any;UserID:any;
  constructor(private sanitizer: DomSanitizer,@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ShowpopupComponent>)
  {
    this.Overalldata = this.data.res;
    this.Message=this.sanitizer.bypassSecurityTrustHtml(this.Overalldata.Message);
    
  }

  UpdateStatus() {
    this.UserID = localStorage.getItem("UserID");
    this._commonservice.ApiUsingGetWithOneParam("Helper/CheckUpdateStatus?UserID=" + this.UserID+"&Status=true").subscribe((res: any) => {
      this.CloseTab();

    }, (error) => {
      // this.toastr.error(error.message);

    });

  }

  close(){
    this.dialogRef.close();
  }
  CloseTab()
{
  this.dialogRef.close({})
}
}

