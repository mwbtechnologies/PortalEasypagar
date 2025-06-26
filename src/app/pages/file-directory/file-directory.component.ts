import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClient } from '@angular/common/http';
import * as saveAs from 'file-saver';
import { CommonTableComponent } from '../common-table/common-table.component';
import { MatDialog } from '@angular/material/dialog';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

export class Emp{
  EmployeeID:any;
}

@Component({
  selector: 'app-file-directory',
  templateUrl: './file-directory.component.html',
  styleUrls: ['./file-directory.component.css']
})
export class FileDirectoryComponent {
  EmployeeList:any;
  // Array to store the selected files
  files: File[] = [];
  EmpClass:Array<Emp> = [];
  BranchList:any[]=[];
  DepartmentList:any; YearList:any;MonthList:any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  file:any;
  EmployeeId:any;
  ShowDownload=false;
  showMonthWise=false;
  selectedDepartmentIds: string[] | any;
  selectedBranch:any[]=[];
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  selectedMonthId: string[] | any;
  selectedEmployeeId: string[] | any;
  OrgID:any;
  SalaryList:any;
  NewApiURL:any;
  index=0;pdfSrc:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  ViewPermission:any;
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  monthSettings :IDropdownSettings = {}
  yearSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  FileSettings:IDropdownSettings = {}
  temparray:any=[]; tempdeparray:any=[];
  selectedDepartment:any[]=[];
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  selectedEmployees:any[]=[];
  UserID:any;selectedFileType:any;tmpselectedFileType:any
    //common table
    actionOptions:any
    displayColumns:any
    displayedColumns:any
    employeeLoading:any=undefined;
    ShowDirectory:any;
    editableColumns:any =[]
    topHeaders:any = []
    headerColors:any = []
    smallHeaders:any = []
    ReportTitles:any = {}
    selectedRows:any = []
    commonTableOptions :any = {}
    @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
  FileTypeList: any[]=[];
    //ends here
    selectedOrganization:any[]=[]
    OrgList:any[]=[]
    orgSettings:IDropdownSettings = {}
  constructor(public dialog: MatDialog,private _router: Router,private spinnerService: NgxSpinnerService,
    private _commonservice: HttpCommonService, private globalToastService:ToastrService,private _httpClient:HttpClient){ 
    this.isSubmit=false
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.FileSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    
    this.employeeSettings = {
      singleSelection: true,
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
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50
    };
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };

