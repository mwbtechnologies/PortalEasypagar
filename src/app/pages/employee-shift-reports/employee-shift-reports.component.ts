import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../common-table/common-table.component';
import { MatDialog } from '@angular/material/dialog';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

export class Emp{
  EmployeeID:any;
}

@Component({
  selector: 'app-employee-shift-reports',
  templateUrl: './employee-shift-reports.component.html',
  styleUrls: ['./employee-shift-reports.component.css']
})
export class EmployeeShiftReportsComponent implements OnInit {
  EmployeeList:any;
  ListType:any=['Day Shift', 'Morning Shift','Afternoon Shift','Evening Shift','Night Shift'];
  selectedListType:any;
  EmpClass:Array<Emp> = [];
  BranchList:any[]=[];
  DepartmentList:any; YearList:any;MonthList:any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  file:any;UserListType:any;
  EmployeeId:any;
  ShowDownload=false;
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
  paginatedItems: any[] = [];
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  monthSettings :IDropdownSettings = {}
  yearSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  temparray:any=[]; tempdeparray:any=[];
  selectedDepartment:any[]=[];
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  selectedEmployees:any[]=[]
  ShiftList: any;
  ShowBtn:boolean=false;
  DisplayDays: any;
  currentPage: number = 1;
  itemsPerPage: number = 1; // Adjust as needed
  totalPages: number = 1;MonthDays:number=31;
  showday1=false;  showday11=false;  showday21=false;  showday31=false;
  showday2=false;  showday12=false;  showday22=false;  
  showday3=false;  showday13=false;  showday23=false;  
  showday4=false;  showday14=false;  showday24=false;  
  showday5=false;  showday15=false;  showday25=false;  
  showday6=false;  showday16=false;  showday26=false;  
  showday7=false;  showday17=false;  showday27=false; 
  showday8=false;  showday18=false;  showday28=false;
  showday9=false;  showday19=false;  showday29=false;
  showday10=false;  showday20=false;  showday30=false;
  showMonthWise = false
  MonthlyData:any
//common table
actionOptions:any
orginalValues:any = {}
  displayColumns:any
  displayedColumns:any
  employeeLoading:any;
  editableColumns:any =[]
  topHeaders:any = []
  headerColors:any = []
  smallHeaders:any = []
  ReportTitles:any = {}
selectedRows:any = [];UserID:any
commonTableOptions :any = {}
tableDataColors: any;
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
  currentMonth: any;
  currentYear: any;
//ends here
selectedOrganization:any[]=[]
OrgList:any[]=[]
orgSettings:IDropdownSettings = {}

  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService,private dialog:MatDialog){ 
    this.isSubmit=false
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
        name: "View Details",
        icon: "fa fa-eye",
      },
      
    ];
    this.orginalValues={
      displayColumns: {
      SelectAll: "SelectAll", 
      "Actions":"ACTIONS",
      "SLno":"SL No",
      "MappedEmpId":"EMPLOYEE ID",
      "EmployeeName":"EMPLOYEE",
      "ShiftAmount":"TOTAL SHIFT AMOUNT",
      // "ontime":"ON TIME",
      // "latein":"LATE IN",
      // "lateexit":"LATE EXIT",
      // "earlyexit":"EARLY EXIT",
      // "OverallShiftHrs":"TOTAL",
      // "OverallEmpWorkedHrs":"WORKED",
      // "OverallExtraHrs":"EXTRA",
    },
    displayedColumns: [
      "SelectAll",     
      "Actions",
      "SLno",
      "MappedEmpId",
      "EmployeeName",
      "ShiftAmount"
      // "ontime",
      // "latein",
      // "lateexit",
      // "earlyexit",
      // "OverallShiftHrs",
      // "OverallEmpWorkedHrs",
      // "OverallExtraHrs",
      // "Actions",
    ],
    topHeaders : [
      {
        id:"blank1",
        name:"",
        colspan:6
      },
      // {
      //   id:"TimeManagementStatus",
      //   name:"TIME MANAGEMENT STATUS",
      //   colspan:4
      // },
      // {
      //   id:"shiftHrs",
      //   name:"SHIFT in HOURS",
      //   colspan:3
      // },
    ],
    originalTableDataColors : {
    
    }
    
  }
  this.editableColumns = {
    SelectAll: {
      //commented by ashwini- changed logic of approve all, now each payslip should be approved manually and this checkbox is used for generating bank payslip
      filters: {IsPayslipExist:false},
    }}
  this.headerColors ={
    // "Day 1" : {text:"#068206",bg:"#00ff008a"},
  }

  this.displayColumns= JSON.parse(JSON.stringify(this.orginalValues.displayColumns))
  this.displayedColumns= JSON.parse(JSON.stringify(this.orginalValues.displayedColumns))
  this.topHeaders= JSON.parse(JSON.stringify(this.orginalValues.topHeaders))
  this.tableDataColors= JSON.parse(JSON.stringify(this.orginalValues.originalTableDataColors))
  }
  ngOnInit(): void {

    this.UserListType="All";
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID=localStorage.getItem("UserID");
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
    }
    this.GetOrganization();
     this.GetBranches()
     this.getEmployeeList()
  this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
     console.log(error);
  });
  this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
     console.log(error);
  });
 this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
 const now = new Date();
 const currentMonth = now.getMonth()+1; 
 const currentYear = now.getFullYear();
 const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
 const monthIndex = currentMonth - 1; // setting month to previous month

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
      // this.globalToastService.error(error); 
      this.ShowAlert(error,"error")
      console.log(error);
    });
  }

  getEmployeeList(){
   let Month = this.selectedMonth?.map((y:any) => y.Value)[0] ||this.currentMonth
   let BranchID = this.selectedBranch?.map((y:any) => y.Value)[0] || 0
   let deptID = this.selectedDepartment?.map((y:any) => y.Value)[0] || 0
   let Year = this.selectedyear?.map((y:any) => y.Text)[0] || this.currentYear
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+BranchID+"&DeptId="+deptID+"&Year="+Year+"&Month="+Month+"&Key=en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
       console.log(error);this.spinnerService.hide();
    });
  }
  onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.push({id:item.Value, text:item.Text });
   }
   onDeptSelectAll(item:any){
    console.log(item,"item");
    this.tempdeparray = item;
   }
   onDeptDeSelectAll(){
    this.tempdeparray = [];
   }
   onDeptDeSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
   }
  onBranchSelect(item:any){
   console.log(item,"item");
   this.temparray.push({id:item.Value,text:item.Text });
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  }
  onBranchDeSelect(item:any){
   console.log(item,"item");
   this.temparray.splice(this.temparray.indexOf(item), 1);
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  //  this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+item.Value+"&DeptId=0&Year=0&Month="+0+"&Key=en";
  //  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
  //     console.log(error);this.spinnerService.hide();
  //  });
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
  onyearDeSelect(event:any){
    this.spinnerService.show();
    this.getEmployeeList()
    // this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+this.selectedDepartment+"&Year="+event.Value+"&Month="+0+"&Key=en";
    // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    //    console.log(error);this.spinnerService.hide();
    // });
    this.spinnerService.hide();
  }
  OnMonthChange(event:any)
  {
    this.spinnerService.show();
    this.getEmployeeList()
    // this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+this.selectedDepartment+"&Year="+this.selectedyear+"&Month="+event.Value+"&Key=en";
    // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    //    console.log(error);this.spinnerService.hide();
    // });
    this.spinnerService.hide();
  }
  onMonthDeSelect(event:any)
  {
    this.spinnerService.show();
    this.getEmployeeList()
    // this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+this.selectedDepartment+"&Year="+this.selectedyear+"&Month="+event.Value+"&Key=en";
    // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    //    console.log(error);this.spinnerService.hide();
    // });
    this.spinnerService.hide();
  }
  OnEmployeesChange(_event:any){
  }
  OnEmployeesChangeDeSelect(event:any){ 
  }
  ViewDetails(_ID:any,Month:any, Year:any){
    // let seleectedmonth = this.selectedMonth.map(res=>res.Value)[0]
    // let seleectedyear = this.selectedyear.map(res=>res.Text)[0]
    localStorage.setItem("EmployeeID",_ID);
    localStorage.setItem("Month",Month);
    localStorage.setItem("Year",Year);
    this._router.navigate(['/Shiftreports']);
  }

GetReport(){
  this.employeeLoading = true;
  if(this.selectedBranch.length==0){
    this.ShowAlert("Please Select Branch","warning")
    this.spinnerService.hide();
    this.employeeLoading = false
        }
       else if(this.selectedyear.length==0){
    this.ShowAlert("Please Select Year","warning")
    this.spinnerService.hide();
    this.employeeLoading = false
        }
        else if(this.selectedMonth.length==0){
          this.ShowAlert("Please Select Month","warning")
          this.spinnerService.hide();
          this.employeeLoading = false
        }
          else if(this.selectedEmployees.length==0){
          this.ShowAlert("Please Select Employee","warning")
          this.spinnerService.hide();
          this.employeeLoading = false
        }
      else{
       this.spinnerService.show();
       this.employeeLoading = true
       this.EmployeeId=this.selectedEmployees?.map((y:any) => y.Value)[0];
       let month=this.selectedMonth?.map((y:any) => y.Value)[0];
       let year=this.selectedyear?.map((y:any) => y.Text)[0];
       const json={
        ShiftType:this.UserListType,
          Month:this.selectedMonth?.map((y:any) => y.Value)[0],
          BranchID:this.selectedBranch?.map((y:any) => y.Value)[0],
          Year:this.selectedyear?.map((y:any) => y.Text)[0],
          Employees:this.selectedEmployees?.map((se:any)=>{
            return {
              "id":se.Value,
              "text":se.Text
            }
          }),
          AdminID:this.AdminID
        }
       this._commonservice.ApiUsingPost("ShiftMaster/GetAllEmployeeShiftReport",json).subscribe((data) => { 
       this.SalaryList = data.Details.map((l: any, i: any) => { return { SLno: i + 1, ...l } });;
       this.MonthDays=data.MonthDays;
       this.ShowBtn = true
       this.dtTrigger.next(null);
       this.employeeLoading = false
       this.spinnerService.hide();
       this.totalPages = Math.ceil(this.SalaryList.length / this.itemsPerPage);
       this.updatePaginatedItems();
       this.DisplayDays=  data.Days;
      this.updateDayList()

    }, (error) => {
      this.employeeLoading = false
      this.spinnerService.hide();
      // this.globalToastService.error(error.message);
      this.ShowAlert(error.message,"error")
    });
      }
 
}
updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.SalaryList.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedItems();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedItems();
    }
  }


