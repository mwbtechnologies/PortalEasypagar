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
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-breaks-history-reports',
  templateUrl: './breaks-history-reports.component.html',
  styleUrls: ['./breaks-history-reports.component.css']
})
export class BreaksHistoryReportsComponent {
  EmployeeList: any;
  EmpClass: Array<Emp> = [];
  BranchList: any[] = [];
  DepartmentList: any; YearList: any; MonthList: any;
  AdminID: any;
  ApiURL: any;
  OrgID: any;
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
  MonthWiseBreak:any=[]
  detailedList:any[]=[]
  ShowDownload=false;
  //common table
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
  //ends here
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  constructor(private _router: Router, private spinnerService: NgxSpinnerService,private dialog :MatDialog,
    private _commonservice: HttpCommonService, private globalToastService: ToastrService, private _httpClient: HttpClient) {
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
      "MappedEmpId":"EMPLOYEE ID",
      "EmployeeName":"EMPLOYEE",
      "Branch":"BRANCH",
      "Department":"DEPARTMENT",
      "BreakActualTime":"BREAK TIME",
      "BreakTakenTime":"TIME TAKEN",
      "ExtraTime":"EXTRA TIME",
      "Actions":"ACTIONS",
    },


    this.originalDisplayedColumns= [
      // "SelectAll",
      "SLno",
      "MappedEmpId",
      "EmployeeName",
      "Branch",
      "Department",
      "BreakActualTime",
      "BreakTakenTime",
      "ExtraTime",
      "Actions"
    ]

    this.editableColumns = {
      // "HRA":{
      //   filters:{}
      // },
    }

    this.topHeaders = [
      // {
      //   id:"blank1",
      //   name:"",
      //   colspan:2
      // }
    ]

    this.headerColors = {
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    this.tableDataColors = {
      // "BreaksStrings": [
      //   { styleClass: "breakLine", filter: [{}] }
      // ]
    }
    //ends here
  }

