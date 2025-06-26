import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-addlimit',
  templateUrl: './addlimit.component.html',
  styleUrls: ['./addlimit.component.css']
})
export class AddlimitComponent {
  BranchList: any;
  DepartmentList: any;
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
 selectedDesignation:any[]=[]
 DesignationList:any[]=[]
  designationSettings:IDropdownSettings = {}
  limit:any;UserID:any;

  constructor(
    private spinnerService: NgxSpinnerService,
    private _route: Router,
    private _commonservice: HttpCommonService,
    private globalToastService: ToastrService,
    private dialog: MatDialog,public dialogRef: MatDialogRef<AddlimitComponent>
  ) {
    this.branchSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
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
 this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
 this.designationSettings = {
      singleSelection: false,
      idField: 'DesignationID',
      textField: 'Designation',
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
    this.GetDesignationList()
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
      }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowToast(error,"error")
       console.log(error);
    });
  }
  GetDesignationList() {
    this.ApiURL="Portal/GetDesignation?OrgID="+this.OrgID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res) => {
      this.DesignationList = res.DesignationList
    }, (error) => { 
    });
  }

  submitLimit(){
    // let branch = this.selectedBranch.map(res=>res.Value)[0] || []
    // let dept = this.selectedDepartment.map(res=>res.Value)[0] || []
    // let design = this.selectedDesignation.map(res=>res.DesignationID)[0] || []
 
    let brnarray: any[] = [];
    if (this.selectedBranch.length > 0) {
      brnarray = this.selectedBranch.map(res => res.Value);
    }
     var deptarray: any[]=[];
     if(this.selectedDepartment.length>0)
     {
      deptarray=this.selectedDepartment.map(res=>res.Value)
     }
     var desgnarray: any[]=[];
     if(this.selectedDesignation.length>0)
     {
      desgnarray=this.selectedDesignation.map(res=>res.DesignationID)
     }
     let json:any =  {
      "BranchID":brnarray,
      "DeptID":deptarray,
      "DesignationID":desgnarray,
      "Limit":this.limit,
      "userid":parseInt(this.AdminID),
      "limitid":0
   }

   console.log(json,"json");
   this._commonservice.ApiUsingPost("Employee/setExpenselimit",json).subscribe((res) => {
    this.ShowToast(res.Message,"success")
    this.dialogRef.close({res})
  }, (error) => {
    this.ShowToast("Something Went wrong!..","error")
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
