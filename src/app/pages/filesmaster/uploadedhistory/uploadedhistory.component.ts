import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ViewdetailsComponent } from '../files/viewdetails/viewdetails.component';
import * as html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-uploadedhistory',
  templateUrl: './uploadedhistory.component.html',
  styleUrls: ['./uploadedhistory.component.css']
})
export class UploadedhistoryComponent {

  AdminID:any
   searchText: any = ''
  UploadHistory:any[]=[]
  filteredList:any[]=[]
  EmployeeId:any
  FileTypeId:any
  EmployeeName:any
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private dialog: MatDialog,
      private spinnerService: NgxSpinnerService,private http: HttpClient,private globalToastService: ToastrService,public dialogRef: MatDialogRef<UploadedhistoryComponent>){

 this.EmployeeId = this.data.row.EmployeeID
 this.EmployeeName = this.data.row.EmployeeName
 this.FileTypeId = this.data.filetypeid
}
ngOnInit(){
  this.AdminID=localStorage.getItem("AdminID");
  this.uploadHistory()
}

applyFilter(): void {
  this.UploadHistory = this.filteredList.filter(item => {
    return (
        item.SubFileType.toLowerCase().includes(this.searchText.toLowerCase())
    );
  });
}
close(){
  this.dialogRef.close();
}

uploadHistory(){
  this._commonservice.ApiUsingGetWithOneParam("Directory/GetEmployeeFileUploadHistory?EmployeeID="+this.EmployeeId+"&FileTypeID="+this.FileTypeId+"").subscribe((res:any) => {
    if(res.Status==true)
    {
      this.spinnerService.hide();
      if(res.List.length > 0){
        this.UploadHistory=res.List;
        this.filteredList = [...this.UploadHistory];
      }
      else{
        // this.globalToastService.warning("No Upload Files Found!..");
        this.ShowAlert("No Upload Files Found!..","warning")
        this.dialogRef.close()
      }
    }
    else{
      this.spinnerService.hide();
      // this.globalToastService.warning(res.Message);
      this.ShowAlert(res.Message,"warning")
    }
    this.spinnerService.hide();
   }, (error) => {
    this.spinnerService.hide();
   });
}

Open(sub:any) {
  const json = {
    "EmployeeID":sub.EmployeeID,
    "FileType":sub.SubFileType,
    "FrontImage":sub.FilePath,
    "BackImage":sub.BackFilePath
  }
  this._commonservice.ApiUsingPostNew("Reports/GenerateImagePDF",json,{ responseType: 'text' }).subscribe((res:any)=>{
      if(res){
         window.open(res,"_blank");
      } else{
        // this.globalToastService.warning("Sorry Failed to Generate");
        this.ShowAlert("Sorry Failed to Generate","warning")
      }
     }, (error) => {
      // this.globalToastService.error(error.error.Message);
      this.ShowAlert(error.error.Message,"error")
      this.spinnerService.hide();
     });
}

openDialog(IL: any): void {  
  const dialogRef = this.dialog.open(ViewdetailsComponent, {
   
    data: { IL }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Child dialog closed with:', result);
  });
 }
 OpenLink(path:any){
  window.open(path,'_blank');
 }

    print(){
      const content = document.getElementById('history_container')!;
      const options = {
        margin: 1,
        filename: 'Upload History Of '+ this.EmployeeName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          logging: true,  
          useCORS: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().from(content).set(options).save();
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
