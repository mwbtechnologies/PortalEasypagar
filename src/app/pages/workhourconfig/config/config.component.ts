import { Component, Inject } from '@angular/core';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
 BranchList: any;
  DepartmentList: any;
  UserID: any;
  AdminID: any;
  ApiURL: any;
OrgID: any;
 branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
selectedDepartment: any[] = [];
selectedBranch: any[] = [];
 selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  firstHalf:any
  secondHalf:any
  wholeDay:any
  isHour:boolean=false
  isEdit:boolean
  error:any={}
  IsActive:boolean 
  
  constructor(
    private spinnerService: NgxSpinnerService,
    private _route: Router,
    private _commonservice: HttpCommonService,
    private globalToastService: ToastrService,@Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,public dialogRef: MatDialogRef<ConfigComponent>
  ) {
    this.isEdit = this.data.isEdit
    this.firstHalf = this.data?.row?.FirstHalf || ""
    this.secondHalf = this.data?.row?.SecondHalf || ""
    this.wholeDay = this.data?.row?.WholeDay || ""
    this.isHour = this.data?.row?.IsHours || ""
    this.IsActive = this.data?.row?.IsActive || false
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
 this.departmentSettings = {
      singleSelection: true,
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
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
    this.GetOrganization();
    this.GetBranches()
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

  onDeptSelect(item: any) {
  }
  onDeptSelectAll(items:any) {
    this.selectedDepartment = [...items]
    this.GetDepartments()
  }
  onDeptDeSelectAll() {
    this.selectedDepartment = []
  }
  onDeptDeSelect(item: any) {
  }
  onBranchSelectAll(items:any){
    this.selectedBranch = [...items]
    this.selectedDepartment = []
    this.GetDepartments();
  }
  onBranchDeSelectAll(){
    this.selectedBranch = []
    this.selectedDepartment = []
    this.GetDepartments();
  }
  onBranchSelect(item: any) {
    this.selectedDepartment = []
    this.GetDepartments();
  }
  onBranchDeSelect(item: any) {
    this.DepartmentList = []  
    this.GetDepartments();
  }
  onDesignationSelect(item:any){
    
  }
  onDesignationDeSelect(item:any){
    
  }


  GetOrganization() {
    this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List
      if(data.List.length == 1){
        this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
        this.onselectedOrg({Value:this.OrgList[0].Value,Text:this.OrgList[0].Text})
      }
      if(this.isEdit){
        this.selectedOrganization = this.data?.row?.SubOrgId && this.data?.row?.SubOrgName
        ? [{Value:this.data.row.SubOrgId,Text:this.data.row.SubOrgName}]
        : [];
      }
    }, (error) => {
      this.ShowToast(error,"error")
       console.log(error);
    });
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
      if(this.isEdit){
        this.selectedBranch = this.data?.row?.BranchId && this.data?.row?.BranchName
        ? [{Value:this.data.row.BranchId,Text:this.data.row.BranchName}]
        : [];
        this.onBranchSelect({Value:this.data.row.BranchId,Text:this.data.row.BranchName})
      }
    }, (error) => {
      this.ShowToast(error,"error")
      console.log(error);
    });

  }

  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json = {
      OrgID:this.OrgID,
      AdminID:loggedinuserid,
      Branches: this.selectedBranch.map((br: any) => {
        return {
          "id": br.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        console.log(this.DepartmentList, "department list");
        if(this.isEdit){
          this.selectedDepartment = this.data?.row?.DepartmentId && this.data?.row?.DepartmentName
        ? [{ Value: this.data.row.DepartmentId, Text: this.data.row.DepartmentName }]
        : [];

        }
      }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowToast(error,"error")
       console.log(error);
    });
  }

  submit(){
    let paramerror:any = {}
    let hasError = false;

    if(this.selectedOrganization.length == 0 || this.selectedOrganization == undefined){
      paramerror[`organization`] =  "Please Select Organization"
      hasError = true;
    }
    if(this.selectedBranch.length == 0 || this.selectedBranch == undefined){
      paramerror[`branch`] =  "Please Select Branch"
      hasError = true;
    }
    
    if(this.firstHalf == undefined || this.firstHalf==''){
      paramerror[`fHalf`] =  "Please Enter First Half Hours"
      hasError = true;
    }
    if(this.secondHalf == undefined || this.secondHalf==''){
      paramerror[`sHalf`] =  "Please Enter Second Half Hours"
      hasError = true;
    }
    if(this.wholeDay == undefined || this.wholeDay==''){
      paramerror[`wDay`] =  "Please Enter Whole Day"
      hasError = true;
    }
    this.error = paramerror;
   if (hasError) {
    return;
   }
    let suborg = this.selectedOrganization.map(res=>res.Value)[0]
    let branch = this.selectedBranch.map(res=>res.Value)[0]
    let dept = this.selectedDepartment.map(res=>res.Value)[0]
    let json = {
      "AdminId": this.AdminID,
      "OrgId": this.OrgID,
      "SubOrgId": suborg,
      "BranchId": branch,
      "DepartmentId": dept,
      "FirstHalf": this.firstHalf,
      "SecondHalf": this.secondHalf,
      "WholeDay": this.wholeDay,
      "IsHours":this.isHour
    }
    console.log(json,"add config hour");    
    this._commonservice.ApiUsingPost("TraniningMaster/WorkingHourConfig",json).subscribe((data) => {
      this.ShowToast(data.message,"success")
      this.dialogRef.close({data})
    }, (error) => {
      this.ShowToast("Something Went Wrong!..", "error")
    });
  }
  Update(){
    let paramerror:any = {}
    let hasError = false;

    if(this.selectedOrganization.length == 0 || this.selectedOrganization == undefined){
      paramerror[`organization`] =  "Please Select Organization"
      hasError = true;
    }
    if(this.selectedBranch.length == 0 || this.selectedBranch == undefined){
      paramerror[`branch`] =  "Please Select Branch"
      hasError = true;
    }
    
    if(this.firstHalf == undefined || this.firstHalf==''){
      paramerror[`fHalf`] =  "Please Enter First Half Hours"
      hasError = true;
    }
    if(this.secondHalf == undefined || this.secondHalf==''){
      paramerror[`sHalf`] =  "Please Enter Second Half Hours"
      hasError = true;
    }
    if(this.wholeDay == undefined || this.wholeDay==''){
      paramerror[`wDay`] =  "Please Enter Whole Day"
      hasError = true;
    }
    this.error = paramerror;
   if (hasError) {
    return;
   }
    let json = {
      "Id":this.data.row?.Id, 
      "FirstHalf": this.firstHalf,
      "SecondHalf": this.secondHalf,
      "WholeDay": this.wholeDay,
      "IsHours":this.isHour,
      "IsActive":this.IsActive,
      "UpdatedBy":this.AdminID
    }
    console.log(json,"edit config hour");    
    this._commonservice.ApiUsingPost("TraniningMaster/GetWorkingHourConfigUpdate",json).subscribe((data) => {
      this.ShowToast(data.message,"success")
      this.dialogRef.close({data})
    }, (error) => {
      this.ShowToast("Something Went Wrong!..", "error")
    });
  }

   ShowToast(message: string, type: 'success' | 'warning' | 'error'): void {
        this.dialog.open(ShowalertComponent, {
          data: { message, type },
          panelClass: 'custom-dialog',
          disableClose: true
        }).afterClosed().subscribe((res) => {
          if (res) {
            console.log("Dialog closed");
          }
        });
      }
}