    //common table
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye",
      }
    ];

    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"SL No",
      "Employee":"EMPLOYEE NAME",
      // "Branch":"BRANCH",
      "Department":"DEPARTMENT",
      "WorkingDays":"WORKING DAYS",
      "PresentDays":"PRESENT DAYS",
      "EmployeeLeaves":"ABSENT DAYS",
      "Efficiency":"EFFICIENCY",
      "Actions":"ACTIONS"
    },


    this.displayedColumns= [
      "SLno",
      "Employee",
      // "Branch",
      "Department",
      "WorkingDays",
      "PresentDays",
      "EmployeeLeaves",
      "Efficiency",
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

    this.headerColors ={
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    //ends here
  }
  ngOnInit(): void {
    this.ShowDirectory=false;
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID=localStorage.getItem("UserID");
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
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
    this.GetOrganization();
     this.GetBranches();
     this.GetFileTypes();
     this.getEmployeeList()
     this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
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

    // Handle file drop or selection
    onSelect(event: any): void {
      console.log('Files selected:', event.addedFiles);
      this.files.push(...event.addedFiles);
    }
  
    // Handle file removal
    onRemove(event: File): void {
      console.log('File removed:', event);
      this.files.splice(this.files.indexOf(event), 1);
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
      this.ShowAlert(error,"error")
       console.log(error);
    });

  }
  GetFileTypes() {
    this._commonservice.ApiUsingGetWithOneParam("Directory/GetFileTypes?AdminID="+this.AdminID).subscribe((data) => {
      this.FileTypeList = data.List;
      console.log(this.FileTypeList, "FileTypeList");
    }, (error) => {
      
    });

  }
 
  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json={
      OrgID:this.OrgID,
      AdminID:loggedinuserid,
      Branches:this.selectedBranch.map((br: any) => {
        return {
          "id":br.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments",json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        console.log(this.DepartmentList,"department list");
      }
    }, (error) => {
      // his.globalToastService.error(error); 
      this.ShowAlert(error,"error")
      console.log(error);
    });
  }

  getEmployeeList(){
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
  this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch",json).subscribe((data) => {
  this.EmployeeList = data.List
  // this.selectedEmployees = [...data.List]
  }
  ,(error) => {
  console.log(error);this.spinnerService.hide();
});
  }
  onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.push({id:item.Value, text:item.Text });
    this.selectedEmployees = []
    this.getEmployeeList()
   }
   onDeptSelectAll(){
     this.tempdeparray = [...this.DepartmentList]
     this.selectedEmployees = []
     this.tempdeparray = [];
    this.getEmployeeList()
   }
   onDeptDeSelectAll(){
    this.tempdeparray = [];
    this.selectedEmployees = []
    this.getEmployeeList()
   }
   onDeptDeSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    this.selectedEmployees = []
    this.getEmployeeList()
   }
  onBranchSelect(item:any){
   console.log(item,"item");
   this.temparray.push({id:item.Value,text:item.Text });
   this.selectedDepartment = []
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  }
  onBranchDeSelect(item:any){
   console.log(item,"item");
   this.temparray.splice(this.temparray.indexOf(item), 1);
   this.selectedDepartment = []
   this.DepartmentList = []
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  }

  onFiletypeSelect(item:any){
    this.tmpselectedFileType=item.Value;
   }
   onFiletypeDeSelect(item:any){
    this.tmpselectedFileType="";
   }

  OnYearChange(event:any){
    this.spinnerService.show();
    this.getEmployeeList()
    // this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+this.selectedDepartment+"&Year="+event.Value+"&Month="+0+"&Key=en";
    // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    //    console.log(error);this.spinnerService.hide();
    // });
    this.spinnerService.hide();
  }
  OnEmployeesChange(_event:any){
  }
  OnEmployeesChangeDeSelect(event:any){ 
  }
  

  Submit(){
     if(this.selectedBranch.length==0){
          // this.globalToastService.warning("Please select Branch");
          this.ShowAlert("Please select Branch","warning")
           
          this.spinnerService.hide();
        }
          else if(this.selectedEmployees.length==0){
          // this.globalToastService.warning("Please select Employee");
          this.ShowAlert("Please select Employee","warning")
           
          this.spinnerService.hide();
        }
        else if(this.tmpselectedFileType==0||this.tmpselectedFileType==" "||this.tmpselectedFileType==null||this.tmpselectedFileType==undefined||this.tmpselectedFileType==""){
          // this.globalToastService.warning("Please Select FileType");
          this.ShowAlert("Please select FileType","warning")
          this.spinnerService.hide();
        }
       else if (this.files.length === 0) {
          // alert('Please select files to upload.');
          this.ShowAlert("Please select files to upload","warning")
          return;
        }
      else{
        
       this.spinnerService.show();
       const formData = new FormData();

    // Append form data (e.g., image type)
    formData.append('formdata', JSON.stringify({ FileType: this.tmpselectedFileType, AdminID:this.AdminID, EmployeeID:this.selectedEmployees?.map((y:any) => y.ID)[0] }));

    // Append files to FormData
    this.files.forEach(file => {
      formData.append('files', file, file.name);
    });
    this._commonservice.ApiUsingPost("Helper/MultiFileUpload",formData).subscribe((res:any) => {
      if(res.Status==true)
      {
        this.spinnerService.hide();
        // this.globalToastService.success(res.Message);
        this.ShowAlert(res.Message,"success")
        window.location.reload();
      }
      else{
        this.spinnerService.hide();
        // this.globalToastService.warning(res.Message);
        this.ShowAlert(res.Message,"warning")
      }
      this.spinnerService.hide();
    }, (error) => {
      // this.globalToastService.warning(error.Message);
      this.ShowAlert(error.Message,"warning")
      this.spinnerService.hide();
    });
      }
 
}


MoveToFiles(FileType:any)
{
  localStorage.setItem("FileType", FileType);
  this._router.navigate(['/FileMaster']);
}

 openDialog(): void {
  this._router.navigate(['/UploadFile']);
 // this.ShowDirectory=false;
        // this.dialog.open(UploadfileComponent,{
        //    ,panelClass: 'custom-dialog',
        //   if(res){
        // this.FileTypeList()
        //       this.spinnerService.hide();
        //   }
        // })
      }

      backToList()
      {
        this.ShowDirectory=true;
      }
      backToDashboard(){
        this._router.navigate(["appdashboard"]);
      }

            ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
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

