import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-monthly-expense-report',
  templateUrl: './monthly-expense-report.component.html',
  styleUrls: ['./monthly-expense-report.component.css']
})
export class MonthlyExpenseReportComponent  implements OnInit  {
  BranchList:any;
  DepartmentList:any; YearList:any;MonthList:any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  file:any;
  EmployeeId:any;
  Reports:any
  datepdflist:any[]=[]
  selectedDepartmentIds: string[] | any;
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  selectedMonthId: string[] | any;
  OrgID:any;
  DateWiseExpenseList:any[]=[];
  EmpWiseExpenseList:any;
  NewApiURL:any;
  index=0;
  Month:any;Year:any;
  pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  monthSettings :IDropdownSettings = {}
  yearSettings :IDropdownSettings = {}
  ETypeSettings:IDropdownSettings = {}
  temparray:any=[]; tempdeparray:any=[];
  selectedDepartment:any[]=[];
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  selectedBranch:any[]=[];  
  selectedEType:any;  
  ETypeList:any[]=['Date Wise','Employee Wise']
  isDateWise :boolean = true
  isEmpWise :boolean = false
  UserID:any

  datewiseReportInPDF = false
  datewiseReportInExcel = false
  employeewiseReportInPDF = false
  employeewiseReportInExcel = false

  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService,private dialog:MatDialog){
     this.isSubmit=false}
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
    this.ETypeSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.GetBranches()
    // this.GetDepartments();
    const storedyear = localStorage.getItem("ExpenseYear");
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => {
      this.YearList = data.List
      if (storedyear) {
        const selectedyear = this.YearList.find((yr:any) => yr.Text === storedyear);
        if (selectedyear) {
          this.selectedyear = [selectedyear];
          setTimeout(() => {
            this.GetReport()
          },1000);
        }
      }
    }, (error) => {
       console.log(error);
    });
