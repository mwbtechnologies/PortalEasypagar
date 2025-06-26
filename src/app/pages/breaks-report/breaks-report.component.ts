import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { AddlunchtimingsComponent } from '../addlunchtimings/addlunchtimings.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../common-table/common-table.component';
import { NavigationExtras, Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { PdfExportService } from 'src/app/services/pdf-export.service';

@Component({
  selector: 'app-breaks-report',
  templateUrl: './breaks-report.component.html',
  styleUrls: ['./breaks-report.component.css']
})
export class BreaksReportComponent {

  ORGId: any
  AllLunchList: any[] = []
  EmployeeList: any;
  BranchList: any[] = []; UserID: any
  DepartmentList: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  TypeSettings: IDropdownSettings = {}
  yearSettings: IDropdownSettings = {}
  monthSettings: IDropdownSettings = {}
  temparray: any = []; tempdeparray: any = [];
  TypeList:any[]=['Date Wise','Month Wise']
  selectedType:any
  selectedDepartment: any[] = [];
  selectedEmployees: any[] = []
  selectdate: any
  selectedBranch: any[] = []
  ApiURL: any
  AdminID: any
  YearList:any;MonthList:any;
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  detailedList:any[]=[]
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  maxBreaks:number = 0
  breakHeaders: number[] = [];
  //common table
  actionOptions: any
  displayColumns: any
  displayedColumns: any
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
  //ends here

  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  constructor(private pdfExportService:PdfExportService,private spinnerService: NgxSpinnerService,
    private _route: Router, private _commonservice: HttpCommonService, private globalToastService: ToastrService, private _httpClient: HttpClient, private dialog: MatDialog) {
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.employeeSettings = {
      singleSelection: false,
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
    this.TypeSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
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
    //common table
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-edit",
        // rowClick: true,
      },

    ];

    this.displayColumns = {
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


    this.displayedColumns= [
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


  ngOnInit(){
this.ORGId = localStorage.getItem('OrgID')
this.AdminID = localStorage.getItem("AdminID");
this.UserID=localStorage.getItem("UserID");
this.GetOrganization();
this.GetBranches()
// this.getEmployeeList()
this.GetYearList()
this.GetMonthList()

  }
  calculateMaxBreaks() {
    if (this.AllLunchList && this.AllLunchList.length > 0) {
    this.maxBreaks = Math.max(...this.AllLunchList.map(lunch => lunch.BreaksDetails.length));
    this.breakHeaders = Array.from({ length: this.maxBreaks }, (_, i) => i + 1); 
    }
}
handleDuration(duration: string): string {
  const [time] = duration.split('.'); 
  return time;
}
handle12hrsformat(date:any){
const time24 = date;
const time12 = moment(time24, 'HH:mm').format('hh:mm A');
return time12
}

getArrayOfLength(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}
  GetYearList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
    console.log(error);
 });
  }
  GetMonthList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
    console.log(error);
 });
  }
  GetReport(){
    this.getAllLunchList()
  }
  getAllLunchList(){
    this.employeeLoading = true;
    if(this.selectedBranch.length==0)
      {
        this.globalToastService.warning("Please select branch");
      }
      else if(this.selectedDepartment.length==0)
        {
          this.globalToastService.warning("Please select department");
        }
  else if(this.selectedEmployees.length==0)
      {
        this.globalToastService.warning("Please select atleast one employee");
      }
      else if(this.selectdate==undefined||this.selectdate==""||this.selectdate==" "||this.selectdate==null)
      {
        this.globalToastService.warning("Please select Date");
      }
      else{
        const json = {
          "Employees":{
                "empid":this.selectedEmployees.map((se:any)=>se.Value),
              },
             "date":this.selectdate
      }
       this._commonservice.ApiUsingPost("Admin/GetLunchHours",json).subscribe(data => {
        console.log(data,"datda");
        
         this.AllLunchList = data.List.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
         this.employeeLoading = false
         this.calculateMaxBreaks();
       },(error) => {
        this.spinnerService.hide();
        this.globalToastService.error(error.message);
      })
      }
 
  }
  backToList() {
    this.showReportWise = false
    this.GetBranches()
    this.GetDepartments()
    this.getAllLunchList()
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
    this.ApiURL = "Admin/GetSuborgList?OrgID="+this.ORGId+"&AdminId="+this.UserID
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
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.ORGId+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });

  }

  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    this.DepartmentList=[];
    const json = {
      OrgID:this.ORGId,
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
      this.globalToastService.error(error); console.log(error);
    });
  }

  getEmployeeList() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let BranchID = this.selectedBranch?.map((y: any) => y.Value)[0] || 0
    let deptID = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0
    this.ApiURL = "Admin/GetEmployees?AdminID=" + this.AdminID + "&BranchID=" + BranchID + "&DeptId=" + deptID + "&Year=" + currentYear + "&Month=" + 0 + "&Key=en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
      console.log(error); this.spinnerService.hide();
    });
  }
  onDeptSelect(item: any) {
    console.log(item, "item");
    this.tempdeparray.push({ id: item.Value, text: item.Text });
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onDeptSelectAll(item: any) {
    console.log(item, "item");
    this.tempdeparray = item;
  }
  onDeptDeSelectAll() {
    this.tempdeparray = [];
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
    this.selectedDepartment = []
    this.GetDepartments();
    this.selectedEmployees = []
    // this.getEmployeeList()
  }
  onBranchDeSelect(item: any) {
    console.log(item, "item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.selectedDepartment = []
    this.GetDepartments();
    this.selectedEmployees = []
    // this.getEmployeeList()
    //  this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+item.Value+"&DeptId=0&Year=0&Month="+0+"&Key=en";
    //  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    //     console.log(error);this.spinnerService.hide();
    //  });
  }

  OnEmployeesChange(_event: any) {
  }
  OnEmployeesChangeDeSelect(event: any) {
  }

  // DeactiveLunch(row:any){
  //   this._commonservice.ApiUsingGetWithOneParam("Breaks/UpdateBreakStatus?Id="+row.id).subscribe(data =>{
  //   this.globalToastService.success(data.Message)
  //   },(error)=>{
  //     this.globalToastService.error(error.Message)
  //   })
  // }
  ViewDetailed(row:any){
    this.showReportWise = true
    this.detailedList = row.BreaksDetails
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

  exportPDF() {
    let columns = ['EmployeeName','Branch','Department','BreakActualTime','BreakTakenTime','ExtraTime',
    ]
    const header = ''
    const title = 'Monthly Break Report'
    // let data = this.AllLunchList.map((item:any) => {
    //   const rowData: any[] = [];
    //   for (let column of columns) {
    //     rowData.push(item[column]);
    //    }
    //   return rowData;
    // });
    // console.log(data,"data");
    let rows: any[] = this.AllLunchList.map((item: any) => {
      const rowData: any[] = [
          item.EmployeeName,
          item.Branch,
          item.Department,
          item.BreakActualTime,
          item.BreakTakenTime,
          item.ExtraTime
      ];
      if (item.BreaksDetails && item.BreaksDetails.length > 0) {
        item.BreaksDetails.forEach((breakDetail: any) => {
            const breakInfo = [
                'Break: ' + breakDetail.Break,
                'In: ' + (breakDetail.BreakIn ? new Date(breakDetail.BreakIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
                'Out: ' + (breakDetail.BreakOut ? new Date(breakDetail.BreakOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
                'Duration: ' + this.handleDuration(breakDetail.Duration)
            ].join('\n');

            rowData.push(breakInfo);
        });
    } else {
        rowData.push('No breaks');
    }

    return rowData;
});

// Adding extra break headers if needed
for (let i = 1; i <= this.breakHeaders.length; i++) {
    columns.push(`Break ${i}`);
}
    
    this.pdfExportService.generatePDF(header, title, columns, rows);
  }
  exportexcel(){
    let columns = ['Name','Branch','Department','Role','Mobile','Email','DateOfJoining','CreatedDate']
    let fileName = 'Monthly Break Report.xlsx'
  //  let data = this.AllLunchList.map((item:any) => {
  //     const rowData: any[] = [];
  //     for (let column of columns) {
  //       rowData.push(item[column]);
  //      }
  //     return rowData;
  //   });
    let rows: any[] = this.AllLunchList.map((item: any) => {
      const rowData: any[] = [
          item.EmployeeName,
          item.Branch,
          item.Department,
          item.BreakActualTime,
          item.BreakTakenTime,
          item.ExtraTime
      ];
      if (item.BreaksDetails && item.BreaksDetails.length > 0) {
        item.BreaksDetails.forEach((breakDetail: any) => {
            const breakInfo = [
                'Break: ' + breakDetail.Break,
                'In: ' + (breakDetail.BreakIn ? new Date(breakDetail.BreakIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
                'Out: ' + (breakDetail.BreakOut ? new Date(breakDetail.BreakOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
                'Duration: ' + this.handleDuration(breakDetail.Duration)
            ].join('\n');

            rowData.push(breakInfo);
        });
    } else {
        rowData.push('No breaks');
    }

    return rowData;
});

// Adding extra break headers if needed
for (let i = 1; i <= this.breakHeaders.length; i++) {
    columns.push(`Break ${i}`);
}
      rows.unshift(columns);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'OT List');
    XLSX.writeFile(wb, fileName);
  }
}
