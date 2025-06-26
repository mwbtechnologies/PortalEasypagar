import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
declare const GetInfo: any;
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
  selector: 'app-module-master',
  templateUrl: './module-master.component.html',
  styleUrls: ['./module-master.component.css']
})
export class ModuleMasterComponent implements OnInit{
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
  RolesList:any;ApplicationList:any;ModulesList:any;
  selectedRoleId:any;ApiUrl:any;
  selectedApplicationId:any;
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
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      
      this.spinnerService.hide();
    });
  }
   allCheck(event:any) {
    const checked = event.target.checked;
    this.institutionsList.forEach((item: { checked: any; }) => item.checked = checked);
  }
    Update() {
      if (this.selectedApplicationId == "") {
        this.globalToastService.warning("Please Select Application...!");
        return false;
      }
     else if (this.formInput.mname == "") {
        this.globalToastService.warning("Please Enter Modulename...!");
        return false;
      }
      else if (this.formInput.icon == "") {
        this.globalToastService.warning("Please Enter Icon...!");
        return false;
      }    const json={
        ApplicationID:this.selectedApplicationId,
        ModuleName:this.formInput.mname,
        Icon:this.formInput.icon,
        ModuleID:this.editid
      }
      this._commonservice.ApiUsingPost("SuperAdmin/UpdateModuleNames",json).subscribe(
  
        (data: any) => {
          if(data=="Updated SuccessFully"){
          this.spinnerService.hide();
          this.Add = false;
          this.Edit = false;
          this.View = true;
          this.globalToastService.success("Module Updated Successfully...!");
            window.location.reload();
          }
          else if(data=="link exist")
          {
            this.globalToastService.warning("Module Already Exist...!");
              this.spinnerService.hide();
          }
          else
          {
            this.globalToastService.warning("Sorry Something went wrong");
              this.spinnerService.hide();
          }
          
        }, (error: any) => {
          localStorage.clear();
  
          this.globalToastService.error(error.message);
          this.spinnerService.hide();
         }
      );
      return true;
    }
       edit(ID: number): any {
     this.spinnerService.show();
      this.ApiUrl="SuperAdmin/EditModuleNames?Id="+ID;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
        this.Editdetails = data
        this.spinnerService.hide();
        this.Edit = true;
        this.Add = false;
        this.editid=ID;   
        this.formInput.mname = this.Editdetails.modulename;
        this.formInput.icon= this.Editdetails.icon;
        this.formInput.kname = this.Editdetails.langkannada; 
        this.View= false;
        this.Add=false;
        this.Edit=true   
        this.spinnerService.hide();  
       }, (error) => {
        this.spinnerService.hide();
      })  
    }   
    CreateModule() {
      this.spinnerService.show();
      if (this.selectedApplicationId == "") {
        this.globalToastService.warning("Please Select Application...!");
        this.spinnerService.hide();
        return false;
      }
      else if (this.formInput.mname == "") {
        this.globalToastService.warning("Please Enter Modulename...!");
        this.spinnerService.hide();
        return false;
      }
      else if (this.formInput.icon == "") {
        this.globalToastService.warning("Please Enter Icon...!");
        this.spinnerService.hide();
        return false;
      }
      const json={
        ApplicationID:this.selectedApplicationId,
        ModuleName:this.formInput.mname,
        Icon:this.formInput.icon
      }
      this._commonservice.ApiUsingPost("SuperAdmin/AddModule",json).subscribe(
  
        (data: any) => {
          if(data=="Updated SuccessFully"){
          this.spinnerService.hide();
          this.Add = false;
          this.Edit = false;
          this.View = true;
          this.spinnerService.hide();
          this.globalToastService.success("Module Created Successfully...!");
            window.location.reload();
          }
          else if(data=="link exist")
          {
            this.spinnerService.hide();
            this.globalToastService.warning("Module Already Exist...!");
              this.spinnerService.hide();
          }
          else
          {
            this.spinnerService.hide();
            this.globalToastService.warning("Sorry Something went wrong");
              this.spinnerService.hide();
          }
          
        }, (error: any) => {
          localStorage.clear();
          this.spinnerService.hide();
          this.globalToastService.warning("Sorry something went wrong");
         }
      );
      return true;
    }
    AddNewModule()
    {
      this.spinnerService.show();
      this.AddModule=true;
      this.View=false;
      this.Add=false;
      this.Edit=false;
      this.spinnerService.hide();
    }

    ActiveModule(ID: number): any {
      this.spinnerService.show();
       this.ApiUrl="SuperAdmin/ActiveModule?Id="+ID;
       this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
        if(data.Status==true)
        {
          this.spinnerService.hide();
          this.globalToastService.success("Module Activated Successfully...!");
            window.location.reload();
        }
        else{
          this.globalToastService.warning("Failed to Active Module...!");
          this.spinnerService.hide(); 
        }        
        }, (error) => {
          this.globalToastService.error(error);
         this.spinnerService.hide();
       })  
     }   
     DeactiveModule(ID: number): any {
      this.spinnerService.show();
       this.ApiUrl="SuperAdmin/DeactiveModule?Id="+ID;
       this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
        if(data.Status==true)
        {
          this.spinnerService.hide();
          this.globalToastService.success(data.Message);
            window.location.reload();
        }
        else{
          this.globalToastService.warning(data.Message);
          this.spinnerService.hide(); 
        }        
        }, (error) => {
          this.globalToastService.error(error);
         this.spinnerService.hide();
       })  
     }  
  }
  
  
  
