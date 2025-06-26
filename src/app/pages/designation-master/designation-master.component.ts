import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
declare const GetInfo: any;
import { Subject } from 'rxjs';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';
export class FormInput {
  DesignationName:any;
}

@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.css']
})
export class DesignationMasterComponent implements OnInit{
  formInput: FormInput|any;
  public isSubmit: boolean;
  Editdetails: any;
  editid: any;
  Add = true;
  Edit = false;
  View = true;AdminID:any;OrgID:any;
  BranchList:any; DepartmentList:any;ApiURL:any;
  selectedBranchId:string[]|any; selectedDepartmentId:string[]|any;
   institutionsList:any;
   dtExportButtonOptions: any = {};
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   file:File | any;ImageUrl:any;ShowImage=false;
   showAddButton:boolean = false;
   AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
     //common table
  actionOptions:any
  displayColumns:any
  displayedColumns:any
  employeeLoading:any;
  editableColumns:any =[]
  topHeaders:any = []
  headerColors:any = []
  smallHeaders:any = []
  ReportTitles:any = {}
  selectedRows:any = []
  commonTableOptions :any = {}
  ShowBtn:boolean = false
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
  //ends here

  constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,private dialog:MatDialog) {
    this.isSubmit = false;

     //common table
     this.actionOptions = [
      {
        name: "View Edit",
        icon: "fa fa-edit",
      },
      {
        name: "Deactivate",
        icon: "fa fa-trash",
        filter: [
          { field:'IsActive',value : true}
        ],
      },
      {
        name: "Activate",
        icon: "fa fa-plus",
        filter: [
          { field:'IsActive',value : false}
        ],
      }
    ];

    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"SL No",
      "Designation":"DESIGNATION",
      "CreatedBy":"CREATED BY",
      "ModifiedBy":"MODIFIED BY",
      "Actions":"ACTIONS"
    },


    this.displayedColumns= [
      "SLno",
      "Designation",
      "CreatedBy",
      "ModifiedBy",
      "Actions"
    ]

    this.editableColumns = {
      // "HRA":{
      //   filters:{}
      // },
    }

    // this.topHeaders = [
      // {
      //   id:"blank1",
      //   name:"",
      //   colspan:5
      // },
    // ]

    this.headerColors ={
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    //ends here
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    if (this.AdminID==null||this.AdminID==""||this.OrgID==undefined||this.OrgID==null||this.OrgID==""||this.AdminID==undefined) {
      this._router.navigate(["auth/signin-v2"]);
    }
    this.formInput = {     
      DesignationName:''
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
    this.GetDesignationList();
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }
  CreateNew(){
    this.showAddButton = false
    this.Add = true;
    this.Edit = false
  }
  Viewlist()
  {
  window.location.reload();
  }
  GetDesignationList() {
    this.spinnerService.show();
    this.employeeLoading = true
    // this.ApiURL="ShiftMaster/GetAllShiftList"?AdminID="+this.AdminID+"&BranchID="+BranchID;
    this.ApiURL="Portal/GetDesignation?OrgID="+this.OrgID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
      if(sec.Status==true)
      {
        this.institutionsList = sec.DesignationList.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
        this.dtTrigger.next(null);
        this.employeeLoading = false
        this.Edit = false;this.Add = true;
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      this.employeeLoading = false
      
    });
  }

  UploadProof1Image1(event:any,form: NgForm) {
    const target = event.target as HTMLInputElement;
    var img = (target.files as FileList)[0];
    if (img && img.type.startsWith('image/'))
    {
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
else
{
  // this.globalToastService.warning("Please select valid image file");
  this.ShowToast("Please select valid image file","warning")
}
 
}
    Update() { 
     if (this.formInput.DesignationName == ""||this.formInput.DesignationName ==undefined) {
        // this.globalToastService.warning("Please Enter DesignationName...!");
        this.ShowToast("Please Enter DesignationName...!","warning")
        return false;
      }
      else
      {
        const json={
          Designation:this.formInput.DesignationName, 
          OrgID:this.OrgID,
          ModifiedByID:this.AdminID,
          DesignationID:this.editid,
          ImageURl:this.ImageUrl
                    }
        this._commonservice.ApiUsingPost("Portal/UpdateDesignation",json).subscribe(
    
          (data: any) => {
            if(data.Status==true){
            this.spinnerService.hide();
            this.Add = true;
            this.Edit = false;
            this.View = true;
            // this.globalToastService.success(data.Message);
            this.ShowToast(data.Message,"success")
              window.location.reload();
            }
            else
            {
              // this.globalToastService.warning(data.Message);
              this.ShowToast(data.Message,"warning")
                this.spinnerService.hide();
            }
            
          }, (error: any) => {
            localStorage.clear();
    
            // this.globalToastService.error(error.message);
            this.ShowToast(error.message,"error")
            this.spinnerService.hide();
           }
        );
        return true;
      }
        
    }


       edit(IL: any): any {
          this.showAddButton = true
          this.spinnerService.show();
          this.Editdetails = IL;
          this.spinnerService.hide();
          this.editid=IL.DesignationID;   
          this.formInput.DesignationName = this.Editdetails.Designation; 
          this.View= true;
          this.Add=false;
          this.Edit=true;
          this.spinnerService.hide();  
        } 
    
    
   CreateShift() {
    if (this.formInput.DesignationName == ""||this.formInput.DesignationName ==undefined) {
      // this.globalToastService.warning("Please Enter DesignationName...!");
      this.ShowToast("Please Enter DesignationName...!","warning")
      return false;
    }
    else{
      const json={
        Designation:this.formInput.DesignationName, 
    OrgID:this.OrgID,
    CreatedByID:this.AdminID,
    ImageURl:this.ImageUrl
  }
        this._commonservice.ApiUsingPost("Portal/CreateDesignation",json).subscribe(
    
          (data: any) => {
            if(data.Status==true){
            this.spinnerService.hide();
            this.Add = true;
            this.Edit = false;
            this.View = true;
            // this.globalToastService.success(data.Message);
            this.ShowToast(data.Message,"success")
              window.location.reload();
            }
            else
            {
              // this.globalToastService.warning(data.Message);
              this.ShowToast(data.Message,"warning")
                this.spinnerService.hide();
            }
            
          }, (error: any) => {
            localStorage.clear();
    
            // this.globalToastService.error(error.message);
            this.ShowToast(error.message,"error")
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
       this.ApiURL="Portal/ActiveDesignation?DesignationID="+ID;
       this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
        if(data.Status==true)
        {
          this.spinnerService.hide();
          // this.globalToastService.success(data.Message);
          this.ShowToast(data.Message,"success")
          this.GetDesignationList()
        }
        else{
          // this.globalToastService.warning(data.Message);
          this.ShowToast(data.Message,"warning")
          this.spinnerService.hide(); 
        }        
        }, (error) => {
          // this.globalToastService.error(error);
          this.ShowToast(error,"error")
         this.spinnerService.hide();
       })  
     }   
     DeactiveModule(ID: number): any {
      this.spinnerService.show();
       this.ApiURL="Portal/DeleteDesignation?DesignationID="+ID;
       this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
        if(data.Status==true)
        {
          this.spinnerService.hide();
          // this.globalToastService.success(data.Message);
          this.ShowToast(data.Message,"success")
           this.GetDesignationList()
        }
        else{
          // this.globalToastService.warning(data.Message);
          this.ShowToast(data.Message,"warning")
          this.spinnerService.hide(); 
        }        
        }, (error) => {
          // this.globalToastService.error(error);
          this.ShowToast(error,"error")
         this.spinnerService.hide();
       })  
     }  

          //common table
 actionEmitter(data:any){
  if(data.action.name == "View Edit"){
    this.edit(data.row);
  }
  if(data.action.name == "Deactivate"){
      this.DeactiveModule(data.row.DesignationID);
    }
  if(data.action.name == "Activate"){
    this.ActiveModule(data.row.DesignationID);
    }
}
downloadReport(){
  let selectedColumns = this.displayedColumns
  this.commonTableChild.downloadReport(selectedColumns)
}

//ends here

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