this.GetMonthList()
  this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
  this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
  this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
  this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
  // this.GetReport()
  // this.selectedEType = 'Date Wise';
  // this.datewiseReportInPDF = true;this.datewiseReportInExcel=true;
  }


  OnETypeChange(item:any){
    if (item === 'Date Wise'){
      this.isDateWise = true;
      this.isEmpWise = false
      this.GetReport()
    }
    if(item === 'Employee Wise'){
      this.isEmpWise = true
      this.isDateWise = false;
      this.GetExpenseDayWiseList()
    }
  }
  onETypeDeSelect(item:any){
    if (item === 'Date Wise'){
      this.isDateWise = false;
      this.isEmpWise = true
      this.GetReport()
    }
    if(item === 'Employee Wise'){
      this.isEmpWise = false
      this.isDateWise = true;
      this.GetExpenseDayWiseList()
    }
  }

  
  
  GetBranches() {
    const storedbranch = localStorage.getItem("ExpenseBranch");
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetBranchList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID).subscribe((data) => {
      this.BranchList = data.List;
      if (storedbranch) {
        const selectedbranch = this.BranchList.find((yr:any) => yr.Text === storedbranch);
        if (selectedbranch) {
            this.selectedBranch = [selectedbranch];
            this.GetDepartments()
            setTimeout(() => {
            this.GetReport()
          },1000);
        }
      }
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowToast(error,"error")
       console.log(error);
    });

  }
  GetMonthList(){
      const storedmonth = localStorage.getItem("MonthWise");
      this._commonservice.ApiUsingGetWithOneParam("Admin/GetMonthList").subscribe((data) => {
        this.MonthList = data.List
        if (storedmonth) {
        const selectedmonth = this.MonthList.find((yr:any) => yr.Text === storedmonth);
        if (selectedmonth) {
          this.selectedMonth = [selectedmonth];
          setTimeout(() => {
            this.GetReport()
          },1000);
        }
      }
      }, (error) => {
      console.log(error);
      });
  }


  GetDepartments() {
    this.selectedDepartment=[];
    const storeddepartment = localStorage.getItem("ExpenseDepartment");
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
        if (storeddepartment) {
          const selecteddepartment = this.DepartmentList.find((yr:any) => yr.Text === storeddepartment);
          if (selecteddepartment) {
              this.selectedDepartment = [selecteddepartment];
              setTimeout(() => {
                this.GetReport()
              },1000);
          }
        }
        console.log(this.DepartmentList,"department list");
      }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowToast(error,"error")
       console.log(error);
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
    this.selectedDepartment = []
    this.GetDepartments();
  }
  onBranchDeSelect(item:any){
   console.log(item,"item");
   this.temparray.splice(this.temparray.indexOf(item), 1);
   this.DepartmentList = []
   this.selectedDepartment = []
     this.GetDepartments();
  }

  OnYearChange(event:any){

  }
  onyearDeSelect(event:any){

  }
  OnMonthChange(event:any)
  {

  }
  onMonthDeSelect(event:any)
  {
   
  }
  ViewDetails(Date:any)
  {
    localStorage.setItem("Date",Date);
    localStorage.setItem("AdminID",this.AdminID);
    this._router.navigate(['DaywiseEmpExpenses']);
  }
  GetReport() {
    if(this.selectedBranch.length==0){
      // this.globalToastService.warning("Please select Branch");
      this.ShowToast("Please select Branch","warning")
      this.spinnerService.hide();
    }
     else if(this.selectedMonth.length==0){
      //  this.globalToastService.warning("Please Select Month");
      this.ShowToast("Please select Month","warning")
       this.spinnerService.hide();
     }
     else if(this.selectedyear.length==0){
      //  this.globalToastService.warning("Please Select Year");
      this.ShowToast("Please select Year","warning")
       this.spinnerService.hide();
     }
     else{
    this.GetExpenseList();
     }

  }
  GetExpenseList(){
    const now = new Date(); 
    const currentYear = now.getFullYear();
    let Month = this.selectedMonth?.map((y:any) => y.Value)[0]
    let Year = this.selectedyear?.map((y:any) => y.Text)[0] || currentYear
    let Branch = this.selectedBranch?.map((y:any) => y.Value)[0] || 0
    let Dept = this.selectedDepartment?.map((y:any) => y.Value)[0] || 0
    const json={
      Month:Month,
      BranchID:Branch,
      DepartmentID:Dept,
      Year:Year,
      Employee:[],
      AdminID:this.AdminID
    }
  this._commonservice.ApiUsingPost("Admin/GetAdminDailyExpenseReport",json).subscribe((res:any) => {
        var table = $('#DataTables_Table_0').DataTable();
        table.destroy();
        if(res.ExpenseList[0]?.Expenses?.length > 0){
        this.DateWiseExpenseList = res.ExpenseList[0].Expenses;
        console.log(this.DateWiseExpenseList,"listing");
        
        this.Reports = this.DateWiseExpenseList
        this.datepdflist = res.ExpenseList
        this.datewiseReportInExcel = true
        this.datewiseReportInPDF = true
        
      }
      else{
          this.datewiseReportInExcel = false
          this.datewiseReportInPDF = false
          // this.globalToastService.error("No Data Found For Day Wise");
          this.ShowToast("No Data Found For Day Wise","error")
        }
        this.dtTrigger.next(null)
        ;this.spinnerService.hide();
      }, (error) => {
        // this.globalToastService.error(error.message);
        this.ShowToast(error.message,"error")
        this.spinnerService.hide();
      });
    
}
  GetExpenseDayWiseList(){
    const now = new Date(); 
    const currentYear = now.getFullYear();
    let Month = this.selectedMonth?.map((y:any) => y.Value)[0]
    let Year = this.selectedyear?.map((y:any) => y.Text)[0] || currentYear
    let Branch = this.selectedBranch?.map((y:any) => y.Value)[0] || 0
    let Dept = this.selectedDepartment?.map((y:any) => y.Value)[0] || 0
    const json={
      Month:Month,
      BranchID:Branch,
      DepartmentID:Dept,
      Year:Year,
      Employee:[],
      AdminID:this.AdminID
    }
      this._commonservice.ApiUsingPost("Admin/GetExpenseReport",json).subscribe((res:any) => {
        if(res.ExpenseList.length > 0){
          this.EmpWiseExpenseList = res.ExpenseList;
          this.Reports = this.EmpWiseExpenseList
          this.employeewiseReportInExcel = true
          this.employeewiseReportInPDF = true
        }
        else{
          this.employeewiseReportInExcel = false
          this.employeewiseReportInPDF = false
          // this.globalToastService.error("No Data Found For Employee Wise");
          this.ShowToast("No Data Found For Employee Wise","error")
        }
        this.dtTrigger.next(null)
        ;this.spinnerService.hide();
      }, (error) => {
        // this.globalToastService.error(error.message);
        this.ShowToast(error.message,"error")
        this.spinnerService.hide();
      });
}


GetdatewiseReportInPDF()
{
const json = {
  "List" : this.datepdflist
}
    this.ApiURL="ReportsNew/GetOrgDateWiseExpenseReport";
    this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
       window.open(res , "_blank")
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });


}
GetdatewiseReportInExcel()
{
  const json = {
    "List" : this.datepdflist
  }
    this.ApiURL="ExReports/GetOrgDateWiseExpenseReport  ";
    this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
       window.open(res , "_blank")
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });


}

GetemployeewiseReportInPDF(){
  const json = {
    "AttendanceList" : this.EmpWiseExpenseList
  }
    this.ApiURL="ReportsNew/GetMonthlyExpenseReport";
    this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
       window.open(res , "_blank")
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });
}
GetemployeewiseReportInExcel(){
  const json = {
    "AttendanceList" : this.EmpWiseExpenseList
  }
    this.ApiURL="ExReports/GetMonthlyExpenseReport";
    this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
       window.open(res , "_blank")
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });
}

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
