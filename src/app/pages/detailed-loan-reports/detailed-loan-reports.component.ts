import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-detailed-loan-reports',
  templateUrl: './detailed-loan-reports.component.html',
  styleUrls: ['./detailed-loan-reports.component.css']
})
export class DetailedLoanReportsComponent implements AfterViewInit, OnInit {
 YearList:any;MonthList:any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  file:any;
  EmployeeId:any;
  selectedYearId: string[] | any;
  selectedMonthId: string[] | any;
  OrgID:any;
  LoanList:any;
  NewApiURL:any;
  index=0;
  Year:any;
  Month:any;
  pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  selectedBranch:any
  EmployeeList:any[]=[]
  selectedEmployees:any[]=[]
  selectedyear:any[]=[]
  yearSettings:IDropdownSettings = {}
   employeeSettings:IDropdownSettings = {}
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
  dataTable: any;
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
  constructor(public dialog: MatDialog,private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService){ 
    this.isSubmit=false
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
      "MappedEmpId":"EMPLOYEE ID",
      "EmployeeName":"EMPLOYEE NAME",
      "LoanIssuedDate":"LOAN/ADVANCE ISSUED ON",
      "LoanType":"TYPE",
      "ApprovedAmount":"LOAN TAKEN",
      "TotalDeduction":"DEDUCTION",
      "Balance":"BALANCE",
      "Actions":"ACTIONS"
    },


    this.displayedColumns= [
      "SLno",
      "MappedEmpId",
      "EmployeeName",
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
    this.OrgID = localStorage.getItem("OrgID");
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
    }
    this.yearSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.employeeSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.getEmpList()
    this.getYearList()
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
    
  } 
  ngAfterViewInit() {
    this.dtTrigger.subscribe(() => {
        this.initializeDataTable();
    });
}

initializeDataTable() {
    if (this.dataTable) {
        this.dataTable.destroy();
    }
    this.dataTable = $('#DataTables_Table_0').DataTable({
    paging: true,   
    searching: true,   
    info: true,   
    ordering: true  
    });
}

ngOnDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy();
     }
    this.dtTrigger.unsubscribe();
}
  getEmpList(){
    let branch = localStorage.getItem("Branch") || 0
    const storedEmployee = localStorage.getItem('Employee');
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+branch+"&DeptId=0&Year=0&Month="+0+"&Key=en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.EmployeeList = data.data;
        if (storedEmployee) {
          const selectedEmployee = this.EmployeeList.find(emp => emp.Text === storedEmployee);
          if (selectedEmployee) {
            setTimeout(() => {
              this.selectedEmployees = [selectedEmployee];
              this.GetReport();
            },1000);
          }
        }
    }
      ,(error) => {
       console.log(error);this.spinnerService.hide();
    });
  
  }
  getYearList(){
     const storedyear = localStorage.getItem("Year");
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => {
      this.YearList = data.List
      if (storedyear) {
        const selectedyear = this.YearList.find((yr:any) => yr.Text === storedyear);
        if (selectedyear) {
          // setTimeout(() => {
            this.selectedyear = [selectedyear];
            // this.GetReport();
          // },1000);
        }
      }
    }, (error) => {
      console.log(error);
   });
  }


  OnYearChange(event:any){
    this.spinnerService.show();
    let branch = localStorage.getItem("Branch")
    this.EmployeeList = []
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+branch+"&DeptId="+0+"&Year="+event.Value+"&Month="+0+"&Key=en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.EmployeeList = data.data
      // this.GetReport()
    }
 
    , (error) => {
       console.log(error);this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }
  onyearDeSelect(event:any){
    this.spinnerService.show();
    this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+0+"&Year="+event.Value+"&Month="+0+"&Key=en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
       console.log(error);this.spinnerService.hide();
    });
    this.spinnerService.hide();
    // this.GetReport();
  }
  OnEmployeesChange(_event:any){
    // this.GetReport()
  }
  OnEmployeesChangeDeSelect(event:any){ 
    // this.GetReport()
  }
  GetReport(){ 
    if(this.selectedyear.length==0)
      {
        // this.globalToastService.warning("Please Select Year");
        this.ShowToast("Please Select Year","warning")
        this.spinnerService.hide();
        this.employeeLoading = false
      }
    else if(this.selectedEmployees.length==0)
     {
    // this.globalToastService.warning("Please select Employee");
    this.ShowToast("Please Select Employee","warning")
    this.spinnerService.hide();
    this.employeeLoading = false
  }
else{
    this.employeeLoading = true
  let month = localStorage.getItem('Month')
  let Year = this.selectedyear?.map((y:any) => y.Text)[0]
  let Employee = this.selectedEmployees?.map((se:any)=>se.Value)
    this.ApiURL="Admin/GetDetailedLoanReportList?EmployeeID="+Employee+"&Month="+month+"&Year="+Year+"&LoanType=All"
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      if(data.data.length > 0) {
        this.LoanList = data.data.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
        this.employeeLoading = false
      }
      else {
        // this.globalToastService.warning("No Data Found");
        this.ShowToast("No Data Found","warning")
      }
    }, (error) => {
      // this.globalToastService.warning(error.message); 
      this.ShowToast(error.message,"warning")
      console.log(error);this.spinnerService.hide();
    });
    this.spinnerService.hide();
    this.employeeLoading = false
  }
 
  }
  ViewDetails(row:any){
  this.dialog.open(LoandataPopup, {
    data: {row},
  })

}

log(l:any){
  console.log(l);
  
}
  
  GetReportInPDF()
{
  if(this.LoanList.length>0)
  {
    this.ApiURL="PortalReports/GetSharableLoanslistReport";
    this._commonservice.ApiUsingPost(this.ApiURL,this.LoanList).subscribe((res:any) => {
      if(res.Status==true)
      {
       this.pdfSrc = res.URL;
       window.open(res.URL,"_blank");
      }
      else{
        // this.globalToastService.warning("Sorry Failed to Generate");
        this.ShowToast("Sorry Failed to Generate","warning")
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });
  }
  else{
    this.spinnerService.hide();
    // this.globalToastService.warning("No Records Found")
         this.ShowToast("No Records Found","warning");
  }


  }

   //common table
 actionEmitter(data:any){
  if(data.action.name == "View"){
    this.ViewDetails(data.row);
  }
  
}

//ends here

  ShowToast(message: string, type: 'success' | 'warning' | 'error'): void {
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

  @Component({
    selector: 'loandata-popup',
    templateUrl: 'loandata-popup.html',
  })
  export class LoandataPopup {
    // @Output()
    UserInput : any = "ABCD";
    constructor(
      public dialogRef: MatDialogRef<LoandataPopup>,
      @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,
    ) {
      
    }

  }
