import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-viewimages',
  templateUrl: './viewimages.component.html',
  styleUrls: ['./viewimages.component.css']
})
export class ViewimagesComponent {
  ImageData:any
  AllImages:any[]=[]
  EmployeeName:any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog)
  {
    this.AllImages = data.Images
  }

  ngOnInit(){
   
  }
}
