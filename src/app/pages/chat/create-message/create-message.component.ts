import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';
import { ShowAlertComponent } from '../showalert/showalert.component';
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
export class CreateMessageComponent {
 formInput: FormInput|any;
form: any;
public isSubmit: boolean;
record: any;
id: any;
FileType:any;
Editdetails: any;
editid: any;
roleid:any;
Add = false;
Edit = false;
View = true;
AddModule=false;
 userName: any;
 institutionsList:any;
isVisible: boolean = false;ApiUrl:any;
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
  DepartmentList:any;
  selectedBranch:any[]=[];
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  temparray:any=[]; tempdeparray:any=[];tempemparray:any=[]
  selectedDepartment:any[]=[];
  selectedEmployees:any[]=[]
  BranchList:any[]=[];LoginUserID:any;
  Columns: any;CurrentDomain:any;
  DepColumns: any;ReplyFiles:any=[];
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}

constructor(private _router: Router, private globalToastService: ToastrService, 
  private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,public dialog: MatDialog,public dialogRef: MatDialogRef<CreateMessageComponent>) {
  this.isSubmit = false;
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
}
ngOnInit(): void {
  this.CurrentDomain=environment.Url;
  if (localStorage.getItem('LoggedInUserData') == null) {

    this._router.navigate(["auth/signin-v2"]);
  }
  else {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
    this.LoginUserID = localStorage.getItem("UserID");
  }
  
  this.branchSettings = {
    singleSelection: false,
    enableCheckAll: true,
    idField: 'id',
    textField: 'text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
 this.employeeSettings = {
    singleSelection: false,
    enableCheckAll: true,
    idField: 'ID',
    textField: 'Name',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
  this.departmentSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'text',
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
  this.formInput = { Description:''};
  this.GetOrganization();
   this.GetBranches()
}
UploadMultipleFiles(event:any,form: NgForm) {
  const target = event.target as HTMLInputElement;
 
  const fileList = event.target.files;
  if(fileList.length<=4)
    {
  for(let i=0;i<fileList.length;i++)
  {
    this.file = (target.files as FileList)[i];
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
    fData.append('ImageType','Chats');
    if (this.file != undefined) { fData.append('File', this.file, this.file.name);
    this._commonservice.ApiUsingPost("Admin/FileUpload",fData).subscribe(data => { 
      this.ImageUrl=data.NewUrl;
      this.FileType=data.fileType;
      this.ReplyFiles.push({FilePath:this.ImageUrl,FileType:this.FileType});

    });
  }
}
}
else{
  this.globalToastService.warning("You are allowed to choose only 4 files")
}

}

ShowAlert(IP:any,URL: any): void {
  var CompleteURL=IP+""+URL;
  this.dialog.open(ShowAlertComponent,{
    data: { FileUrl:CompleteURL}
     ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
    if(res){
    }
  })
}
getData(): void {
  let tmp = [];this.temparray=[];
  for (let i = 0; i < this.Columns.length; i++) {
    tmp.push({ id: this.Columns[i].Value, text: this.Columns[i].Text });
  }
  this.Columns = tmp;
        this.GetDepartments()
}
getData1(): void {
  let tmp = [];this.tempdeparray=[];
  for (let i = 0; i < this.DepColumns.length; i++) {
    tmp.push({ id: this.DepColumns[i].Value, text: this.DepColumns[i].Text });
  }
  this.DepColumns = tmp;
}

GetEmployeeList(){
  const json = {
    AdminID:this.AdminID,
    "BranchID" :  this.temparray.map((br:any)=>{return br.id}),
    "DepartmentID" :  this.tempdeparray.map((br:any)=>{ return br.id})
    }
       console.log(json);
       
  this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch",json).subscribe((data) => {
    this.EmployeeList = data.List
  }
    ,(error) => {
    console.log(error);this.spinnerService.hide();
 });
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
    }
  }, (error) => {
    this.ShowAlert(error,"error")
     console.log(error);
  });
}
GetBranches() {
  let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
  this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
    this.BranchList = data.List;
    if (this.BranchList.length > 0) {
      this.Columns = data.List;
      this.getData();

    }
    console.log(this.BranchList, "branchlist");
    
  }, (error) => {
    this.globalToastService.error(error); console.log(error,"error");
  });

}
GetDepartments() {
  this.selectedDepartment=[];
  var loggedinuserid=localStorage.getItem("UserID");
  var passingdept =  this.temparray.map((br: any) => {
    return {
     "id": br.id,
     "text":br.text
     };
    })

  const json={
    OrgID:this.OrgID,
    Branches:passingdept,
    AdminID:loggedinuserid
  }  
  this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments",json).subscribe((data) => {
    if (data.Status==true) {
      this.DepartmentList = data.List;
      this.DepColumns=this.DepartmentList;
      this.getData1();
      console.log(this.DepartmentList,"department list");
    }
  }, (error) => {
    this.globalToastService.error(error); console.log(error,"error");
  });
}

 OnEmpSelectAll(item:any){
  // this.tempemparray = [{id:item.Value, text:item.Text }];
  item.forEach((item:any) => {
    this.tempemparray.push({ id: item.ID, text: item.Name });
  });
 }
