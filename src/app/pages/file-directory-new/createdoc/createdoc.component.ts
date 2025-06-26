import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DirectoryService } from 'src/app/services/directory.service';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-createdoc',
  templateUrl: './createdoc.component.html',
  styleUrls: ['./createdoc.component.css']
})
export class CreatedocComponent {

  RequiredList:any[]=["Mandatory","Optional"]
  TypeList:any[]=["text","number","file"]
  ExtensionList:any[];
selectedRequired:any
requiredSettings:IDropdownSettings = {}
typeSettings:IDropdownSettings = {}
extensionSettings:IDropdownSettings = {}
originalData:any
Parameters:any[]=[]
error:any={}
DocumentName:any
responsedocgroup:any
DocumentSubName:any
GroupList:any[]=[]
selectedGroups:any[]=[]
groupSettings:IDropdownSettings = {}
documentFile:string = ''
documentPreview: string | null = null;
documentName:any
showGroup: boolean = false
  IMGURL = environment.DirectoryUrl;
  ORGId:any
AdminID:any
Edit:any
Create:any
isValid:boolean = false
  
constructor(private pdfExportService:PdfExportService,private spinnerService: NgxSpinnerService,
      private _route: Router, private directoryService: DirectoryService, private globalToastService: ToastrService, private _httpClient: HttpClient, private dialog: MatDialog)
       {
      this.requiredSettings = {
        singleSelection: true,
        idField: 'id',
        textField: 'text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
      this.typeSettings = {
        singleSelection: true,
        idField: 'id',
        textField: 'text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
      this.extensionSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
      this.groupSettings = {
        singleSelection: true,
        idField: '_id',
        textField: 'groupTypeName',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
     this.Edit = history.state?.type == "Edit"

     this.ExtensionList = directoryService.allowedExtensions
    }
    ngOnInit(){
      // this.ORGId = localStorage.getItem('OrgID')
      this.AdminID = localStorage.getItem("AdminID");
      this.addParameters()
      // this.getGroupsList()
      if(this.Edit){
        // this.bindData()
        this.getDocumentList()
      }else if(!this.Edit){
        this.getGroupsList()
      }
      
    }

    getDocumentList(){
      let json = {
        "SoftwareId":this.directoryService.SoftwareId,
        "docTypeId":history.state?.data._id,
        mapping:{
          "orgId":this.directoryService.ORGId,
        }
      }
      this.directoryService.PostMethod('document/get',json).subscribe((res:any)=>{
          this.bindData(res) 
      },(error)=>{
        this.globalToastService.error(error.error.message)
      })
    }
    bindData(response:any){
      let data = response?.data?.data || [];
      let document = data[0]; 
    this.DocumentName = document.name
    this.responsedocgroup = document.docGroupId
    this.DocumentSubName = document.subName
    this.selectedRequired = [document.required ? 'Mandatory' : 'Optional']
    this.documentFile = document.iconPath
    let temp :any = document.parameters
    this.Parameters = document?.parameters.map((doc:any)=>({
      ...doc,
      SelectedRequirement: [doc.required ? 'Mandatory' : 'Optional'],
      SelectedType: [doc.type]
      // SelectedType: [{text:this.TypeList.filter((t:any)=>t == doc.type)[0], id:this.TypeList.filter((t:any)=>t == doc.type)[0]}]
    }))
    this.originalData = this.buildPayload(); 
    this.getGroupsList()
    }
    buildPayload() {
      return {
        name: this.DocumentName,
        subName: this.DocumentSubName,
        required: this.selectedRequired
          ? this.selectedRequired[0] === 'Mandatory'
          : '',
        docGroupId: this.selectedGroups?.map(s => s._id)?.[0] || this.responsedocgroup,
        iconPath: this.documentFile,
        SoftwareId: this.directoryService.SoftwareId,
        parameters: this.Parameters.map(param => ({
          parameterId: param._id || param.parameterId,
          name: param.name,
          minSize:param.minSize,
          maxSize:param.maxSize,
          allowedExtension:param.allowedExtension,
          required: param.SelectedRequirement?.[0] === 'Mandatory',
          type: param.SelectedType?.[0],

        })),
        createdBy: this.directoryService.UserID,
        mapping: {
          userId: this.directoryService.UserID,
          orgId: this.directoryService.ORGId,
        },
      };
    }
    
    addParameters(): void {
      this.Parameters.push({
        name:'',
        type:'',
        minSize:'',
        maxSize:'',
        SelectedRequirement:'',
        allowedExtension:[]
     });
     }
     removeParameters(index: number): void {
       this.Parameters.splice(index, 1);
     }



    getGroupsList(){
      let json={
        mapping:{
          // "userId":parseInt(this.AdminID),
          "orgId":this.directoryService.ORGId,
        },
        "SoftwareId":this.directoryService.SoftwareId,
      }
      this.directoryService.PostMethod('group/get/type',json).subscribe((res:any)=>{
        this.GroupList = res.data
        if(this.Edit){
          this.selectedGroups =  this.GroupList.filter((br:any) => br._id == this.responsedocgroup)    
        }
      },(error)=>{
        this.globalToastService.error(error.error.message)
      })
    }
    generateObjectId(): string {
      const timestamp = Math.floor(Date.now() / 1000).toString(16);
      const randomBytes = Array.from(crypto.getRandomValues(new Uint8Array(10)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      return timestamp + randomBytes;
    }
    
  submit(){
    const currentPayload = this.buildPayload();
    const original = JSON.stringify(this.originalData);
    const current = JSON.stringify(currentPayload);
  
    if (original === current) {
      this.globalToastService.warning("Please Make Any Desired Changes To Proceed.")
      return;
    }
  let paramerror:any = {}
  let hasError = false;
  if(!this.DocumentName){
    paramerror[`DocName`] = "Please Enter Document Title"
    hasError = true;
  }
  if(this.selectedRequired == undefined || this.selectedRequired.length ==0){
      paramerror[`required`] = "Please Select Requirement"
    hasError = true;
  }
  if(this.selectedGroups.length == 0 ||this.selectedGroups == undefined ){
       paramerror[`groups`] = "Please Select Document Group"
    hasError = true;
  }
  if(this.documentFile == "" || this.documentFile == undefined ||this.documentFile == null){
      paramerror[`icon`] = "Please Select Document Icon"
    hasError = true;
  }
   if(this.Parameters.length > 0){
    for(let i=0; i<this.Parameters.length;i++)
      {
        paramerror[`${i}`] = {}
        let param = this.Parameters[i]
        if(param.name == undefined || param.name.length == 0){
          paramerror[`${i}`][`name`] = "Please Enter Name"
          hasError = true;
        }
        if(param.SelectedType == undefined || param.SelectedType.length == 0){
          paramerror[`${i}`][`type`] = "Please Select Type"
          hasError = true;
        }
        if(param.minSize == undefined || param.minSize.length == 0){
          paramerror[`${i}`][`min`] = "Please Enter Min Size"
          hasError = true;
        }
        if(param.maxSize == undefined || param.maxSize.length == 0){
          paramerror[`${i}`][`max`] = "Please Enter Max Size"
          hasError = true;
        }
        if(param.maxSize < param.minSize){
          paramerror[`${i}`][`max`] = "Maxsize Should be greater than Minsize"
          hasError = true;
        }
        if(param.SelectedRequirement == undefined || param.SelectedRequirement.length == 0){
          paramerror[`${i}`][`require`] = "Please Select Requirement"
          hasError = true;
        }
        if(param.SelectedType == 'file' && (param.allowedExtension.length == 0 || param.allowedExtension.length == undefined)){
          paramerror[`${i}`][`extension`] = "Please Select File Extension"
          hasError = true;
        }
      }
      if(this.Parameters.length ==1 && this.Parameters[0].SelectedRequirement[0] === 'Optional'){
        paramerror[`parameterErr`] = "Cannot set requirement to optional if only one parameters are there"
        hasError = true;
      }
    }
    this.error = paramerror;
  // Stop if any validation failed
   if (hasError) {
    return;
   }
    this.Parameters = this.Parameters.map(param=>({
      ...param,
      parameterId:param._id,
      required:param.SelectedRequirement[0] == 'Mandatory' ? true : false,
      type:param?.SelectedType[0],
      SelectedRequirement:undefined,
      SelectedType:undefined,
      _id:undefined,
      docTypeId:undefined,
      SoftwareId:undefined,
      modifiedAt:undefined,
      createdAt:undefined,
      isActive:undefined,
    }))
    let json:any = {
      "name": this.DocumentName,
      "subName": this.DocumentSubName,
      "required": this.selectedRequired ? this.selectedRequired == 'Mandatory' ? true : false : '',
      "docGroupId":this.selectedGroups.map(s=>s._id)[0],
      "iconPath":this.documentFile,
      "SoftwareId":this.directoryService.SoftwareId,
      "parameters": this.Parameters,
      "createdBy":this.directoryService.UserID,
      "mapping":{
        "userId":this.directoryService.UserID,
        "orgId":this.directoryService.ORGId,
      }
    }
    if(this.Edit){
    json["docTypeId"] = history.state?.data._id    
    }
    if(this.Edit){
    console.log(json,"json");
    this.finalsave('edit',json)
    }
    if(!this.Edit){
    console.log(json,"json");
    this.finalsave('create',json)
    }
    }

    finalsave(type:any,json:any){
      this.directoryService.PostMethod('document/'+type,json).subscribe((res:any)=>{
        if(res.status == 200){
          this.globalToastService.success(res.message)
        }
        this._route.navigate(["/Directory/Document"]);
      },(error)=>{
        this.globalToastService.error(error.error.validation.body.message)
      })    
    }
    addDocumentGroup(){
      this.showGroup = !this.showGroup
    }
    cancelDocument(){
      this.showGroup = false
    }
    isImageFile(fileType: string): boolean {
      const allowedTypes = ['image/jpeg', 'image/png'];
      return allowedTypes.includes(fileType);
    }
  
    getFileType(dataUrl: string): string {
      if (!dataUrl) {
        return ''
      }
      return dataUrl.split(',')[0].split(':')[1].split(';')[0];
    }

    
    setDefaultImage(event: Event) {
      (event.target as HTMLImageElement).src = 'assets/images/directory/default.png';
    }
  
    onFileSelect(event: any): void {
      const file: File = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const dataUrl = e.target.result;
          const fileType = this.getFileType(dataUrl);
  
          if (this.isImageFile(fileType)) {
            const fData: FormData = new FormData();
            fData.append("file", file);
            fData.append("SoftwareId", "8");
            this.directoryService.PostMethod("uploading/icon", fData).subscribe((res:any) => {
              this.documentFile = res.data.iconPath;
              console.log(this.documentFile,"whats here");
              
            })
          } else {
            this.globalToastService.warning('Please select a valid image file (JPEG or PNG).');
          }
        };
        reader.readAsDataURL(file);
  
      }
    }
    createNewGroup(){
      let paramerror:any = {}
      let hasError = false;
      if(!this.documentName){
         paramerror[`GroupName`] = "Please Enter Document"
         hasError = true;
      }
      this.error = paramerror;
      if (hasError) {
         return;
        }
      let json={
          "groupTypeName":this.documentName,
          // "userId":parseInt(this.AdminID),
          mapping:{
            "orgId":this.directoryService.ORGId,
          },
          "SoftwareId":this.directoryService.SoftwareId,
      }
      this.directoryService.PostMethod('group/add',json).subscribe((res:any)=>{
        this.globalToastService.success("created Successfully")
        this.documentName = ''
        this.showGroup = false
        this.getGroupsList()
       
      },(error)=>{
        this.globalToastService.success(error.error.message)
      })
    }
    backToList(){
      this._route.navigate(["/Directory/Document"]);
    }

    TextFeildValidation(event: KeyboardEvent) {
      const key = event.key;
      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
      if (allowedKeys.includes(key) || event.ctrlKey || event.metaKey) {
        return;
      }
      const input = event.target as HTMLInputElement;
      const futureValue = input.value + key;
    
      if (!/^(?=.*[a-zA-Z]).+$/.test(futureValue)) {
        event.preventDefault();
      }
    }

    NumberValidation(event: KeyboardEvent) {
      const key = event.key;
      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
      if (allowedKeys.includes(key) || event.ctrlKey || event.metaKey) {
        return;
      }
      if (!/^[0-9]$/.test(key)) {
        event.preventDefault();
      }
    }
    
}
