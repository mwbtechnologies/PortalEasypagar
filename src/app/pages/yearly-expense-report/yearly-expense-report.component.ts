import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ViewimagesComponent } from './viewimages/viewimages.component';
import { MatDialog } from '@angular/material/dialog';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';


@Component({
  selector: 'app-yearly-expense-report',
  templateUrl: './yearly-expense-report.component.html',
  styleUrls: ['./yearly-expense-report.component.css']
})
export class YearlyExpenseReportComponent  implements OnInit {
  BranchList:any;
  DepartmentList:any; YearList:any;MonthList:any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  showExpenseWise= false
  file:any;
  EmployeeId:any;
  selectedDepartmentIds: string[] | any;
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  OrgID:any;
  ExpenseList:any;
  NewApiURL:any;
  index=0;
  pdfSrc: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
   branchSettings :IDropdownSettings = {}
   departmentSettings :IDropdownSettings = {}
   yearSettings :IDropdownSettings = {}
   selectedDepartment:any[]=[];
   selectedyear:any[]=[]
  selectedBranch:any[]=[];
  pdflist:any[]=[];
  temparray:any=[]; tempdeparray:any=[];
  //common table
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
  commonTableOptions :any = {}
  ShowExports:boolean=false;
  UserID:any;
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
  //ends here
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  constructor(private dialog: MatDialog,private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService){ 
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
      },
      {
        name: "Images",
        icon: "fa fa-camera",
      }
    ];

    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"SL No",
      "Month":"MONTH",
      "LocalAmount":"LOCAL",
      "TravelAmount":"TRAVEL",
      "DNSAmount":"DNS",
      "LodgeAmount":"LODGING",
      "TotalAmount":"TOTAL",
      "Actions":"ACTIONS"
    },


    this.displayedColumns= [
      "SLno",
      "Month",
      "LocalAmount",
      "TravelAmount",
      "DNSAmount",
      "LodgeAmount",
      "TotalAmount",
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
    this.UserID=localStorage.getItem("UserID");
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
    }
   
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
    this.GetOrganization();
    this.GetBranches()
   this.GetYearList()
   const now = new Date();
   const currentMonth = now.getMonth()+1; 
   const currentYear = now.getFullYear();
   this.selectedyear = [{
    "Value": currentYear,
    "CreatedByID": null,
    "Text": currentYear.toString(),
    "createdbyname": null,
    "Key": null
   }]
  this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
    // this.GetReport()

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
      this.ShowToast(error,"error")
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
      this.ShowToast(error,"error")
       console.log(error);
    });

  }
  GetYearList(){
      this._commonservice.ApiUsingGetWithOneParam("Admin/GetYearList").subscribe((data) => this.YearList = data.List, (error) => {
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
   this.GetDepartments();
  }
  onBranchDeSelect(item:any){
   console.log(item,"item");
   this.temparray.splice(this.temparray.indexOf(item), 1);
   this.selectedDepartment = []
   this.DepartmentList = []
   this.GetDepartments();
  }

  OnYearChange(event:any){
    
  }
  onyearDeSelect(event:any){
   
  }
 
  ViewExpenses(row:any) {
    let month = row.Month
    let selectedyear = this.selectedyear.map(res=>res.Text)[0]
    let selectedbranch = this.selectedBranch.map(res=>res.Text)[0]
    let selectedbranchid = this.selectedBranch.map(res=>res.Value)[0]
    let selecteddepartment = this.selectedDepartment.map(res=>res.Text)[0]
    localStorage.setItem("ExpenseYear",selectedyear);
    localStorage.setItem("MonthWise",month);
    localStorage.setItem("ExpenseBranch",selectedbranch);
    localStorage.setItem("ExpenseBranchid",selectedbranchid);
    localStorage.setItem("ExpenseDepartment",selecteddepartment);
    this.showExpenseWise = true
  //  this._router.navigate(['MonthlyDatewiseExpenses']);
  }

  backToExpenseReport(){
    this.showExpenseWise = false
    this.GetYearList()
    this.GetBranches()
    this.GetDepartments()
  }
  // ViewDateWise(Month:any)
  // {
  //   let Branch=this.selectedBranch?.map((y:any) => y.Value)[0] ||0
  //   let Dept=this.selectedDepartment?.map((y:any) => y.Value)[0] || 0
  //   let Year =this.selectedyear?.map((y:any) => y.Text)[0] || 2024
  //   localStorage.setItem("Department",Dept);
  //   localStorage.setItem("Branch",Branch);
  //   localStorage.setItem("Year",Year);
  //   localStorage.setItem("Month",Month);
  //   this._router.navigate(['MonthlyDatewiseExpenses']);
  // }
  GetReport(){
   if(this.selectedBranch.length==0){
      // this.globalToastService.warning("Please select Branch");
      this.ShowToast("Please select Branch","warning")
      this.spinnerService.hide();
    }
   else if(this.selectedyear.length==0){
      // this.globalToastService.warning("Please select Year");
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
    this.spinnerService.show();
    this.employeeLoading= true
    let Branch=this.selectedBranch?.map((y:any) => y.Value)[0] ||0
    let Dept=this.selectedDepartment?.map((y:any) => y.Value)[0] || 0
    let Year =this.selectedyear?.map((y:any) => y.Text)[0] || currentYear
    this.ApiURL="Admin/GetYearlyExpenseReport?AdminID="+this.AdminID+"&Year="+Year+"&Branch="+Branch+"&Department="+Dept;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
        this.ExpenseList = res.ExpenseList.map((el:any)=>el.ExpenseList)[0].map((l: any, i: any) => { return { SLno: i + 1, ...l } })
        console.log(this.ExpenseList,"sdds");
        this.ShowExports= true
        this.pdflist = res.ExpenseList
        this.spinnerService.hide();
        this.employeeLoading= false
      }, (error) => {
        this.spinnerService.hide();
        this.employeeLoading= false
        // this.globalToastService.warning(error.message);
        this.ShowToast(error.message,"warning")
      });
}



GetReportInPDF()
{
  this.ApiURL="ReportsNew/GetOrganizationExpenseReport";
  const json = {
    "AttendanceList":this.pdflist
  }
  this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
    if(res)
    {
     this.pdfSrc = res;
   window.open(res,"_blank");
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
GetReportInExcel()
{
  this.ApiURL="ExReports/GetOrganizationExpenseExcelReport";
  const json = {
    "AttendanceList":this.pdflist
  }
  this._commonservice.ApiUsingPostNew(this.ApiURL,json,{ responseType: 'text' }).subscribe((res:any) => {
    if(res)
    {
     this.pdfSrc = res;
   window.open(res,"_blank");
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
 //common table
 actionEmitter(data:any){
  if(data.action.name == "View"){
    this.ViewExpenses(data.row);
  }
  if(data.action.name=="Images")
  {
    this.openImagesDialog(data.row.Images);
  }
  
}

openImagesDialog(Images:any){
  this.dialog.open(ViewimagesComponent,{
    data: {"Images":Images}
  })
 }
backToDashboard()
{
  this._router.navigate(["appdashboard"]);
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
