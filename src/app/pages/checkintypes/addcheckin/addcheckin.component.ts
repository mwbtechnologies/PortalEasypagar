import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-addcheckin',
  templateUrl: './addcheckin.component.html',
  styleUrls: ['./addcheckin.component.css']
})
export class AddcheckinComponent {
  EmployeeList:any;
  DepartmentList:any;
   BranchList:any[]=[];
   branchSettings :IDropdownSettings = {}
   departmentSettings :IDropdownSettings = {}
   employeeSettings :IDropdownSettings = {}
   loginSettings:IDropdownSettings = {}
   selectedDepartment:any[]=[];
   selectedEmployees:any[]=[]
   selectedBranch:any[]=[];
   AdminID:any
   OrgID:any
   UserID:any
   LoginList:any[]=[]
   selectedLogins:any
   EmployeeName:any
   isEdit:boolean
 constructor( private globalToastService:ToastrService,@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<AddcheckinComponent>){
  this.isEdit = this.data.isEdit || false,
  this.EmployeeName = this.data.row?.Empname || "",
  this.branchSettings = {
    singleSelection: true,
    idField: 'Value',
    textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
 this.employeeSettings = {
    singleSelection: false,
    idField: 'ID',
    textField: 'Name',
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
 this.loginSettings = {
    singleSelection: false,
    idField: 'ID',
    textField: 'device',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    enableCheckAll:false
  }; 
}

 ngOnInit(){
  this.AdminID = localStorage.getItem("AdminID");
  this.OrgID = localStorage.getItem("OrgID");
  this.UserID = localStorage.getItem("UserID");
  this.GetBranches()
  if(this.isEdit){
    this.getLoginTypesData()
  }
  console.log(this.data.row,"this is data.row values");
  
 }

 GetBranches() {
  this._commonservice.ApiUsingGetWithOneParam("Admin/GetBranchList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID).subscribe((data) => {
    this.BranchList = data.List;
    console.log(this.BranchList, "branchlist");
  }, (error) => {
    // this.globalToastService.error(error); 
    this.ShowToast(error,"error")
    console.log(error);
  });

}

close(){
  this.dialogRef.close();
}
GetDepartments() {
  this.selectedDepartment=[];
  var loggedinuserid=localStorage.getItem("UserID");
  const json={
    AdminID:loggedinuserid,
    OrgID:this.OrgID,
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
  },(error) => {
    // this.globalToastService.error(error);
    this.ShowToast(error,"error")
     console.log(error);
  })
}
getEmployeeList(){
  const json:any = {
    AdminID:this.AdminID
  }
  if (this.selectedBranch) {
    json["BranchID"] =  this.selectedBranch.map((br:any)=>{return br.Value})
   }
  if (this.selectedDepartment) {
    json["DepartmentID"] =  this.selectedDepartment?.map((br:any)=>{ return br.Value})
   }
  this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch",json).subscribe((data) => {
  this.EmployeeList = data.List
  },(error) => {

});
  }
onDeptSelect(item:any){
  this.selectedEmployees = []
 this.getEmployeeList()
 }
 onDeptSelectAll(item:any){
  this.selectedEmployees = []
  this.getEmployeeList()
 }
 onDeptDeSelectAll(){
  this.selectedEmployees = []
  this.getEmployeeList()
 }
 onDeptDeSelect(item:any){
  this.selectedEmployees = []
 this.getEmployeeList()
 }
onBranchSelect(item:any){
 this.GetDepartments();
 this.selectedEmployees = []
 this.getEmployeeList()
}
onBranchDeSelect(item:any){
 this.GetDepartments();
 this.selectedEmployees = []
 this.getEmployeeList()
}
OnEmployeesChange(_event:any){
  this.getLoginTypesData();
}
OnEmployeesChangeDeSelect(event:any){ 
}

OnEmployeesAllChange(_event:any)
{
  this.getLoginTypesData();
}
getLoginTypesData(){
  this._commonservice.ApiUsingGetWithOneParam("Settings/getDeviceList").subscribe((data) => {
  this.LoginList = data.DeviceList
  if(this.isEdit){
    this.selectedLogins = this.LoginList.filter((item: any) => {
      const key = `is${item.device}`;
      return this.data.row[key] === true; 
    });
  }
  },(error) => {
    
});
}

OnloginChange(item:any){{

}}
OnloginChangeDeSelect(item:any){{

}}

saveCheckIn(){
  let empid = this.selectedEmployees.map((se:any)=>se.ID) || []
  const json = {
    "createdbyid":parseInt(this.AdminID),
    "Employeeid": empid,
    "isMobileApp": this.selectedLogins.some((res:any)=>res.device ===  'MobileApp'),
    "isBiometric":  this.selectedLogins.some((res:any)=>res.device ===  'Biometric'),
    "isFaceApp":  this.selectedLogins.some((res:any)=>res.device ===  'FaceApp'),
  }
console.log(json,"json for add");
this.finalSave(json)

}
updateCheckIn(){
if(this.selectedLogins.length==0)
{
// this.toastr.warning("Please select atleast login device");
this.ShowToast("Please select atleast login device","warning")
}
else{
  const json = {
    "createdbyid":parseInt(this.AdminID),
    "Employeeid": [this.data.row.Empid],
    "isMobileApp": this.selectedLogins.some((res:any)=>res.device ===  'MobileApp'),
    "isBiometric":  this.selectedLogins.some((res:any)=>res.device ===  'Biometric'),
    "isFaceApp":  this.selectedLogins.some((res:any)=>res.device ===  'FaceApp'),
  }
  console.log(json,"json for edit");
  this.finalSave(json)
}


}

finalSave(json:any){
 this._commonservice.ApiUsingPost("Settings/AddDeviceMapping",json).subscribe((res: any) => {
  if(res.Status==true)
  {
    // this.globalToastService.success(res.Message);
    this.ShowToast(res.Message,"success")
  }
  else
  {
    // this.globalToastService.warning(res.Message);
    this.ShowToast(res.Message,"warning")
  }
  this.dialogRef.close();
 },(error):any=>{
  //  this.globalToastService.error(error.error.Message)
  this.ShowToast(error.error.Message,"warning")
 });
}

      ShowToast(message: string, type: 'success' | 'warning' | 'error'): void {
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
