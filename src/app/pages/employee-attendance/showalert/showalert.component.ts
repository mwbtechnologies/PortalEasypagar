import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-showalert',
  templateUrl: './showalert.component.html',
  styleUrls: ['./showalert.component.css']
})
export class ShowalertComponent {
  Message:any;Emoji:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ShowalertComponent>)
  {
    this.Message = this.data.Message;
    this.Emoji = this.data.Emoji;
  }

  CloseTab()
{
  this.dialogRef.close({})
}
}

