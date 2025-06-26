import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { environment } from 'src/environments/environment';
export class FormInput {
  RoleName: any;
  EmailID: any; CPassword: any; Password: any;

}
export class Credentials {
  EmployeeID: any;
  EmployeeName: any;
  EmailID: any;
  Password: any;
}
export class Employees {
  EmployeeID: any;
}
@Component({
  selector: 'app-role-and-permission',
  templateUrl: './role-and-permission.component.html',
  styleUrls: ['./role-and-permission.component.css']
})
export class RoleAndPermissionComponent implements OnInit {
  EmpCredentials: Array<Credentials> = [];
  SelectedEmployees: Array<Employees> = [];
  formInput: FormInput | any;
  IsOrgAdmin: boolean = false;
  public isSubmit: boolean;
  Editdetails: any; index: any;
  editid: any; selectedApplicationId: any;
  Add = false; roleid: any;
  Edit = false; Columns: any;
  View = true; AdminID: any; OrgID: any;
  BranchList: any; DepartmentList: any[] = []; ApiURL: any;
  selectedBranchId: string[] | any; selectedDepartmentId: string[] | any;
  institutionsList: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission: any; EditPermission: any; ViewPermission: any; DeletePermission: any;
  Role = true; Assign = false; Map = false;
  ApiUrl: any; RolesList: any = [];
  AssignClass: any;
  RoleClass: any; NewApiURL: any;
  MapClass: any; FilterModuleList: any;
  selectedEmployeeId: string[] | any;
  EmployeeList: any; ModuleList: any; Roles: any; credstatus: any;
  selectedEmployee: any; temparray: any = [];
  OrgRoleList: any[] = []; MapBranchList: any[] = [];
  branchSettings: IDropdownSettings = {};
  departmentSettings: IDropdownSettings = {};
  RoleSettings: IDropdownSettings = {};
  employeeSettings: IDropdownSettings = {};
  BranchApiURL: any;
  selectedBranch: any[] = [];
  selectedDepartment: any[] = [];
  DepartmentApiURL: any;
  UserID: any; EnableAssign: any;
  EmployeelistApiURL: any; tempemparray: any = []; employeeid: any;
  EmpRoleList: any[] = []
  //common table
  actionOptions: any
  displayColumns: any
  displayedColumns: any
  employeeLoading: any;
  editableColumns: any = []
  topHeaders: any = []
  headerColors: any = []
  smallHeaders: any = []
  ReportTitles: any = {}
  selectedRows: any = []
  commonTableOptions: any = {}
  ShowBtn: boolean = false
  EditData: boolean = true
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here
  selectedOrganization: any[] = [];
  selectedMultiOrganization: any[] = [];
  OrgList: any[] = []
  orgSettings: IDropdownSettings = {};
  multiorgSettings: IDropdownSettings = {};
  MultipleOrgList: any;
  showList: boolean = true
  constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private dialog: MatDialog) {
    this.isSubmit = false;
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
      idField: 'id',
      textField: 'text',
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
    this.multiorgSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    //common table
    this.actionOptions = [
      {
        name: "View Edit",
        icon: "fa fa-edit",
      },
      {
        name: "Delete",
        icon: "fa fa-trash",
      },
    ];

    this.displayColumns = {
      // SelectAll: "SelectAll",
      "SLno": "SL No",
      "MappedEmpId": "EMPLOYEE ID",
      "EmployeeName": "EMPLOYEE",
      "SubOrgs": "SUBORGS",
      "Branches": "BRANCHES",
      "Depts": "DEPARTMENTS",
      "EmailID": "EMAIL",
      "RoleName": "ROLE",
      "Message": "MESSAGE",
      "Actions": "ACTIONS"
    },


      this.displayedColumns = [
        "SLno",
        "MappedEmpId",
        "EmployeeName",
        "SubOrgs",
        "Branches",
        "Depts",
        "EmailID",
        "RoleName",
        "Message",
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

    this.headerColors = {
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    //ends here

  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
    this.IsOrgAdmin = false;
    // this.CreateRoles();
    this.GetCount();
    this.EnableAssign = false;
    if (this.AdminID == null || this.AdminID == "" || this.OrgID == undefined || this.OrgID == null || this.OrgID == "" || this.AdminID == undefined) {
      this._router.navigate(["auth/signin-v2"]);
    }
    this.formInput = {
      RoleName: '', EmailID: '', CPassword: '', Password: ''
    };
    this.AssignClass = "nav-link";
    this.RoleClass = "nav-link active";
    this.MapClass = "nav-link";
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };
    this.formInput.OrgID = this.OrgID;
    this.GetOrganization();
    this.GetBranches(); this.GetRoles(); this.getRoleEmpList(); this.GetEmployeeList();
    // this.GetDepartments();
    this.AddPermission = localStorage.getItem("AddPermission"); if (this.AddPermission == "true") { this.AddPermission = true; } else { this.AddPermission = false; }
    this.EditPermission = localStorage.getItem("EditPermission"); if (this.EditPermission == "true") { this.EditPermission = true; } else { this.EditPermission = false; }
    this.ViewPermission = localStorage.getItem("ViewPermission"); if (this.ViewPermission == "true") { this.ViewPermission = true; } else { this.ViewPermission = false; }
    this.DeletePermission = localStorage.getItem("DeletePermission"); if (this.DeletePermission == "true") { this.DeletePermission = true; } else { this.DeletePermission = false; }

  }


  getRoleEmpList() {
    this.employeeLoading = true
    this._commonservice.ApiUsingGetWithOneParam("Portal/GetEmpCredentials/" + this.OrgID).subscribe(data => {
      this.EmpRoleList = data.EmployeeList.map((l: any, i: any) => { return { SLno: i + 1, ...l } });
      this.employeeLoading = false
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      this.employeeLoading = false
    })
  }

  ShowRoleTab() {
    this.Role = true; this.Assign = false; this.Map = false;
    this.AssignClass = "nav-link";
    this.RoleClass = "nav-link active";
    this.MapClass = "nav-link";
  }
  ShowAssignTab() {
    this.ApiUrl = "Portal/GetOrgRoles?OrgID=" + this.OrgID;
    this.Role = false; this.Assign = true; this.Map = false;
    this.AssignClass = "nav-link active";
    this.RoleClass = "nav-link";
    this.MapClass = "nav-link";
  }
  GetRoles() {
    // http://192.168.1.36/EPPortal/api/Portal/GetRoles?OrgID=124
    this.ApiUrl = "Portal/GetRoles?OrgID=" + this.OrgID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe((data) => {
      if (data.Status == true) {
        this.RolesList = data.RoleList;
        this.getData1();
      }
    }
      ,
      (error) => {
        this.ShowToast("Something Went Wrong!...", "error")
      });
  }
  ShowMapTab() {
    this.ApiUrl = "Portal/GetOrgRoles?OrgID=" + this.OrgID;
    // this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe((data) => this.RolesList = data.List, (error) => {
    //   this.ShowToast(error,"error")
    // });
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List

    }, (error) => {
      console.log(error);
    });
    this.getDepartment()
    this.Role = false; this.Assign = false; this.Map = true;
    this.AssignClass = "nav-link";
    this.RoleClass = "nav-link";
    this.MapClass = "nav-link active";
  }

  getDepartment() {
    this.NewApiURL = "Portal/GetEmployeeDepartments";
    const json = {
      "OrgID": this.OrgID,
      "AdminID": this.AdminID,
      "Branches": this.selectedBranch.map(res => {
        return {
          "id": res.Value
        }
      })
    }
    this._commonservice.ApiUsingPost(this.NewApiURL, json).subscribe((data) => {
      this.DepartmentList = data.List
      if (this.Editdetails.length > 0 || this.Editdetails) {
        let storedDept = this.Editdetails[0]?.DeptData.map((b: any) => b.DeptName);
        this.selectedDepartment = this.DepartmentList.filter((dept: any) =>
          storedDept.includes(dept.Text)
        );
      }
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      console.log(error);
    });
  }
  Viewlist() {
    window.location.reload();
  }

  GetRoleList() {
    this.spinnerService.show();
    this.ApiURL = "Portal/GetRoles?OrgID=" + this.OrgID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
      this.Roles = res.RoleList;
      this.dtTrigger.next(null);
      this.Edit = false;
      this.Add = false;
      this.View = true;
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      this.ShowToast("Something Went Wrong!...", "error")
    });


  }

  Update() {
    if (this.formInput.RoleName == "" || this.formInput.RoleName == undefined) {
      // this.globalToastService.warning("Please Enter Role Name...!");
      this.ShowToast("Please Enter Role Name...!", "warning")
      return false;
    }
    else {
      this.spinnerService.show();
      const json = {
        RoleName: this.formInput.RoleName,
        OrgID: this.OrgID,
        ModifiedByID: this.AdminID,
        RoleID: this.editid
      }
      this._commonservice.ApiUsingPost("Portal/UpdateRole", json).subscribe(

        (data: any) => {
          if (data.Status == true) {
            this.spinnerService.hide();
            this.Add = false;
            this.Edit = false;
            this.View = true;
            // this.globalToastService.success(data.Message);
            this.ShowToast(data.Message, "success")
            this.getRoleEmpList();
          }
          else {
            // this.globalToastService.warning(data.Message);
            this.ShowToast(data.Message, "warning")
            this.spinnerService.hide();
          }

        }, (error: any) => {
          localStorage.clear();

          this.ShowToast("Something Went Wrong!...", "error")
          this.spinnerService.hide();
        }
      );
      return true;
    }

  }
  back() {
    if (!this.EditData) {
      window.location.reload()
    }
    this.showList = true
  }

  edit(IL: any): any {
    this.spinnerService.show();
    this.showList = false
    this.employeeid = IL.EmployeeID;
    this._commonservice.ApiUsingGetWithOneParam("Admin/EditRoleDetails?ID=" + IL.EmployeeID).subscribe((res: any) => {
      let data = res.List;
      debugger
      let suborglist = data[0].Sodata;
      if (data.length > 0) {
        if (data[0].RoleName == "Organization Head") {
          this.IsOrgAdmin = true;
          this.GetOrganizationEdit(suborglist);
        }
      }
      this.tempemparray = []
      this.Editdetails = data;
      this.spinnerService.hide();
      this.editid = IL.RoleID;
      this.EditData = false
      console.log(IL, "data");
      // this.getDepartment()
      this.GetRoles()
      this.GetBranchesEdit()
      this.GetEmployeeList()
      this.tempemparray.push({ id: this.Editdetails[0].EmpID, EmailID: this.Editdetails[0].MappedUserName, Password: this.Editdetails[0].MappedPassword, ConfirmPassword: this.Editdetails[0].MappedPassword });
      this.spinnerService.hide();
    })
  }
  createRoleBtn() {
    this.selectedBranch = [];
    this.selectedApplicationId = [];
    this.selectedBranchId = [];
    this.selectedDepartment = [];
    this.selectedDepartmentId = [];
    this.selectedEmployee = [];
    this.selectedEmployeeId = [];
    this.selectedMultiOrganization = [];
    this.selectedOrganization = [];
    this.temparray = [];
    this.tempemparray = [];
    this.EditData = true
    this.showList = false
    this.GetBranches(); this.GetRoles(); this.getRoleEmpList(); this.GetEmployeeList();
  }

  CreateShift() {
    if (this.formInput.RoleName == "" || this.formInput.RoleName == undefined) {
      // this.globalToastService.warning("Please Enter Role Name...!");
      this.ShowToast("Please Enter Role Name...!", "warning")
      return false;
    }
    else {
      this.spinnerService.show();
      const json = {
        RoleName: this.formInput.RoleName,
        OrgID: this.OrgID,
        CreatedByID: this.AdminID,
      }
      this._commonservice.ApiUsingPost("Portal/CreateRole", json).subscribe(

        (data: any) => {
          if (data.Status == true) {
            this.spinnerService.hide();
            this.Add = false;
            this.Edit = false;
            this.View = true;
            // this.globalToastService.success(data.Message);
            this.ShowToast(data.Message, "success")
            window.location.reload();
          }
          else {
            // this.globalToastService.warning(data.Message);
            this.ShowToast(data.Message, "warning")
            this.spinnerService.hide();
          }

        }, (error: any) => {
          localStorage.clear();

          this.ShowToast("Something Went Wrong!...", "error")
          this.spinnerService.hide();
        }
      );
      return true;
    }

  }
  AddNewModule() {
    this.spinnerService.show();
    this.View = false;
    this.Add = true;
    this.Edit = false;
    this.spinnerService.hide(); this.selectedBranchId = "";
  }

  ActiveModule(ID: number): any {
    this.spinnerService.show();
    this.ApiURL = "Portal/ActiveRole?RoleID=" + ID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.hide();
        // this.globalToastService.success(data.Message);
        this.ShowToast(data.Message, "success")
        window.location.reload();
      }
      else {
        // this.globalToastService.warning(data.Message);
        this.ShowToast(data.Message, "warning")
        this.spinnerService.hide();
      }
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      this.spinnerService.hide();
    })
  }
  DeactiveModule(ID: number): any {
    this.spinnerService.show();
    this.ApiURL = "Portal/DeleteRole?RoleID=" + ID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.hide();
        // this.globalToastService.success(data.Message);
        this.ShowToast(data.Message, "success")
        window.location.reload();
      }
      else {
        // this.globalToastService.warning(data.Message);
        this.ShowToast(data.Message, "warning")
        this.spinnerService.hide();
      }
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      this.spinnerService.hide();
    })
  }

  OnAppChange(event: any) {
    this.spinnerService.show();
    this.roleid = event.Value;
    this.ApiUrl = "Portal/GetModuleList?AdminID=" + this.AdminID + "&UserRoleID=" + event.Value;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe((data) => {
      if (data.Status == true) {
        this.ModuleList = data.List;
      }
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
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
  allCheck(event: any) {
    const checked = event.target.checked;
    this.institutionsList.forEach((item: { checked: any; }) => item.checked = checked);
  }

  AssignModule() {

    this.FilterModuleList = this.ModuleList.filter((en: { checked: any; }) => en.checked);
    if (this.roleid == null || this.roleid == 0 || this.roleid == undefined || this.roleid == '') {
      //  this.globalToastService.warning("Please select role");
      this.ShowToast("Please select role", "warning")
    }
    else if (this.FilterModuleList.length == 0) {
      //  this.globalToastService.warning("Please select atleast once checkbox");
      this.ShowToast("Please select atleast once checkbox", "warning")
    }
    else {
      this.spinnerService.show();
      var json = {
        RoleID: this.roleid,
        AdminID: this.AdminID,
        Modules: this.FilterModuleList
      }
      this._commonservice.ApiUsingPost("Portal/AssignModules", json).subscribe(data => {
        if (data.Status == true) {
          this.spinnerService.hide();
          // this.globalToastService.success("Module Assigned Successfully...!");
          this.ShowToast("Module Assigned Successfully...!", "warning")
          window.location.reload();
        }
        else {
          // this.globalToastService.warning("Failed to Assign Module...!");
          this.ShowToast("Failed to Assign Module...!", "warning")
          this.spinnerService.hide();
        }
      }, (error) => {
        this.ShowToast("Something Went Wrong!...", "error")
        this.spinnerService.hide();
      })
    }
    this.spinnerService.hide();

  }
  OnRoleSelect(event: any) {
    if (event != null && event != undefined) {
      this.formInput.RoleName = event.text;
      this.roleid = event.id;
      // if(event=="Unit Head"){ this.roleid=4;}
      // if(event=="Manager"){ this.roleid=3;}
      if (event.text == "Organization Head") {
        this.IsOrgAdmin = true;
      }
      else {
        this.IsOrgAdmin = false
        this.GetBranchesEdit()
      }
    }
  }

  MapModule() {
    if (this.EnableAssign == true) {

      this.EmpCredentials = [];
      this.credstatus = false;
      if (this.selectedApplicationId == 0 || this.selectedApplicationId == null || this.selectedApplicationId == undefined || this.selectedApplicationId == '') {
        // this.globalToastService.warning("Please Select Role");
        this.ShowToast("Please Select Role", "warning")
      }
      else if (this.tempemparray.length == 0) {
        // this.globalToastService.warning("Please Select Employee");
        this.ShowToast("Please Select Employee", "warning")
      }
      else if (this.selectedBranch.length == 0 && this.IsOrgAdmin == false) {
        // this.globalToastService.warning("Please Select Employee");
        this.ShowToast("Please Select Branch", "warning")
      }
      else if (this.selectedApplicationId[0].text == 'Organization Head' && (this.selectedMultiOrganization.length == 0 || this.selectedMultiOrganization == null || this.selectedMultiOrganization == undefined)) {
        // this.globalToastService.warning("Please Select Employee");
        this.ShowToast("Please Select Organization For Organization Head", "warning")
      }
      else {
        var st = '0';
        this.spinnerService.show();
        for (this.index = 0; this.index < this.tempemparray.length; this.index++) {
          if (this.tempemparray[this.index].EmailID == undefined || this.tempemparray[this.index].Password == undefined || this.tempemparray[this.index].EmailID == null || this.tempemparray[this.index].EmailID == '' || this.tempemparray[this.index].Password == null || this.tempemparray[this.index].Password == '') {
            // this.globalToastService.warning("Please fill all employees credentials");
            this.ShowToast("Please fill all employees credentials", "warning");
            this.spinnerService.hide();
            this.credstatus = true;
            break;
          }
          else {
            this.EmpCredentials.push({
              EmployeeID: this.tempemparray[this.index].id,
              EmployeeName: this.tempemparray[this.index].text,
              EmailID: this.tempemparray[this.index].EmailID,
              Password: this.tempemparray[this.index].Password
            })
          }
        }
        if (this.credstatus != true) {
          this.spinnerService.show();
          this.ApiURL = "Account/CheckDuplicateEmail?Email=" + this.tempemparray[0].EmailID;
          this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(rest => {
            if (rest.EmailExist == false) {
              var json = {
                RoleID: this.roleid,
                isportal  :true,
                employees: this.selectedDepartment.length > 0
                  ? this.selectedDepartment.map((dept: any) => ({
                    "AdminId": this.AdminID,
                    "BranchId": 0,  // Ignore branch if departments are selected
                    "EmployeeId": this.employeeid,
                    "RoleID": this.roleid,
                    "Deptid": dept.Value,
                    "SubOrgID": 0
                  }))
                  : this.selectedBranch.length > 0
                  ? this.selectedBranch.map((branch: any) => ({
                    "AdminId": this.AdminID,
                    "BranchId": branch.Value,  // Only include branch if no departments are selected
                    "EmployeeId": this.employeeid,
                    "RoleID": this.roleid,
                    "Deptid": 0,
                    "SubOrgID": 0
                  })) 
                  : this.selectedMultiOrganization.map((org: any) => ({
                    "AdminId": this.AdminID,
                    "BranchId": 0,  // Only include branch if no departments are selected
                    "EmployeeId": this.employeeid,
                    "RoleID": this.roleid,
                    "Deptid": 0,
                    "SubOrgID": org.Value
                  })),
                Key: "en"
              };
              console.log(json, "assign module");

              this._commonservice.ApiUsingPost("Portal/Brachmappingtorole", json).subscribe(data => {
                if (data.Status == true) {
                  var json = {
                    RoleID: this.roleid,
                    employees: this.EmpCredentials,
                    Key: "en"
                  }
                  this._commonservice.ApiUsingPost("Portal/MapEmployeeRole", json).subscribe(data => {
                    if (data.Status == true) {
                      this.spinnerService.hide();
                      this.ShowToast(data.Message, "success")
                      this.selectedBranch = [];
                      this.selectedApplicationId = [];
                      this.selectedBranchId = [];
                      this.selectedDepartment = [];
                      this.selectedDepartmentId = [];
                      this.selectedEmployee = [];
                      this.selectedEmployeeId = [];
                      this.selectedMultiOrganization = [];
                      this.selectedOrganization = [];
                      this.temparray = [];
                      this.tempemparray = [];
                      this.showList = true
                      this.getRoleEmpList()
                    }
                    else {
                      //  this.globalToastService.warning(data.Message);
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
              //  this.globalToastService.warning(data.Message);
              this.ShowToast(rest.Message, "warning")
              this.spinnerService.hide();
            }
          }, (error) => {
            this.ShowToast(error, "error")
            this.spinnerService.hide();
            return false;
          })

        }
        this.spinnerService.hide();
      }
    }
    else {
      // this.globalToastService.warning("Out of Plan! Please Buy Role AddOn to Assign Roles");
      this.ShowToast("Out of Plan! Please Buy Role AddOn to Assign Roles", "warning")
      this.spinnerService.hide();
    }
  }

  UpdateMapModule() {
    let roleid = this.selectedApplicationId.map((sa: any) => sa.id)[0]
    if (this.selectedApplicationId == 0 || this.selectedApplicationId == null || this.selectedApplicationId == undefined || this.selectedApplicationId == '') {
      // this.globalToastService.warning("Please Select Role");
      this.ShowToast("Please Select Role", "warning")
    }
    else if (this.tempemparray.length == 0) {
      // this.globalToastService.warning("Please Select Employee");
      this.ShowToast("Please Select Employee", "warning")
    }
    else if (this.selectedBranch.length == 0 && this.selectedDepartment.length == 0 && this.IsOrgAdmin == false) {
      // this.globalToastService.warning("Please Select Employee");
      this.ShowToast("Please Select Either the Branch or Department", "warning")
    }
    else if (this.selectedApplicationId[0].text == 'Organization Head' && (this.selectedMultiOrganization.length == 0 || this.selectedMultiOrganization == null || this.selectedMultiOrganization == undefined)) {
      // this.globalToastService.warning("Please Select Employee");
      this.ShowToast("Please Select Organization For Organization Head", "warning")
    }
    else {
      this.spinnerService.show();
      var json = {
        "email": this.tempemparray[0].EmailID,
        "employees": this.selectedDepartment.length > 0
          ? this.selectedDepartment.map((dept: any) => ({
            "AdminId": parseInt(this.AdminID),
            "BranchId": 0,
            "EmployeeId": this.employeeid,
            "RoleID": roleid,
            "Deptid": dept.Value,
            "IsActive": "1",
            "SubOrgID": 0
          }))
          : this.selectedBranch.length > 0 ? this.selectedBranch.map((branch: any) => ({
            "AdminId": this.AdminID,
            "BranchId": branch.Value,
            "EmployeeId": this.employeeid,
            "RoleID": roleid,
            "Deptid": 0,
            "IsActive": "1",
            "SubOrgID": 0
          })) : this.selectedMultiOrganization.map((org: any) => ({
            "AdminId": this.AdminID,
            "BranchId": 0,
            "EmployeeId": this.employeeid,
            "RoleID": roleid,
            "Deptid": 0,
            "IsActive": "1",
            "SubOrgID": org.Value
          })),
        "Key": "en",
        "Password": this.tempemparray[0].Password
      };
      console.log(json, "for editing");
      this._commonservice.ApiUsingPutNew("Portal/Editroleemploye", json).subscribe(data => {
        if (data.Status == true) {
          this.EditData = false;
          this.ShowToast(data.Message, "success")
          this.selectedBranch = [];
          this.selectedApplicationId = [];
          this.selectedBranchId = [];
          this.selectedDepartment = [];
          this.selectedDepartmentId = [];
          this.selectedEmployee = [];
          this.selectedEmployeeId = [];
          this.selectedMultiOrganization = [];
          this.selectedOrganization = [];
          this.temparray = [];
          this.tempemparray = [];
          this.spinnerService.hide();
          this.showList = true
          window.location.reload()
        } else {
          // this.globalToastService.warning("Failed to Update Employee Role Mapping!");
          this.ShowToast(data.Message, "warning")
          this.spinnerService.hide();
        }
      }, (error) => {
        // this.globalToastService.success("Something Went Wrong!...");
        this.ShowToast("Something Went Wrong!...", "error")
        this.spinnerService.hide();
      })
    }


  }

  onBranchSelect(item: any) {
    // this.employeeid = undefined
    // this.tempemparray = []
    // this.temparray = []
    // this.temparray.push({id:item.Value, text:item.Text })
    // this.selectedEmployee = []
    this.selectedDepartment = []
    // this.GetEmployeeList()
    this.getDepartment()

  }
  onBranchDeSelect(item: any) {
    // this.employeeid = undefined/
    // this.selectedEmployee = []
    this.selectedDepartment = []
    // this.GetEmployeeList()
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
      this.MultipleOrgList = data.List;
      if (data.List.length == 1) {
        this.selectedOrganization = [{ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text }]
        this.onselectedOrg({ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text })
      }
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
      if (this.Editdetails.length > 0 || this.Editdetails) {
        let storedbranch = this.Editdetails[0]?.BreanchDetail.map((b: any) => b.BranchName);
        this.selectedBranch = this.BranchList.filter((branch: any) =>
          storedbranch.includes(branch.Text)
        );
        this.onBranchSelect(this.selectedBranch)
      }
      if (this.BranchList.length > 0) {
        this.Columns = data.List;
        this.getData();
      }
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      console.log(error, "error");
    });
  }
  GetBranchesEdit() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      if (this.Editdetails.length > 0 || this.Editdetails) {
        let storedbranch = this.Editdetails[0]?.BreanchDetail.map((b: any) => b.BranchName);
        this.selectedBranch = this.BranchList.filter((branch: any) =>
          storedbranch.includes(branch.Text)
        );
      }
      if (this.BranchList.length > 0) {
        this.Columns = data.List;
        this.getData();
      }
      this.getDepartment();
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      this.ShowToast("Something Went Wrong!...", "error")
      console.log(error, "error");
    });
  }
  onallbranchselect(selecteditems: any) {
    // this.temparray=[];
    // for (let i = 0; i < this.Columns.length; i++) {
    //   this.temparray.push({ id: this.Columns[i].id, text: this.Columns[i].text });
    // }
    this.selectedBranch = selecteditems
    this.selectedDepartment = []
    this.getDepartment()
  }

  onallbranchdeselect(selecteditems: any) {
    this.temparray = [];
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

  onEmpSelect(item: any) {
    console.log(item, "item");
    this.tempemparray = [];
    this.employeeid = item.ID;
    this.tempemparray.push({ id: item.ID, text: item.Name, EmailID: "", Password: "", ConfirmPassword: "" });
  }
  onEmpDeSelect(item: any) {
    console.log(item, "item");
    this.tempemparray.splice(this.tempemparray.indexOf(item), 1);
  }

  GetEmployeeList() {
    this.EmployeelistApiURL = "Portal/GetEmpListOnBranch";
    const json: any = {
      AdminID: this.AdminID,
      Year: 0,
      Month: 0,
      DepartmentID: [],
      BranchID: []
    }
    this._commonservice.ApiUsingPost(this.EmployeelistApiURL, json).subscribe(
      (data) => {
        this.EmployeeList = data.List
        this.EmployeeList = this.EmployeeList.map((employee: any) => {
          const isDisabled = this.EmpRoleList.some(emp => emp.EmployeeID === employee.ID);
          return { ...employee, isDisabled };
        });
        let storedEmployee = this.Editdetails[0]?.FirstName;
        if (storedEmployee) {
          const selectedEmployee = this.EmployeeList.find((yr: any) => yr.Name === storedEmployee);
          if (selectedEmployee) {
            this.selectedEmployee = [selectedEmployee];
          }
        }

      }
      , (error) => {
        this.ShowToast("Something Went Wrong!...", "error")
        console.log(error); this.spinnerService.hide();
      });
  }
  getData(): void {
    let tmp = [];
    for (let i = 0; i < this.Columns.length; i++) {
      tmp.push({ id: this.Columns[i].Value, text: this.Columns[i].Text });
    }
    this.Columns = tmp;

  }
  getData1(): void {
    let tmp = [];
    for (let i = 0; i < this.RolesList.length; i++) {
      tmp.push({ id: this.RolesList[i].RoleID, text: this.RolesList[i].RoleName });
    }
    this.OrgRoleList = tmp;
    if (this.Editdetails) {
      let storedRole = this.Editdetails[0]?.RoleName;
      if (storedRole) {
        const selectedRole = this.OrgRoleList.find((yr: any) => yr.text === storedRole);
        if (selectedRole) {
          this.selectedApplicationId = [selectedRole];
        }
      }

    }
  }

  CreateRoles() {
    const json = { CreatedByID: this.UserID, OrgID: this.OrgID, RoleName: 'Manager' }
    this._commonservice.ApiUsingPost("Admin/CreateRole", json).subscribe(
      (data) => { }, (error) => { });
    const vjson = { CreatedByID: this.UserID, OrgID: this.OrgID, RoleName: 'Unit Head' }
    this._commonservice.ApiUsingPost("Admin/CreateRole", vjson).subscribe(
      (data) => { }, (error) => { });
  }


  MapBranch() {
    //  this.spinnerService.show();
    //  for(this.index=0;this.index<this.temparray.length;this.index++)
    //  {
    // this.MapBranchList.push(
    //   {
    //     "AdminId":this.AdminID,
    //     "BranchId":this.selectedBranch.map((res:any)=>res.Value)[0],
    //     "EmployeeId":this.employeeid,
    //     "RoleID":this.roleid,
    //     "DepartmentId":this.selectedDepartment.map((res:any)=>res.Value)[0] || 0
    //   })
    //  }


  }



  delete(data: any) {
    this._commonservice.ApiUsingPostForDelete("Admin/deactiveRole/" + data.EmployeeID).subscribe(data => {
      if (data.Status == true) {
        // this.globalToastService.success(data.Message);
        this.ShowToast(data.Message, "success")
        this.getRoleEmpList()
        this.GetEmployeeList()
      } else {
        // this.globalToastService.warning("Failed to Delete Employee Role Mapping!");
        this.ShowToast("Failed to Delete Employee Role Mapping!", "warning")
      }
    }, (error) => {
      // this.globalToastService.success("Something Went Wrong!...");
      this.ShowToast("Something Went Wrong!...", "error")
    })
  }


  //common table
  actionEmitter(data: any) {
    if (data.action.name == "View Edit") {
      this.edit(data.row);
    }
    if (data.action.name == "Delete") {
      this.delete(data.row);
    }

  }
  downloadReport() {
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

  GetOrganizationEdit(selectedorgs: any[]) {
    this.ApiURL = `Admin/GetSuborgList?OrgID=${this.OrgID}&AdminId=${this.UserID}`;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(
      (data) => {
        this.OrgList = data.List || [];
        this.selectedMultiOrganization = [];

        if (this.OrgList.length && selectedorgs.length) {
          this.selectedMultiOrganization = this.OrgList
            .filter(org =>
              selectedorgs.some(sel => sel.SuborgnameName === org.Text)
            )
            .map(org => ({
              Value: org.Value,
              Text: org.Text
            }));
        }
      },
      (error) => {
        this.ShowToast("Something went wrong!", "error");
        console.error(error);
      }
    );
  }

}
