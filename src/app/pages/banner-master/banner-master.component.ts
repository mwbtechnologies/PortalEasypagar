import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getBranchList } from 'src/app/Redux/selectors/branch_list.selectors';
import { MatDialog } from '@angular/material/dialog';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
export class FormInput {
  BannerImage: any;
  BranchID: any;
  AdminID: any;
  DepartmentId: any;
  Description: any;
  FromDate: any;
  ToDate: any;
  StartDate: any;
}


@Component({
  selector: 'app-banner-master',
  templateUrl: './banner-master.component.html',
  styleUrls: ['./banner-master.component.css']
})
export class BannerMasterComponent implements OnInit {
  formInput: FormInput | any;
  form: any;
  public isSubmit: boolean;
  record: any;
  id: any;
  Editdetails: any;
  editid: any;
  roleid: any;
  Add: boolean = false;
  Edit: boolean = false;
  View: boolean = true;
  AddModule = false;
  AddPermission: any; EditPermission: any; ViewPermission: any; DeletePermission: any;
  userName: any;
  institutionsList: any; UserID: any;
  isVisible: boolean = false;
  BranchList: any; DepartmentList: any;
  selectedBranch: any[] = [];
  selectedDepartment: any[] = [];
  ApiUrl: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AdminID: any; OrgID: any;
  file: File | any; ImageUrl: any; ShowImage = false;
  fileurl: any; Columns: any[] = [];
  DeptColumns: any[] = [];
  branchSettings: IDropdownSettings = {}
  branchListSettings: IDropdownSettings = {}
  AllBranchList: any;
  userselectedbranchid: any;
  OriginalBranchList: any;
  userselecteddeptid: any;
  selectedOrganization: any[] = []
  OrgList: any[] = []
  orgSettings: IDropdownSettings = {}
  today: any
  constructor(private dialog: MatDialog, private pdfExportService: PdfExportService, private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService) {
    this.isSubmit = false;
    this.branchSettings = {
      singleSelection: false,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.branchListSettings = {
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
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
  }
  ngOnInit(): void {
    if (localStorage.getItem('LoggedInUserData') == null) {

      this._router.navigate(["auth/signin-v2"]);
    }
    else {

    }
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
    this.userselectedbranchid = 0;
    this.userselecteddeptid = 0;
    this.formInput = { StartDate: '', BannerImage: '', BranchID: '', AdminID: '', DepartmentId: '', Description: '', FromDate: '', ToDate: '' };
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    const ST = new Date().toISOString();
    const STdatePart = ST.split('T')[0];
    this.formInput.StartDate = STdatePart;
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };

    this.GetOrganization();
    this.GetBranches();
 this.getbannerlist();
    this.AddPermission = localStorage.getItem("AddPermission"); if (this.AddPermission == "true") { this.AddPermission = true; } else { this.AddPermission = false; }
    this.EditPermission = localStorage.getItem("EditPermission"); if (this.EditPermission == "true") { this.EditPermission = true; } else { this.EditPermission = false; }
    this.ViewPermission = localStorage.getItem("ViewPermission"); if (this.ViewPermission == "true") { this.ViewPermission = true; } else { this.ViewPermission = false; }
    this.DeletePermission = localStorage.getItem("DeletePermission"); if (this.DeletePermission == "true") { this.DeletePermission = true; } else { this.DeletePermission = false; }
  }
  isFutureDate(fromDate: string): boolean {
    const inputDate = new Date(fromDate);
    const today = new Date();
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return inputDate > today;
  }

  setdate(event: any) {
    this.formInput.StartDate = event.target.value;
  }
  onselectedOrg(item: any) {
    this.selectedBranch = []
    this.selectedDepartment = []
    this.GetBranches()
  }
  onDeselectedOrg(item: any) {
    this.selectedBranch = []
    this.selectedDepartment = []
    this.GetBranches()
  }

  GetOrganization() {
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetSuborgList?OrgID=" + this.OrgID + "&AdminId=" + this.AdminID).subscribe((data) => {
      this.OrgList = data.List
      if (data.List.length == 1) {
        this.selectedOrganization = [{ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text }]
        this.onselectedOrg({ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text })
      }
    }, (error) => {
      // this.ShowToast(error,"error")
      console.log(error);
    });
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });

  }

  GetDepartments(IL?: any) {
    this.DepartmentList = [];
    this.selectedDepartment = [];
    var loggedinuserid = localStorage.getItem("UserID");
    const json = {
      AdminID: loggedinuserid,
      OrgID: this.OrgID,
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
        this.selectedDepartment = this.DepartmentList.filter((dept: any) =>
          IL?.Departments.some((selected: any) => selected?.ID === dept?.Value)
        );
        console.log(this.DepartmentList, "department list");
      }
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
  }

  getCommaSeparatedNames(list: any[]): any {
    return list?.[0]?.Name || '';
  }
  getHoveredDate(list: any[]): any {
    return list?.map((x: any) => x.Name).join(', ');
  }

  Viewlist() {
    // this.View = true
    // this.AddModule = false
    // this.Edit = false
    // this.selectedOrganization = []
    // this.selectedBranch = []
    // this.selectedDepartment = []
    // this.formInput.StartDate = []
    // this.GetOrganization()
    // this.GetBranches()
    // this.getbannerlist()
    window.location.reload()
  }

  CheckDate(date: any) {
    this.ApiUrl = "Admin/CheckDate?UserDate=" + date;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
      if (data.Status == false) {
        this.spinnerService.hide();
        return true;
      }
      else {
        this.spinnerService.hide();
        this.globalToastService.warning("Date should be greater than Current Date");
        this.formInput.FromDate = '';

        return false;
      }

    }, (error: any) => {
      this.spinnerService.hide();
      this.globalToastService.warning(error.message);
      return false;
    }
    );
  }

  CheckNextDate(date: any) {
    if (this.formInput.FromDate == "" || this.formInput.FromDate == null || this.formInput.FromDate == undefined) {
      this.spinnerService.hide();
      this.globalToastService.warning("Please Select FromDate");
      this.formInput.ToDate = '';
    }
    else {
      this.ApiUrl = "Admin/CheckDateRange?FromDate=" + this.formInput.FromDate + "&ToDate=" + date;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
        if (data.Status == true) {
          this.spinnerService.hide();
          return true;
        }
        else {
          this.spinnerService.hide();
          this.globalToastService.warning("ToDate should be greater than FromDate");
          this.formInput.FromDate = '';
          return false;
        }

      }, (error: any) => {
        this.spinnerService.hide();
        this.globalToastService.warning(error.message);
        return false;
      }
      );
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
  getbannerlist() {
    if (this.formInput.StartDate == "" || this.formInput.StartDate == undefined || this.formInput.StartDate == null) {
      this.ShowToast("Please Select Date", "warning")
    }
    else {
      this.spinnerService.show();
      let branchid = this.selectedBranch.map((res:any)=>res.Value)[0] || 0
      let deptid = this.selectedDepartment.map((res:any)=>res.Value)[0] || 0
      this.ApiUrl = "Banner/GetAdminBanners?AdminID=" + this.UserID + "&Date=" + this.formInput.StartDate + "&BranchID=" + branchid + "&DeptId=" + deptid;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe((sec) => {
        var table = $('#DataTables_Table_0').DataTable();
        table.destroy();
        this.institutionsList = sec.List;
        this.dtTrigger.next(null);
        this.spinnerService.hide();
      }, (error) => {
        this.spinnerService.hide();
      });
    }
  }

  allCheck(event: any) {
    const checked = event.target.checked;
    this.institutionsList.forEach((item: { checked: any; }) => item.checked = checked);
  }
  Update() {
    this.spinnerService.show();
    if (this.selectedBranch.length == 0 && this.userselectedbranchid == 0) {
      this.globalToastService.warning("Please Select Branch...!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.Title == "") {
      this.globalToastService.warning("Please Enter Title...!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.Description == "") {
      this.globalToastService.warning("Please Enter Description...!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.FromDate == "" || this.formInput.FromDate == null) {
      this.globalToastService.warning("Please Select FromDate..!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.ToDate == "" || this.formInput.ToDate == null) {
      this.globalToastService.warning("Please Select ToDate...!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.ToDate < this.formInput.FromDate) {
      this.globalToastService.warning("To Date Cannot Be Lesser Than From Date");
      this.spinnerService.hide();
      return false;
    }  else if (!this.ImageUrl || this.ImageUrl.startsWith('data:image')) {
      alert('Please upload a valid image before submitting.');
      return;
    }
    else {
      let userselectedbranchid = []
      let userselecteddeptid = []
      if (this.selectedBranch.length > 0) {
        userselectedbranchid = this.selectedBranch.map(res => res.Value)
      }
      if (this.selectedDepartment.length > 0) {
        userselecteddeptid = this.selectedDepartment.map(res => res.Value)
      }
      
      this.spinnerService.show();
      const json = {
        AdminID: this.AdminID,
        ToDate: `${moment(this.formInput.ToDate).format('DD/MM/YYYY')} 11:59 PM`,
        FromDate: this.formInput.FromDate,
        Description: this.formInput.Description,
        Title: this.formInput.Title,
        BannerImage: this.ImageUrl,
        UpdateImageURL: this.Editdetails.ImageURL,
        BranchID: userselectedbranchid,
        DepartmentId: userselecteddeptid,
        BannerID: this.editid,
        Key: 'en'
      }
      console.log(json, "json of edit banner");

      this._commonservice.ApiUsingPost("Banner/UpdateBanner", json).subscribe(

        (data: any) => {
          if (data.Status == true) {
            this.spinnerService.hide();
            this.globalToastService.success(data.Message);
            window.location.reload()
          }
          else {
            this.spinnerService.hide();
            this.globalToastService.warning(data.Message);
          }

        }, (error: any) => {
          localStorage.clear();
          this.spinnerService.hide();
          this.globalToastService.error("Sorry something went wrong");
        }
      );
    }

    return true;
  }

  convertDate(dateString: string): string {
    return dateString.split('T')[0];
  }
  edit(IL: any): any {
    this.ApiUrl = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=banner&editType=edit";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
      if (data.Status == true) {
        this.Editdetails = IL.Bannerdetails;
        this.spinnerService.show();
        this.editid = IL.BannerID;
        this.formInput.Title = this.Editdetails.Title;
        this.formInput.Description = this.Editdetails.Description;
        console.log(this.Editdetails.FromDate, "from date")
        this.formInput.FromDate = this.convertDate(this.Editdetails.FromDate);
        this.formInput.ToDate = this.convertDate(this.Editdetails.ToDate);
        this.userselecteddeptid = this.Editdetails.DepartmentID;
        this.userselectedbranchid = this.Editdetails.BranchID;
        this.ImageUrl = this.Editdetails.ImageURL;
        this.fileurl = environment.Url + this.Editdetails.ImageURL;
        this.GetBranches()
        // this.selectedBranch = [{ Value: this.Editdetails.BranchID, Text: this.Editdetails.Branch }]
        // this.selectedDepartment = [{ Value: this.Editdetails.DepartmentID, Text: this.Editdetails.Department }]
        this.selectedBranch = this.BranchList.filter((branch: any) =>
          IL.Branches.some((selected: any) => selected.ID === branch.Value)
        );
        this.GetDepartments(IL)
        // this.selectedDepartment = this.DepartmentList.filter((dept:any) =>
        //   IL.Departments.some((selected:any) => selected.ID === dept.Value)
        // );
        this.ShowImage = true;
        this.View = false;
        this.Add = false;
        this.Edit = true
        this.spinnerService.hide();

      }
      else {
        this.globalToastService.warning(data.Message);
      }
    }, (error: any) => {
      this.spinnerService.hide();
      this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");

    });

  }
  CreateModule() {
    this.spinnerService.show();
    if (this.selectedBranch.length == 0 && this.userselectedbranchid == 0) {
      this.globalToastService.warning("Please Select Branch...!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.Title == "") {
      this.globalToastService.warning("Please Enter Title...!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.Description == "") {
      this.globalToastService.warning("Please Enter Description...!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.FromDate == "" || this.formInput.FromDate == null) {
      this.globalToastService.warning("Please Select FromDate..!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.ToDate == "" || this.formInput.ToDate == null) {
      this.globalToastService.warning("Please Select ToDate...!");
      this.spinnerService.hide();
      return false;
    }
    else if (this.formInput.ToDate < this.formInput.FromDate) {
      this.globalToastService.warning("To Date Cannot Be Lesser Than From Date");
      this.spinnerService.hide();
      return false;
    }
    else if (!this.ImageUrl || this.ImageUrl.startsWith('data:image')) {
      alert('Please upload a valid image before submitting.');
      return;
    }
    else {
      let userselectedbranchid = []
      let userselecteddeptid = []
      if (this.selectedBranch.length > 0) {
        userselectedbranchid = this.selectedBranch.map(res => res.Value)
      }
      if (this.selectedDepartment.length > 0) {
        userselecteddeptid = this.selectedDepartment.map(res => res.Value)
      }
      this.spinnerService.show();
      const json = {
        AdminID: this.AdminID,
        FromDate: this.formInput.FromDate,
        ToDate: `${moment(this.formInput.ToDate).format('DD/MM/YYYY')} 11:59 PM`,
        Description: this.formInput.Description,
        Title: this.formInput.Title,
        BannerImage: this.ImageUrl,
        BranchID: userselectedbranchid,
        DepartmentId: userselecteddeptid,
        Key: 'en'

      }
      this._commonservice.ApiUsingPost("Banner/CreateBanner", json).subscribe(

        (data: any) => {
          if (data.Status == true) {
            this.spinnerService.hide();
            this.globalToastService.success(data.Message);
            // this.Viewlist()
            window.location.reload()

          }
          else {
            this.spinnerService.hide();
            this.globalToastService.warning(data.Message);
          }

        }, (error: any) => {
          localStorage.clear();
          this.spinnerService.hide();
          this.globalToastService.error("Sorry something went wrong");
        }
      );
    }
    return true;
  }
  AddNewModule() {
    this.ApiUrl = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=banner&editType=create";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.show();
        this.AddModule = true;
        this.View = false;
        this.Add = false;
        this.Edit = false;
        this.spinnerService.hide();
        this.ImageUrl = ""
        this.selectedBranch = []
        this.selectedDepartment = []
        this.formInput.FromDate = ""
        this.formInput.ToDate = ""
        this.formInput.Title = ""
        this.formInput.Description = ""
        this.GetBranches()
        // this.GetDepartments()
      }
      else {
        this.globalToastService.warning(data.Message);
      }
    }, (error: any) => {
      this.spinnerService.hide();
      this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");

    });

  }

  ActiveModule(row: any): any {
    this.spinnerService.show();
    this.ApiUrl = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=banner&editType=delete";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.show();
        this.ApiUrl = "Banner/ActiveBanner?AdminID=" + this.AdminID + "&BannerImageURL=" + row.ImageURL;
        this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
          if (data.Status == true) {
            this.spinnerService.hide();
            this.globalToastService.success(data.Message);
            this.getbannerlist()
          }
          else {
            this.globalToastService.warning(data.Message);
            this.spinnerService.hide();
          }
        }, (error) => {
          this.globalToastService.error(error);
          this.spinnerService.hide();
        });
      }
      else {
        this.globalToastService.warning(data.Message);
        this.spinnerService.hide();
      }
    }, (error: any) => {
      this.spinnerService.hide();
      this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");

    });

  }
  DeactiveModule(row: any): any {
    this.spinnerService.show();
    this.ApiUrl = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=banner&editType=delete";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.show();
        this.ApiUrl = "Banner/DeleteBanner?AdminID=" + this.AdminID + "&BannerImageURL=" + row.ImageURL;
        this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
          if (data.Status == true) {
            this.spinnerService.hide();
            this.globalToastService.success(data.Message);
            this.getbannerlist()
          }
          else {
            this.globalToastService.warning(data.Message);
            this.spinnerService.hide();
          }
        }, (error) => {
          this.globalToastService.error(error);
          this.spinnerService.hide();
        });
      }
      else {
        this.globalToastService.warning(data.Message);
        this.spinnerService.hide();
      }
    }, (error: any) => {
      this.spinnerService.hide();
      this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");

    });
  }

  // UploadProof1Image1(event: any, form: NgForm) {
  //   const target = event.target as HTMLInputElement;
  //   this.file = (target.files as FileList)[0];
  //   var reader = new FileReader();
  //   reader.onload = (event: any) => {
  //     this, this.ImageUrl = event.target.result;
  //     this.fileurl = this.ImageUrl;
  //   }
  //   reader.readAsDataURL(this.file);
  //   this.ShowImage = true;
  //   const fData: FormData = new FormData();
  //   fData.append('formdata', JSON.stringify(form.value));
  //   fData.append('FileType', "Image");
  //   const apiUrl = 'Admin/UploadFile?ImageType=Notification';
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'multipart/form-data',
  //   });
  //   if (this.file != undefined) {
  //     fData.append('File', this.file, this.file.name);
  //     this._commonservice.ApiUsingPostMultipart(apiUrl, fData, headers).subscribe(data => { this.ImageUrl = data.ImagePath; });
  //   }
  // }

 UploadProof1Image1(event: any, form: NgForm) {
  const target = event.target as HTMLInputElement;
  const file = (target.files as FileList)[0 ];

  if (!file) return;

  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    alert('Only PNG, JPG, and JPEG files are allowed.');
    return;
  }

  this.file = file;

  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.ImageUrl = e.target.result;
    this.fileurl = this.ImageUrl;
  };
  reader.readAsDataURL(this.file);
  this.ShowImage = true;

  const fData: FormData = new FormData();
  fData.append('formdata', JSON.stringify(form.value));
  fData.append('FileType', "Image");

  fData.append('File', this.file, this.file.name);

  const apiUrl = 'Admin/UploadFile?ImageType=Notification';

  this._commonservice.ApiUsingPostMultipart(apiUrl, fData)
    .subscribe(
      (data: any) => {
        if (data && data.ImagePath) {
          this.ImageUrl = data.ImagePath;
        } else {
          alert('Failed to upload the image.');
        }
      },
      (error) => {
        console.error(error);
        alert('Failed to upload the image. Please try again.');
      }
    );
}

  onDeptSelect(item: any) {
    this.userselecteddeptid = item.Value;
  }
  onDeptDeSelect(item: any) {
    this.userselecteddeptid = 0;
  }
  onBranchSelect(item: any) {
    this.userselectedbranchid = item.Value;
    this.GetDepartments();
  }
  onBranchDeSelect(item: any) {
    this.GetDepartments();
  }
  onBranchesSelectAll(item: any) {
    this.selectedBranch = [...item]
    this.GetDepartments();
  }
  onBranchesDeSelectAll(item: any) {
    this.selectedDepartment = []
    this.DepartmentList = []
  }

  exportPDF() {
    let columns = ['Name', 'Branch', 'Department', 'Role', 'Mobile', 'Email', 'DateOfJoining', 'CreatedDate']
    const header = ''
    const title = 'Employee Master'
    let data = this.institutionsList.map((item: any) => {
      const rowData: any[] = [];
      for (let column of columns) {
        if (column.toLowerCase().split('date').length > 1) {
          rowData.push(moment(item[column]).format('MMMM Do YYYY'));
        }
        else rowData.push(item[column]);
      }
      return rowData;
    });
    console.log(data, "data");

    this.pdfExportService.generatePDF(header, title, columns, data);
  }
  exportexcel() {
    let columns = ['Name', 'Branch', 'Department', 'Role', 'Mobile', 'Email', 'DateOfJoining', 'CreatedDate']
    let fileName = 'BannerList.xlsx'
    let data = this.institutionsList.map((item: any) => {
      const rowData: any[] = [];
      for (let column of columns) {
        if (column.toLowerCase().split('date').length > 1) {
          rowData.push(moment(item[column]).format('MMMM Do YYYY'));
        }
        else rowData.push(item[column]);
      }
      return rowData;
    });
    data.unshift(columns);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'OT List');
    XLSX.writeFile(wb, fileName);
  }
}