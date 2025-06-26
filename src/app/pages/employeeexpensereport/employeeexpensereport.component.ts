import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../common-table/common-table.component';

@Component({
  selector: 'app-employeeexpensereport',
  templateUrl: './employeeexpensereport.component.html',
  styleUrls: ['./employeeexpensereport.component.css']
})
export class EmployeeexpensereportComponent {
  AdminID:any
  UserId:any
  ExpenseList:any[]=[]
  PDFlist:any[]=[]
  YearList:any
  MonthList:any
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  yearSettings :IDropdownSettings = {}
  selectedyear:any[]=[]
  monthSettings :IDropdownSettings = {}
  selectedMonth:any[]=[]
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
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService){ 

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
      // {
      //   name: "View",
      //   icon: "fa fa-eye",
      // }
    ];

    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"SL No",
      "Date":"DATE",
      "DNSAmount":"DNS AMOUNT",
      "LocalAmount":"LOCAL AMOUNT",
      "TravelAmount":"TRAVEL AMOUNT",
      "LodgeAmount":"LODGE AMOUNT",
      "TotalAmount":"TOTAL AMOUNT",
    },


    this.displayedColumns= [
      "SLno",
      "Date",
      "DNSAmount",
      "LocalAmount",
      "TravelAmount",
      "LodgeAmount",
      "TotalAmount",
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
       this.getEmpExpense()
       this.getYearList()
       this.getMonthList()
  }
  
  back(){
    this._router.navigate(['/mydashboard']);
  }

  getYearList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
      console.log(error);
   });
  }
  getMonthList(){
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => this.MonthList = data.List, (error) => {
      console.log(error);
   });
  }
  OnYearChange(item:any){
    this.getEmpExpense()
  }
onyearDeSelect(item:any){
  this.getEmpExpense()
}
OnMonthChange(item:any){
  this.getEmpExpense()
}
onMonthDeSelect(item:any){
  this.getEmpExpense()
}


  getEmpExpense(){
    this.employeeLoading = true
    const now = new Date(); 
    const currentYear = now.getFullYear();
    let Month = this.selectedMonth?.map((y:any) => y.Value)[0] || 0
    let Year = this.selectedyear?.map((y:any) => y.Text)[0] || currentYear
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetDailyExpenseReport?EmployeeID="+this.UserId+"&Year="+Year+"&Month="+Month+"").subscribe((data:any)=>{
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();
      this.ExpenseList = data.ExpenseList[0].Expenses.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
      this.PDFlist = data.ExpenseList
      this.employeeLoading = false
      this.dtTrigger.next(null);
    },(error)=>{
      this.globalToastService.error(error.Message)
      this.employeeLoading = false
    })
  }
  ExportPDF(){
    const json = {
      "AttendanceList":this.PDFlist
    }
    this._commonservice.ApiUsingPostNew("ReportsNew/GetEmployeeExpenseReport",json,{ responseType: 'text' }).subscribe((res:any) =>{
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
          // this.viewHistory(data.row);
        }
        
      }
      
      //ends here
}
