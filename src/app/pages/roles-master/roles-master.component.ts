import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
export class FormInput {
  RoleName:any;
}
@Component({
  selector: 'app-roles-master',
  templateUrl: './roles-master.component.html',
  styleUrls: ['./roles-master.component.css']
})
export class RolesMasterComponent implements OnInit{
  formInput: FormInput|any;
  public isSubmit: boolean;
  Editdetails: any;
  editid: any;
  Add = false;
  Edit = false;
  View = true;AdminID:any;OrgID:any;
  BranchList:any; DepartmentList:any;ApiURL:any;
  selectedBranchId:string[]|any; selectedDepartmentId:string[]|any;
   institutionsList:any;
   dtExportButtonOptions: any = {};
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

  constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
    this.isSubmit = false;
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    if (this.AdminID==null||this.AdminID==""||this.OrgID==undefined||this.OrgID==null||this.OrgID==""||this.AdminID==undefined) {
      this._router.navigate(["auth/signin-v2"]);
    }
    this.formInput = {     
      RoleName:''
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
    this.formInput.OrgID=this.OrgID;
    this.GetRoleList();
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }
  
  Viewlist()
  {
  window.location.reload();
  }

  GetRoleList()
{this.spinnerService.show();
  this.ApiURL="Portal/GetRoles?OrgID="+this.OrgID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.institutionsList = res.RoleList;
      
      this.dtTrigger.next(null);
        this.Edit = false;
        this.Add = false;
        this.View = true;
        this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      this.globalToastService.error(error.message);
    });
  
 
}

    Update() { 
     if (this.formInput.RoleName == ""||this.formInput.RoleName ==undefined) {
        this.globalToastService.warning("Please Enter Role Name...!");
        return false;
      }
      else{
        const json={
          RoleName:this.formInput.RoleName, 
          OrgID:this.OrgID,
          ModifiedByID:this.AdminID,
          RoleID:this.editid
                    }
        this._commonservice.ApiUsingPost("Portal/UpdateRole",json).subscribe(
    
          (data: any) => {
            if(data.Status==true){
            this.spinnerService.hide();
            this.Add = false;
            this.Edit = false;
            this.View = true;
            this.globalToastService.success(data.Message);
              window.location.reload();
            }
            else
            {
              this.globalToastService.warning(data.Message);
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
        
    }


       edit(IL: any): any {
     this.spinnerService.show();
          this.Editdetails = IL;
          this.spinnerService.hide();
          this.editid=IL.RoleID;   
          this.formInput.RoleName = this.Editdetails.RoleName; 
          this.View= false;
          this.Add=false;
          this.Edit=true;
          this.spinnerService.hide();  
        } 
    
    
   CreateShift() {
    if (this.formInput.RoleName == ""||this.formInput.RoleName ==undefined) {
      this.globalToastService.warning("Please Enter Role Name...!");
      return false;
    }
    else{
      const json={
        RoleName:this.formInput.RoleName, 
    OrgID:this.OrgID,
    CreatedByID:this.AdminID,
  }
        this._commonservice.ApiUsingPost("Portal/CreateRole",json).subscribe(
    
          (data: any) => {
            if(data.Status==true){
            this.spinnerService.hide();
            this.Add = false;
            this.Edit = false;
            this.View = true;
            this.globalToastService.success(data.Message);
              window.location.reload();
            }
            else
            {
              this.globalToastService.warning(data.Message);
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
        
    }
    AddNewModule()
    {
      this.spinnerService.show();
      this.View=false;
      this.Add=true;
      this.Edit=false;
      this.spinnerService.hide();this.selectedBranchId="";
    }

    ActiveModule(ID: number): any {
      this.spinnerService.show();
       this.ApiURL="Portal/ActiveRole?RoleID="+ID;
       this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
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
     DeactiveModule(ID: number): any {
      this.spinnerService.show();
       this.ApiURL="Portal/DeleteRole?RoleID="+ID;
       this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
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

