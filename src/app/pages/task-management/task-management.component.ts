import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
export class FormInput {
  Title:any;
  Description:any;
}

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css']
})
export class TaskManagementComponent implements OnInit{
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
   file:File | any;ImageUrl:any;ShowImage=false;
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
    this.formInput = {     
      OrgID:'',
      ShiftName:'',
      FromTime:'',
      ToTime:''
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
    this.GetShiftList();
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }
  
  Viewlist()
  {
  window.location.reload();
  }

  UploadProof1Image1(event:any,form: NgForm) {
      const target = event.target as HTMLInputElement;
      this.file = (target.files as FileList)[0];
  
  var reader = new FileReader();
  reader.onload = (event: any) => {
  this, this.ImageUrl = event.target.result;
  }
  reader.readAsDataURL(this.file);
  this.ShowImage = true;
  const fData: FormData = new FormData();
  fData.append('formdata', JSON.stringify(form.value));
  fData.append('FileType', "Image");
  if (this.file != undefined) { fData.append('File', this.file, this.file.name);
  this._commonservice.ApiUsingPost("Admin/FileUpload",fData).subscribe(data => { this.ImageUrl=data.URL;});}
    
   
  }
  GetShiftList() {
    this.spinnerService.show();
    this.ApiURL="Admin/GetAllTaskList?AdminID="+this.AdminID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
      if(sec.Status==true)
      {
        this.institutionsList = sec.List;
        this.dtTrigger.next(null);
        this.Edit = false;this.Add = false;
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      
    });
  }


    Update() {
      if (this.formInput.Title == "") {
        this.globalToastService.warning("Please Enter Title...!");
        return false;
      }
    else if (this.formInput.Description == "") {
        this.globalToastService.warning("Please Enter Description...!");
        return false;
      }
      else{
        const json={
          TaskID:this.editid,
          AdminID:this.AdminID,
          Title:this.formInput.Title,
          Description:this.formInput.Description,
          ImageUrl:this.ImageUrl
                    }
        this._commonservice.ApiUsingPost("Admin/UpdateTask",json).subscribe(
    
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


       edit(ID: number): any {
     this.spinnerService.show();
      this.ApiURL="Admin/EditTask?Id="+ID;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
        if(data.Status==true)
        {
          this.Editdetails = data.Data;
          this.spinnerService.hide();
          this.editid=ID;   
          this.formInput.Title = this.Editdetails.Title;
          this.formInput.Description= this.Editdetails.Description;
          this.View= false;
          this.Add=false;
          this.Edit=true 
        }
      
        this.spinnerService.hide();  
       }, (error) => {
        this.spinnerService.hide();
      })  
    }  
    
    
   CreateShift() {
    if (this.formInput.Title == "") {
      this.globalToastService.warning("Please Enter Title...!");
      return false;
    }
  else if (this.formInput.Description == "") {
      this.globalToastService.warning("Please Enter Description...!");
      return false;
    }
      else{
        const json={
          AdminID:this.AdminID,
          Description:this.formInput.Description,
          Title:this.formInput.Title,
          ImageUrl:this.ImageUrl
                    }
        this._commonservice.ApiUsingPost("Admin/CreateTask",json).subscribe(
    
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
       this.ApiURL="Admin/ActiveTask?TaskID="+ID;
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
       this.ApiURL="Admin/DeactiveTask?TaskID="+ID;
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

