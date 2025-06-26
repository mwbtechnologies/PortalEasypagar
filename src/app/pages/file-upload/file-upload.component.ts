import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClient } from '@angular/common/http';
import { ViewdetailsComponent } from './viewdetails/viewdetails.component';
import { MatDialog } from '@angular/material/dialog';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  EmployeeList:any;
   // Array to store the selected files
   files: File[] = [];
   BranchList:any[]=[];
   DepartmentList:any; YearList:any;MonthList:any;
   public isSubmit: boolean | any;
   LoginUserData:any;
   AdminID: any;
   ApiURL:any;ShowTwo:any;
   file:any;
   EmployeeId:any;
   ShowDownload=false;
   showMonthWise=false;
   selectedDepartmentIds: string[] | any;
   selectedBranch:any[]=[];
   selectedBranchId: string[] | any;
   selectedYearId: string[] | any;
   selectedMonthId: string[] | any;
   selectedEmployeeId: string[] | any;
   OrgID:any;
   SalaryList:any;
   NewApiURL:any;
   index=0;pdfSrc:any;
   dtExportButtonOptions: any = {};
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   ViewPermission:any;
   branchSettings :IDropdownSettings = {}
   departmentSettings :IDropdownSettings = {}
   monthSettings :IDropdownSettings = {}
   yearSettings :IDropdownSettings = {}
   employeeSettings :IDropdownSettings = {}
   FileSettings:IDropdownSettings = {}
   temparray:any=[]; tempdeparray:any=[];
   selectedDepartment:any[]=[];
   selectedyear:any[]=[]
   selectedMonth:any[]=[]
   selectedEmployees:any[]=[];
   UserID:any;selectedFileType:any;tmpselectedFileType:any
   FileTypeList: any;
   SubFileTypeList: any;
   UploadFile:any;
   FileDetails: any[]=[];
   FileType: any;
   FilesCount: any;
   FileTypeID: any;
 ActiveTab:any;
   frontImageFile: File |any;
  backImageFile: File | any;
  frontImagePreview: string | null = null;
  backImagePreview: string | null = null;
  filetypeid: any;
     //ends here
     selectedOrganization:any[]=[]
     OrgList:any[]=[]
     orgSettings:IDropdownSettings = {}
   constructor( private dialog: MatDialog,private _router: Router,private spinnerService: NgxSpinnerService,
     private _commonservice: HttpCommonService, private globalToastService:ToastrService,private _httpClient:HttpClient){ 
     this.isSubmit=false
     this.branchSettings = {
       singleSelection: true,
       idField: 'Value',
       textField: 'Text',
       itemsShowLimit: 1,
       allowSearchFilter: true,
     };
 
     this.FileSettings = {
       singleSelection: true,
       idField: 'Value',
       textField: 'Text',
       itemsShowLimit: 1,
       allowSearchFilter: true,
     };
     
     this.employeeSettings = {
       singleSelection: true,
       idField: 'Value',
       textField: 'Text',
       itemsShowLimit: 1,
       allowSearchFilter: true,
     };
     this.monthSettings = {
       singleSelection: true,
       idField: 'Value',
       textField: 'Text',
       itemsShowLimit: 1,
       allowSearchFilter: true,
     };
     this.departmentSettings = {
       singleSelection: false,
       idField: 'Value',
       textField: 'Text',
       itemsShowLimit: 1,
       allowSearchFilter: true,
     };
     this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
     this.dtOptions = {
       pagingType: 'full_numbers',
       pageLength: 50
     };
     this.dtExportButtonOptions = {
       dom: 'Bfrtip',
       buttons: [
         'copy',
         'print',
         'excel',
         'csv'
       ]
     };
   }
   ngOnInit(): void {
    this.ActiveTab="List";
     this.AdminID = localStorage.getItem("AdminID");
     this.OrgID = localStorage.getItem("OrgID");
     this.UserID=localStorage.getItem("UserID");
     this.UploadFile=true;
     this.ShowTwo=false;
     if (this.AdminID==null||this.OrgID==null) {
 
       this._router.navigate(["auth/signin"]);
     }
     this.GetOrganization()
      this.GetBranches();
      this.GetFileTypes(0);
      this.getEmployeeList()
      this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
   this.filetypeid=localStorage.getItem("FileType");
   
 
   }
 
     // Handle file drop or selection
     onSelect(event: any): void {
       console.log('Files selected:', event.addedFiles);
       this.files.push(...event.addedFiles);
     }
   
     // Handle file removal
     onRemove(event: File): void {
       console.log('File removed:', event);
       this.files.splice(this.files.indexOf(event), 1);
     }
     onselectedOrg(item:any){
      this.selectedBranch = []
      this.selectedDepartment = []
      this.GetBranches()
    }
    onDeselectedOrg(item:any){
      this.selectedBranch = []
      this.selectedDepartment = []
      this.GetBranches()
    }
  
    GetOrganization() {
      this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.UserID
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
        this.OrgList = data.List
        if(data.List.length == 1){
          this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
          this.onselectedOrg({Value:this.OrgList[0].Value,Text:this.OrgList[0].Text})
        }
      }, (error) => {
         console.log(error);
      });
    }
   GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
     this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
       this.BranchList = data.List;
       console.log(this.BranchList, "branchlist");
     }, (error) => {
      //  this.globalToastService.error(error);
      this.ShowAlert(error,"error")
        console.log(error);
     });
 
   }
 
   GetYearList(){
     this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
     console.log(error);
  });
   }
   GetMonthList(){
     this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
     console.log(error);
  });
   }
  
   GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
     const json={
       OrgID:this.OrgID,
       AdminID:loggedinuserid,
       Branches:this.selectedBranch.map((br: any) => {
         return {
           "id":br.Value
         }
       })
     }
     this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments",json).subscribe((data) => {
       console.log(data);
       if (data.DepartmentList.length > 0) {
         this.DepartmentList = data.List;
         console.log(this.DepartmentList,"department list");
       }
     }, (error) => {
      //  this.globalToastService.error(error);
      this.ShowAlert(error,"error")
        console.log(error);
     });
   }
 
   getEmployeeList() {
    const now = new Date(); 
    const currentYear = now.getFullYear();
    let BranchID = this.selectedBranch?.map((y: any) => y.Value)[0] || 0
    let deptID = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0
    this.ApiURL = "Admin/GetEmployees?AdminID=" + this.AdminID + "&BranchID=" + BranchID + "&DeptId=" + deptID + "&Year=" + currentYear + "&Month=" + 0 + "&Key=en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
      console.log(error); this.spinnerService.hide();
    });
  }
   onDeptSelect(item:any){
     console.log(item,"item");
     this.tempdeparray.push({id:item.Value, text:item.Text });
     this.selectedEmployees = []
     this.getEmployeeList()
    }
    onDeptSelectAll(){
      this.tempdeparray = [...this.DepartmentList]
      this.selectedEmployees = []
      this.tempdeparray = [];
     this.getEmployeeList()
    }
    onDeptDeSelectAll(){
     this.tempdeparray = [];
     this.selectedEmployees = []
     this.getEmployeeList()
    }
    onDeptDeSelect(item:any){
     console.log(item,"item");
     this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
     this.selectedEmployees = []
     this.getEmployeeList()
    }
   onBranchSelect(item:any){
    console.log(item,"item");
    this.temparray.push({id:item.Value,text:item.Text });
    this.selectedDepartment = []
    this.GetDepartments();
    this.selectedEmployees = []
    this.getEmployeeList()
   }
   onBranchDeSelect(item:any){
    console.log(item,"item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.selectedDepartment = []
    this.DepartmentList = []
    this.GetDepartments();
    this.selectedEmployees = []
    this.getEmployeeList()
   }
 
   onFiletypeSelect(item:any){
     this.tmpselectedFileType=item.Value;
     this.GetEmployeeFiles();
    }
    onFiletypeDeSelect(item:any){
     this.tmpselectedFileType=0;
     this.GetEmployeeFiles();
    }
 
   OnYearChange(event:any){
     this.spinnerService.show();
     this.getEmployeeList()
     // this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+this.selectedDepartment+"&Year="+event.Value+"&Month="+0+"&Key=en";
     // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
     //    console.log(error);this.spinnerService.hide();
     // });
     this.spinnerService.hide();
   }
   OnEmployeesChange(_event:any){
    this.EmployeeId=_event.Value;
     this.GetEmployeeFiles();
     this.GetFileTypes(this.EmployeeId);
    
   }
   OnEmployeesChangeDeSelect(event:any){ 
    this.EmployeeId=0;
    this.GetFileTypes(this.EmployeeId);
     this.FileTypeList=[];
    
   }
   Submit(){
      if(this.selectedBranch.length==0){
          //  this.globalToastService.warning("Please select Branch");
          this.ShowAlert("Please select Branch","warning")
            
           this.spinnerService.hide();
         }
           else if(this.selectedEmployees.length==0){
          //  this.globalToastService.warning("Please select Employee");
          this.ShowAlert("Please select Employee","warning")
            
           this.spinnerService.hide();
         }
         else if(this.tmpselectedFileType==0||this.tmpselectedFileType==" "||this.tmpselectedFileType==null||this.tmpselectedFileType==undefined||this.tmpselectedFileType==""){
          //  this.globalToastService.warning("Please Select FileType");
          this.ShowAlert("Please select FileType","warning")
           this.spinnerService.hide();
         }
        else if (this.files.length === 0) {
           alert('Please select files to upload.');
           return;
         }
       else{
         
        this.spinnerService.show();
        const formData = new FormData();
 
     // Append form data (e.g., image type)
     formData.append('formdata', JSON.stringify({ FileType: this.tmpselectedFileType, AdminID:this.AdminID, EmployeeID:this.selectedEmployees?.map((y:any) => y.ID)[0] }));
 
     // Append files to FormData
     this.files.forEach(file => {
       formData.append('files', file, file.name);
     });
     this._commonservice.ApiUsingPost("Helper/MultiFileUpload",formData).subscribe((res:any) => {
       if(res.Status==true)
       {
         this.spinnerService.hide();
        //  this.globalToastService.success(res.Message);
        this.ShowAlert(res.Message,"success")
         window.location.reload();
       }
       else{
         this.spinnerService.hide();
        //  this.globalToastService.warning(res.Message);
        this.ShowAlert(res.Message,"warning")
       }
       this.spinnerService.hide();
     }, (error) => {
      //  this.globalToastService.warning(error.Message);
      this.ShowAlert(error.Message,"warning")
       this.spinnerService.hide();
     });
       }
  
 }
 
 
 GetEmployeeFiles() {
   if(this.tmpselectedFileType==0 ||this.tmpselectedFileType==null || this.tmpselectedFileType==undefined||this.tmpselectedFileType==""||this.tmpselectedFileType=='')
   {
     this.tmpselectedFileType=0;
   }
   this.spinnerService.show();
   this._commonservice.ApiUsingGetWithOneParam("Directory/GetEmployeeFiles?EmployeeID="+this.EmployeeId+"&FileTypeID="+this.tmpselectedFileType).subscribe((data) => {
     this.SubFileTypeList = data.List;
     this.spinnerService.hide();
   }, (error) => {
     this.spinnerService.hide();
   });
 
 }
 
 GetFileTypes(EmployeeID:any) {
   this._commonservice.ApiUsingGetWithOneParam("Directory/GetEmpFileTypes?EmployeeID="+EmployeeID).subscribe((data) => {
     this.FileTypeList = data.List;
   }, (error) => {
     
   });
 
 }
 
 ViewDetails(Data:any)
 {
   this.FileDetails=Data.FilesDetails;
   this.FileType=Data.FileType;
   this.FileTypeID=Data.FileTypeID;
   this.FilesCount=Data.FilesCount;
   this.ActiveTab="File"
 }
 
 DeleteFile(RecordID: number)
  {
   var loggedInuserID=localStorage.getItem("UserID");
     this.spinnerService.show();    
     this._commonservice.ApiUsingGetWithOneParam("Directory/DeleteFile?RecordID="+RecordID+"&AdminID="+loggedInuserID).subscribe(data => {
      if(data.Status==true){
      //  this.globalToastService.success(data.Message);
      this.ShowAlert(data.Message,"success")
       this.spinnerService.hide();
       this.GetEmployeeFiles();
      }
      else{
      //  this.globalToastService.warning(data.Message);
      this.ShowAlert(data.Message,"warning")
       this.spinnerService.hide();
      }
     
     }, (error: any) => {
      //  this.globalToastService.error(error.message);
      this.ShowAlert(error.message,"error")
       this.spinnerService.hide();
      
     }
     );
 }
 
 Open(Path:any)
 {
   window.open(Path,'_blank')
 }
 
 openDialog(IL: any): void {  
  this.ActiveTab="Upload";
  this.FileTypeID=IL.FileTypeID;
  this.FileType=IL.FileType;
  //  const dialogRef = this.dialog.open(UploadfileComponent, {
  //    data: {IL, "EmployeeID":this.EmployeeId, "FileTypeID":this.tmpselectedFileType }
  //  });
 
  //  dialogRef.afterClosed().subscribe(result => {
  //    console.log('Child dialog closed with:', result);
  //  });
  }

  
  backToList()
  {
    this.ActiveTab="List";
  }

  onFileSelect(event: Event, type: 'front' | 'back'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (type === 'front') {
          this.frontImageFile = file;
          this.frontImagePreview = reader.result as string;
        } else if (type === 'back') {
          this.backImageFile = file;
          this.backImagePreview = reader.result as string;
        }
      };

      reader.readAsDataURL(file);
    }
  }

  uploadImages(): void {
    if (this.ShowTwo==false && (!this.frontImageFile && !this.backImageFile)) {
      // this.globalToastService.warning('Please select atleast one file');
      this.ShowAlert('Please select atleast one file',"warning")
      return;
    }
    else if(this.ShowTwo==true && (!this.frontImageFile || !this.backImageFile))
    {
      // this.globalToastService.warning('Please select both the files');
      this.ShowAlert('Please select both the files',"warning")
      return;
    }
else{
  if(this.EmployeeId>0 && this.FileTypeID>0)
  {
    const formData = new FormData();
    // Append form data (e.g., image type)
  formData.append('formdata', JSON.stringify({ FileType: this.FileTypeID, AdminID:this.AdminID, EmployeeID:this.EmployeeId }));
  
  formData.append('frontImage', this.frontImageFile);
  formData.append('backImage', this.backImageFile);
  
  this._commonservice.ApiUsingPost("Directory/FileUpload",formData).subscribe((res:any) => {
   if(res.Status==true)
   {
     this.spinnerService.hide();
    //  this.globalToastService.success(res.Message);
    this.ShowAlert(res.Message,"success")
     this.ActiveTab="List";
     this.GetEmployeeFiles();
   }
   else{
     this.spinnerService.hide();
    //  this.globalToastService.warning(res.Message);
    this.ShowAlert(res.Message,"warning")
   }
   this.spinnerService.hide();
  }, (error) => {
  //  this.globalToastService.warning(error.Message);
  this.ShowAlert(error.Message,"error")
   this.spinnerService.hide();
  });
  }
  else{
    // this.globalToastService.warning("Something went wrong. Please try again...");
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
  }

  CloseTab()
  {
    this.ActiveTab="List";
  }

  openDialogNew(IL: any): void {  
    const dialogRef = this.dialog.open(ViewdetailsComponent, {
     
      data: { IL }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Child dialog closed with:', result);
    });
   }

   backToDashboard()
{
  this._router.navigate(["FileDirectory"]);
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
 
 
 