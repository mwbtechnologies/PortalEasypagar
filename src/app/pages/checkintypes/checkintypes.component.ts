import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { AddcheckinComponent } from './addcheckin/addcheckin.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { ConfirmationpopupComponent } from 'src/app/layout/admin/confirmationpopup/confirmationpopup.component';

@Component({
  selector: 'app-checkintypes',
  templateUrl: './checkintypes.component.html',
  styleUrls: ['./checkintypes.component.css']
})
export class CheckintypesComponent {

  CheckinTypes:any[]=[]
    dtExportButtonOptions: any = {};
     dtOptions: DataTables.Settings = {};
     dtTrigger: Subject<any> = new Subject();
     EmployeeList:any;
     DepartmentList:any;
      BranchList:any[]=[];
      branchSettings :IDropdownSettings = {}
      departmentSettings :IDropdownSettings = {}
      employeeSettings :IDropdownSettings = {}
      selectedDepartment:any[]=[];
      selectedEmployees:any[]=[]
      selectedBranch:any[]=[];
      AdminID:any
      OrgID:any
      UserID:any
      ApiURL:any
      selectedOrganization:any[]=[]
      OrgList:any[]=[]
      orgSettings:IDropdownSettings = {}
 constructor(private spinnerService: NgxSpinnerService,private globalToastService: ToastrService, private _commonservice: HttpCommonService,public dialog: MatDialog){
  this.dtExportButtonOptions = {
    dom: 'Bfrtip',
    buttons: [
      'copy',
      'print',
      'excel',
      'csv'
    ]  };
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
      disabledField: 'disabled'
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
  }
ngOnInit() {
  this.AdminID = localStorage.getItem("AdminID");
  this.OrgID = localStorage.getItem("OrgID");
  this.UserID = localStorage.getItem("UserID");
  this.GetOrganization();
  this.GetBranches()
}
addCheckinType(isEdit:boolean,row?:any){
  this.dialog.open(AddcheckinComponent,{
    data: { isEdit, row }
  }).afterClosed().subscribe(res =>{
    this.AutoRefreshlist()
  })
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
    console.log(this.BranchList, "branchlist");
  }, (error) => {
    // this.globalToastService.error(error); 
    this.ShowAlert(error,"error")
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
  },(error) => {
    // this.globalToastService.error(error);
    this.ShowAlert(error,"error")
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
    json["DepartmentID"] =  this.selectedDepartment?.map((br:any)=>{ return br.id})
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
}
OnEmployeesChangeDeSelect(event:any){ 
}
   getCheckinTypes(){
    this.spinnerService.show()
    if(this.selectedBranch.length==0)
    {
      // this.globalToastService.warning("Please select branch");
      this.ShowAlert("Please select branch","warning")
      this.spinnerService.hide()
    }
    else if(this.selectedEmployees.length==0)
      {
        // this.globalToastService.warning("Please select employee");
        this.ShowAlert("Please select Employee","warning")
        this.spinnerService.hide()
      }
    else
    {
        const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
                  data: "Are You Sure You Want To Save These Device Mapping!",
                });
                dialogRef.componentInstance.confirmClick.subscribe(() => {
                  this.submit();
                  dialogRef.close();
              
                },(error):any=>{
                  // this.globalToastService.error(error.error.message)
                  this.ShowAlert(error.error.message,"error")
                });
     
    }

  }

  submit(){
    if(this.selectedBranch.length==0)
    {
      this.ShowAlert("Please Select Branch","warning")
      this.spinnerService.hide()
    }
   else if(this.selectedEmployees.length>0)
    {
      let empid = this.selectedEmployees.map((se:any)=>se.ID) || []
      const json = {
        "Empids": empid
      }
    
     this._commonservice.ApiUsingPost("Settings/GetAllEmpDeviceMapping",json).subscribe((res: any) => {
    
         this.CheckinTypes = res.Response
         this.spinnerService.hide();
       
     },(error):any=>{
      //  this.globalToastService.error(error.error.Message)
      this.ShowAlert(error.error.Message,"error")
       this.spinnerService.hide()
     });
    }
    else{
      this.ShowAlert("Please Select Employees","warning")
      this.spinnerService.hide()
    }

}
AutoRefreshlist(){
if(this.selectedEmployees.length>0)
      {
        this.spinnerService.show();
      let empid = this.selectedEmployees.map((se:any)=>se.ID) || []
      const json = {
        "Empids": empid
      }
   console.log(json,"json for add accesscontrol");
   
     this._commonservice.ApiUsingPost("Settings/GetAllEmpDeviceMapping",json).subscribe((res: any) => {
   
         this.CheckinTypes = res.Response
         this.spinnerService.hide();
       
     },(error):any=>{
      //  this.globalToastService.error(error.error.Message)
      this.ShowAlert(error.error.Message,"error")
       this.spinnerService.hide()
     });
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
