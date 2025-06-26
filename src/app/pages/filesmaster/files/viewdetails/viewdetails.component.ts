import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ShowalertComponent } from 'src/app/pages/create-employee/showalert/showalert.component';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
export class FormInput {
  ApprovedSessionID:any;
  Comment:any;
}
@Component({
  selector: 'app-viewdetails',
  templateUrl: './viewdetails.component.html',
  styleUrls: ['./viewdetails.component.css']
})
export class ViewdetailsComponent {
  FileData:any;AdminID:any;
  @ViewChild('printImage', { static: false }) printImage!: ElementRef<HTMLImageElement>;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,
private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ViewdetailsComponent>,
private dialog:MatDialog){
  this.FileData = this.data.IL;
 
}
ngOnInit(){
  console.log(this.FileData);
  this.AdminID=localStorage.getItem("AdminID");
}
DeleteFile(ID: number): any {
  this.spinnerService.show();
  this._commonservice.ApiUsingGetWithOneParam("Directory/DeleteFile?RecordID="+ID+"&AdminID="+this.AdminID).subscribe(data => {
   if(data.Status==true)
   {
     this.spinnerService.hide();
    //  this.toastr.success(data.Message);
    this.ShowAlert(data.Message,"success")
     this.CloseTab();
   }
   else{
    //  this.toastr.warning(data.Message);
    this.ShowAlert(data.Message,"warning")
     this.spinnerService.hide(); 
   }        
   }, (error) => {
    //  this.toastr.error(error);
    this.ShowAlert(error,"error")
    this.spinnerService.hide();
  }) 

} 
CloseTab()
{
  this.dialogRef.close({})
}

OpenFile(Path:any)
{
  window.open(Path,'_blank')
}
// print(){
//   if (this.printImage) {
//     const printContents = `<img src="${this.printImage.nativeElement.src}" style="width: 100%; height: auto;" />`;

//     const originalContents = document.body.innerHTML;
//     document.body.innerHTML = printContents; // Temporarily replace the content of the body with the image

//     window.print(); // Trigger the print dialog

//     document.body.innerHTML = originalContents; // Restore the original content of the body
//   } else {
//     console.error('Image not found for printing');
//   }
// }
       ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
                 this.dialog.open(ShowalertComponent, {
                   data: { message, type },
                   panelClass: 'custom-dialog',
                   disableClose: true  // Prevents closing on outside click
                 }).afterClosed().subscribe((res) => {
                   if (res) {
                     console.log("Dialog closed");
                   }
                 });
               }

}