getDatesBetween(startDate: string, endDate: string): number[] {
  const dates: string[] = []; const days: number[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
     days.push(currentDate.getDate());
    dates.push(new Date(currentDate).toISOString().split('T')[0]); // Add the date to the array
    currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
  }

  return days;
}

//   GetReportInPDF(){
//     this.ApiURL="PortalReports/GetAttendanceReport";
//     this._commonservice.ApiUsingPost(this.ApiURL,this.SalaryList).subscribe((res:any) => {
//       if(res.Status==true)
//       {
//        this.pdfSrc = res.URL;
//        window.open(res.URL,'_blank')
//       }
//       else{
//         this.globalToastService.warning("Sorry Failed to Generate");
//       }
//       this.spinnerService.hide();
//     }, (error) => {
//       this.spinnerService.hide();
//       this.globalToastService.error(error.message);
//     });
 
// }
OnTypeChange(event:any)
{
  if(event!=undefined&& event!=null)
  {
    // this.selectedListType=event;
    this.UserListType=event;
  }
  else{
    // this.selectedListType=['Active'];
    this.UserListType="All";
  }
  
}

updateDayList(){
  this.displayColumns= JSON.parse(JSON.stringify(this.orginalValues.displayColumns))
  this.displayedColumns= JSON.parse(JSON.stringify(this.orginalValues.displayedColumns))
  this.topHeaders= JSON.parse(JSON.stringify(this.orginalValues.topHeaders))

  let daysArr = []
  let daysHeaderArr = []
  for (let i = 0; i < this.DisplayDays.length; i++) {
    const day = this.DisplayDays[i];
    daysHeaderArr.push({
      id:'Day ' + day.Day,
      name:'Day ' + day.Day,
      colspan:5
    })
    daysArr.push("Day_"+day.Day+"_Shift")
    daysArr.push("Day_"+day.Day+"_In")
    daysArr.push("Day_"+day.Day+"_Out")
    daysArr.push("Day_"+day.Day+"_Duration")
    daysArr.push("Day_"+day.Day+"_Amount")
    if(!this.displayColumns["Day_"+day.Day+"_Shift"]) this.displayColumns["Day_"+day.Day+"_Shift"] = "Shift"
    if(!this.displayColumns["Day_"+day.Day+"_In"]) this.displayColumns["Day_"+day.Day+"_In"] = "In"
    if(!this.displayColumns["Day_"+day.Day+"_Out"]) this.displayColumns["Day_"+day.Day+"_Out"] = "Out"  
    if(!this.displayColumns["Day_"+day.Day+"_Duration"]) this.displayColumns["Day_"+day.Day+"_Duration"] = "Duration"
    if(!this.displayColumns["Day_"+day.Day+"_Amount"]) this.displayColumns["Day_"+day.Day+"_Amount"] = "Amount"  
  }

  this.SalaryList.forEach((emp:any) => {
    emp.DaywiseDetails.forEach((day:any) => {
      emp["Day_"+day.Day+"_Shift"] = day.Shift
      emp["Day_"+day.Day+"_In"] = day.EmployeeStartTime
      emp["Day_"+day.Day+"_Out"] = day.EmployeeEndTime
      emp["Day_"+day.Day+"_Duration"] = day.EmpDuration
      emp["Day_"+day.Day+"_Amount"] = day.ShiftAmount
      emp["Day_"+day.Day+"shiftType"] = day.ShiftType

      let temp: any = { col: "Day_" + day.Day + "shiftType", value: "Day Shift" };
      this.tableDataColors["Day_" + day.Day + "_Shift"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Shift"] || []),
        { styleClass: "greenBold", filter: [temp] },  
      ];
      this.tableDataColors["Day_" + day.Day + "_In"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_In"] || []),
        { styleClass: "greenBold", filter: [temp] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Out"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Out"] || []),
        { styleClass: "greenBold", filter: [temp] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Duration"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Duration"] || []),
        { styleClass: "greenBold", filter: [temp] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Amount"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Amount"] || []),
        { styleClass: "greenBold", filter: [temp] },
      ];



      let temp1: any = { col: "Day_" + day.Day + "shiftType", value: "Morning Shift" };
      this.tableDataColors["Day_" + day.Day + "_Shift"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Shift"] || []),
        { styleClass: "blueBold", filter: [temp1] },  
      ];
      this.tableDataColors["Day_" + day.Day + "_In"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_In"] || []),
        { styleClass: "blueBold", filter: [temp1] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Out"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Out"] || []),
        { styleClass: "blueBold", filter: [temp1] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Duration"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Duration"] || []),
        { styleClass: "blueBold", filter: [temp1] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Amount"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Amount"] || []),
        { styleClass: "blueBold", filter: [temp1] },
      ];



      let temp2: any = { col: "Day_" + day.Day + "shiftType", value: "Afternoon Shift" };
      this.tableDataColors["Day_" + day.Day + "_Shift"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Shift"] || []),
        { styleClass: "orangeBold", filter: [temp2] },  
      ];
      this.tableDataColors["Day_" + day.Day + "_In"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_In"] || []),
        { styleClass: "orangeBold", filter: [temp2] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Out"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Out"] || []),
        { styleClass: "orangeBold", filter: [temp2] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Duration"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Duration"] || []),
        { styleClass: "orangeBold", filter: [temp2] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Amount"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Amount"] || []),
        { styleClass: "orangeBold", filter: [temp2] },
      ];



      let temp3: any = { col: "Day_" + day.Day + "shiftType", value: "Evening Shift" };
      this.tableDataColors["Day_" + day.Day + "_Shift"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Shift"] || []),
        { styleClass: "purpleBold", filter: [temp3] },  
      ];
      this.tableDataColors["Day_" + day.Day + "_In"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_In"] || []),
        { styleClass: "purpleBold", filter: [temp3] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Out"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Out"] || []),
        { styleClass: "purpleBold", filter: [temp3] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Duration"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Duration"] || []),
        { styleClass: "purpleBold", filter: [temp3] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Amount"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Amount"] || []),
        { styleClass: "purpleBold", filter: [temp3] },
      ];



      let temp4: any = { col: "Day_" + day.Day + "shiftType", value: "Night Shift" };
      this.tableDataColors["Day_" + day.Day + "_Shift"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Shift"] || []),
        { styleClass: "redBold", filter: [temp4] },  
      ];
      this.tableDataColors["Day_" + day.Day + "_In"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_In"] || []),
        { styleClass: "redBold", filter: [temp4] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Out"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Out"] || []),
        { styleClass: "redBold", filter: [temp4] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Duration"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Duration"] || []),
        { styleClass: "redBold", filter: [temp4] },
      ];
      this.tableDataColors["Day_" + day.Day + "_Amount"] = [
        ...(this.tableDataColors["Day_" + day.Day + "_Amount"] || []),
        { styleClass: "redBold", filter: [temp4] },
      ];

    });
    console.log({emp});
    console.log({tableDataColors:this.tableDataColors});
  });

     
  this.displayedColumns.splice(9,0,...daysArr)
  this.topHeaders.splice(4,0,...daysHeaderArr)
}
//common table
actionEmitter(data:any){
  if(data.action.name == "View Details"){
    this.ShowShiftDetails(data.row);
  }
 if (data.action.name == "updatedSelectedRows") {
    this.updatedSelectedRows(data)
 }
}

