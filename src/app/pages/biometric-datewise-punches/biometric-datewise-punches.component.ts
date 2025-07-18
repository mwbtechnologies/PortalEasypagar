import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Emp } from '../generate-payslip/generate-payslip.component';
import { CommonTableComponent } from '../common-table/common-table.component';
import { DatePipe } from '@angular/common';
import { ShowalertComponent } from './showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

export class FormInput {
  StartDate: any;
}
@Component({
  selector: 'app-biometric-datewise-punches',
  templateUrl: './biometric-datewise-punches.component.html',
  styleUrls: ['./biometric-datewise-punches.component.css']
})
export class BiometricDatewisePunchesComponent {
 formInput: FormInput | any;
  EmployeeList: any;
  EmpClass: Array<Emp> = [];
  BranchList: any[] = [];
  DepartmentList: any; YearList: any; MonthList: any;
  AdminID: any;
  ApiURL: any;
  OrgID: any;
  showtable:any=false;
  SalaryList: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  ViewPermission: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  monthSettings: IDropdownSettings = {}
  yearSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  temparray: any = []; tempdeparray: any = [];
  selectedDepartment: any[] = [];
  selectedyear: any[] = []
  selectedMonth: any[] = []
  selectedEmployees: any[] = [];
  selectedBranch: any[] = []
  UserID: any;
  MonthWisePunch:any=[]
  detailedList:any[]=[]
  ShowDownload=false;
  //common table
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  actionOptions: any
  displayColumns: any
  displayedColumns: any
  originalDisplayColumns: any
  originalDisplayedColumns: any
  employeeLoading: any;
  editdata: any
  editableColumns: any = []
  topHeaders: any = []
  headerColors: any = []
  smallHeaders: any = []
  ReportTitles: any = {}
  selectedRows: any = []
  commonTableOptions: any = {}
  tableDataColors: any = {}
  showReportWise: boolean = false

  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  Breaks:any=[]
  maxcount: any;
  //ends here
  constructor(private dialog:MatDialog,private _router: Router, private spinnerService: NgxSpinnerService,
    private _commonservice: HttpCommonService) {
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
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.departmentSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
     //common table
     this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-edit",
        // rowClick: true,
      },

    ];

    this.originalDisplayColumns = {
      "SLno":"SL No",
      "MappedEmpId":"EmpID",
      "EmployeeName":"Name",
      // "Duration":"Duration",
    },


    this.originalDisplayedColumns= [
      // "SelectAll",
      "SLno",
      "MappedEmpId",
      "EmployeeName",
      //  "Duration",
    ]

    this.editableColumns = {
    }

    this.topHeaders = []
    this.headerColors = {}
    this.tableDataColors = {}
  }

  ngOnInit() {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
    this.GetOrganization();
    this.GetBranches();
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = currentMonth - 1;

    this.formInput = {
      StartDate: ''
    }
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
    const today = new Date();
    const year = today.getFullYear();
    const month =(today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = today.getDate().toString().padStart(2, '0');
    this.formInput.StartDate = `${year}-${month}-${day}`;
  }
  onselectedOrg(item:any){
    this.selectedBranch = [];
    this.BranchList=[];
    this.selectedDepartment = [];
    this.DepartmentList=[];
    this.selectedEmployees=[];
    this.EmployeeList=[];
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranch = [];
    this.BranchList=[];
    this.selectedDepartment = [];
    this.DepartmentList=[];
    this.selectedEmployees=[];
    this.EmployeeList=[];
    this.GetBranches()
  }

  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      this.ShowAlert(error,"error"); console.log(error);
    });

  }

  GetDepartments() {  
     this.selectedDepartment=[];
     this.DepartmentList=[];
    const json = {
      OrgID: this.OrgID,
      Branches: this.selectedBranch.map((br: any) => {
        return {
          "id": br.Value
        }
      })
    }
     this.DepartmentList=[];
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        console.log(this.DepartmentList, "department list");
      }
    }, (error) => {
      this.ShowAlert(error,"error");
    });
  }

  getEmployeeList() {
    const json: any = {
      AdminID:this.AdminID
    }
    if (this.selectedBranch.length>0) {
      json["BranchID"] = this.selectedBranch.map((br: any) => { return br.Value })
      if (this.selectedDepartment) {
        json["DepartmentID"] = this.tempdeparray.map((br: any) => { return br.id })
      }
      else{
        json["DepartmentID"]=0;
      }
      if (this.selectedyear) {
        json["Year"] =  this.selectedyear.map((sy:any)=>{ return sy.Text})[0]
       }
      if (this.selectedMonth) {
        json["Month"] =  this.selectedMonth.map((sm:any)=>{ return sm.Value})[0]
       }
      //  if(this.tempdeparray.length>0)
      //  {
        this.EmployeeList=[];
        this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch", json).subscribe((data) => {
          this.EmployeeList = data.List
          this.selectedEmployees = [...data.List]
        }
          , (error) => {
            console.log(error); this.spinnerService.hide();
          });
    }
    else{
      this.EmployeeList=[];
    }
   
    //  }
    //  else{
    //   this.EmployeeList=[];
    //  }
  
  }
 
    onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray = [];
    this.tempdeparray.push({id:item.Value, text:item.Text });
    // if(this.tempdeparray.length  == this.DepartmentList.length) this.onDeptDeSelectAll()
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
    this.tempdeparray = [...this.DepartmentList]
    this.tempdeparray = [];
    this.selectedEmployees = []
    this.getEmployeeList()
   }
   onDeptDeSelect(item:any){
    this.tempdeparray = [];
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    this.selectedEmployees = []
    this.getEmployeeList()
   }
  onBranchSelect(item: any) {
    console.log(item, "item");
    this.temparray.push({ id: item.Value, text: item.Text });
    this.selectedDepartment = []
    this.GetDepartments();
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onBranchDeSelect(item: any) {
    console.log(item, "item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.selectedDepartment = []
    this.DepartmentList = []
    this.GetDepartments();
    this.selectedEmployees = []
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

  backToDashboard() {
    this._router.navigate(["/appdashboard"]);
  }

  getPunchReport() {
    if(this.selectedBranch.length==0){
      this.ShowAlert("Please select Branch","warning");
       this.employeeLoading = false
      this.spinnerService.hide();
    }
            else if(this.selectedEmployees.length==0){
              this.ShowAlert("Please select Employee","warning");
             this.employeeLoading = false
            this.spinnerService.hide();
          }
        else{
           var len=this.formInput.StartDate.length;console.log(len);
              if(len==undefined || len>10 || len==null)
              {
                var datePipe = new DatePipe('en-US');
                this.formInput.StartDate= datePipe.transform(this.formInput.StartDate, 'dd/MM/yyyy');
              }
    let json = {
    "Employees":this.selectedEmployees?.map((se:any)=>{
      return {
        "EmployeeID":se.ID
      }
    }),
    "Date":this.formInput.StartDate,
  }
  this.spinnerService.show();
    this._commonservice.ApiUsingPost("Punch/GetDateWisePunchReport",json).subscribe(data => {
      if(data.Status==true)
      {

        this.employeeLoading=true;
      this.MonthWisePunch = data.PunchReport.map((l: any, i: any) => { return { SLno: i + 1, ...l } });
         this.employeeLoading = false
         this.ShowDownload=true;
         this.maxcount=data.maxPunches;
         this.updateDisplayColumns(data.maxPunches);
         this.showtable=true;
      }
      else{
        this.MonthWisePunch=[];
        this.showtable=false;
      }
        this.spinnerService.hide();
      },(error)=>{
        this.ShowAlert(error,"error");
        this.spinnerService.show();
        this.showtable=false;
      })
  }
  }

   ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
      this.dialog.open(ShowalertComponent, {
        data: { message, type },
        panelClass: 'custom-dialog',
        disableClose: true  // Prevents closing on outside click
      }).afterClosed().subscribe((res: any) => {
       
      });
    }
  updateDisplayColumns(maxcount: number) {
    this.spinnerService.show();
    this.displayColumns = JSON.parse(JSON.stringify(this.originalDisplayColumns));
    this.displayedColumns = JSON.parse(JSON.stringify(this.originalDisplayedColumns));

    // Find the index of "Date" column
    const EmpIndex = this.displayedColumns.indexOf("EmployeeName");
    const MappedEmpId = this.displayedColumns.indexOf("MappedEmpId");
    // const BranchIndex = this.displayedColumns.indexOf("Branch");

    for (let i = 0; i < maxcount; i++) {
        const header = i + 1;
        if (!this.displayColumns.hasOwnProperty(`Punch_${header}`)) {
            this.displayColumns[`Punch_${header}`] = `Punch_${header}`;
        }
    }

    for (let i = 0; i < this.MonthWisePunch.length; i++) {
        let tempPunches: any = this.MonthWisePunch[i]['Punches']; 
        for (let j = 0; j < tempPunches.length; j++) {
            this.MonthWisePunch[i][`Punch_${j + 1}`] = tempPunches[j].Time + "("+ tempPunches[j].Device+")"; 
        }
    }

    // Insert punches **after** the "Date" column
    for (let i = 1; i <= maxcount; i++) {
        this.displayedColumns.splice(EmpIndex + i, 0, `Punch_${i}`);
        // this.displayedColumns.splice(BranchIndex + i, 0, `Punch_${i}`);
    }
this.spinnerService.hide();
    console.log(this.displayedColumns);
}



  backToList() {
    this.showReportWise = false
    this.GetBranches()
    this.GetDepartments()
    this.getEmployeeList()
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
      // this.ShowToast(error,"error")
       console.log(error);
    });
  }
    //common table
    actionEmitter(data: any) {
    
    }
    downloadReport(){
      let selectedColumns = this.displayedColumns
      this.commonTableChild.downloadReport(selectedColumns)
     }
     DownloadPDF() {
      this.spinnerService.show();
      const json = {
        "PunchReport": this.MonthWisePunch,
        "Date":this.formInput.StartDate,
        "maxPunches":this.maxcount,
        "Branch":this.selectedBranch?.map((y:any) => y.Text)[0],
      }
      this._commonservice.ApiUsingPost("Punch/DatewisePunchReportAppPDF", json).subscribe((data) => {
        console.log(data);
        if (data.Status==true) 
        {
          this.spinnerService.hide();
          window.open(data.Link,'_blank')
        }
        else{
          this.spinnerService.hide();
          this.ShowAlert("Failed to generate PDF File","warning");
        }
      }, (error) => {
        this.spinnerService.hide();
        
      });
    }
    DownloadExcel() {
      this.spinnerService.show();
      const json = {
        "PunchReport": this.MonthWisePunch,
        "Date":this.formInput.StartDate,
        "maxPunches":this.maxcount,
        "Branch":this.selectedBranch?.map((y:any) => y.Text)[0],
      }
      this._commonservice.ApiUsingPost("Punch/DatewisePunchReportAppExcel", json).subscribe((data) => {
        console.log(data);
        if (data.Status==true) 
        {
          this.spinnerService.hide();
          window.open(data.Link,'_blank')
        }
        else{
          this.spinnerService.hide();
         this.ShowAlert("Failed to generate PDF File","warning");
        }
      }, (error) => {
        this.spinnerService.hide();
        
      });
    }
}

