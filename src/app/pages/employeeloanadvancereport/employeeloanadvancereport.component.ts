import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { HistoryComponent } from './history/history.component';
import { CommonTableComponent } from '../common-table/common-table.component';

@Component({
  selector: 'app-employeeloanadvancereport',
  templateUrl: './employeeloanadvancereport.component.html',
  styleUrls: ['./employeeloanadvancereport.component.css']
})
export class EmployeeloanadvancereportComponent {
  AdminID:any
  UserId:any
  LoanAdvanceList:any[]=[]
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  YearSettings:IDropdownSettings = {}
  TypeSettings:IDropdownSettings = {}
  selectedYear:any[]=[]
  
  YearList:any[]=[]
  selectedType:any
  typeList:any[]=['All','Loan','Advance']

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
  constructor(private dialog:MatDialog,private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService){ 
    
    this.YearSettings = {
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
      "LoanIssuedDate":"DATE",
      "LoanType":"TYPE",
      "ApprovedAmount":"AMOUNT",
      "TotalDeduction":"DEDUCTED",
      "Balance":"BALANCE",
      "Actions":"ACTONS"
    },


    this.displayedColumns= [
      "SLno",
      "LoanIssuedDate",
      "LoanType",
      "ApprovedAmount",
      "TotalDeduction",
      "Balance",
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
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
      console.log(error);
    });
    const now = new Date(); 
    const currentYear = now.getFullYear();
    this.selectedYear = [{
        "Value": currentYear,
        "CreatedByID": null,
        "Text": currentYear.toString(),
        "createdbyname": null,
        "Key": null
    }]
    this.getEmpLoanAdvanceAttendance()
  }
  ontypeselectChange(item:any){
    this.getEmpLoanAdvanceAttendance()
  }
  ontypedeselectChange(item:any){
    this.selectedType = ['All']
    this.getEmpLoanAdvanceAttendance()
  }
  onyearselectChange(item:any){
    this.getEmpLoanAdvanceAttendance()
  }
  onyeardeselectChange(item:any){
    const now = new Date(); 
    const currentYear = now.getFullYear();
    this.selectedYear = [currentYear]
    this.getEmpLoanAdvanceAttendance()
  }

  back(){
    this._router.navigate(['/mydashboard']);
  }

  getEmpLoanAdvanceAttendance(){
    const now = new Date(); 
    const currentYear = now.getFullYear();
    this.employeeLoading = true
      const year = this.selectedYear?.map((y:any)=>y.Value) || currentYear
      const type = this.selectedType?.map((t:any)=>t) || 'All'
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetDetailedLoanReportList?EmployeeID="+this.UserId+"&Month=0&Year="+year+"&LoanType="+type+"").subscribe((data:any)=>{
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();
      this.LoanAdvanceList = data.data.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
      this.employeeLoading = false
      this.dtTrigger.next(null);
    },(error)=>{
      this.globalToastService.error(error.Message)
      this.employeeLoading = false
    })
  }

  viewHistory(row:any){
    this.dialog.open(HistoryComponent,{
      data: { row ,year:this.selectedYear?.map((y:any)=>y.Value)}
    })
  }

  ExportPDF(){
    const now = new Date(); 
    const currentYear = now.getFullYear();
      const year = this.selectedYear?.map((y:any)=>y.Value) || currentYear
      const type = this.selectedType?.map((t:any)=>t) || 'All'
    this._commonservice.ApiUsingGetNew("ReportsNew/GetLoanLedgerReport?EmployeeID="+this.UserId+"&Year="+year+"&LoanID=0&Month=0&LoanType="+type+"",{ responseType: 'text' }).subscribe((res:any)=>{
      if(res){
        window.open(res,'_blank')
     }
    else{
     this.globalToastService.error("Something went wrong");
    }
    },(error)=>{
      this.globalToastService.error(error.Message)
    })
  }

     //common table
     actionEmitter(data:any){
      if(data.action.name == "View"){
        this.viewHistory(data.row);
      }
      
    }
    
    //ends here
  }