updatedSelectedRows(data:any){
  this.selectedRows = []
  let row = data?.row
  if(row.length > 0){
    for (let i = 0; i < row.length; i++) {
      const ri = row[i];
      if(ri.IsPayslipExist == true){
        // this.globalToastService.warning("Payslip has been already approved.")
        let slIndex = this.SalaryList.findIndex((sl:any)=>sl.EmployeeID == ri.EmployeeID)
        if(slIndex != -1 ){
          this.SalaryList[slIndex]['isSelected'] = false
          console.log(this.SalaryList);
        }          
        
      }else{
        if(ri.isSelected == true) this.selectedRows.push(ri)
          console.log(this.selectedRows,"whats here...");
          
      }
    }
    // this.selectedRows = data.row;
  }

}

ShowShiftDetails(row:any){
  this.MonthlyData = row
  this.showMonthWise = true
  let branch = this.selectedBranch.map(sm=>sm.Text)[0]
  let month = this.selectedMonth.map(sm=>sm.Text)[0]
  localStorage.setItem("SRBranch",branch);
    localStorage.setItem("SREmployeeID",row.EmployeeID);
    localStorage.setItem("SRMonth",month);
    localStorage.setItem("SRYear",row.Year);
    // this._router.navigate(['Shiftreports']);
}

