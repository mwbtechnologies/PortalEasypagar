import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent {
  Image:any
  IMGURL=environment.Url
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<BillComponent>)
  {
    this.Image = data.BillImages
  }

  ngOnInit(){
    
  }
  close(){
    this.dialogRef.close();
  }
}