  ngOnInit() {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
    this.GetOrganization();
    this.GetBranches()
    // this.getEmployeeList()
    this.GetYearList()
    this.GetMonthList()
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
      this.ShowAlert(error,"error")
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
  GetYearList() {
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
      console.log(error);
    });
  }
  GetMonthList() {
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
      console.log(error);
    });
  }

  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json = {
      OrgID: this.OrgID,
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
      this.ShowAlert(error,"error")
      console.log(error);
    });
  }

  getEmployeeList() {
    const json: any = {
      AdminID:this.AdminID
    }
    if (this.selectedBranch) {
      json["BranchID"] = this.selectedBranch.map((br: any) => { return br.Value })
    }
    if (this.selectedDepartment) {
      json["DepartmentID"] = this.tempdeparray.map((br: any) => { return br.id })
    }
    if (this.selectedyear) {
      json["Year"] =  this.selectedyear.map((sy:any)=>{ return sy.Text})[0]
     }
    if (this.selectedMonth) {
      json["Month"] =  this.selectedMonth.map((sm:any)=>{ return sm.Value})[0]
     }
     if(this.tempdeparray.length>0)
     {
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
  
  }
  // onDeptSelect(item: any) {
  //   console.log(item, "item");
  //   this.tempdeparray.push({ id: item.Value, text: item.Text });
  //   if (this.tempdeparray.length == this.DepartmentList.length) this.onDeptDeSelectAll()
  //   this.selectedEmployees = []
  //   this.getEmployeeList()
  // }
  // onDeptSelectAll() {
  //   this.tempdeparray = [...this.DepartmentList]
  //   this.selectedEmployees = []
  //   this.tempdeparray = [];
  //   this.getEmployeeList()
  // }
  // onDeptDeSelectAll() {
  //   this.tempdeparray = [];
  //   this.selectedEmployees = []
  //   this.getEmployeeList()
  // }
  // onDeptDeSelect(item: any) {
  //   console.log(item, "item");
  //   console.log(this.tempdeparray, "tempdeparray");
  //   console.log(this.tempdeparray.findIndex((sd: any) => sd == item));

  //   if (this.tempdeparray.findIndex((sd: any) => sd == item) != -1) {
  //     this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
  //   } else {
  //     this.tempdeparray = this.DepartmentList.map((dl: any) => { return { id: dl.Value, text: dl.Text } }).filter((dl: any) => dl.id != item.Value && dl.text != item.Text)
  //   }

  //   this.selectedEmployees = []
  //   this.getEmployeeList()
  // }
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
    // this.getEmployeeList()
  }
  onBranchDeSelect(item: any) {
    console.log(item, "item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.selectedDepartment = []
    this.DepartmentList = []
    this.GetDepartments();
    this.selectedEmployees = []
    // this.getEmployeeList()
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
    this._router.navigate(["appdashboard"]);
  }

  getBreakReport() {
    if(this.selectedBranch.length==0){
      // this.globalToastService.warning("Please select Branch");
      this.ShowAlert("Please select Branch","warning")
       this.employeeLoading = false
      this.spinnerService.hide();
    }
  else if(this.selectedDepartment.length==0){
      // this.globalToastService.warning("Please select Department");
      this.ShowAlert("Please select Department","warning")
       this.employeeLoading = false
      this.spinnerService.hide();
    }
   else if(this.selectedyear.length==0){
      // this.globalToastService.warning("Please Select Year");
      this.ShowAlert("Please select Year","warning")
       this.employeeLoading = false
      this.spinnerService.hide();
          }
          else if(this.selectedMonth.length==0){
            // this.globalToastService.warning("Please Select Month");
            this.ShowAlert("Please select Month","warning")
             this.employeeLoading = false
            this.spinnerService.hide();
          }
            else if(this.selectedEmployees.length==0){
            // this.globalToastService.warning("Please select Employee");
            this.ShowAlert("Please select Employee","warning")
             this.employeeLoading = false
            this.spinnerService.hide();
          }
        else{
    let json = {
    "Employee":this.selectedEmployees?.map((se:any)=>{
      return {
        "EmployeeID":se.ID
      }
    }),
    "Month":this.selectedMonth?.map((y:any) => y.Value)[0],
    "Year":this.selectedyear?.map((y:any) => y.Text)[0]
  }
  this.employeeLoading = true
    this._commonservice.ApiUsingPost("Break/GetLunchReport", json).subscribe(data => {
      this.MonthWiseBreak = data.List.map((l: any, i: any) => { return { SLno: i + 1, ...l } });
      this.Breaks=data.Breaks;
         this.employeeLoading = false
         this.ShowDownload=true;
         this.updateDisplayColumns(data.Breaks)
        this.spinnerService.hide();
      },(error)=>{
        // this.globalToastService.error(error.message);
        this.ShowAlert(error.message,"warning")
      })
  }
  }

  updateDisplayColumns(headers:any){
    
    this.displayColumns = JSON.parse(JSON.stringify(this.originalDisplayColumns))
    this.displayedColumns = JSON.parse(JSON.stringify(this.originalDisplayedColumns))
    for (let i = 0; i < headers?.length; i++) {
      const header = headers[i];
      if(!this.displayColumns.hasOwnProperty(`BreakID_${header.BreakID}`)) 
        this.displayColumns[`BreakID_${header.BreakID}`] = header.BreakName
    }
    for(let i=0;i<this.MonthWiseBreak.length;i++){
      let tempBreaks : any = this.MonthWiseBreak[i]['Breaks']
      for(let j=0;j<tempBreaks.length;j++){
        this.MonthWiseBreak[i][`BreakID_${tempBreaks[j].BreakID}`] = tempBreaks[j].Duration
      }
    }

    this.displayedColumns.splice(this.displayedColumns.length - 1, 0,...headers.map((h:any)=>`BreakID_${h.BreakID}`))

  }

  ViewDetailed(row:any){
    this.showReportWise = true
    this.detailedList = row
  }
  backToList() {
    this.showReportWise = false
    this.GetBranches()
    this.GetDepartments()
    this.getEmployeeList()
    this.GetYearList()
    this.GetMonthList()
  }

    //common table
    actionEmitter(data: any) {
      if(data.action.name == "View"){
          this.ViewDetailed(data.row)
      }
    }
    downloadReport(){
      let selectedColumns = this.displayedColumns
      this.commonTableChild.downloadReport(selectedColumns)
     }
    // ShowShiftDetails(row:any){
    // }
    //ends here


    DownloadPDF() {
      this.spinnerService.show();
      const json = {
        "List": this.MonthWiseBreak,
        "Breaks": this.Breaks,
        "Month":this.selectedMonth?.map((y:any) => y.Value)[0],
        "Year":this.selectedyear?.map((y:any) => y.Text)[0]
      }
      this._commonservice.ApiUsingPost("Breaks/MonthwisebreakreportAppPDF", json).subscribe((data) => {
        console.log(data);
        if (data.Status==true) 
        {
          this.spinnerService.hide();
          window.open(data.Link,'_blank')
        }
        else{
          this.spinnerService.hide();
          // this.globalToastService.warning("Failed to generate PDF File");
          this.ShowAlert("Failed To Generate PDF File","warning")
        }
      }, (error) => {
        this.spinnerService.hide();
        
      });
    }
    DownloadExcel() {
      this.spinnerService.show();
      const json = {
        "List": this.MonthWiseBreak,
        "Breaks": this.Breaks,
        "Month":this.selectedMonth?.map((y:any) => y.Value)[0],
        "Year":this.selectedyear?.map((y:any) => y.Text)[0]
      }
      this._commonservice.ApiUsingPost("Breaks/MonthwisebreakreportAppExcel", json).subscribe((data) => {
        console.log(data);
        if (data.Status==true) 
        {
          this.spinnerService.hide();
          window.open(data.Link,'_blank')
        }
        else{
          this.spinnerService.hide();
          // this.globalToastService.warning("Failed to generate PDF File");
          this.ShowAlert("Failed To Generate PDF File","warning")
        }
      }, (error) => {
        this.spinnerService.hide();
        
      });
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
