import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';

export class Emp{
  EmployeeID:any;
}

export class FormInput{
  Date:any;
  SelectedDate:any}

@Component({
  selector: 'app-task-allocation',
  templateUrl: './task-allocation.component.html',
  styleUrls: ['./task-allocation.component.css']
})
export class TaskAllocationComponent implements OnInit{
  formInput: FormInput | any;
  public isSubmit: boolean;
  EmpClass:Array<Emp> = [];
  Editdetails: any;UserID:any;
  editid: any;AdminID:any;OrgID:any;ApiURL:any;NewApiURL:any;
  selectedTaskId:string[]|any;  selectedEmployeeId:string[]|any;
  selectedBranchId:string[]|any; selectedDepartmentId:string[]|any;
  BranchList:any; DepartmentList:any;institutionsList:any;TaskList:any;EmployeeList:any;
   dtExportButtonOptions: any = {};
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   EmployeesArray=[];
index:any;
AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

ArrayLength=0;
  constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
    this.isSubmit = false;
  }
  ngOnInit(): void {
    this.formInput={
      Date:'',
    SelectedDate:''}
    if (localStorage.getItem('LoggedInUserData') == null) {
  
      this._router.navigate(["auth/signin-v2"]);
    }
    else {
      this.AdminID = localStorage.getItem("AdminID");
      this.OrgID = localStorage.getItem("OrgID");
    }
    this.UserID=localStorage.getItem("UserID");
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

     this.ApiURL="Admin/GetBranchList?OrgID="+this.OrgID+"&AdminId="+this.UserID;
     this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.BranchList = data.List, (error) => {
       this.globalToastService.error(error); console.log(error);
     });
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetDepartmentList").subscribe((data) => this.DepartmentList = data.List, (error) => {
      this.globalToastService.error(error); console.log(error);
    });

    this.NewApiURL="Admin/GetTaskList?AdminID="+this.AdminID;
    this._commonservice.ApiUsingGetWithOneParam(this.NewApiURL).subscribe((data) => this.TaskList = data.List, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }
  GetEmpOnBranchChange(event:any)
  {
      this.spinnerService.show();
      if(this.selectedBranchId==""||event==undefined|| this.selectedBranchId==null && this.selectedBranchId==undefined){this.selectedBranchId=0;}
      else{
        this.selectedBranchId=event.Value;
      }
       if(this.selectedDepartmentId==""||this.selectedDepartmentId==null && this.selectedDepartmentId==undefined){this.selectedDepartmentId=0;}
      this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+event.Value+"&DeptId="+this.selectedDepartmentId+"&Year=0&Month=0";
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
         console.log(error);this.spinnerService.hide();
      });
      this.spinnerService.hide();
  }
  GetEmpOnDeptChange(event:any)
  {
      this.spinnerService.show();
      if(this.selectedBranchId==""||this.selectedBranchId==null && this.selectedBranchId==undefined){this.selectedBranchId=0;} 
      if(this.selectedDepartmentId==""||this.selectedDepartmentId==null && this.selectedDepartmentId==undefined || event==undefined){this.selectedDepartmentId=0;}
else{
  this.selectedDepartmentId=event.Value;
}
      this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranchId+"&DeptId="+this.selectedDepartmentId+"&Year=0&Month=0";
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
         console.log(error);this.spinnerService.hide();
      });
      this.spinnerService.hide();
  }

  GetAllotedShifts() {
    if(this.formInput.SelectedDate==null||this.formInput.SelectedDate==""||this.formInput.SelectedDate==undefined)
    {
      this.globalToastService.warning("Please Select Date");
    }
    else{
      
    this.spinnerService.show();
    this.ApiURL="Admin/GetAllotedTasks?AdminID="+this.AdminID+"&Date="+this.formInput.SelectedDate;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
      if(sec.Status==true)
      {
        if(this.institutionsList!=undefined && this.institutionsList!=null)
        {
          var table = $('#DataTables_Table_0').DataTable();
          table.destroy();
        }  
        this.institutionsList = sec.List;
        this.dtTrigger.next(null);
        this.spinnerService.hide();
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      
    });
  }
  }

   Allocate() {
      if (this.selectedTaskId == ""||this.selectedTaskId == null||this.selectedTaskId ==undefined) {
        this.globalToastService.warning("Please Select Task...!");
        return false;
      }
     else if (this.selectedEmployeeId == ""||this.selectedEmployeeId == null||this.selectedEmployeeId ==undefined) {
        this.globalToastService.warning("Please Select Employees...!");
        return false;
      }
      else if(this.selectedEmployeeId.length==0)
      {
        this.globalToastService.warning("Please Select Employees...!");
        return false;
      }
      else if (this.formInput.Date == ""||this.formInput.Date == null||this.formInput.Date ==undefined) {
        this.globalToastService.warning("Please Select Date...!");
        return false;
      }
      else{
        for(this.index=0;this.index<this.selectedEmployeeId.length;this.index++){
          let customObj = new Emp();
          customObj.EmployeeID=this.selectedEmployeeId[this.index];    
          this.EmpClass.push(customObj);
        }
        const json={
          Employee:this.EmpClass,
          TaskID:this.selectedTaskId,
          AdminID:this.AdminID,
          StartDate:this.formInput.Date,
          EndDate:this.formInput.Date
                    }
        this._commonservice.ApiUsingPost("Admin/AllocateTask",json).subscribe(
    
          (data: any) => {
            if(data.Status==true){
            this.spinnerService.hide();
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
    
    
    selectAll() {
    }
  
    unselectAll() {
      this.selectedEmployeeId=[];
    }
  }
