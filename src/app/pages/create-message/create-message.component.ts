import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
export class FormInput {
  Description:any;
}
export class Emp{
  EmployeeID:any;
}

export class files{
  FilePath:any;
  FileType:any;
}
@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.css']
})
export class CreateMessageComponent implements OnInit{
 formInput: FormInput|any;
form: any;
public isSubmit: boolean;
record: any;
id: any;
Editdetails: any;
editid: any;
roleid:any;
Add = false;
Edit = false;
View = true;
AddModule=false;
 userName: any;
 institutionsList:any;
isVisible: boolean = false;
BranchList:any;DepartmentList:any;ApiUrl:any;
selectedDepartmentIds: string[] | any;
selectedBranchId: string[] | any;
selectedEmployeeId: string[] | any;
dtExportButtonOptions: any = {};
dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject();
AdminID:any;OrgID:any;ApiURL:any;EmployeeList:any;
file:File | any;ImageUrl:any;ShowImage=false;
  index: any;fileurl:any;
  EmpClass:Array<Emp> = [];
  MessageFiles:Array<files> = [];UserID:any;
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
  this.isSubmit = false;
}
ngOnInit(): void {
  if (localStorage.getItem('LoggedInUserData') == null) {

    this._router.navigate(["auth/signin-v2"]);
  }
  else {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
  }
  this.selectedDepartmentIds=[];
  this.selectedBranchId=[];
  this.selectedEmployeeId=[];
  this.formInput = { Description:''};
  this.dtExportButtonOptions = {
    dom: 'Bfrtip',
    buttons: [
      'copy',
      'print',
      'excel',
      'csv'
    ]
  };
  
    this.dtOptions = {
      pagingType: 'full_numbers',
       pageLength: 10
   };
 this.ApiUrl="Admin/GetBranchList?OrgID="+this.OrgID+"&AdminId="+this.UserID;
  this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe((data) => this.BranchList = data.List, (error) => {
    this.globalToastService.error(error);
  });

  this._commonservice.ApiUsingGetWithOneParam("Admin/GetDepartmentList").subscribe((data) => this.DepartmentList = data.List, (error) => {
    this.globalToastService.error(error);
  });

  this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
}
UploadProof1Image1(event:any,form: NgForm) {
  const target = event.target as HTMLInputElement;
  this.file = (target.files as FileList)[0];

var reader = new FileReader();
reader.onload = (event: any) => {
this, this.ImageUrl = event.target.result;
this.fileurl=this.ImageUrl;
}
reader.readAsDataURL(this.file);
this.ShowImage = true;
const fData: FormData = new FormData();
fData.append('formdata', JSON.stringify(form.value));
fData.append('FileType', "Image");
if (this.file != undefined) { fData.append('File', this.file, this.file.name);
this._commonservice.ApiUsingPost("Admin/FileUpload",fData).subscribe(data => { this.ImageUrl=data.URL;});}


}
OnBranchChange(event:any)
{ this.spinnerService.show();
  this.selectedDepartmentIds=[];
  this.selectedEmployeeId=[];
  if(this.selectedBranchId.length==0){this.selectedBranchId=0;}
  this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+event.Value+"&DeptId=0&Year=0&Month="+0;
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    this.globalToastService.error(error); console.log(error);
    this.spinnerService.hide();
  });
  this.spinnerService.hide();
}


OnDepartmentChange(event:any)
{ this.spinnerService.show();
  this.selectedEmployeeId=[];
  if(this.selectedBranchId.length==0){this.selectedBranchId=0;}
  this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranchId+"&DeptId="+event.Value+"&Year=0&Month=0";
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    this.globalToastService.error(error); console.log(error); this.spinnerService.hide();
  });
  this.spinnerService.hide();
}


Viewlist()
{
window.location.reload();
} 
 
SendMessage() {  
    this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=employeemaster&editType=edit";
this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
 if(data.Status==true){

  this.spinnerService.show();
  if (this.formInput.Description == "") {
      this.globalToastService.warning("Please Enter Message...!");
      this.spinnerService.hide();
    
    }
    else
    {
      if (this.selectedBranchId == ""||this.selectedBranchId==undefined||this.selectedBranchId==null) {
        this.selectedBranchId=0;
        }
       if (this.selectedDepartmentIds == ""||this.selectedDepartmentIds==undefined||this.selectedDepartmentIds==null) {
        this.selectedDepartmentIds=0;
        }
        for(this.index=0;this.index<this.selectedEmployeeId.length;this.index++){
          let customObj = new Emp();
          customObj.EmployeeID=this.selectedEmployeeId[this.index];    
          this.EmpClass.push(customObj);
        }
        let customObj = new files();
          customObj.FilePath=this.ImageUrl;  
          customObj.FileType="Image";  
          this.MessageFiles.push(customObj);
        this.spinnerService.show();
        const json={
          EmployeeList:this.EmpClass,
          BranchID:this.selectedBranchId,
          DepartmentID:this.selectedDepartmentIds,
          Message:this.formInput.Description,
          FromEmployee:this.AdminID,
          Files:this.MessageFiles,
         
        }
    this._commonservice.ApiUsingPost("Admin/CreateMesageNew",json).subscribe(

      (data: any) => {
        if(data.Status==true){
        this.spinnerService.hide();
        this.Add = false;
        this.Edit = false;
        this.View = true;
        this.spinnerService.hide();
        this.globalToastService.success(data.Message);
          window.location.reload();
        }
        else
        {
          this.spinnerService.hide();
          this.globalToastService.warning(data.Message);
        }
        
      }, (error: any) => {
        localStorage.clear();
        this.spinnerService.hide();
        this.globalToastService.error("Sorry something went wrong");
       }
    );
      }
}
else
{
this.globalToastService.warning(data.Message);
}
}, (error: any) => {
this.spinnerService.hide();
this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");

});
  }
}
