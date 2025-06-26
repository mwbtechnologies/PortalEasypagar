import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-showpopup',
  templateUrl: './showpopup.component.html',
  styleUrls: ['./showpopup.component.css']
})
export class ShowpopupComponent {
  ID:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ShowpopupComponent>)
  {
    this.ID = this.data.ID;
  }

  CloseTab()
{
  this.dialogRef.close({})
}

DeactiveModule(): any {
  this.spinnerService.show();
   this._commonservice.ApiUsingGetWithOneParam("Portal/DeleteDepartment?DepartmentID="+this.ID).subscribe(data => {
    if(data.Status==true)
    {
      this.spinnerService.hide();
      this.toastr.success(data.Message);
      this.CloseTab();
    }
    else{
      this.toastr.warning(data.Message);
      this.spinnerService.hide();
      
    }        
    }, (error) => {
      this.toastr.error(error);
     this.spinnerService.hide();
   })  
 } 
}
