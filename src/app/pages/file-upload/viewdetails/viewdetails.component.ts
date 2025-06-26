import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
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
  FileData:any;AdminID:any;ImagesArray:any[]=[];
  ViewFile:any;

constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ViewdetailsComponent>){
  this.FileData = this.data.IL;
  this.ImagesArray.push(this.data.IL);
 
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
