import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-checkinoutdata',
  templateUrl: './checkinoutdata.component.html',
  styleUrls: ['./checkinoutdata.component.css']
})
export class CheckinoutdataComponent {
InOutData:any
 constructor( private globalToastService:ToastrService,@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<CheckinoutdataComponent>){
  this.InOutData = data.fulldata
  }

  ngOnInit(){

  }
}
