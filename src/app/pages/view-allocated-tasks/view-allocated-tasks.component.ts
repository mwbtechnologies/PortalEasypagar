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
  selector: 'app-view-allocated-tasks',
  templateUrl: './view-allocated-tasks.component.html',
  styleUrls: ['./view-allocated-tasks.component.css']
})
export class ViewAllocatedTasksComponent implements OnInit {
  BranchList:any;
  DepartmentList:any; 
  formInput: FormInput | any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  UserID: any;
  ApiURL:any;
  file:any;
  NewApiURL:any;
  EmployeeId:any;
  index=0; TaskList:any;
  pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

  constructor(public dialog: MatDialog,private toastr:ToastrService,private spinnerService: NgxSpinnerService,private _router: Router,private _commonservice: HttpCommonService){ this.isSubmit=false}
  ngOnInit(): void {
    this.UserID = localStorage.getItem("UserID");
    if (this.UserID==null||this.UserID==null) {

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
  else
  {
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
}