downloadReport(){
  let selectedColumns = this.displayedColumns
  this.commonTableChild.downloadReport(selectedColumns)
}


//ends here

backToAttendance(){
  this.showMonthWise = false
  this.ngOnInit()
}

GetCalculatedReport() {
  this.spinnerService.show();
  this.employeeLoading = true;
  if (this.selectedyear.length == 0) 
    {
    this.ShowAlert("Please Select Year","warning")
    this.spinnerService.hide();
    this.employeeLoading = undefined;
  } else if (this.selectedMonth.length == 0) {
    // this.globalToastService.warning("Please Select Month");
    this.ShowAlert("Please Select Month","warning")
    this.spinnerService.hide();
    this.employeeLoading = undefined;
  }
   else
    {
    this.spinnerService.show();
    const json = {
      Month: this.selectedMonth?.map((y: any) => y.Value)[0],
      Year: this.selectedyear?.map((y: any) => y.Text)[0],
      Employee: this.selectedEmployees?.map((se: any) => {
        return {
          EmployeeID: se.Value,
          EmployeeName: se.Text,
        };
      }),
      AdminID: this.AdminID,

    };
    this._commonservice
      .ApiUsingPost("Performance/RecalculateSalaryReport", json)
      .subscribe(
        (data) => {
          if(data.Status == true || data.status == true){
          
            // this.globalToastService.success(data.Message);
            this.ShowAlert(data.Message,"success")
            this.GetReport();
          }else{
            // this.globalToastService.error("Failed to Recalculte Salary. Please try again..");
            this.ShowAlert("Failed to Recalculte Salary. Please try again..","error")
          }
          this.spinnerService.hide();
          this.employeeLoading = false;
          this.selectedRows = []

        },
        (error) => {
          this.spinnerService.hide();
          this.employeeLoading = false;
          // this.globalToastService.error(error.message || error.Message);
          this.ShowAlert(error.message || error.Message,"error")
        }
      );
      // this.GetReport();
  }
}

    ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
      this.dialog.open(ShowalertComponent, {
        data: { message, type },
        panelClass: 'custom-dialog',
        disableClose: true  
      }).afterClosed().subscribe((res) => {
        if (res) {
          console.log("Dialog closed");
        }
      });
    }
}