OnEmpDeSelectAll(item:any){
  this.tempemparray = []
}
 OnEmployeesChange(item:any){
  this.tempemparray.push({id:item.ID, text:item.Name });
}
OnEmployeesChangeDeSelect(item:any){ 
  this.tempemparray.splice(this.tempemparray.indexOf(item), 1);
  // const index = this.tempemparray.findIndex((i:any) => i.id === item.id);
  // if (index !== -1) {
  //     this.tempemparray.splice(index, 1);
  // }
}
onBranchSelect(item:any)
{
  console.log(item,"item");
  this.temparray.push({id:item.id, text:item.text });
  this.selectedDepartment = []
  this.GetDepartments();
  this.selectedEmployees = []
  this.GetEmployeeList();
 }

 onBranchDeSelect(item:any)
 {
  console.log(item,"item");
  // this.temparray.splice(this.temparray.indexOf(item), 1);
  const index = this.temparray.findIndex((i:any) => i.id === item.id);
    if (index !== -1) {
        this.temparray.splice(index, 1);
    }
  this.selectedDepartment = []
  this.GetDepartments();
  this.selectedEmployees = []
  this.tempemparray = []
  this.GetEmployeeList();
  this.updateDropdownSettings();

 }
 updateDropdownSettings() {
  this.employeeSettings = {
    ...this.employeeSettings,
  };
}
 onBranchSelectAll(){
  this.temparray = [...this.Columns];
    this.selectedDepartment = []
  this.GetDepartments();
  this.tempemparray = []
  this.selectedEmployees = []
  this.GetEmployeeList();
 }
onBranchDeSelectAll(){
  this.temparray = []
    this.selectedDepartment = []
  this.GetDepartments();
  this.selectedEmployees = []
  this.tempemparray = []
  this.GetEmployeeList();
 }

Viewlist()
{
window.location.reload();
} 
 
SendMessage() {  
  this.spinnerService.show();
    this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=messages&editType=create";
this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
 if(data.Status==true){

  // this.spinnerService.show();
  if (this.tempemparray.length == 0) {
    this.globalToastService.warning("Please Select atleast one employee");
    this.spinnerService.hide();
  }
 else if (this.formInput.Description == "") {
      this.globalToastService.warning("Please Enter Message...!");
      this.spinnerService.hide();
    }
    else
    {
      // let Branch  = this.temparray?.map((y:any) => y.id)[0] ||0
      // let Dept = this.tempdeparray?.map((y:any) => y.Value)[0] || 0
      let Employee = this.tempemparray?.map((se:any)=>{
        return {
          "EmployeeID":se.id,
          "EmployeeName":se.text
        }
      })

      let sharedfiles=[{
        FilePath:this.ImageUrl,
        FileType:this.FileType
      }]
        // const json={
        //   EmployeeList:Employee,
        //   BranchID:Branch,
        //   DepartmentID:Dept,
        //   Message:this.formInput.Description,
        //   FromEmployee:this.AdminID,
        //   Files:sharedfiles,
         
        // }
        const json={
          EmployeeList:Employee,
          BranchID:0,
          DepartmentID:0,
          Message:this.formInput.Description,
          FromEmployee:this.LoginUserID,
          Files:this.ReplyFiles,
         
        }
        console.log(json,"json value");
        
    this._commonservice.ApiUsingPost("Messages/SendMessage",json).subscribe(

      (data: any) => {
        if(data.Status==true){
        this.spinnerService.hide();
        this.globalToastService.success(data.Message);
        this.CloseTab();
        }
        else
        {
          this.spinnerService.hide();
          this.globalToastService.warning(data.Message);
        }
      }, (error: any) => {
        this.spinnerService.hide();
        this.globalToastService.error("Sorry something went wrong");
       }
    );
    this.spinnerService.hide();
      }
}
else
{
  this.spinnerService.hide();
this.globalToastService.warning(data.Message);
}
}, (error: any) => {
this.spinnerService.hide();
this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");

});
  }

  CloseTab()
  {
    this.dialogRef.close();
  }

  onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.push({id:item.id, text:item.text });
    this.selectedEmployees = []
    this.tempemparray = []
    this.GetEmployeeList();
   }
   onDeptSelectAll(item:any){
    console.log(item,"item");
    this.tempdeparray = item;
    this.tempemparray = []
    this.selectedEmployees = []
    this.GetEmployeeList();
   }
   onDeptDeSelectAll(){
    this.tempdeparray = [];
    this.selectedEmployees = []
    this.tempemparray = []
    this.GetEmployeeList();
   }
   onDeptDeSelect(item:any){
    // this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    const index = this.tempdeparray.findIndex((i:any) => i.id === item.id);
    if (index !== -1) {
        this.tempdeparray.splice(index, 1);
    }
    this.selectedEmployees = []
    this.tempemparray = []
    this.GetEmployeeList();
   }

}
