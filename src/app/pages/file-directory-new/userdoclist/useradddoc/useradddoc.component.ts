import { Component, Inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ViewdetailsComponent } from 'src/app/pages/file-upload/viewdetails/viewdetails.component';
import { DirectoryService } from 'src/app/services/directory.service';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { RejectremarksComponent } from './rejectremarks/rejectremarks.component';

@Component({
  selector: 'app-useradddoc',
  templateUrl: './useradddoc.component.html',
  styleUrls: ['./useradddoc.component.css']
})
export class UseradddocComponent {

  // mat group
  
  activeTabIndex = 0;
  // mat group ends
  ORGId:any
AdminID:any
IMGURL = environment.DirectoryUrl
formValuesPending: { [key: string]: any } = {};
formValuesAdd: { [key: string]: any } = {};
formValuesEdit: { [key: string]: any } = {};
showTimeline:any
showEdit:any = false
showPendingEdit:any = false
editDocParam:any
editLatestDocParam:any
latestDocument:any[]=[]
uploadHistory:any[]=[]
approvalPending:any[]=[]
timelineDocs:any[]=[]
editHistory:any[]=[]
recentbtn:boolean=false
uploadid:any;
RecentList:any
showhistory:boolean = true
validationErrors:boolean=false
previewImage:boolean = false
previewDoc : any
errors: { [key: string]: string } = {};
previewDocData : any
showFilter:boolean = false

// Loaders
  latestLoader : any
  historyLoader : any
  pendingLoader : any
// Loaders end

fromDate:any
toDate:any
parameterSearch:any


constructor(@Inject(MAT_DIALOG_DATA) public data: any,private directoryService: DirectoryService,

private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<UseradddocComponent>,
private renderer: Renderer2,private clipboard: Clipboard ,private dialog: MatDialog){
  console.log(data);
  
  this.getUploadedData()
  if(this.data.uploadstatus == true){
    this.showTimeline = true
    this.showhistory = true
    this.showEdit = false
  }
  if(this.data.uploadstatus == false){
    this.showTimeline = false
    this.showhistory = false
    this.showEdit = true
  }

  this.getApprovalPending()
}

ngOnInit(){
  this.ORGId = this.directoryService.ORGId
  this.AdminID = this.directoryService.AdminID
}
editHistoryDoc(id:any,index:any,doc:any,docList:any[]){
  // this.showTimeline = true
  this.showEdit = true
  this.editDocParam = JSON.parse(JSON.stringify(doc))
  console.log(this.data.fulldata[0].parameters);
  const selectedData = docList[index]?.documents;
  this.uploadid = docList[index].id
  if (selectedData) {
    for (let param of this.data.fulldata[0]?.parameters) {
      for (let doc of selectedData) {
        if (doc[param._id] !== undefined) {
          this.formValuesEdit[param._id] = doc[param._id]; // Assign value if key exists
        }
      }
    }
  }
}
editLatest(id:any,index:any,doc:any,docList:any[]){
  // this.showTimeline = true
  this.showEdit = true
  this.editLatestDocParam = JSON.parse(JSON.stringify(doc))
  console.log(this.data.fulldata[0].parameters);
  this.formValuesEdit[doc.key] = doc.data
  const selectedData = docList[index]?.documents;
  this.uploadid = docList[index].id
  // if (selectedData) {
  //   for (let param of this.data.fulldata[0]?.parameters) {
  //     for (let doc of selectedData) {
  //       if (doc[param._id] !== undefined) {
  //         this.formValuesEdit[param._id] = doc[param._id]; // Assign value if key exists
  //       }
  //     }
  //   }
  // }
}

editPending(id:any,index:any,doc:any,docList:any[]){
  this.showTimeline = true
  this.showPendingEdit = true
  this.editDocParam = doc
  console.log(this.data.fulldata[0].parameters);
  const selectedData = docList[index]?.documents;
  this.uploadid = docList[index].id
    if (selectedData) {
      for (let param of this.data.fulldata[0]?.parameters) {
        for (let doc of selectedData) {
          if (doc[param._id] !== undefined) {
            this.formValuesPending[param._id] = doc[param._id]; // Assign value if key exists
          }
        }
      }
    }
}
checkminmax(param: any,formValues:any){
  const value = formValues[param._id] || "";
  if (value.length < param.minSize) {
    this.errors[param._id] = `Minimum length of ${param.name} should be ${param.minSize} characters.`;
  } else if (value.length > param.maxSize) {
    this.errors[param._id] = `Maximum length of ${param.name} should be ${param.maxSize} characters.`;
  } else {
    this.errors[param._id] = ''; 
  }
}
onFileChange(event: any, param: any, formValues:any) {
  const file = event.target.files[0];
  if (file) {
    const fileSizeKB = Math.ceil(file.size / 1024);
    const displaySize = (file.size / 1024).toFixed(2);
    if (param.minSize && fileSizeKB < param.minSize) {
      this.errors[param._id] = `File size is ${displaySize} KB.File size must be at least ${param.minSize} KB.`;
      event.target.value = '';
      return
    } else if (param.maxSize && fileSizeKB > param.maxSize) {
      this.errors[param._id] = `File size is ${displaySize} KB.File size must not exceed ${param.maxSize} KB.`;
      event.target.value = '';
      return
    }
    else{
      this.errors[param._id] = ''; 
    }
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (param.allowedExtension && !param.allowedExtension.map((ext:any) => ext.toLowerCase()).includes(fileExtension)) {
      this.errors[param._id] = `Only ${param.allowedExtension.join(', ')} files are allowed.`;
      event.target.value = '';
      return
    }
    else{
      this.errors[param._id] = ''; 
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const dataUrl = e.target.result;
        const fData: FormData = new FormData();
        fData.append("orgId", this.ORGId);
        fData.append("userId", this.data.userdata?.UserId);
        fData.append("file", file);
        fData.append("SoftwareId", "8");
        this.directoryService.PostMethod("uploading/user/upload", fData).subscribe((res:any) => {
          formValues[param._id] = res.data.files[0].filePath;
        })
    };
    reader.readAsDataURL(file); 
  }
}

getFileType(dataUrl: string): string {
  if (!dataUrl) {
    return ''
  }
  return dataUrl.split(',')[0].split(':')[1].split(';')[0];
}
getAllowedExtensions(param: any): string {
  return param.allowedExtension
    .map((ext: string) => `.${ext.toLowerCase()},.${ext.toUpperCase()}`)
    .join(',');
}
getProcessedDocs(docs:any){
  docs?.file?.forEach((docFile:any) => {
    docFile['fileType'] = this.getDocFileType(docFile.data)
  });
  return docs
}
getUploadedData(){
  let json={
    "docTypeId":this.data.fulldata[0]?._id,
    "SoftwareId":8,
    mapping:{
      orgId:this.directoryService.ORGId,
      "userId":this.data.userdata?.UserId,
    },
    "approvalStatus": "approved",
    limit:1
    }
  this.latestLoader = true
  this.directoryService.PostMethod('submit/get',json).subscribe((res:any)=>{
    this.RecentList  = res.data.map((item: any) => ({
      _id:item._id,
      createdAt: item.createdAt, 
      documents: this.getProcessedDocs(item.documents)
    }));
    
    this.latestDocument = [...this.RecentList];
    // console.log(this.UploadHistory);
    
    this.recentbtn = false
    this.showhistory = true
    this.latestLoader = false
    
    // if(this.data.edit){
    //   this.edit(this.UploadHistory[0].id,0,)
    // }
    // this.editHistory = res.data
    // this.updateTimeline()
  },(error)=>{
    this.recentbtn = false
    this.showhistory = true
    this.latestLoader = false
    // this.toastr.error(error.error.message)
  })
}
getApprovalPending(){
  let json={
    "docTypeId":this.data.fulldata[0]?._id,
    "SoftwareId":8,
    mapping:{
      orgId:this.directoryService.ORGId,
      "userId":this.data.userdata?.UserId,
    },
    "approvalStatus": "pending",
  }
  this.pendingLoader = true
  this.directoryService.PostMethod('submit/get',json).subscribe((res:any)=>{
    this.RecentList  = res.data.map((item: any) => ({
      _id:item._id,
      createdAt: item.createdAt, 
      documents: this.getProcessedDocs(item.documents)
    }));
    this.approvalPending = [...this.RecentList];
    this.pendingLoader= false
    // if(this.data.edit){
    //   this.edit(this.UploadHistory[0].id,0,)
    // }
    // this.editHistory = res.data
    // this.updateTimeline()
  },(error)=>{
    this.pendingLoader= false
    // this.toastr.error(error.error.message)
  })
}

// updateTimeline(){
//   this.timelineDocs = []

// }

resetHistory(){
  this.fromDate = undefined
  this.toDate = undefined
  this.parameterSearch = undefined
  this.viewHistory()
}
SearchFilter(){
  if(this.fromDate == undefined && this.toDate == undefined && this.parameterSearch == undefined ){
    this.toastr.warning("Please Select From Date Or To Date Or Parameter")
  }
  else{
    this.viewHistory()
  }
}
viewHistory(){
  this.showTimeline = true
  this.recentbtn = true
  this.showhistory = false
  let json:any={
    "docTypeId":this.data.fulldata[0]?._id,
    "SoftwareId":8,
    "mapping":{
      "orgId":this.ORGId,
      "userId":this.data.userdata?.UserId,
    }
  }
  if(this.parameterSearch != undefined){
    json["filter"] = this.parameterSearch
  }
  if(this.fromDate != undefined || this.toDate != undefined){
    json["date"]={
        "startDate":this.fromDate,
        "endDate":this.toDate
    }
  }
   this.historyLoader = true
  this.directoryService.PostMethod('submit/get/history',json).subscribe((res:any)=>{
    let HistoryList = res.data.map((item: any) =>{
      return {
        ...item,
        documents:this.getProcessedDocs(item.documents),
        createdAt : item.updateAt,
      }
    }
    );
   this.uploadHistory = [...HistoryList];
   this.historyLoader = false
  },(error)=>{
    this.uploadHistory = [];
   this.historyLoader = false
  })

}
viewRecent(){
  this.showTimeline = true
}

isImageKey(key: unknown, value: unknown): boolean {
  const imageExtensions = ['.jpg', '.jpeg','jfif','.png'];
  return (
    (typeof key === 'string' && key.toLowerCase().includes('image')) ||
    (typeof value === 'string' && imageExtensions.some(ext => value.toLowerCase().endsWith(ext)))
  );
}

hasImages(documents: any[]): boolean {
  return documents.some((doc:any) => 
    Object.entries(doc).some(([key, value]) => this.isImageKey(key, value))
  );
}

setDefaultImage(event: Event) {
  let element = (event.target as HTMLImageElement)
  let path = (event.target as HTMLImageElement).src
  console.log(path);
  if(path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg')){
    element.src = 'assets/images/directory/image.png';
    this.renderer.addClass(element, 'error-image')
  }
  if(path.endsWith('.pdf')){
    element.src = 'assets/images/directory/pdf.png';
  }
}
download(userDoc:any,doc:any = null){
  doc['name']= this.getDocDetails(doc.key,'name',"line 327 ts")
  doc['docName']= this.data.fulldata[0]?.name
  let docTypeId = this.data.fulldata[0]?._id
  this.directoryService.download(this.data.userdata?.UserId,this.toastr,docTypeId,userDoc?._id, doc?._id, doc?.key,doc.name,doc.docName,"")
}
delete(doc:any, i:number,userDocumentId:any){
  console.log(doc)
  this.directoryService.delete(this.AdminID,this.directoryService.ORGId,this.data.userdata?.UserId,this.toastr,doc,userDocumentId)
  .subscribe(
    (res: any) => {
      if (res.status) {
        debugger
        this.toastr.success(res.message)
        this.getUploadedData()
        this.getApprovalPending()
        this.viewHistory()
    }
    },
    (error) => {
      this.toastr.error(error.error.message);
    }
  );
}
  submit(){
    let docData:any = {}
    let hasError = false;
    this.errors = {};
    for (let param of this.data.fulldata[0].parameters) {
      if (param.required) {
        if (param.type == 'text' || param.type == 'number') {
          const value = this.formValuesAdd[param._id] || "";
          if (value == '' || value.length < param.minSize || value.length > param.maxSize) {
            this.checkminmax(param, this.formValuesAdd);  
            hasError = true;
          }
        }
        if (param.type == 'file') {
          const value = this.formValuesAdd[param._id] || "";
          if (value == '') {
            this.errors[param._id] = `Please Upload the ${param.name} File`;
            hasError = true;
          }
        }
      }
      if(!docData[param.type]){
        docData[param.type] = []
      }
      docData[param.type].push({
        key:param._id,
        data:this.formValuesAdd[param._id]
      })
    }
    
  if (hasError) {
    return; // prevent submission if any errors exist
  }
    let json: any = {
      mapping:{
        userId: this.data.userdata?.UserId,
        departmentId:this.data.dept,
        branchId:this.data.branch,
        SubOrgId:this.data.suborg,
        orgId: this.ORGId,
      },
      SoftwareId: 8,
      createdBy:this.directoryService.UserID,
      documents:[{
        docGroupId: this.data.fulldata[0]?.docGroupId,
        docTypeId: this.data.fulldata[0]?._id,
        documents:docData,
      }]
    };
    
    console.log(json);
    this.directoryService.PostMethod("submit/files", json).subscribe((res: any) => {
      this.toastr.success(res.message);
      this.getUploadedData()
      this.changeTab(1)
    },(error)=>{
      this.toastr.success(error.error.message);
    });
  }

update(formValues:any, type:string=''){
  const selectedData = this.data.fulldata[0].parameters || {}; // Original values
  let changedValues: any = {};
  for (let key in formValues) {
    if (formValues[key] !== selectedData[key]) {
      changedValues[key] = formValues[key]; // Store only modified values
    }
  }
  if(type == 'Add' && this.latestDocument.length>0){
    this.uploadid = this.latestDocument[0]._id
  }
  let json:any = {
    "_id": this.uploadid,
    mapping:{
      "orgId":this.ORGId,
      "userId":this.data.userdata?.UserId,
    },
    "SoftwareId": 8,
    // "adminId":parseInt(this.AdminID),
    parameters:{
      ...changedValues,
    },
    createdBy:this.directoryService.UserID
  }
  if(this.data?.fulldata[0]?._id){
    json['docTypeId'] = this.data?.fulldata[0]?._id
    json['docGroupId'] = this.data?.fulldata[0]?.docGroupId
  }
  if(type == "Latest"){
    json['userDocParamId'] = this.editLatestDocParam._id
  }
  this.directoryService.PostMethod("submit/edit", json).subscribe((res:any) => {
    this.toastr.success(res.message)
    this.getUploadedData()
    formValues = {}
    if(type == 'Add'){
      this.changeTab(0)
    }
    if(type == 'Latest'){
      this.showEdit = false
    }
    // this.dialogRef.close();
  },error=>{
    this.toastr.success(error.data.message)
  })
}

getDocDetails(key:any,param:string,temp:string):any{
  try{
    return this.data.fulldata[0].paramData.filter((p:any)=>p._id == key)[0][param]
  }catch(error){
    return ""
  }
}

getDocFileType(filePath:any){
  try{
    let extension = filePath.split('.').pop()
    console.log(extension);
    return this.directoryService.extensionTypes[extension.toLowerCase()] || ""
  }catch(error){
    console.log(error);
    return ""
  }
}

copyToClipBoard(data:any){
  this.clipboard.copy(data)
}

copySpecificImage(imageElement: HTMLImageElement) {
  if (!imageElement) {
    console.error('No image element provided');
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  ctx?.drawImage(imageElement, 0, 0);

  canvas.toBlob(async (blob) => {
    if (blob) {
      try {
        const clipboardItem = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([clipboardItem]);
        console.log('Image copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy image:', error);
      }
    }
  });
}

async copyImageDirectly(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const clipboardItem = new ClipboardItem({ [blob.type]: blob });

    await navigator.clipboard.write([clipboardItem]);
    console.log('Image copied!');
  } catch (error) {
    console.error('Failed to copy image:', error);
  }
}

closePreview(){
  this.previewImage = false
  this.previewDoc = undefined
}
showPreview(doc:any,uploadData:any){
  this.previewImage = true
  this.previewDoc = doc
  this.previewDocData = uploadData
  console.log(this.previewDoc)

}

closeDialog(): void {
  this.dialogRef.close();
}

// ValidationFeilds(event: KeyboardEvent) {
//   const key = event.key;
//   if (/^[a-zA-Z0-9]$/.test(key) ||['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(key)) {
//     return;
//   }
//   event.preventDefault();
// }
ValidationFeilds(event: KeyboardEvent, type: string) {
  const key = event.key;
      if (/^[a-zA-Z0-9]$/.test(key) ||['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(key)) {
        return;
      }
      event.preventDefault();
}

changeTab(tab:number){
  this.activeTabIndex = tab
}

onTabChange(event: MatTabChangeEvent) {
  if(event.index == 1) this.viewHistory()
  // this.selectedDocumentTypes = this.DocumentGroups.data[event.index]?.documentTypes || [];
  // console.log(this.DocumentGroups.data[event.index]);
}

applyFilter(){
  this.showFilter = true
}

cancelFilter(){
  this.showFilter = false
}


setPendingStatus(status:string){
  if(status == 'rejected'){
    this.dialog.open(RejectremarksComponent,{
    }).afterClosed().subscribe(res=>{
      let json:any={
        SoftwareId:8,
        mapping:{
          orgId:this.directoryService.ORGId,
          userId:this.data.userdata?.UserId,
        },
        userDocumentId:this.approvalPending[0]._id,
        createdBy: this.directoryService.UserID,
        approvalStatus: status,
      }
      if(status == 'rejected'){
        json['reMarks'] = res.remarks
      }
      this.updateStatus(json)
    })
  }
  if(status == 'approved'){
    let json:any={
      SoftwareId:8,
      mapping:{
        orgId:this.directoryService.ORGId,
        userId:this.data.userdata?.UserId,
      },
      userDocumentId:this.approvalPending[0]._id,
      createdBy: this.directoryService.UserID,
      approvalStatus: status,
    }
    this.updateStatus(json)
  }
}

updateStatus(json:any){
    this.directoryService.PostMethod('submit/verify',json).subscribe((res:any)=>{
       this.approvalPending = [];
       this.toastr.success(res.data.message)
       this.getUploadedData()
       this.changeTab(0)
   
       
     },(error)=>{
       this.toastr.error(error.error.message)
     })
}

}
