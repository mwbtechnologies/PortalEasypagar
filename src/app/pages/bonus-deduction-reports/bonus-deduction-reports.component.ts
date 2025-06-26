import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-bonus-deduction-reports',  
  templateUrl: './bonus-deduction-reports.component.html',
  styleUrls: ['./bonus-deduction-reports.component.css']
})
export class BonusDeductionReportsComponent {
  AdminID:any
  OrgID:any
  EmployeeList: any;
  DepartmentList: any;
  BranchList: any[] = [];
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  temparray: any = []; tempdeparray: any = [];
  monthSettings :IDropdownSettings = {}
  yearSettings :IDropdownSettings = {}
  selectedyear:any[]=[]
  selectedMonth:any[]=[]
  selectedDepartment: any[] = [];
  selectedEmployees: any[] = []
  selectedBranch: any[] = [];
  ApiURL:any
  BDHistory:any[]=[]
  YearList:any;MonthList:any;
  showMonthWise:boolean = false
  MonthlyData:any
   //common table
   actionOptions: any
   displayColumns: any
   displayedColumns: any
   employeeLoading: any;
   editableColumns: any = []
   topHeaders: any = []
   headerColors: any = []
   smallHeaders: any = []
   ReportTitles: any = {}
   selectedRows: any = []
   commonTableOptions: any = {}
   UserID: any
   @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
   //ends here
   selectedOrganization:any[]=[]
   OrgList:any[]=[]
   orgSettings:IDropdownSettings = {}
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService,private dialog:MatDialog){
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
        //common table
        this.actionOptions = [
          {
            name: "View Details",
            icon: "fa fa-eye",
          },
        ];
    
        this.displayColumns = {
          SelectAll: "SelectAll",
          "SLno":"SL No",
          "Employeeid":"Employee Id",
          "EmployeeName":"Employee Name",
          "DateRange":"Dates",
          "TotalBonus":"Total Bonus",
          "TotalDeduction":"Total deduction",
          "Actions":"Actions"
        },
    
    
          this.displayedColumns = [
            "SelectAll",
            "SLno",
            "Employeeid",
            "EmployeeName",
            "DateRange",
            "TotalBonus",
            "TotalDeduction",
            "Actions"
          ]
    
        this.editableColumns = {
          SelectAll: {
            //commented by ashwini- changed logic of approve all, now each payslip should be approved manually and this checkbox is used for generating bank payslip
            filters: {IsPayslipExist:false},
          }
        }
    
        this.topHeaders = [
        ]
    
        this.headerColors = {
        }
        //ends here
   }
   ngOnInit(){
     this.AdminID = localStorage.getItem("AdminID");
     this.OrgID = localStorage.getItem("OrgID");
     this.UserID = localStorage.getItem("UserID");     
    this.GetOrganization();
     this.GetBranches()
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

   backToDashboard()
   {
     this._router.navigate(["appdashboard"]);
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
    this.DepartmentList=[];
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json = {
      AdminID:loggedinuserid,
      OrgID: this.OrgID,
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
    let BranchID = this.selectedBranch?.map((y: any) => y.Value)[0] || 0
    let deptID = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0
    let year = this.selectedyear?.map((y: any) => y.Value)[0] || 0
    let month = this.selectedMonth?.map((y: any) => y.Value)[0] || 0
    this.ApiURL = "Admin/GetEmployees?AdminID=" + this.AdminID + "&BranchID=" + BranchID + "&DeptId=" + deptID + "&Year=" + year + "&Month=" + month + "&Key=en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
      console.log(error); this.spinnerService.hide();
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
    this.GetDepartments();
    this.selectedEmployees = []
    this.getEmployeeList()
  }
  onBranchDeSelect(item: any) {
    console.log(item, "item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.GetDepartments();
    this.selectedEmployees = []
    this.EmployeeList = []
    // this.getEmployeeList()
  }
  OnYearChange(event:any){
    this.spinnerService.show();
    this.selectedEmployees = []
    if(this.selectedBranch.length>0){
      this.getEmployeeList()
    }
    // this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+this.selectedDepartment+"&Year="+event.Value+"&Month="+0+"&Key=en";
    // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    //    console.log(error);this.spinnerService.hide();
    // });
    this.spinnerService.hide();
  }
  onyearDeSelect(event:any){
    this.spinnerService.show();
    this.selectedEmployees = []
    if(this.selectedBranch.length>0){
      this.getEmployeeList()
    }
    // this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+this.selectedBranch+"&DeptId="+this.selectedDepartment+"&Year="+event.Value+"&Month="+0+"&Key=en";
    // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.EmployeeList = data.data, (error) => {
    //    console.log(error);this.spinnerService.hide();
    // });
    this.spinnerService.hide();
  }
  OnMonthChange(event:any)
  {
    this.spinnerService.show();
    this.selectedEmployees = []
    if(this.selectedBranch.length>0){
      this.getEmployeeList()
    }
    this.spinnerService.hide();
  }
  onMonthDeSelect(event:any)
  {
    this.spinnerService.show();
    this.selectedEmployees = []
    if(this.selectedBranch.length>0){
      this.getEmployeeList()
    }
    this.spinnerService.hide();
  }
  OnEmployeesChange(_event: any) {
  }
  OnEmployeesChangeDeSelect(event: any) {
  }

  getBDHistory(){
    if(this.selectedBranch.length ==0){
      // this.globalToastService.warning("Please select Branch")
      this.ShowAlert("Please select Branch","warning")
    }
    else if(this.selectedyear.length ==0){
      // this.globalToastService.warning("Please select Year")
      this.ShowAlert("Please select Year","warning")
    }
    else if(this.selectedMonth.length ==0){
      // this.globalToastService.warning("Please select Month")
      this.ShowAlert("Please select Month","warning")
    }
    else if(this.selectedEmployees.length ==0){
      // this.globalToastService.warning("Please select Employees")
      this.ShowAlert("Please select Employees","warning")
    } 
    else {
      let json = {
      "EmpIds": this.selectedEmployees.map((ep:any)=>{return ep.Value}),
      "MonthID":this.selectedMonth?.map((y:any) => y.Value)[0],
        "Year":parseInt(this.selectedyear?.map((y:any) => y.Text)[0]),
      }
      this.employeeLoading = true
      this._commonservice.ApiUsingPost("SalaryCalculation/Bonusanddeductionreport",json).subscribe((res:any)=>{
        if(res.Status == true){
         this.BDHistory = res.List.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
          this.employeeLoading = false
        }else if(res.Status == false){
          // this.globalToastService.error(res.Message)
          this.ShowAlert(res.Message,"error")
          this.employeeLoading = false
        }
        else{
          // this.globalToastService.error("An error occurred please try again later")
          this.ShowAlert("An error occurred please try again later","error")
          this.employeeLoading = false
        }
      },(error)=>{
        // this.globalToastService.error(error.error.Message)
        this.ShowAlert(error.error.message,"error")
        this.employeeLoading = false
      })
    }
  }

  GetCalculatedReport() {
    this.spinnerService.show();
    this.employeeLoading = true;
    if (this.selectedyear.length == 0) {
      // this.globalToastService.warning("Please Select Year");
      this.ShowAlert("Please select Year","warning")
      this.spinnerService.hide();
      this.employeeLoading = undefined;
    } else if (this.selectedMonth.length == 0) {
      // this.globalToastService.warning("Please Select Month");
      this.ShowAlert("Please select Month","warning")
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
              this.clearSelect()
              this.getBDHistory();
            }else{
              // this.globalToastService.error("Failed to Recalculte Salary. Please try again..");
              this.ShowAlert("Failed to Recalculte Salary. Please try again..","error")
            }
            this.spinnerService.hide();
            this.employeeLoading = false;
            this.clearSelect()
  
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

  clearSelect(){
    this.selectedRows = []
    this.commonTableChild.clearSelectAll()
    this.BDHistory.forEach(element => {
      element.isSelected = false
    });
  }

  backToBonusDeduction(){
    this.showMonthWise = false
    this.GetBranches()
    this.GetDepartments()
    this.GetYearList()
    this.GetMonthList()
    this.getEmployeeList()
  }
  View(row:any){
    this.MonthlyData = {data:row.BandDArray,name:row.EmployeeName}
    this.showMonthWise = true
  }
    //common table
    actionEmitter(data: any) {
      if (data.action.name == "View Details") {
        this.View(data.row);
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
            let slIndex = this.BDHistory.findIndex((sl:any)=>sl.EmpID == ri.EmpID)
            if(slIndex != -1 ){
              this.BDHistory[slIndex]['isSelected'] = false
              console.log(this.BDHistory);
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
    //ends here

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

