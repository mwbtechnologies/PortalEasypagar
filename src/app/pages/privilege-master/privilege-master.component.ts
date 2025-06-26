import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
export class FormInput {
  ulevel: any;
  mname:any;
  lname:any;
  kname:any;
  link:any;
  icon:any;
  aname:any;
}
@Component({
  selector: 'app-privilege-master',
  templateUrl: './privilege-master.component.html',
  styleUrls: ['./privilege-master.component.css']
})
export class PrivilegeMasterComponent{
   formInput: FormInput|any;
form: any;
public isSubmit: boolean;
record: any;
id: any;
Editdetails: any;
editid: any;
roleid:any;
institutionsListdata: any;
Add = false;
Edit = false;
View = true;
AddLink = true;
AddModule=false;
 userName: any;
 institutionsList:any;
isVisible: boolean = false;
RolesList:any;ApplicationList:any;ModulesList:any;
selectedRoleId:any;ApiUrl:any;
selectedApplicationId:any;selectedModuleId:any;
ModuleID:any; ApplicationID:any;
dtExportButtonOptions: any = {};
dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject();
AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   


constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
  this.isSubmit = false;
}
ngOnInit(): void {
  if (localStorage.getItem('LoggedInUserData') == null) {

    this._router.navigate(["auth/signin-v2"]);
  }
  else {
  }
  this.formInput = {     
    ulevel: '',
mname:'',
lname:'',
kname:'',
link:'',
icon:'',
aname:''
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
  
    this.dtOptions = {
      pagingType: 'full_numbers',
       pageLength: 10
   };
 
  this._commonservice.ApiUsingGetWithOneParam("SuperAdmin/GetApplicationList").subscribe((data) => this.ApplicationList = data.List, (error) => {
    this.globalToastService.error(error);
  });
  this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   this.ViewPermission=true;
}

OnAppChange(event:any)
{
  this.spinnerService.show();
  this.ApiUrl="SuperAdmin/GetRolesList?ApplicationID="+event.Value;
  this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe((data) => this.RolesList = data.List, (error) => {
    this.globalToastService.error(error);
    this.spinnerService.hide();
  });
  this.getnavList(event.Value);
}

Viewlist()
{
window.location.reload();
}
getnavList(AppId:any) {
  this.spinnerService.show();
  this.ApiUrl="SuperAdmin/GetNavList?ApplicationID="+AppId;
  this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe((sec) => {
    this.institutionsList = sec;
    this.dtTrigger.next(null);
    this.Edit = false;
    this.spinnerService.hide();
  }, (error) => {
    this.spinnerService.hide();
    
  });
}
 allCheck(event:any) {
  const checked = event.target.checked;
  this.institutionsList.forEach((item: { checked: any; }) => item.checked = checked);
}
save() {
  if (this.selectedApplicationId == "") {
    this.globalToastService.warning("Please Select Application");
    return false;
  }
  if (this.selectedRoleId == "") {
    this.globalToastService.warning("Please Select Role");
    return false;
  }
  this.roleid= this.formInput.ulevel;
  this.institutionsList = this.institutionsList.filter((en: { checked: any; }) => en.checked);
 if (this.institutionsList.length == 0) {
  this.globalToastService.warning("Please Select Atleast One Checkbox");
}
  else {    
   this.spinnerService.show();     
    this._commonservice.assignform(this.institutionsList, this.roleid).subscribe(
      (data: any) => {
        if(data=="Assigned"){
          this.spinnerService.hide();
          this.Add = false;
          this.Edit = false;
          this.globalToastService.success("Modules Assigned Successfully");
            window.location.reload();
          }
          else if(data=="Module unavailable")
          {
            this.globalToastService.warning("Module Not Exist");
              this.spinnerService.hide();
              this.getnavList(this.selectedRoleId);
          }
          else if(data=="Partial")
          {
            
                this.globalToastService.warning("Modules Assigned Partially");
                
              this.spinnerService.hide();
              this.getnavList(this.selectedRoleId);
          }
          else
          {
            this.globalToastService.error("Sorry Something went wrong..!");
              this.spinnerService.hide();
              this.getnavList(this.selectedRoleId);
             
          }
      }, (error: any) => {
       
        this.globalToastService.error("Sorry Something went wrong..!");
      }
    );
    
  }
  return true;
  }
}


