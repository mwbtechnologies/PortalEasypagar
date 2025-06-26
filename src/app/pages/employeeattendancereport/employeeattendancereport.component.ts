import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowdetailComponent } from './showdetail/showdetail.component';
import { MatDialog } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../common-table/common-table.component';

@Component({
  selector: 'app-employeeattendancereport',
  templateUrl: './employeeattendancereport.component.html',
  styleUrls: ['./employeeattendancereport.component.css']
})
export class EmployeeattendancereportComponent {
  AdminID:any
  UserId:any
  AttendanceList:any[]=[]
  AttendanceDetails:any[]=[]
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  showList:boolean=true
  showDetails:boolean=false
  dtTrigger: Subject<any> = new Subject();
  YearSettings:IDropdownSettings = {}
  selectedYear:any
  yearList:any[]=[]
      //common table
      actionOptions:any
      displayColumns:any
      displayedColumns:any
      employeeLoading:any;
      editableColumns:any =[]
      topHeaders:any = []
      headerColors:any = []
      smallHeaders:any = []
      ReportTitles:any = {}
      selectedRows:any = []
      commonTableOptions :any = {}
      @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
      //ends here
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService,private dialog: MatDialog){ 
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };  this.dtOptions = {
      pagingType: 'full_numbers',
       pageLength: 10 };
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
      "Month":"MONTH",
      "WorkingDays":"WORKING DAYS",
      "PresentDays":"PRESENT",
      "EmployeeLeaves":"ABSENT",
      "Efficiency":"EFFICIENCY",
      "Actions":"ACTONS"
    },


    this.displayedColumns= [
      "SLno",
      "Month",
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
    this.AdminID = localStorage.getItem("AdminID");
    this.UserId = localStorage.getItem("UserID");

    this.YearSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.yearList = data.List, (error) => {
      console.log(error);
    });
    const now = new Date();
    const currentMonth = now.getMonth()+1; 
    const currentYear = now.getFullYear();
    this.selectedYear = [{
      "Value": currentYear,
      "CreatedByID": null,
      "Text": currentYear.toString(),
      "createdbyname": null,
      "Key": null
     }]
       this.getEmpAttendance()
  }
  onyearselectChange(item:any){
    this.getEmpAttendance()
    console.log(item,"dsdsdsdsdsdsds");
    
  }
  onyeardeselectChange(item:any){

  }
  back(){
    this._router.navigate(['/mydashboard']);
  }

  getEmpAttendance(){
    this.employeeLoading = true
    this.spinnerService.show()
    const now = new Date();
    const currentMonth = now.getMonth()+1; 
    const currentYear = now.getFullYear();
    const year = this.selectedYear?.map((y:any)=>y.Value) || currentYear
    const json = {
      "AdminID":parseInt(this.AdminID),
      "Employee":[{
        "EmployeeID":parseInt(this.UserId),
        "EmployeeName":""
      }],
      "Month":0,
      "Year":parseInt(year)
    }
    console.log(json,"sdsdsdsd");
    
    this._commonservice.ApiUsingPost("Admin/GetEmployeeAttendanceList",json).subscribe((data:any)=>{
      this.employeeLoading = true
      this.spinnerService.show()
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();
      this.AttendanceList = data.Attendance.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
      this.dtTrigger.next(null);
      this.employeeLoading = false
      this.spinnerService.hide()
    },(error)=>{
      this.globalToastService.error(error.message);
      this.employeeLoading = false
      this.spinnerService.hide()
    })
  }
  BacktoAttendance(){
    this.showList = true
    this.showDetails = false
  }

  viewAttendance(row:any){
   this.showList = false
   this.showDetails = true
   this.spinnerService.show()
   this._commonservice.ApiUsingGetWithOneParam("SalaryCalculation/GetAttendance?UserID="+this.UserId+"&Month="+row.MonthID+"&Year="+parseInt(row.Year)+"&comments=&all=yes&checkin=&checkout=&Early").subscribe((data:any)=>{
    var table = $('#DataTables_Table_0').DataTable();
    table.destroy();
    this.AttendanceDetails = data.List
    this.spinnerService.hide()
    this.dtTrigger.next(null);
   })
  }
  showDailog(IL:any){
    this.dialog.open(ShowdetailComponent,{
      data: { IL }
    })
  }
  exportpdf(){
    const json = {
      "AttendanceList":this.AttendanceDetails
    }
    console.log(json,"attendanceDetails");
    
    this._commonservice.ApiUsingPostNew("ReportsNew/GetEmployeeMonthlyReport",json,{ responseType: 'text' }).subscribe((res:any)=>{
      if(res){
         window.open(res,'_blank')
      }
     else{
      this.globalToastService.error("Something went wrong");
     }
    },(error)=>{
      this.globalToastService.error(error.message);
    })
  }
  Exportpdf(){
    const json = {
      "AttendanceList":this.AttendanceList
    }
    this._commonservice.ApiUsingPostNew("ReportsNew/GetEmpAttendanceReport",json,{ responseType: 'text' }).subscribe((res:any)=>{
      if(res){
        window.open(res,'_blank')
     }
    else{
     this.globalToastService.error("Something went wrong");
    }
    },(error)=>{
      this.globalToastService.error(error.message);
    })
  }

   //common table
   actionEmitter(data:any){
    if(data.action.name == "View"){
      this.viewAttendance(data.row);
    }
    
  }
  
  //ends here

}
