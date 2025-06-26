import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ShowalertComponent } from 'src/app/pages/create-employee/showalert/showalert.component';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-uploadfiles',
  templateUrl: './uploadfiles.component.html',
  styleUrls: ['./uploadfiles.component.css']
})
export class UploadfilesComponent {
  SelectedData:any
  ShowTwo:any;
  FileData:any[]=[]
  FileTypeID:any;
  EmployeeID:any;
  FilesArray: any;
  AdminID:any
  frontImageFile: File |any;
  backImageFile: File | any;
  frontImagePreview: string | null = null;
  backImagePreview: string | null = null;
  aadharCard:any
  panCard:any
  drivinglicense:any
  fields:any[]=[]
  RecordDate:any;
  UploadedBy:any
  frontImageFormat:any;backImageFormat:any;
  frontImageSize:any;backImageSize:any;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private dialog: MatDialog,
      private spinnerService: NgxSpinnerService,private http: HttpClient,private globalToastService: ToastrService,public dialogRef: MatDialogRef<UploadfilesComponent>){
  this.FileData = this.data.fd;
  this.SelectedData = this.data.SelectedData;
  this.addField()
}

ngOnInit(){
  console.log(this.data,"fdfdfdf");
  this.ShowTwo=false;
  this.AdminID=localStorage.getItem("AdminID");
  this.RecordDate=  localStorage.getItem("RecordDate");
  this.UploadedBy = localStorage.getItem("Name");
}

// onFileSelect(event: Event, type: 'front' | 'back'): void {
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files[0]) {
//     const file = input.files[0];
//     const reader = new FileReader();

//     reader.onload = () => {
//       if (type === 'front') {
//         this.frontImageFile = file;
//         this.frontImagePreview = reader.result as string;
//         this.frontImagePreview = (reader.result as string).split(',')[1];
//       } else if (type === 'back') {
//         this.backImageFile = file;
//         this.backImagePreview = reader.result as string;
//         this.backImagePreview = (reader.result as string).split(',')[1];
//       }
//     };

//     reader.readAsDataURL(file);
//   }
// }
ondynamicFrontFileSelect(event: Event, index: number,form:any): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType === 'xlsx' || fileType === 'xls') {
    //  this.globalToastService.warning('Excel files are not allowed.')
    this.ShowAlert('Excel files are not allowed.',"warning")
      input.value = ''; // Reset the file input
    } else {
      reader.onload = () => {
        this.fields[index].frontImage = file;
        this.fields[index].frontImageFile = reader.result as string;
        const fData: FormData = new FormData();
        fData.append("formdata", JSON.stringify(form.value));
        fData.append("FileType", "Directory");
        if (file != undefined) {
          fData.append("File", file, file.name);
          this._commonservice
            .ApiUsingPost("Helper/FileUpload", fData)
            .subscribe((data) => {
              if(data.Status==true)
              {
                this.fields[index].frontImagePreview = data.URL;
                this.fields[index].frontImageFormat = data.FileFormat;
                this.fields[index].frontImageSize = data.FileSize;
  
              }
             
            });
        }
      };
  
      reader.readAsDataURL(file);
    }
   
  }
}
ondynamicBackFileSelect(event: Event, index: number,form:any): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType === 'xlsx' || fileType === 'xls') {
    //  this.globalToastService.warning('Excel files are not allowed.')
    this.ShowAlert('Excel files are not allowed.',"warning")
      input.value = ''; // Reset the file input
    } else {
    reader.onload = () => {
      this.fields[index].backImage = file;
      this.fields[index].backImageFile = reader.result as string;
      const fData: FormData = new FormData();
      fData.append("formdata", JSON.stringify(form.value));
      fData.append("FileType", "Directory");
      if (file != undefined) {
        fData.append("File", file, file.name);
        this._commonservice
          .ApiUsingPost("Helper/FileUpload", fData)
          .subscribe((data) => {
            if(data.Status==true)
            {
              this.fields[index].backImagePreview = data.URL;
              this.fields[index].backImageFormat = data.FileFormat;
              this.fields[index].backImageSize = data.FileSize;

            }
           
          });
      }
    };

    reader.readAsDataURL(file);
  }
}
}


