import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ViewdetailsComponent } from '../viewdetails/viewdetails.component';
import { HttpClient } from '@angular/common/http';
import { ShowalertComponent } from 'src/app/pages/create-employee/showalert/showalert.component';

@Component({
  selector: 'app-viewfiles',
  templateUrl: './viewfiles.component.html',
  styleUrls: ['./viewfiles.component.css']
})
export class ViewfilesComponent {
  SelectedData:any
  FileData:any[]=[]
  FileTypeID:any;
  EmployeeID:any;
  FilesArray: any;
  AdminID:any
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private dialog: MatDialog,
      private spinnerService: NgxSpinnerService,private http: HttpClient,private globalToastService: ToastrService,public dialogRef: MatDialogRef<ViewfilesComponent>){
  this.FileData = this.data.img;
  this.SelectedData = this.data.SelectedData;
  
 
}
ngOnInit(){
  console.log(this.FileData);
  this.AdminID=localStorage.getItem("AdminID");
  if(this.SelectedData!=null)
    {
      if(this.SelectedData[0].EmployeeID>0)
      {
        this.GetEmployeeFiles(this.SelectedData[0].EmployeeID, this.SelectedData[0].FileTypeID);
      }
      
    }
}

close(){
  this.dialogRef.close();
}
GetEmployeeFiles(EmployeeID:any,FileTypeID:any){
  if(FileTypeID==" "||FileTypeID==null||FileTypeID==undefined||FileTypeID==""){
   FileTypeID=0;
  }
this._commonservice.ApiUsingGetWithOneParam("Directory/GetEmployeeFiles?EmployeeID="+EmployeeID+"&FileTypeID="+FileTypeID).subscribe((res:any) => {
 if(res.Status==true)
 {
   this.spinnerService.hide();
 this.FilesArray=res.List;
 }
 else{
   this.spinnerService.hide();
  //  this.globalToastService.warning(res.Message);
  this.ShowAlert(res.Message,"warning")
 }
 this.spinnerService.hide();
}, (error) => {
 this.spinnerService.hide();
});
}

DeleteEmployee(RecordID: number)
 {
  var loggedInuserID=localStorage.getItem("UserID");
    this.spinnerService.show();    
    this._commonservice.ApiUsingGetWithOneParam("Directory/DeleteFile?RecordID="+RecordID+"&AdminID="+loggedInuserID).subscribe(data => {
     if(data.Status==true){
      // this.globalToastService.success(data.Message);
      this.ShowAlert(data.Message,"warning")
      this.spinnerService.hide();
      this.GetEmployeeFiles(this.EmployeeID, this.FileTypeID);
      this.dialog.closeAll()
     }
     else{
      // this.globalToastService.warning(data.Message);
      this.ShowAlert(data.Message,"warning")
      this.spinnerService.hide();
     }
    
    }, (error: any) => {
      // this.globalToastService.error(error.message);
      this.ShowAlert(error.Message,"error")
      this.spinnerService.hide();
     
    }
    );
}

downloadFile(fileUrl: string, fileName: string): void {
  this.http.get(fileUrl, { responseType: 'blob' }).subscribe(
    (blob) => {
      // Create a temporary anchor element
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl); // Release the URL after download
    },
    (error) => {
      console.error('Error downloading the file:', error);
    }
  );
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
