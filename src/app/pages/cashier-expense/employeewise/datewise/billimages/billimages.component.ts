import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-billimages',
  templateUrl: './billimages.component.html',
  styleUrls: ['./billimages.component.css']
})
export class BillimagesComponent {
  ImageData:any
  AllImages:any[]=[]
    IMGURL=environment.Url
  EmployeeName:any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<BillimagesComponent>)
  {
    this.AllImages = data.BillImages
  }

  ngOnInit(){
    
  }
}
