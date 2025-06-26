import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowpayslipComponent } from './showpayslip/showpayslip.component';
import { CommonTableComponent } from '../common-table/common-table.component';

@Component({
  selector: 'app-employeesalaryreport',
  templateUrl: './employeesalaryreport.component.html',
  styleUrls: ['./employeesalaryreport.component.css']
})
export class EmployeesalaryreportComponent {
  AdminID:any
  UserId:any
  SalaryList:any[]=[]
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
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
      "BasicSalary":"PAYABLE",
      "TotalDeduction":"DEDUCTED",
      "NetSalary":"NET",
      "PaymentStatus":"STATUS",
      "Actions":"ACTONS"
    },


    this.displayedColumns= [
      "SLno",
      "Month",
      "BasicSalary",
      "TotalDeduction",
      "NetSalary",
      "PaymentStatus",
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

       this.getEmpSalaryAttendance()
  }
  back(){
    this._router.navigate(['/mydashboard']);
  }

  getEmpSalaryAttendance(){
    const now = new Date(); 
    const currentYear = now.getFullYear();
    this.employeeLoading = true
    this.spinnerService.show()
    const json = {
      "AdminID":parseInt(this.AdminID),
      "Employee":[{
        "EmployeeID":parseInt(this.UserId),
        "EmployeeName":""
      }],
      "Month":0,
      "Year":currentYear
    }

    this._commonservice.ApiUsingPost("Admin/GetEmployeeAttendanceList",json).subscribe((data:any)=>{
      this.employeeLoading = true
      this.spinnerService.show()
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();
      this.SalaryList = data.Attendance.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
      this.employeeLoading = false
      this.spinnerService.hide();
      this.dtTrigger.next(null);
    }, (error) => {
        this.spinnerService.hide();
        this.globalToastService.error(error.message);
        this.employeeLoading = false
      });
  }
  viewPayslip(IL:any){
    this.dialog.open(ShowpayslipComponent,{
      data: { IL }
    })
  }

  ExportPDF(){
    const json = {
      "AttendanceList":this.SalaryList
    }
    this._commonservice.ApiUsingPostNew("ReportsNew/GetEmpSalaryReport",json,{ responseType: 'text' }).subscribe((res:any)=>{
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
      this.viewPayslip(data.row);
    }
    
  }
  
  //ends here
}