addField(): void {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = today.getDate().toString().padStart(2, '0');
  this.fields.push({
    fileName: '',
    date: `${year}-${month}-${day}`,
    frontImageFile:null,
    frontImagePreview:null,
    backImageFile:null,
    backImagePreview:null,
    backImageFormat:null,backImageSize:null,
    frontImageFormat:null,frontImageSize:null
  });
}
convertToDisplayFormat(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`; // Convert 'YYYY-MM-DD' to 'DD-MM-YYYY'
}

removeField(index: number): void {
  this.fields.splice(index, 1);
}

uploadImages(): void {
  if(this.data.name === 'Aadhar Card' && (!this.aadharValidate(this.aadharCard))){
    return
  }
  if(this.data.name === 'PAN Card' && (!this.panValidate(this.panCard))){
    return
  }
  if(this.data.name === 'Driving License' && (!this.dlValidate(this.drivinglicense))){
    return
  }
  
  else if(this.ShowTwo==true && (!this.frontImageFile || !this.backImageFile))
  {
    // this.globalToastService.warning('Please select both the files');
    this.ShowAlert('Please select both the files',"warning")
    return;
  }
else{
if(this.SelectedData[0].EmployeeID > 0 && this.data.fileid)
{
  const formData = new FormData();
  // Append form data (e.g., image type)
  let w = ""
  if(this.data.name === 'Aadhar Card'){
    w = this.aadharCard
  }
  if(this.data.name === 'PAN Card'){
    w = this.panCard
  }
  if(this.data.name === 'Driving License'){
    w = this.drivinglicense
  }
  //  if(this.SelectedData[0].SelectedFileType != 2){
  //   for(let j=0; j<this.fields.length;j++)
  //     {
  //       if(this.fields[j].fileName == undefined || this.fields[j].fileName.length == 0){
  //         this.globalToastService.warning('Please Enter File Name')
  //         break;
  //       } 
  //       else{
  //         return 
  //       }
  //     }
  // }
  if (this.SelectedData[0].SelectedFileType != 2) {
    let isValid = true;
  
    for (let j = 0; j < this.fields.length; j++) {
      if (!this.fields[j].fileName || this.fields[j].fileName.length === 0) {
        // this.globalToastService.warning('Please Enter File Name');
        this.ShowAlert('Please Enter File Name',"warning")
        isValid = false;
        break; // Exit loop if validation fails
      }
    }
  
    if (!isValid) {
      return; // Stop execution if any field is invalid
    }
  }
const json = {
  FileTypeID: this.data.fileid,
  AdminID:this.AdminID, 
  EmployeeID:this.SelectedData[0].EmployeeID,
  // IdentityNumber:w,
  Files:this.fields.map((fd:any)=>{
    return {
      FrontFile:fd.frontImagePreview,
      BackFile:fd.backImagePreview,
      Title:fd.fileName,
      IdentityNumber:w,
      CreatedByID:this.AdminID,
      FrontFormat:fd.frontImageFormat,BackFormat:fd.backImageFormat,
      FrontSize:fd.frontImageSize,BackSize:fd.backImageSize
    }
  })
}
console.log(json,"woooo enered");
this.spinnerService.show();
this._commonservice.ApiUsingPost("Directory/FileUpload",json).subscribe((res:any) => {
  if(res.Status==true)
  {
    this.spinnerService.hide();
    // this.globalToastService.success(res.Message);
    this.ShowAlert(res.Message,"success")
    this.dialog.closeAll()
  }
  else if(res.Status==false){
    this.spinnerService.hide();
    // this.globalToastService.error(res.Message);
    this.ShowAlert(res.Message,"error")
    
  }
  else{
    this.spinnerService.hide();
    // this.globalToastService.error("Something Went Wrong");
    this.ShowAlert("Something Went Wrong","error")
  }
 }, (error) => {
  // this.globalToastService.error(error.error.Message);
  this.ShowAlert(error.error.Message,"error")
  this.spinnerService.hide();
  
 });
 }
 else{
  //  this.globalToastService.warning("Something went wrong. Please try again...");
  this.ShowAlert("Something went wrong. Please try again...","error")
 }
 
 }
}
ShowFile(){
  if(this.ShowTwo==true)
  {
    this.ShowTwo=false;

  }
  else{
    this.ShowTwo=true;
  }
  this.frontImageFile=null;this.backImageFile=null;
  this.frontImagePreview="";this.backImagePreview="";
  this.frontImageFormat="";this.backImageFormat="";
  this.frontImageSize="";this.backImageSize="";
}

aadharValidate(aadhar: string):boolean {
  const aadharpattern = /^\d{12}$/;
  if (!aadharpattern.test(aadhar)) {
  // this.globalToastService.warning("Pleasse Enter Valid Aadhar Card")
  this.ShowAlert("Pleasse Enter Valid Aadhar Card","warning")
  return false
  } else {
    return true
  }
}
panValidate(pan: string):boolean {
  const panpattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panpattern.test(pan)) {
  // this.globalToastService.warning("Pleasse Enter Valid PAN Card")
  this.ShowAlert("Pleasse Enter Valid PAN Card","warning")
  return false
  } else {
    return true
  }
}
dlValidate(dl: string):boolean {
  const dlpattern = /^[A-Z]{2}\d{2}\d{4}\s?\d{7}$/;
  if (!dlpattern.test(dl)) {
  // this.globalToastService.warning("Please Enter Valid Driving License")
  this.ShowAlert("Pleasse Enter Valid Driving License","warning")
  return false
  } else {
    return true
  }
}

nameValidate(event: any){
 const input = event.target.value;
  const filteredInput = input.replace(/[^a-zA-Z0-9]/g, '');
  if (filteredInput.length > 20) {
    event.target.value = filteredInput.substring(0, 20);
  } else {
    event.target.value = filteredInput;
  }

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
