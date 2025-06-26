import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-role-wise-module-master',
  templateUrl: './role-wise-module-master.component.html',
  styleUrls: ['./role-wise-module-master.component.css']
})
export class RoleWiseModuleMasterComponent implements OnInit {
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
  RolesList:any;ModulesList:any;
  selectedRoleId:any;ApiUrl:any;
  selectedApplicationId:any;selectedModuleId:any;
  ModuleID:any; ApplicationID:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AdminID:any;OrgID:any;
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
    }
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
   this.ApiUrl="Portal/GetOrgRoles?OrgID="+this.OrgID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe((data) => this.RolesList = data.List, (error) => {
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
    this.roleid=event.Value;
    this.ApiUrl="Portal/GetModuleList?AdminID="+this.AdminID+"&UserRoleID="+event.Value;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe((data) => this.institutionsList = data.List, (error) => {
      this.globalToastService.error(error);
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }
  
  Viewlist()
  {
  window.location.reload();
  }
   allCheck(event:any) {
    const checked = event.target.checked;
    this.institutionsList.forEach((item: { checked: any; }) => item.checked = checked);
  }

  AssignModule()
  {
 
    this.institutionsList = this.institutionsList.filter((en: { checked: any; }) => en.checked);
    if(this.institutionsList.length==0)
    {
      this.globalToastService.warning("Please select atleast once checkbox");
    }
    else{
      this.spinnerService.show();
      var json={
        RoleID:this.roleid,
        AdminID:this.AdminID,
        Modules:this.institutionsList
      }
        this._commonservice.ApiUsingPost("Portal/AssignModules",json).subscribe(data => {
         if(data.Status==true)
         {
           this.spinnerService.hide();
           this.globalToastService.success("Module Assigned Successfully...!");
             window.location.reload();
         }
         else{
           this.globalToastService.warning("Failed to Assign Module...!");
           this.spinnerService.hide(); 
         }        
         }, (error) => {
           this.globalToastService.error(error);
          this.spinnerService.hide();
        }) 
    }
    this.spinnerService.hide();

  }

    ActiveModule(ID: number): any {
      this.spinnerService.show();
       this.ApiUrl="SuperAdmin/ActiveModuleLink?Id="+ID;
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
       this.ApiUrl="SuperAdmin/DeactiveModuleLink?Id="+ID;
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
