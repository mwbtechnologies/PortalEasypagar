import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-employeereports',
  templateUrl: './employeereports.component.html',
  styleUrls: ['./employeereports.component.css']
})
export class EmployeereportsComponent {
  EmployeeList: any;
  BranchList: any;
  DepartmentList: any; YearList: any; MonthList: any;
  public isSubmit: boolean | any;
  LoginUserData: any;
  AdminID: any;
  ApiURL: any;
  file: any;
  EmployeeId: any;

  selectedDepartmentIds: string[] | any;
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  selectedMonthId: string[] | any;
  selectedEmployeeId: string[] | any;
  OrgID: any;
  SalaryList: any;
  NewApiURL: any;
  index = 0;
  pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission: any; EditPermission: any; ViewPermission: any; DeletePermission: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  monthSettings: IDropdownSettings = {}
  yearSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  reportsSettings: IDropdownSettings = {}
  temparray: any = []; tempdeparray: any = [];
  selectedDepartment: any[] = [];
  selectedyear: any[] = []
  selectedMonth: any[] = []
  selectedEmployees: any[] = []
  selectedBranch: any[] = [];
  ReportList: any[] = []
  ShowPDF = false; ShowDownload = true; DownloadURL: any;
  selectedReports: any[] = []
  ShowBtn: boolean = false;UserID:any
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  constructor(private httpclient: HttpClient, private _router: Router, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private globalToastService: ToastrService,private dialog:MatDialog) {
    this.isSubmit = false
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };
    this.ShowPDF = true;
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID=localStorage.getItem("UserID");
    if (this.AdminID == null || this.OrgID == null) {

      this._router.navigate(["auth/signin"]);
    }
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.yearSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.employeeSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.monthSettings = {
      singleSelection: true,
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
    this.reportsSettings = {
      singleSelection: true,
      idField: 'APIName',
      textField: 'English_Name',
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
    this.GetOrganization();
    this.GetBranches()
    this.getEmployeeList()
    this.AddPermission = localStorage.getItem("AddPermission"); if (this.AddPermission == "true") { this.AddPermission = true; } else { this.AddPermission = false; }
    this.EditPermission = localStorage.getItem("EditPermission"); if (this.EditPermission == "true") { this.EditPermission = true; } else { this.EditPermission = false; }
    this.ViewPermission = localStorage.getItem("ViewPermission"); if (this.ViewPermission == "true") { this.ViewPermission = true; } else { this.ViewPermission = false; }
    this.DeletePermission = localStorage.getItem("DeletePermission"); if (this.DeletePermission == "true") { this.DeletePermission = true; } else { this.DeletePermission = false; }

    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
      console.log(error);
    });
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
      console.log(error);
    });
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetForms/en").subscribe((data) => this.ReportList = data.Requests[0].Forms, (error) => {
      console.log(error);
    });
    this.ViewPermission = localStorage.getItem("ViewPermission"); if (this.ViewPermission == "true") { this.ViewPermission = true; } else { this.ViewPermission = false; }
    const now = new Date();
    const currentMonth = now.getMonth() + 1; 
    const currentYear = now.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = currentMonth - 1;

    this.selectedMonth = [{
      "Value": currentMonth, 
      "CreatedByID": null,
      "Text": monthNames[monthIndex],
      "createdbyname": null,
      "Key": null
    }];
    this.selectedyear = [{
     "Value": currentYear,
     "CreatedByID": null,
     "Text": currentYear.toString(),
     "createdbyname": null,
     "Key": null
 }]
  }

  OnReportsChange(item: any) {

  }
  OnReportsDeSelect(item: any) {

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
      // this.globalToastService.error(error); 
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

  getEmployeeList() {
    const json:any = {
      AdminID:this.AdminID
    }
    if (this.selectedBranch) {
      json["BranchID"] =  this.selectedBranch.map((br:any)=>{return br.Value})
     }
    if (this.selectedDepartment) {
      json["DepartmentID"] =  this.tempdeparray.map((br:any)=>{ return br.id})
     }
     if (this.selectedyear) {
      json["Year"] =  this.selectedyear.map((sy:any)=>{ return sy.Text})[0]
     }
    if (this.selectedMonth) {
      json["Month"] =  this.selectedMonth.map((sm:any)=>{ return sm.Value})[0]
     }
    this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch", json).subscribe((data) => {
      this.EmployeeList = data.List
      this.selectedEmployees = [...data.List]
    }
      , (error) => {
        console.log(error); this.spinnerService.hide();
      });
  }
  onDeptSelect(item: any) {
    console.log(item, "item");
    this.tempdeparray.push({ id: item.Value, text: item.Text });
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onDeptSelectAll() {
    this.tempdeparray = [...this.DepartmentList]
    this.selectedEmployees = []
    this.tempdeparray = [];
    this.getEmployeeList()
  }
  onDeptDeSelectAll() {
    this.tempdeparray = [];
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onDeptDeSelect(item: any) {
    console.log(item, "item");
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onBranchSelect(item: any) {
    console.log(item, "item");
    this.temparray.push({ id: item.Value, text: item.Text });
    this.GetDepartments();
    this.getEmployeeList()
  }
  onBranchDeSelect(item: any) {
    console.log(item, "item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.DepartmentList = []
    this.GetDepartments();
    this.getEmployeeList()
  }

  OnYearChange(event: any) {
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  onyearDeSelect(event: any) {
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  OnMonthChange(event: any) {
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  onMonthDeSelect(event: any) {
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }

  OnEmployeesChange(_event: any) {
  }
  OnEmployeesChangeDeSelect(event: any) {
  }
  getPdf() {
    if (this.selectedBranch.length == 0) {
      // this.globalToastService.warning("Please select Branch");
      this.ShowToast("Please select Branch","warning")
    }
    else if (this.selectedyear.length == 0) {
      // this.globalToastService.warning("Please Select Year");
      this.ShowToast("Please select Year","warning")
    }
    else if (this.selectedMonth.length == 0) {
      // this.globalToastService.warning("Please Select Month");
      this.ShowToast("Please select Month","warning")
    }
    else if (this.selectedEmployees.length == 0) {
      // this.globalToastService.warning("Please select Employee");
      this.ShowToast("Please select Employee","warning")
    }
    else if (this.selectedReports.length == 0) {
      // this.globalToastService.warning("Please select Report Type");
      this.ShowToast("Please select Report Type","warning")
    }
    else {
      this.spinnerService.show();
      let selectedr = this.selectedReports.map((sr: any) => sr.APIName)[0]
      let Branch = this.selectedBranch?.map((y: any) => y.Value)[0] || 0
      let Dept = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0
      const json = {
        Month: this.selectedMonth?.map((y: any) => y.Value)[0],
        BranchID: Branch,
        DepartmentID: Dept,
        Year: this.selectedyear?.map((y: any) => y.Text)[0],
        Employee: this.selectedEmployees?.map((se: any) => {
          return {
            // "EmployeeID": se.ID,
            "EmployeeName": se.Name,
            "EmployeeID":se.ID
          }
        }),
        AdminID: this.AdminID
      }
      this.ApiURL = "ReportsNew/" + selectedr;
      
      this._commonservice.ApiUsingPostNew(this.ApiURL, json, { responseType: 'text' }).subscribe((res: any) => {
        this.DownloadURL = res;
        res = JSON.parse(res)
        if (res.Status == true) {
          this.pdfSrc = res;
          window.open(res.Message, "_blank");
          this.spinnerService.hide();
        }else if (res.Status == false) {
          // this.globalToastService.warning(res.Message);
          this.ShowToast(res.Message,"warning")
          this.spinnerService.hide();
        }
        else {
          // this.globalToastService.warning("Sorry Failed to Generate");
          this.ShowToast("Sorry Failed to Generate","warning")
          this.spinnerService.hide();
        }
      }, (error) => {
        // this.globalToastService.error(error.message);
        this.ShowToast(error.messagee,"error")
        this.spinnerService.hide();
      });
    }
    // this.spinnerService.hide();
  }
  openPdf(url: string) {
    this.httpclient.get(url, { responseType: 'blob' })
      .subscribe(blob => {
        if (!blob) {
          console.error('Failed to retrieve PDF file');
          return;
        }
        const filename = url.split('/').pop(); // Extract filename from URL
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'report.pdf'; // Set default filename
        link.target = '_blank';

        // Trigger the download in a new tab
        link.click();

        // Release the object URL after download (optional for memory management)
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
      },
        error => {
          console.error('Error downloading PDF:', error);
        });
  }

  // downloadPDFFile(url: string) {
  //   this.httpclient.get(url, { responseType: 'blob' })
  //     .subscribe((blob: Blob) => {
  //       const link = document.createElement('a');
  //       link.href = URL.createObjectURL(blob);
  //       link.download = 'EmployeeReport.pdf'; 
  //       link.click();
  //       URL.revokeObjectURL(link.href);
  //     });
  // }
  getExcel() {
    if (this.selectedBranch.length == 0) {
      // this.globalToastService.warning("Please select Branch");
      this.ShowToast("Please select Branch","warning")
    }
    else if (this.selectedyear.length == 0) {
      // this.globalToastService.warning("Please Select Year");
      this.ShowToast("Please select Year","warning")
    }
    else if (this.selectedMonth.length == 0) {
      // this.globalToastService.warning("Please Select Month");
      this.ShowToast("Please select Month","warning")
    }
    else if (this.selectedEmployees.length == 0) {
      // this.globalToastService.warning("Please select Employee");
      this.ShowToast("Please select Employee","warning")
    }
    else if (this.selectedReports.length == 0) {
      // this.globalToastService.warning("Please select Report Type");
      this.ShowToast("Please select Report Type","warning")
    }
    else {
      this.spinnerService.show();
      let selectedr = this.selectedReports.map((sr: any) => sr.APIName)[0]
      let Branch = this.selectedBranch?.map((y: any) => y.Value)[0] || 0
      let Dept = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0
      const json = {
        Month: this.selectedMonth?.map((y: any) => y.Value)[0],
        BranchID: Branch,
        DepartmentID: Dept,
        Year: this.selectedyear?.map((y: any) => y.Text)[0],
        Employee: this.selectedEmployees?.map((se: any) => {
          return {
            // "EmployeeID": se.ID,
            "EmployeeName": se.Name,
            "EmployeeID":se.ID
          }
        }),
        AdminID: this.AdminID
      }
      this.ApiURL = "ExReports/" + selectedr;
      this._commonservice.ApiUsingPostNew(this.ApiURL, json, { responseType: 'text' }).subscribe((res: any) => {
        res = JSON.parse(res)
        if (res.Status == true) {
          this.pdfSrc = res;
          window.open(res.Message, "_blank");
          this.spinnerService.hide();
        }else if (res.Status == false) {
          // this.globalToastService.warning(res.Message);
          this.ShowToast(res.Message,"warning")
          this.spinnerService.hide();
        }
        else {
          // this.globalToastService.warning("Sorry Failed to Generate");
          this.ShowToast("Sorry Failed to Generate","warning")
          this.spinnerService.hide();
        }
      }, (error) => {
        // this.globalToastService.error(error.message);
        this.ShowToast(error.message,"error")
        this.spinnerService.hide();
      });
    }
  }

  GetEmployeeExcelReports() {
    console.log("employee excel function");

  }
  GetWageExcelReports() {
    console.log("wage excel function");

  }
  GetLoanExcelReports() {
    console.log("loan excel function");

  }
  GetLeaveExcelReports() {
    console.log("leave excel function");

  }
  GetEmployeePDFReports() {
    console.log("employee pdf function");

  }
  GetWagePDFReports() {
    console.log("wage pdf function");

  }
  GetLoanPDFReports() {
    console.log("loan pdf function");

  }
  GetLeavePDFReports() {
    console.log("leave pdf function");

  }
  backToDashboard()
{
  this._router.navigate(["appdashboard"]);
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
}
