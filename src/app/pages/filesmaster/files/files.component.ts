import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { ViewdetailsComponent } from './viewdetails/viewdetails.component';
import { ViewfilesComponent } from './viewfiles/viewfiles.component';
import { UploadfilesComponent } from './uploadfiles/uploadfiles.component';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent {
 @Input()
 SelectedData:any[]=[]
 FileTypeID:any;
 EmployeeID:any;
 FilesArray: any[]=[];
 FilesData:any[]=[]
 TypesArray:any[]=[]
   selectedType: any = ''
 afterClick:boolean=false
 searchText: any = ''
 filteredList:any[]=[]
//ends here
  constructor(
     private dialog: MatDialog,
      private spinnerService: NgxSpinnerService,
    private _route: Router, private _commonservice: HttpCommonService, private globalToastService: ToastrService, private _httpClient: HttpClient
    , private http: HttpClient) {
  }

  
  ngOnInit(): void {
    if(this.SelectedData!=null)
    {
      if(this.SelectedData[0].EmployeeID>0)
      {
        this.GetEmployeeFiles(this.SelectedData[0].EmployeeID, this.SelectedData[0].SelectedFileType);
      }
      
    }
    this.getTypesArray()
  }

  selectTypeWise(ad:any){
     if (this.selectedType === ad) {
       this.selectedType = "";
     } else {
       this.selectedType = ad;
     }
   }

  viewTypeWise(empid:any,filetypeid:any){
    this.afterClick = true
    this.GetEmployeeFiles(empid,filetypeid)
  }

  getTypesArray(){
    this._commonservice.ApiUsingGetWithOneParam("Directory/GetEmpFileTypes?EmployeeID="+this.SelectedData[0].EmployeeID+"").subscribe((res:any) => {
      if(res.Status==true)
      {
        this.spinnerService.hide();
      this.TypesArray=res.List;
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
 
applyFilter(): void {
    this.FilesArray = this.filteredList.filter(item => {
      return (
          item.FileType.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
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

   this.filteredList = [...this.FilesArray]
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
 
CloseTab()
{
//   this.dialogRef.close({})
}
  
// DeleteEmployee(RecordID: number)
//  {
//   var loggedInuserID=localStorage.getItem("UserID");
//     this.spinnerService.show();    
//     this._commonservice.ApiUsingGetWithOneParam("Directory/DeleteFile?RecordID="+RecordID+"&AdminID="+loggedInuserID).subscribe(data => {
//      if(data.Status==true){
//       this.globalToastService.success(data.Message);
//       this.spinnerService.hide();
//       this.GetEmployeeFiles(this.EmployeeID, this.FileTypeID);
//      }
//      else{
//       this.globalToastService.warning(data.Message);
//       this.spinnerService.hide();
//      }
    
//     }, (error: any) => {
//       this.globalToastService.error(error.message);
//       this.spinnerService.hide();
     
//     }
//     );
// }

// downloadFile(fileUrl: string, fileName: string): void {
//   this.http.get(fileUrl, { responseType: 'blob' }).subscribe(
//     (blob) => {
//       // Create a temporary anchor element
//       const a = document.createElement('a');
//       const objectUrl = URL.createObjectURL(blob);
//       a.href = objectUrl;
//       a.download = fileName;
//       a.click();
//       URL.revokeObjectURL(objectUrl); // Release the URL after download
//     },
//     (error) => {
//       console.error('Error downloading the file:', error);
//     }
//   );
// }

// Open(Path:any)
// {
//   window.open(Path,'_blank')
// }

// openDialog(IL: any): void {  
//   const dialogRef = this.dialog.open(ViewdetailsComponent, {
   
//     data: { IL }
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     console.log('Child dialog closed with:', result);
//   });
//  }


 viewImages(IL:any){
   if(IL.FilesDetails.length > 0){
    const dialogRef = this.dialog.open(ViewfilesComponent, {
      data: { img:IL.FilesDetails ,SelectedData:this.SelectedData,name:IL.FileType,title:IL.Title}
    });
    dialogRef.afterClosed().subscribe(result => {
        this.GetEmployeeFiles(this.SelectedData[0].EmployeeID, this.SelectedData[0].SelectedFileType)
    });
  }else{
    // this.globalToastService.warning('No images found to view.');
    this.ShowAlert('No images found to view.',"warning")
  }

 }
 uploadFiles(IL:any,event:Event){
   event.stopPropagation();
   this.dialog.open(UploadfilesComponent, {
        data: {fd:IL,name:IL.FileType,SelectedData:this.SelectedData,fileid:IL.FileTypeID,emp:IL.EmployeeID}
      }).afterClosed().subscribe(result => {
        this.GetEmployeeFiles(this.SelectedData[0].EmployeeID, this.SelectedData[0].SelectedFileType)
      });
 }


 downloadfiles(path:any,event:Event){
  event.stopPropagation();
  window.open(path,'_blank')
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