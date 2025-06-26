import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-allocateotforemployee',
  templateUrl: './allocateotforemployee.component.html',
  styleUrls: ['./allocateotforemployee.component.css']
})
export class AllocateotforemployeeComponent {
  DepartmentList: any[] = []
  EmployeeList: any[] = []
  DepartmentApiURL: any
  EmployeelistApiURL: any
  selectedDepartment: any
  selectedEmployee: any
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  isMonths: boolean = false
  Week1: boolean = false
  Week2: boolean = false
  Week3: boolean = false
  Week4: boolean = false
  Week5: boolean = false
  IsSunday: boolean = false
  IsMonday: boolean = false
  IsTuesday: boolean = false
  IsWednesday: boolean = false
  IsThursday: boolean = false
  IsFriday: boolean = false
  IsSaturday: boolean = false
  AdminId:any;OrgID:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private globalToastService: ToastrService, private _commonservice: HttpCommonService, private toastr: ToastrService,
    private spinnerService: NgxSpinnerService, public dialogRef: MatDialogRef<AllocateotforemployeeComponent>
  ) {
    this.departmentSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      enableCheckAll:false
    };
    this.employeeSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit:1,
      allowSearchFilter: true,
      enableCheckAll:false
    };
  }
  ngOnInit() {
    this.AdminId = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.DepartmentApiURL = "Portal/GetEmployeeDepartments"
    this.EmployeelistApiURL = "Portal/GetEmpListOnBranch";
    this.GetDepartments()
    this.GetEmployeeList()
  }

  onDepartmentSelect(item: any) {
    console.log(item);
    this.GetEmployeeList()
  }

  onDepartmentDeSelect(item: any) {
    console.log(item);
    this.selectedDepartment = this.selectedDepartment.filter((dept: any) => dept.id !== item.id);
    this.GetEmployeeList();
  }
  onEmployeeSelect(item: any) {
    console.log(item);
  }
  GetEmployeeList() {
    const json: any = {
      "AdminID":this.AdminId,
      "BranchID": [this.data.row?.BranchID]
    }
    if (this.selectedDepartment && this.selectedDepartment.length > 0) {
      json["DepartmentID"] = this.selectedDepartment.map((br: any) => { return br.id })
    }
    console.log(json, "dshdshjdhsjdjsjd");

    this._commonservice.ApiUsingPost(this.EmployeelistApiURL, json).subscribe((data) => {
      this.EmployeeList = data.List
    }
      , (error) => {
        console.log(error); this.spinnerService.hide();
      });
  }

  close(){
    this.dialogRef.close();
  }

  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json = {
      "OrgID":this.OrgID,
      "AdminID":loggedinuserid,
      "Branches": [{ "id": this.data.row?.BranchID }]
    }
    this._commonservice.ApiUsingPost(this.DepartmentApiURL, json).subscribe((data) => {
      this.DepartmentList = data.DepartmentList;
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
  }

  allocateotforemployee() {
    const json ={ 
      "OTID":this.data.row.OTID,
      "EmployeeID": this.selectedEmployee.map((e:any) =>{ return e.ID}),
       "IsFriday": false, 
       "IsMonday": false, 
       "IsSaturday": false, 
       "IsSunday": false, 
       "IsThursday": false, 
       "IsTuesday": false, 
       "IsWednesday": false,
        "IsWeek1": false, 
        "IsWeek3": false, 
        "IsWeek2": false, 
        "IsWeek4": false, 
        "IsWeek5": false, 
        "AdminID": this.AdminId 
      }
      console.log(json,"json for allocate");
      
      this._commonservice.ApiUsingPost("Portal/AllocateOT",json).subscribe(data => {
        this.toastr.success(data.Message);
        this.spinnerService.hide();
        this.dialogRef.close({...json});
      })
  }

}
