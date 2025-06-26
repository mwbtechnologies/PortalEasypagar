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
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-otreports',
  templateUrl: './otreports.component.html',
  styleUrls: ['./otreports.component.css']
})
export class OtreportsComponent {
  EmployeeList:any;
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
  OTReportList:any;
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
  temparray:any=[]; tempdeparray:any=[];
  selectedDepartment:any[]=[];
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  selectedEmployees:any[]=[];
  UserID:any;
  MonthlyParams:any
  TypeList:any[]=['DailyOt','Holiday','Week Off']
  selectedType:any
  typeSettings:IDropdownSettings = {}
    //common table
    orginalValues:any = {}
    DisplayDays: any;
    currentPage: number = 1;
    itemsPerPage: number = 1;
    showday2=false;  showday12=false;  showday22=false;  
    actionOptions:any
    displayColumns:any
    displayedColumns:any
    employeeLoading:any=undefined;
    editableColumns:any =[]
    topHeaders:any = []
    headerColors:any = []
    smallHeaders:any = []
    ReportTitles:any = {}
    selectedRows:any = []
    tableDataColors:any
    commonTableOptions :any = {}
    paginatedItems: any[] = [];
    totalPages: number = 1
    @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;

    //ends here
    selectedOrganization:any[]=[]
    OrgList:any[]=[]
    orgSettings:IDropdownSettings = {}
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,
    private _commonservice: HttpCommonService, private globalToastService:ToastrService,private _httpClient:HttpClient,private dialog:MatDialog){ 

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
    this.typeSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
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
      },
    ];
    this.orginalValues={
      displayColumns: {
        SelectAll: "SelectAll",
        "SLno":"SL No",
        "Actions":"ACTIONS",
        "MappedEmpId":"EMPLOYEE ID",
        "EmployeeName":"EMPLOYEE",
        "EmployeeWorkedHoursstring":"OVERALL WORKED HOURS",
        "TotalOTHours":"TOTAL OT HOURS",
        "TotalOTAmount":"TOTAL OT AMOUNT",
        // "OverallShiftHrs":"TOTAL",
        // "OverallEmpWorkedHrs":"WORKED",
        // "OverallExtraHrs":"EXTRA",
      },
      displayedColumns: [
         "SelectAll",
        "SLno",
        "Actions",
        "MappedEmpId",
        "EmployeeName",
        "EmployeeWorkedHoursstring",
        "TotalOTHours",
        "TotalOTAmount",
        // "OverallShiftHrs",
        // "OverallEmpWorkedHrs",
        // "OverallExtraHrs",
        // "Actions"
      ],
    topHeaders : [
      {
        id:"blank1",
        name:"",
        colspan:5
      },
      // {
      //   id:"TimeManagementStatus",
      //   name:"TIME MANAGEMENT STATUS",
      //   colspan:4
      // },
      {
        id:"Ot",
        name:"OT in HOURS",
        colspan:3
      },
      // {
      //   id:"blank3",
      //   name:"",
      //   colspan:1
      // },
    ],
    originalTableDataColors : {
    
    }
  }
  this.editableColumns = {
    SelectAll: {
      //commented by ashwini- changed logic of approve all, now each payslip should be approved manually and this checkbox is used for generating bank payslip
      filters: {IsPayslipExist:false},
    }
  }
    this.headerColors ={
      // "Day 1" : {text:"#068206",bg:"#00ff008a"},
    }

    this.displayColumns= JSON.parse(JSON.stringify(this.orginalValues.displayColumns))
    this.displayedColumns= JSON.parse(JSON.stringify(this.orginalValues.displayedColumns))
    this.topHeaders= JSON.parse(JSON.stringify(this.orginalValues.topHeaders))
    this.tableDataColors= JSON.parse(JSON.stringify(this.orginalValues.originalTableDataColors))
  }
  ngOnInit(): void {
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
     this.GetBranches()
     this.getEmployeeList()
     this.GetYearList()
     this.GetMonthList()
     this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
     const now = new Date();
     const currentMonth =  now.getMonth() + 1; 
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
  const json:any = {
    AdminID:this.AdminID
  }
  if (this.selectedBranch.length>0) {
    json["BranchID"] =  this.selectedBranch.map((br:any)=>{return br.Value})
    if (this.selectedDepartment) {
      json["DepartmentID"] =  this.tempdeparray.map((br:any)=>{ return br.id})
     }
    this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch",json).subscribe((data) => {
    this.EmployeeList = data.List
    this.selectedEmployees = [...data.List]
    }
    ,(error) => {
    console.log(error);this.spinnerService.hide();
  });
   }
 
  }
  onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.push({id:item.Value, text:item.Text });
    if(this.tempdeparray.length  == this.DepartmentList.length) this.onDeptDeSelectAll()
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
    console.log(this.tempdeparray,"tempdeparray");
    console.log(this.tempdeparray.findIndex((sd:any)=>sd == item));
    
    if(this.tempdeparray.findIndex((sd:any)=>sd == item) != -1){
      this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    }else{
      this.tempdeparray = this.DepartmentList.map((dl:any)=>{return {id:dl.Value, text:dl.Text }}).filter((dl:any)=>dl.id != item.Value && dl.text != item.Text)
    }

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

  OnYearChange(event:any){
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  onyearDeSelect(event:any){
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  OnMonthChange(event:any)
  {
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  onMonthDeSelect(event:any)
  {
    this.spinnerService.show();
    this.getEmployeeList()
    this.spinnerService.hide();
  }
  OnEmployeesChange(_event:any){
  }
  OnEmployeesChangeDeSelect(event:any){ 
  }
  ViewDetails(row:any){
   this.MonthlyParams = row
   let month = this.selectedMonth.map(sm=>sm.Text)[0]
   let branch = this.selectedBranch.map(sm=>sm.Text)[0]
   localStorage.setItem("OTMonth",month);
   localStorage.setItem("OTYear",row.Year);
   localStorage.setItem("OTBranch",branch);
   console.log(this.MonthlyParams,"inside this");
   
    this.showMonthWise = true
  }
  backToAttendance(){
    this.showMonthWise = false
    this.GetBranches()
    this.getEmployeeList()
    this.GetYearList()
    this.GetMonthList()
    this.GetDepartments()
  }
  onTypeSelect(item:any){
  }
  onTypeDeSelect(item:any){
  }
GetReport(){
   if(this.selectedyear.length==0){
    // this.globalToastService.warning("Please Select Year");
    this.ShowAlert("Please Select Year","warning")
     this.employeeLoading = false
    this.spinnerService.hide();
     }
     else if(this.selectedMonth.length==0){
      //  this.globalToastService.warning("Please Select Month");
      this.ShowAlert("Please Select Month","warning")
        this.employeeLoading = false
       this.spinnerService.hide();
     }
       else if(this.selectedBranch.length==0){
      //  this.globalToastService.warning("Please select Branch");
      this.ShowAlert("Please Select Branch","warning")
        this.employeeLoading = false
       this.spinnerService.hide();
     }
       else if(this.selectedEmployees.length==0){
      //  this.globalToastService.warning("Please select Employee");
      this.ShowAlert("Please Select Employee","warning")
        this.employeeLoading = false
       this.spinnerService.hide();
     }
    //    else if(!this.selectedType){
    //    this.globalToastService.warning("Please select OT Type");
    //     this.employeeLoading = false
    //    this.spinnerService.hide();
    //  }
      else{
       this.spinnerService.show();
       this.employeeLoading = true
       const json={
          Month:this.selectedMonth?.map((y:any) => y.Value)[0],
          Year:this.selectedyear?.map((y:any) => y.Text)[0],
          Employees:this.selectedEmployees?.map((se:any)=>{
            return {
              "id":se.ID,
            }
          }),
          // OTType:this.selectedType.toString(),
        }
       this._commonservice.ApiUsingPost("ShiftMaster/GetAllEmployeeOTReport ",json).subscribe((data) => { 
        if(data.status == true){
          this.OTReportList = data.Details.map((l: any, i: any) => { return { SLno: i + 1, ...l } });;
          this.ShowDownload = true
          this.dtTrigger.next(null);
          this.spinnerService.hide();
          this.employeeLoading = false
          this.totalPages = Math.ceil(this.OTReportList.length / this.itemsPerPage);
          this.updatePaginatedItems();
          this.DisplayDays=  data.Days;
          this.updateDayList()
        }else if(data.status == false){
          // this.globalToastService.warning(data.Message);
          this.ShowAlert(data.Message,"warning")
          this.spinnerService.hide()
          this.employeeLoading = false
        }
        else{
          // this.globalToastService.warning("An Error Occured");
          this.ShowAlert("An Error Occured","warning")
          this.spinnerService.hide()
          this.employeeLoading = false
        }
    }, (error) => {
      this.spinnerService.hide();
      this.employeeLoading = false
      // this.globalToastService.error(error.error.message);
      this.ShowAlert(error.error.message,"error")
    });
      }
 
}
updatePaginatedItems() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedItems = this.OTReportList.slice(startIndex, endIndex);
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
// updateDayList(){
//   this.displayColumns= JSON.parse(JSON.stringify(this.orginalValues.displayColumns))
//   this.displayedColumns= JSON.parse(JSON.stringify(this.orginalValues.displayedColumns))
//   this.topHeaders= JSON.parse(JSON.stringify(this.orginalValues.topHeaders))

//   let daysArr = []
//   let daysHeaderArr = []
//   for (let i = 0; i < this.DisplayDays.length; i++) {
//     const day = this.DisplayDays[i];  
//     daysHeaderArr.push({
//       id:'Day ' + day.Day,
//       name:'Day ' + day.Day,
//       colspan:5,
//     })
//     daysArr.push("Day_"+day.Day+"_startTime")
//     daysArr.push("Day_"+day.Day+"_endTime")
//     daysArr.push("Day_"+day.Day+"workHours")
//     daysArr.push("Day_"+day.Day+"otHours")
//     daysArr.push("Day_"+day.Day+"otAmount")
//     if(!this.displayColumns["Day_"+day.Day+"_startTime"]) this.displayColumns["Day_"+day.Day+"_startTime"] = "IN"
//     if(!this.displayColumns["Day_"+day.Day+"_endTime"]) this.displayColumns["Day_"+day.Day+"_endTime"] = "OUT"
//     if(!this.displayColumns["Day_"+day.Day+"workHours"]) this.displayColumns["Day_"+day.Day+"workHours"] = "DURATION"  
//     if(!this.displayColumns["Day_"+day.Day+"otHours"]) this.displayColumns["Day_"+day.Day+"otHours"] = "OT HOURS"  
//     if(!this.displayColumns["Day_"+day.Day+"otAmount"]) this.displayColumns["Day_"+day.Day+"otAmount"] = "OT AMOUNT"    
//   }

//   this.OTReportList.forEach((emp:any) => {
//     emp.DaywiseDetails.forEach((day:any) => {
//       emp["Day_"+day?.Day+"_startTime"] = day.EmployeeStartTime
//       emp["Day_"+day?.Day+"_endTime"] = day.EmployeeEndTime
//       emp["Day_"+day?.Day+"workHours"] = day.EmpDuration
//       emp["Day_"+day?.Day+"otHours"] = day.FormattedOTHours
//       emp["Day_"+day?.Day+"otAmount"] = day.OTAmount
//       emp["Day_"+day?.Day+"otType"] = day.OTType

//       let temp: any = { col: "Day_" + day.Day + "otType", value: "Daily" };

//       // Add the "Daily" condition
//       this.tableDataColors["Day_" + day.Day + "_startTime"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "_startTime"] || []),
//         { styleClass: "greenBold", filter: [temp] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "_endTime"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "_endTime"] || []),
//         { styleClass: "greenBold", filter: [temp] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "workHours"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "workHours"] || []),
//         { styleClass: "greenBold", filter: [temp] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "otHours"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "otHours"] || []),
//         { styleClass: "greenBold", filter: [temp] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "otAmount"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "otAmount"] || []),
//         { styleClass: "greenBold", filter: [temp] },
//       ];
      
//       // Add the "Holiday" condition
//       let temp1 = { col: "Day_" + day.Day + "otType", value: "Holiday" };
      
//       this.tableDataColors["Day_" + day.Day + "_startTime"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "_startTime"] || []),
//         { styleClass: "blueBold", filter: [temp1] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "_endTime"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "_endTime"] || []),
//         { styleClass: "blueBold", filter: [temp1] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "workHours"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "workHours"] || []),
//         { styleClass: "blueBold", filter: [temp1] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "otHours"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "otHours"] || []),
//         { styleClass: "blueBold", filter: [temp1] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "otAmount"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "otAmount"] || []),
//         { styleClass: "blueBold", filter: [temp1] },
//       ];
      
//      let temp2= {col:"Day_" + day.Day + "otType",value: "WeekOff"};
//       this.tableDataColors["Day_" + day.Day + "_startTime"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "_startTime"] || []),
//         { styleClass: "orangeBold", filter: [temp2] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "_endTime"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "_endTime"] || []),
//         { styleClass: "orangeBold", filter: [temp2] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "workHours"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "workHours"] || []),
//         { styleClass: "orangeBold", filter: [temp2] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "otHours"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "otHours"] || []),
//         { styleClass: "orangeBold", filter: [temp2] },
//       ];
//       this.tableDataColors["Day_" + day.Day + "otAmount"] = [
//         ...(this.tableDataColors["Day_" + day.Day + "otAmount"] || []),
//         { styleClass: "orangeBold", filter: [temp2] },
//       ];
//       // this.tableDataColors["Day_"+day.Day+"_startTime"] = [{ styleClass: "orangeBold", filter: [temp] },]
//       // this.tableDataColors["Day_"+day.Day+"_endTime"] = [{ styleClass: "orangeBold", filter: [temp] },]
//       // this.tableDataColors["Day_"+day.Day+"workHours"] = [{ styleClass: "orangeBold", filter: [temp] },]
//       // this.tableDataColors["Day_"+day.Day+"otHours"] = [{ styleClass: "orangeBold", filter: [temp] },]
//       // this.tableDataColors["Day_"+day.Day+"otAmount"] = [{ styleClass: "orangeBold", filter: [temp] },]
    
//     });
//     console.log({emp});
//     console.log({tableDataColors:this.tableDataColors});
//   });

  
  


//   this.displayedColumns.splice(10,0,...daysArr)
//   this.topHeaders.splice(3,0,...daysHeaderArr)
// }

 //common table

 updateDayList() {
  this.displayColumns = JSON.parse(JSON.stringify(this.orginalValues.displayColumns));
  this.displayedColumns = JSON.parse(JSON.stringify(this.orginalValues.displayedColumns));
  this.topHeaders = JSON.parse(JSON.stringify(this.orginalValues.topHeaders));

  let daysArr:any = [];
  let daysHeaderArr = [];

  // Remove previously added dynamic columns to avoid duplicates
  this.displayedColumns = this.displayedColumns.filter((col:any) => !col.startsWith("Day_"));
  this.topHeaders = this.topHeaders.filter((header:any) => !header.id?.startsWith("Day "));

  for (let i = 0; i < this.DisplayDays.length; i++) {
    const day = this.DisplayDays[i];

    if (!daysArr.includes(`Day_${day.Day}_startTime`)) {
      daysHeaderArr.push({ id: `Day ${day.Day}`, name: `Day ${day.Day}`, colspan: 5 });
      daysArr.push(
        `Day_${day.Day}_startTime`, `Day_${day.Day}_endTime`, `Day_${day.Day}workHours`, 
        `Day_${day.Day}otHours`, `Day_${day.Day}otAmount`
      );

      this.displayColumns[`Day_${day.Day}_startTime`] ||= "IN";
      this.displayColumns[`Day_${day.Day}_endTime`] ||= "OUT";
      this.displayColumns[`Day_${day.Day}workHours`] ||= "DURATION";
      this.displayColumns[`Day_${day.Day}otHours`] ||= "OT HOURS";
      this.displayColumns[`Day_${day.Day}otAmount`] ||= "OT AMOUNT";
    }
  }

  this.OTReportList.forEach((emp:any) => {
    emp.DaywiseDetails.forEach((day:any) => {
      const dayKey = `Day_${day?.Day}`;
      emp[`${dayKey}_startTime`] = day.EmployeeStartTime;
      emp[`${dayKey}_endTime`] = day.EmployeeEndTime;
      emp[`${dayKey}workHours`] = day.EmpDuration;
      emp[`${dayKey}otHours`] = day.FormattedOTHours;
      emp[`${dayKey}otAmount`] = day.OTAmount;
      emp[`${dayKey}otType`] = day.OTType;

      const applyStyle = (column:any, styleClass:any, condition:any) => {
        this.tableDataColors[column] = [
          ...(this.tableDataColors[column] || []).filter((f:any) => f.filter[0].value !== condition.value),
          { styleClass, filter: [condition] }
        ];
      };

      applyStyle(`${dayKey}_startTime`, "greenBold", { col: `${dayKey}otType`, value: "Daily" });
      applyStyle(`${dayKey}_endTime`, "greenBold", { col: `${dayKey}otType`, value: "Daily" });
      applyStyle(`${dayKey}workHours`, "greenBold", { col: `${dayKey}otType`, value: "Daily" });
      applyStyle(`${dayKey}otHours`, "greenBold", { col: `${dayKey}otType`, value: "Daily" });
      applyStyle(`${dayKey}otAmount`, "greenBold", { col: `${dayKey}otType`, value: "Daily" });

      applyStyle(`${dayKey}_startTime`, "blueBold", { col: `${dayKey}otType`, value: "Holiday" });
      applyStyle(`${dayKey}_endTime`, "blueBold", { col: `${dayKey}otType`, value: "Holiday" });
      applyStyle(`${dayKey}workHours`, "blueBold", { col: `${dayKey}otType`, value: "Holiday" });
      applyStyle(`${dayKey}otHours`, "blueBold", { col: `${dayKey}otType`, value: "Holiday" });
      applyStyle(`${dayKey}otAmount`, "blueBold", { col: `${dayKey}otType`, value: "Holiday" });

      applyStyle(`${dayKey}_startTime`, "orangeBold", { col: `${dayKey}otType`, value: "WeekOff" });
      applyStyle(`${dayKey}_endTime`, "orangeBold", { col: `${dayKey}otType`, value: "WeekOff" });
      applyStyle(`${dayKey}workHours`, "orangeBold", { col: `${dayKey}otType`, value: "WeekOff" });
      applyStyle(`${dayKey}otHours`, "orangeBold", { col: `${dayKey}otType`, value: "WeekOff" });
      applyStyle(`${dayKey}otAmount`, "orangeBold", { col: `${dayKey}otType`, value: "WeekOff" });
    });
  });

  this.displayedColumns.splice(10, 0, ...daysArr);
  this.topHeaders.splice(3, 0, ...daysHeaderArr);
}

 actionEmitter(data:any){
  if(data.action.name == "View"){
    this.ViewDetails(data.row);
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
        let slIndex = this.OTReportList.findIndex((sl:any)=>sl.EmployeeID == ri.EmployeeID)
        if(slIndex != -1 ){
          this.OTReportList[slIndex]['isSelected'] = false
          console.log(this.OTReportList);
        }          
        
      }else{
        if(ri.isSelected == true) this.selectedRows.push(ri)
          console.log(this.selectedRows,"whats here...");
          
      }
    }
    // this.selectedRows = data.row;
  }

}
downloadReport() {
  let selectedColumns = this.displayedColumns
  this.commonTableChild.downloadReport(selectedColumns)
}

backToDashboard()
{
  this._router.navigate(["appdashboard"]);
}
GetCalculatedReport() {
  this.spinnerService.show();
  this.employeeLoading = true;
  if (this.selectedyear.length == 0) {
    // this.globalToastService.warning("Please Select Year");
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
          EmployeeID: se.ID,
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
//ends here
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

