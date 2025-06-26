import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addtrainer',
  templateUrl: './addtrainer.component.html',
  styleUrls: ['./addtrainer.component.css']
})
export class AddtrainerComponent {

  EmpCredentials: any = [];
  selectedEmployee: any[] = []
  selectedOrganization: any[] = []
  SelectedRole: any[] = []
  selectedBranch: any[] = []
  selectedDepartment: any[] = []
  BranchList: any[] = []
  EmployeeList: any[] = []
  DepartmentList: any[] = []
  ApiURL: any
  OrgList: any[] = []
  OrgRoleList: any[] = []
  orgSettings: IDropdownSettings = {}
  branchSettings: IDropdownSettings = {};
  departmentSettings: IDropdownSettings = {};
  RoleSettings: IDropdownSettings = {};
  employeeSettings: IDropdownSettings = {};
  AdminID: any
  UserID: any
  OrgID: any
  EmpRoleList: any[] = []
  EmailID: any
  Password: any
  ConfirmPassword: any
  disableFeild: boolean = false
  EnableAssign:boolean = false
  constructor(private _router: Router, private globalToastService: ToastrService,
    private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService,
    private dialog: MatDialog, public dialogRef: MatDialogRef<AddtrainerComponent>,) {
    this.employeeSettings = {
      singleSelection: true,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
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
    this.RoleSettings = {
      singleSelection: true,
      idField: 'RoleID',
      textField: 'RoleName',
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
    this.UserID = localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
    this.GetOrganization();
    this.GetBranches(); this.getRoleEmpList(); this.GetRoles();this.GetCount()
  }

  GetRoles() {
    let ApiUrl = "Portal/GetRoles?OrgID=" + this.OrgID
    this._commonservice.ApiUsingGetWithOneParam(ApiUrl).subscribe((data) => {
      if (data.Status == true) {
        this.OrgRoleList = data.RoleList;
        const managerRole = this.OrgRoleList.find(role => role.RoleName === 'Trainer');
        if (managerRole) {
          this.disableFeild = true
          this.SelectedRole = [{ "RoleID": managerRole.RoleID, "RoleName": managerRole.RoleName }];
        }
      }
    },
      (error) => {
        this.ShowToast("Something Went Wrong!...", "error")
      });
  }

  getDepartment() {
    let NewApiURL = "Portal/GetEmployeeDepartments";
    const json = {
      "OrgID": this.OrgID,
      "AdminID": this.AdminID,
      "Branches": this.selectedBranch.map(res => {
        return {
          "id": res.Value
        }
      })
    }
    this._commonservice.ApiUsingPost(NewApiURL, json).subscribe((data) => {
      this.DepartmentList = data.List
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      console.log(error);
    });
  }
  onBranchSelect(item: any) {
    this.selectedDepartment = []
    this.getDepartment()

  }
  onBranchDeSelect(item: any) {
    this.selectedDepartment = []
    this.getDepartment()
  }

  onselectedOrg(item: any) {
    this.selectedBranch = []
    this.selectedDepartment = []
    this.BranchList = []
    this.DepartmentList = []
    this.GetBranches()
  }
  onDeselectedOrg(item: any) {
    this.selectedBranch = []
    this.selectedDepartment = []
    this.BranchList = []
    this.DepartmentList = []
    this.GetBranches()
  }

  onselectedmultiOrg(item: any) {
    this.selectedBranch = []
    this.GetBranches()
  }
  onDeselectedmultiOrg(item: any) {
    this.selectedBranch = []
    this.GetBranches()
  }
  onselectedmultiOrgall(item: any) {
    this.selectedBranch = []
    this.GetBranches()
  }
  onDeselectedmultiOrgall(item: any) {
    this.selectedBranch = []
    this.GetBranches()
  }
  GetOrganization() {
    this.ApiURL = "Admin/GetSuborgList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List;
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      console.log(error);
    });
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      console.log(error, "error");
    });
  }
  onallbranchselect(selecteditems: any) {
    this.selectedBranch = selecteditems
    this.selectedDepartment = []
    this.getDepartment()
  }

  onallbranchdeselect(selecteditems: any) {
    this.selectedDepartment = []
    this.getDepartment()
  }


  onalldeptselect(selecteditems: any) {
    this.selectedDepartment = selecteditems
  }
  onalldeptdeselect(selecteditems: any) {
    this.selectedDepartment = []
  }

  onDepartmentSelect(item: any) {

  }
  onDeselectDepartment(item: any) {
  }
  OnRoleSelect(item: any) {
  }

  onEmpSelect(item: any) {
    console.log(item, "item");
  }
  onEmpDeSelect(item: any) {
    console.log(item, "item");
  }

  getRoleEmpList() {
    this._commonservice.ApiUsingGetWithOneParam("Portal/GetEmpCredentials/" + this.OrgID).subscribe(data => {
      this.EmpRoleList = data.EmployeeList
      this.GetEmployeeList();
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
    })
  }
  GetEmployeeList() {
    let EmployeelistApiURL = "Portal/GetEmpListOnBranch";
    const json: any = {
      AdminID: this.AdminID,
      Year: 0,
      Month: 0,
      DepartmentID: [],
      BranchID: []
    }
    this._commonservice.ApiUsingPost(EmployeelistApiURL, json).subscribe(
      (data) => {
        this.EmployeeList = data.List
        this.EmployeeList = this.EmployeeList.map((employee: any) => {
          const isDisabled = this.EmpRoleList.some(emp => emp.EmployeeID === employee.ID);
          return { ...employee, isDisabled };
        });
      }
      , (error) => {
        this.ShowToast("Something Went Wrong!...", "error")
        console.log(error); this.spinnerService.hide();
      });
  }
    GetCount() {
      this.spinnerService.show();
      const json = { "feature": "rolecreation", "SoftwareID": 8, "UserId": Number(this.UserID) }
      this._commonservice.MasterApiUsingPost(environment.MasterUrl + "/subscription/feature/count", json).subscribe((data) => {
        if (data.status == 200) {
          this.EnableAssign = true;
        }
        else {
          this.EnableAssign = false;
        }
      }, (error) => {
        // this.ShowToast("Something Went Wrong!...","error")
        this.spinnerService.hide();
      });
      this.spinnerService.hide();
    }
  MapModule() {
    if(this.EnableAssign){
      if (this.SelectedRole == null || this.SelectedRole == undefined) {
        this.ShowToast("Please Select Role", "warning")
      }
      else if (this.selectedEmployee.length == 0) {
        this.ShowToast("Please Select Employee", "warning")
      }
      else if (this.selectedBranch.length == 0 && this.selectedDepartment.length == 0) {
        this.ShowToast("Please Select Either the Branch or Department", "warning")
      }
      else if (this.EmailID == undefined || this.EmailID == "") {
        this.ShowToast("Please Enter Email", "warning")
      }
      else if (this.Password == undefined || this.Password == "") {
        this.ShowToast("Please Enter Password", "warning")
      }
      else if (this.ConfirmPassword == undefined || this.ConfirmPassword == "") {
        this.ShowToast("Please Enter ConfirmPassword", "warning")
      }
      else if (this.Password != this.ConfirmPassword) {
        this.ShowToast("Password and Confirm Password must be same", "warning")
      }
      else {
        this.ApiURL = "Account/CheckDuplicateEmail?Email=" + this.EmailID;
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(rest => {
          if (rest.EmailExist == false) {
            var json = {
              RoleID: this.SelectedRole.map(res => res.RoleID)[0],
                isportal  :true,
              employees: this.selectedDepartment.length > 0
                ? this.selectedDepartment.map((dept: any) => ({
                  "AdminId": this.AdminID,
                  "BranchId": 0,  // Ignore branch if departments are selected
                  "EmployeeId": this.selectedEmployee.map(res => res.ID)[0],
                  "RoleID": this.SelectedRole.map(res => res.RoleID)[0],
                  "Deptid": dept.Value,
                  "SubOrgID": 0
                }))
                : this.selectedBranch.length > 0
                  ? this.selectedBranch.map((branch: any) => ({
                    "AdminId": this.AdminID,
                    "BranchId": branch.Value,  // Only include branch if no departments are selected
                    "EmployeeId": this.selectedEmployee.map(res => res.ID)[0],
                    "RoleID": this.SelectedRole.map(res => res.RoleID)[0],
                    "Deptid": 0,
                    "SubOrgID": 0
                  })) : null,
              Key: "en"
            };
            console.log(json, "assign module");
            this._commonservice.ApiUsingPost("Portal/Brachmappingtorole", json).subscribe(data => {
              if (data.Status == true) {
                var json = {
                  RoleID: this.SelectedRole.map(res => res.RoleID)[0],
                  employees: [{
                    EmployeeID: this.selectedEmployee.map(res => res.ID)[0],
                    EmployeeName: this.selectedEmployee.map(res => res.Name)[0],
                    EmailID: this.EmailID,
                    Password: this.Password
                  }],
                  Key: "en"
                }
                this._commonservice.ApiUsingPost("Portal/MapEmployeeRole", json).subscribe(data => {
                  if (data.Status == true) {
                    this.spinnerService.hide();
                    this.ShowToast(data.Message, "success")
                    this.dialogRef.close({data})
                  }
                  else {
                    this.ShowToast(data.Message, "warning")
                    this.spinnerService.hide();
                  }
                }, (error) => {
                  this.ShowToast(error, "error")
                  this.spinnerService.hide();
                  return false;
                })
                this.spinnerService.hide();
                return true;
              }
              else {
                this.ShowToast(data.Message, "warning");
                this.spinnerService.hide();
                return false;
              }
            }, (error) => {
              this.ShowToast(error, "error");
              this.spinnerService.hide();
            })
          }
          else {
            this.ShowToast(rest.Message, "warning")
            this.spinnerService.hide();
          }
        }, (error) => {
          this.ShowToast(error, "error")
          this.spinnerService.hide();
          return false;
        })
      }
    }
    else {
      this.ShowToast("Out of Plan! Please Buy Role AddOn to Assign Roles", "warning")
      this.spinnerService.hide();
    }
  }

  validateEmail(): void {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!this.EmailID || !emailRegex.test(this.EmailID)) {
      this.ShowToast("PLease Enter Valid Email ID", "error");
      this.EmailID = '';
    } else {
    }
  }

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

  close() {
    this.dialogRef.close()
  }
}
