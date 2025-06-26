import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ApproveexpenseComponent } from '../approveexpense/approveexpense.component';

@Component({
  selector: 'app-viewimages',
  templateUrl: './viewimages.component.html',
  styleUrls: ['./viewimages.component.css']
})
export class ViewimagesComponent {
  ImageData:any
  AllImages:any[]=[]
  EmployeeName:any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ApproveexpenseComponent>)
  {
    this.AllImages = data.BillImages
  }

  ngOnInit(){
    
  }

  // GetImages(){
  //   this._commonservice.ApiUsingGetWithOneParam("Admin/GetDatewiseExpenseDetailsReport?FromDate="+this.ImageData.StartDate+"&ToDate="+this.ImageData.EndDate+"&EmployeeID="+this.ImageData.data.EmployeeID+"&Key=en&ListType="+this.ImageData.ListType).subscribe((res:any)=>{
  //     if(res.Status == true){
  //       this.AllImages = res.Images
  //       console.log(res.Images,"img array");
        
  //     }else if(res.Status == false){
  //       this.toastr.error(res.Message)
  //     }
  //     else{
  //       this.toastr.error("An error occurred please try again later")
  //     }
  //   },(error)=>{
  //     this.toastr.error(error.error.Message)
  //   })
  // }
}
