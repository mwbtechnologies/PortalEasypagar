import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';

export class FormInput{
  FromDate:any;
  ToDate:any;
}

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.css']
})
export class ViewTasksComponent implements OnInit {
  BranchList:any;EmployeeList:any;
  DepartmentList:any; 
  formInput: FormInput | any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  UserID: any;
  ApiURL:any;
  file:any;
  selectedDepartmentIds: string[] | any;
  selectedEmployeeId: string[] | any;
  selectedBranchId: string[] | any;
  NewApiURL:any;
  EmployeeId:any;
  index=0; TaskList:any;
  pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();AdminID:any;OrgID:any;
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

  constructor(public dialog: MatDialog,private toastr:ToastrService,private spinnerService: NgxSpinnerService,private _router: Router,private _commonservice: HttpCommonService){ this.isSubmit=false}
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
    }
    this.formInput={
      FormDate:'',
      ToDate:''
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

 this.selectedDepartmentIds=[];
 this.selectedBranchId=[];
this.ApiURL="Admin/GetBranchList?OrgID="+this.OrgID+"&AdminId="+this.UserID;
this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.BranchList = data.List, (error) => {
  console.log(error);
});

this.NewApiURL="Admin/GetAdminDepartments?AdminID="+this.AdminID;
this._commonservice.ApiUsingGetWithOneParam(this.NewApiURL).subscribe((data) => this.DepartmentList = data.List, (error) => {
  console.log(error);
});

this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }
  GetReport()
  {
     if(this.formInput.FromDate=='')
  {
    this.toastr.warning("Please Select FromDate");
  }
  else if(this.formInput.ToDate=='')
  {
    this.toastr.warning("Please Select ToDate");
  }
  else if (this.selectedEmployeeId == ""||this.selectedEmployeeId == null||this.selectedEmployeeId ==undefined) {
    this.toastr.warning("Please Select Employees...!");
  }
  else if(this.selectedEmployeeId.length==0)
  {
    this.toastr.warning("Please Select Employees...!");
  }
  else
  {
    this.UserID=this.selectedEmployeeId;
    this.GetleaveList();
}

  }
  GetleaveList()
  {
    this.spinnerService.show();
    this.ApiURL="Admin/GetAllotedEmpTasks?EmployeeID="+this.UserID+"&FromDate="+this.formInput.FromDate+"&ToDate="+this.formInput.ToDate;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {    
        this.TaskList = res.List;
        this.spinnerService.hide();
      }, (error) => {
        // this.toastr.error(error.message);
        this.spinnerService.hide();
      });
}
GetEmpOnBranchChange(event:any)
{
    this.spinnerService.show();
    if(this.selectedBranchId==""||event==undefined|| this.selectedBranchId==null && this.selectedBranchId==undefined){this.selectedBranchId=0;}
    else{
      this.selectedBranchId=event.Value;
    }
     if(this.selectedDepartmentIds==""||this.selectedDepartmentIds==null && this.selectedDepartmentIds==undefined){this.selectedDepartmentIds=0;}
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+event.Value+"&DeptId="+this.selectedDepartmentIds+"&Year=0&Month=0";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
       console.log(error);this.spinnerService.hide();
    });
    this.spinnerService.hide();
}
GetEmpOnDeptChange(event:any)
{
    this.spinnerService.show();
    if(this.selectedBranchId==""||this.selectedBranchId==null && this.selectedBranchId==undefined){this.selectedBranchId=0;} 
    if(this.selectedDepartmentIds==""||this.selectedDepartmentIds==null && this.selectedDepartmentIds==undefined || event==undefined){this.selectedDepartmentIds=0;}
else{
this.selectedDepartmentIds=event.Value;
}
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranchId+"&DeptId="+this.selectedDepartmentIds+"&Year=0&Month=0";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
       console.log(error);this.spinnerService.hide();
    });
    this.spinnerService.hide();
}
}
