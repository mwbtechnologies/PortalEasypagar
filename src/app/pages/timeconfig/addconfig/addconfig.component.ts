import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-addconfig',
  templateUrl: './addconfig.component.html',
  styleUrls: ['./addconfig.component.css']
})
export class AddconfigComponent {
  OrgID: any;
  AdminID: any;
  BranchApiURL: any
  DepartmentApiURL: any
  BranchList: any[] = []
  DepartmentList: any[] = []
  branches: any[] = []
  DaysList: any[] = ["Monday", "Tuesdays", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  startTime: any
  endTime: any
  selectedBranch: any
  selectedDepartment: any
  selectedDays: any
  branchSettings: IDropdownSettings = {};
  DaySettings: IDropdownSettings = {};
  departmentSettings: IDropdownSettings = {};
  branch:any
  department:any
  day:any;UserID:any;
  isEdit: boolean
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private globalToastService: ToastrService, private _commonservice: HttpCommonService, private toastr: ToastrService,
    private spinnerService: NgxSpinnerService, public dialogRef: MatDialogRef<AddconfigComponent>
  ) {
    this.isEdit = this.data.isEdit || false;
    this.startTime = this.data.row?.StartTime || ''
    this.endTime = this.data.row?.EndTime || ''
    this.branch = this.data.row?.Branch || ''
    this.department = this.data.row?.Department || ''
    this.day = this.data.row?.Day || ''
    // const dayIndex = this.data.row?.Day;
    // if (dayIndex >= 1 && dayIndex <= 7) {
    //   this.selectedDays = [this.DaysList[dayIndex - 1]]; // map numeric value to corresponding day
    // }
    // const selectedDeptId = this.data.row?.DepartmentId;
    // if (selectedDeptId) {
    //     this.selectedDepartment = this.DepartmentList.filter(dept => dept.id === selectedDeptId);
    //   }

    this.branchSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.departmentSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.DaySettings = {
      singleSelection: false,
      idField: 'day',
      textField: 'day',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }
  ngOnInit() {
    this.OrgID = localStorage.getItem("OrgID");
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID=localStorage.getItem("UserID");
    this.BranchApiURL = "Admin/GetBranchList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID;
    this.DepartmentApiURL = "Portal/GetEmployeeDepartments"
    console.log(this.BranchApiURL, "url");

    this.GetBranches()
  }

  GetBranches() {
    const selectedBranchId = this.data.row?.BranchId;
    this._commonservice.ApiUsingGetWithOneParam(this.BranchApiURL).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "list");
      if (selectedBranchId) {
        this.selectedBranch = this.BranchList.filter(branch => branch.Value === selectedBranchId);
      }
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
 
  }
  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");

    const json = { 
      "OrgID":this.OrgID,
      "AdminID":loggedinuserid,
      "Branches": this.selectedBranch.map((br:any)=>{
        return {
          "id": br.Value
        }
      })
      }
      console.log(json,"json value");
    this._commonservice.ApiUsingPost(this.DepartmentApiURL,json).subscribe((data) => {
      this.DepartmentList = data.DepartmentList;
  
      console.log(this.DepartmentList, "Departmentlist");
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
  }
  onBranchSelect(item: any) {
    console.log(item, "selected branch");
    this.GetDepartments()
  }
  onBranchDeSelect(item: any) {
    console.log(item, "selected departmrnt");
    this.GetDepartments()
  }
  onDepartmentSelect(item: any) {
    console.log(item, "selected departmrnt");
  }
  onDaySelect(item: any) {
    const index = this.DaysList.indexOf(item) + 1;
    console.log(index, item, "selected");
  }

  addTimeConfig() {
    const json = {
      "AdminID": this.AdminID,
      "Branches": this.selectedBranch.map((br: any) => {
        return {
          "id": br.Value
        }
      }),
      "Departments":this.selectedDepartment.map((department: any) => {
        return {
          "id": department.id
        }
      }),
      "Days": this.selectedDays.map((sd: any) => {
        return {
          "text": sd
        }

      }),
      "starttime": this.startTime,
      "endtime": this.endTime
    }
    console.log(json,"addconfig");
    
    this.spinnerService.show();
    this._commonservice.ApiUsingPost('/Portal/CreateTimeCofig', json).subscribe((response: any) => {
      this.toastr.success(response.Message);
      this.spinnerService.hide();
      this.dialogRef.close();
    } ,(error: any) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
    })
  }
  editTimeConfig() {
      const json = {
        "Id":this.data.row.Id,
        "AdminID": this.AdminID,
        "starttime": this.startTime,
        "endtime": this.endTime,
        "BranchId": this.data.row.BranchId,
        "DepartmentId": this.data.row.DepartmentId,
        "Day": this.day,
      }
      console.log(json ,"edit");
      
    this.spinnerService.show();
    this._commonservice.ApiUsingPost('/Portal/UpdateTimeConfig',json).subscribe((response:any) =>{
      this.toastr.success(response.Message);
      this.spinnerService.hide();
      this.dialogRef.close();

    },(error:any) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
  })
  }
}



