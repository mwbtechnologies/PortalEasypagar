import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApproveexpenseComponent } from './approveexpense/approveexpense.component';
import { DatePipe } from '@angular/common';
import { ViewimagesComponent } from './viewimages/viewimages.component';
import { CommonTableComponent } from '../common-table/common-table.component';


export interface DialogData {
  Array: any;
  SessionTypes: any;
  ApprovedSessionID: any;
}

export class DynamicArray {
  RequestID: any;
  Date: any;
  IsHalfDay: any;
  IsFullDay: any;
  LeaveType: any;
  ApprovedLeaveType: any;
  ApproveStatus: any;
}
export class Dropdown {
  Text: any;
  Value: any;
}
export class FormInput {
  StartDate: any;EndDate:any;
}

@Component({
  selector: 'app-expense-master',
  templateUrl: './expense-master.component.html',
  styleUrls: ['./expense-master.component.css']
})
export class ExpenseMasterComponent {
  formInput: FormInput | any;
  public isSubmit: boolean | any;
  LoginUserData: any;
  ListTypes: Array<Dropdown> = [];
  AdminID: any;
  ApiURL: any;
  file: any;
  NewApiURL: any;
  EmployeeId: any;
  selectedDepartmentId: any;
  selectedBranchId: any;
  selectedListType: any;
  OrgID: any; RecordID: any;
  LeaveList: any; approvedtype: any;
  LeaveURL: any;
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  index = 0; numberofdays: any; comment: any; LeaveTypes: any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  DateRange: Array<DynamicArray> = [];
  length: any;
  ApproveList: any; AttendanceList: any=[];AttendanceCount:any;
  editid: any; ShowDetails = false; ShowList = true;
  SessionTypes: any;
  AddPermission: any; EditPermission: any; ViewPermission: any; DeletePermission: any;
  BranchID: any;
  EmployeeID: any;
  EmployeeName: any;
  MonthName: any;
  pdfSrc: any;
  sortType: any;
  sortIndex: any;
  data: any; ShowAttendance = true;
  UserName: any; AttendanceAlerts: any;
  OrganizationName: any; TotalUsers: any;
  OverallResponse: any;FinalExpenseList:any=[];
  tempbranches: any = [];
  CurrentDate: any; FormattedDate: any; Day: any; FromDate: any; ToDate: any;
  ApiExist: any;
  UserListWithoutFilter: any[] = [];
  isScrolled: boolean = false;
  searchText: string = '';
  icon: string = 'default';
  AllBranchList: any[] = [];
  ApplicationList: any = ["All","Pending", "Approved", "Rejected"];
  Columns: any[] = [];
  SelectedBranch: any = [];
  selectedChips: string[] = [];
  filtersSelected: boolean = false;
  filterBarVisible: boolean = true;
  displayNames: any = {};
  OriginalBranchList: any; Branchstring: any; FilterType: any;
  SingleSelectionSettings:any;TypeSelectionSettings:any;
  DeptColumns: any;
  all_selected_values: any;
  EnableApprove: any=false;
  BranchName: any;
  userselectedbranchid: any;
  departmentSettings:IDropdownSettings = {}
  DatesArray: any;UserID:any;ExpenseHeads:any;SelectedHeadID:any;userselectedheadid:any;
    LocalAmount: any; LodgeAmount: any; TravelAmount: any; FoodAmount: any; ShowLocal: any; RecordDate: any; selectedDepartment: any[] = [];
    default_branch_id = -1;
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
    @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;

    
      //ends here
  constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService, private toastr: ToastrService, private dialog: MatDialog,private datePipe:DatePipe) { 
    this.SingleSelectionSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
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
    this.departmentSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.TypeSelectionSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.isSubmit = false
         //common table
         this.actionOptions = [
          {
            name: "View Pending Expense",
            icon: "fa fa-eye",
          },
          {
            name: "View All Expense",
            icon: "fa fa-list",
          },
          {
            name: "View All Images",
            icon: "fa fa-camera",
          }
        ];
    
        this.displayColumns= {
          "SLno":"SLNO",
          "Branch":"BRANCH",
          "Department":"DEPARTMENT",
          "EmployeeName":"EMPLOYEE",
          "TotalRequested":"REQUESTED",
          "TotalApproved":"APPROVED",
          "Actions":"ACTIONS"
        },
    
    
        this.displayedColumns= [
          "SLno",
          "Branch",
          "Department",
          "EmployeeName",
          "TotalRequested",
          "TotalApproved",
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
    this.ShowLocal=false;
    this.LocalAmount=0;this.LodgeAmount=0;this.TravelAmount=0;this.FoodAmount=0;
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
    if (this.AdminID == null || this.OrgID == null) {

      this._router.navigate(["auth/signin"]);
    }
    this.BranchID = 0;
    this.formInput = {
      StartDate: '',EndDate:''
    }
    this.RecordID=  localStorage.getItem("RecordID");
    this.RecordDate=  localStorage.getItem("RecordDate");
    this.BranchID = localStorage.getItem("BranchID");
    this.userselectedbranchid=this.BranchID;
    this.BranchName = localStorage.getItem("BranchName");
    this.FilterType=['All'];
    this.selectedBranchId = 0; this.selectedDepartmentId = 0;
    this.userselectedbranchid=0;
    if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
    {
      this.userselectedbranchid=0;this.BranchID =0;this.BranchName='';
      var ttoday=this.parseDateString(this.RecordDate); 
      const year = ttoday.getFullYear();
      const month = (ttoday.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = ttoday.getDate().toString().padStart(2, '0');
      this.formInput.StartDate= `${year}-${month}-${day}`;  this.formInput.EndDate= `${year}-${month}-${day}`;
      this.AttendanceList.splice(0, this.AttendanceList.length);
      this.GetExpenseList();
    }
    else{
         const today = new Date();

const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
const day = today.getDate().toString().padStart(2, '0');

// FromDate as first day of current month
const fromDate = `${year}-${month}-01`;

// ToDate as today's date
const toDate = `${year}-${month}-${day}`;

// Assign to form fields
this.formInput.StartDate = fromDate;
this.formInput.EndDate = toDate;
      this.AttendanceList.splice(0, this.AttendanceList.length);
      // this.GetPendingExpenseList( this.formInput.StartDate, this.formInput.EndDate);
      this.GetExpenseList();
    }    // this.selectedListType="All"; 
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
      pageLength: 50
    };
    this.GetBranches(); this.getcheckintypes();this.GetOrganization();
    this._commonservice.ApiUsingGetWithOneParam("Employee/GetExpenseHeads/en").subscribe((data) => this.ExpenseHeads = data.ExpenseTypes, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
   
  }

  GetOrganization() {
    this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List
        if (data.List.length == 1) {
            this.selectedOrganization = [{ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text }]
            this.onselectedOrg({ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text })
        } else {
           this.get_default_branch();
        }
    }, (error) => {
       console.log(error);
    });
  }

  onselectedOrg(item:any){
    this.selectedBranchId = []
    this.selectedDepartmentId = []
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranchId = []
    this.selectedDepartmentId = []
    this.GetBranches()
  }
  parseDateString(dateString: string): Date {
    // Split the date and time parts
    const [datePart, timePart] = dateString.split('T');
  
    // Split the date part into day, month, and year
    const [year, month, day] = datePart.split('-').map(part => parseInt(part, 10));
  
  
    // Create a new Date object using the parsed components
    const parsedDate = new Date(year, month - 1,day);
    return parsedDate;
  }
  parseDateStringnew(dateString: string): Date {
    // Split the date and time parts
    // const [datePart, timePart] = dateString.split('');
  
    // Split the date part into day, month, and year
    const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10));
  
  
    // Create a new Date object using the parsed components
    const parsedDate = new Date(year, month - 1,day);
    return parsedDate;
  }
  Search()
  {
    this.AttendanceList.splice(0, this.AttendanceList.length);
    this.AttendanceList=[];
    this.RecordID=0;this.RecordDate=null;
    localStorage.removeItem("RecordID");
    localStorage.removeItem("RecordDate");
    this.GetExpenseList();
  }

  getpendingdata(Date:any)
  {
    var dat=this.parseDateStringnew(Date);
    const year = dat.getFullYear();
    const month = (dat.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = dat.getDate().toString().padStart(2, '0');
    this.formInput.StartDate = `${year}-${month}-${day}`;
    this.formInput.EndDate=`${year}-${month}-${day}`;
    this.GetPendingExpenseList(this.formInput.StartDate,this.formInput.EndDate)
  }

  private GetBranches() {
    let suborgid = this.selectedOrganization.map((res:any) => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    // this.ApiURL = "Admin/GetBranchList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      console.log(data);
      if (data.List.length > 0) {
        this.AllBranchList = data.List;
        let tmp = [];
        if(this.AllBranchList.length==1)
{
        this.selectedBranchId = [{id:this.AllBranchList[0].Value,text:this.AllBranchList[0].Text}]
    this.userselectedbranchid=this.AllBranchList[0].Value;
} 
        if (this.AllBranchList.length > 0) 
          {
          for (let i = 0; i < this.AllBranchList.length; i++) {
            tmp.push({ id: this.AllBranchList[i].Value, text: this.AllBranchList[i].Text });
          }
        }
        this.Columns = tmp;
      if(this.BranchName!=null && this.BranchName!=''&& this.BranchName!=undefined)
        {
          this.selectedBranchId = [{id:this.BranchID,text:this.BranchName}]
          this.userselectedbranchid=this.BranchID;
        }
       
        this.OriginalBranchList = this.Columns;
      }
    }, (error) => {
      this.SelectedBranch = this.Columns;
      this.globalToastService.error(error); console.log(error);
    });
  }

  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    var tmp=[];
    if(this.userselectedbranchid>0)
      {
      tmp.push({"id":this.userselectedbranchid});
      }
    const json = {
      "OrgID":this.OrgID,
      "Branches": tmp,
      "AdminID":loggedinuserid
    }
    
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DeptColumns = data.DepartmentList;
      }
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
  }
  onselectedDeptChange(item:any){

  }
  onDeselectedDeptChange(item:any){

  }


  getcheckintypes() {
    this.ApiURL = "Admin/GetCheckInTypes/Session/0/en";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.SessionTypes = data.List, (error) => {

    });
  }

  openDialog(IL: any,Status:any): void {
    this.dialog.open(ApproveexpenseComponent,{
      data: {IL,"StartDate":this.formInput.StartDate,"EndDate":this.formInput.EndDate,"ListType":Status }
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
      if(res){
        localStorage.removeItem("RecordID");this.RecordID=0;
        localStorage.removeItem("RecordDate");this.RecordDate=null;
         this.GetExpenseList();
      }
    })
  }
 

  Approve(ID: any, Amount: any, Comment: any) {
 const json={
  ExpenseID:ID,ApprovedAmount:Amount,CommentByAdmin:Comment
 }
      this._commonservice.ApiUsingPost("Admin/ApproveExpense",json).subscribe(data => {
        if (data.Status == true) {
          this.toastr.success(data.Message);
          this.spinnerService.hide();
          this.AttendanceList.splice(0, this.AttendanceList.length);
         this.GetExpenseList();
        }
        else {
          this.toastr.warning(data.Message);
          this.spinnerService.hide();
        }

      }, (error: any) => {
        //  this.toastr.error(error.message);
        this.spinnerService.hide();

      }

      );
      this.spinnerService.hide();

  }

  Reject(ID: any, Comment: any) {
    if(Comment==''||Comment==undefined||Comment==null||Comment=='0')
      {
        this.toastr.warning("Please Enter Comment");
      }
      else{
    const json={
      ExpenseID:ID,CommentByAdmin:Comment
     }
      this._commonservice.ApiUsingPost("Admin/RejectExpense",json).subscribe(data => {
        if (data.Status == true) {
          this.toastr.success(data.Message);
          this.spinnerService.hide();
          this.AttendanceList.splice(0, this.AttendanceList.length);
          this.GetExpenseList();
        }
        else {
          this.toastr.warning(data.Message);
          this.spinnerService.hide();
        }

      }, (error: any) => {
        //  this.toastr.error(error.message);
        this.spinnerService.hide();

      }

      );
      this.spinnerService.hide();
    }
  }
  onChange(): void {
    this.all_selected_values = this.AttendanceList.filter((item:any) => item !== true);

  if(this.all_selected_values.length>0)
    {
      this.EnableApprove=true;
    }
    else{
      this.EnableApprove= false;
    }
}
 private GetExpenseList() {
    this.AttendanceList.splice(0, this.AttendanceList.length);
    this.AttendanceList=[];
    this.employeeLoading = true
    this.spinnerService.show();
    if (this.formInput.StartDate == null || this.formInput.StartDate == undefined || this.formInput.StartDate == "") {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = today.getDate().toString().padStart(2, '0');
      this.formInput.StartDate = `${year}-${month}-${day}`;
     
    } 
    if (this.formInput.EndDate == null || this.formInput.EndDate == undefined || this.formInput.EndDate == "") {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = today.getDate().toString().padStart(2, '0');
      this.formInput.EndDate = `${year}-${month}-${day}`;
     
    } 
 if(this.userselectedbranchid==undefined||this.userselectedbranchid==null||this.userselectedbranchid=='')
      {
        this.userselectedbranchid=0;
      }
    // if(this.selectedListType==undefined||this.selectedListType==null||this.selectedListType=='')
    // {
    //   this.ApiURL = "Performance/GetAttendance?AdminID=" + this.AdminID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=All&DeptID=" + this.selectedDepartmentId;
  
    // }
    var json={
      // ExpenseTypeID:this.userselectedheadid,
      // BranchID:[this.userselectedbranchid],
      // AdminID:this.UserID,
      // EmployeeID:0,
      // FromDate:this.formInput.StartDate,
      // ToDate:this.formInput.EndDate,
      // Key:'en'
      "Branch": [
        {
          "BranchID": this.userselectedbranchid,
          "DepartmentIDs": this.selectedDepartment && this.selectedDepartment.length>0
              ? this.selectedDepartment.map((sd:any)=>sd.id) : [0]
        },
      ],
      "AdminID": this.UserID,
      "EmployeeID": 0,
      "FromDate": this.formInput.StartDate,
      "ToDate": this.formInput.EndDate,
      "Key": "en"
    }
    this._commonservice.ApiUsingPost("Admin/GetExpenseList",json).subscribe((res: any) => {
      if(res.Status==true)
      {
        var table = $('#DataTables_Table_0').DataTable();
        table.destroy();
        console.log(res);
        this.AttendanceList = res.FilteredList;
        this.LocalAmount=res.LocalExpense;
        this.LodgeAmount=res.LodgeExpense;
        this.FoodAmount=res.DNSExpense;
        this.TravelAmount=res.TravelExpense;
        if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
          {
            var data = res.ExpenseList.filter((item:any) => item.ExpenseID ===parseInt(this.RecordID));
            if(data.length==1)
            {
              localStorage.removeItem("RecordID");this.RecordID=0;
              localStorage.removeItem("RecordDate");this.RecordDate=null;
              this.openDialog(data[0],"Pending");
            }
          }
          this.FinalExpenseList=[];var tmp=[];
          if(this.AttendanceList.length>0)
          {
            for(this.index=0;this.index<this.AttendanceList.length;this.index++)
              {
              
                tmp.push({"EmployeeID":this.AttendanceList[this.index].EmployeeID,"Branch":this.AttendanceList[this.index].Branch,"Department":this.AttendanceList[this.index].Department,"EmployeeName":this.AttendanceList[this.index].EmployeeName,"TotalRequested":this.AttendanceList[this.index].TotalRequested,"TotalApproved":this.AttendanceList[this.index].TotalApproved,"BillImages":this.AttendanceList[this.index].BillImages});
             
              }
          }
          this.FinalExpenseList=tmp.map((l: any, i: any) => { return { SLno: i + 1, ...l } });
        this.DatesArray=res.DateList;
        this.dtTrigger.next(null);
        this.spinnerService.hide();
        this.employeeLoading = false
      }
      else{
        this.toastr.warning(res.Message);
        this.spinnerService.hide();
        this.employeeLoading = false
      }
 
      
    }, (error) => {
      this.spinnerService.hide();
      this.employeeLoading = false
    });
  }

  private GetPendingExpenseList(FromDate:any, ToDate:any) {
    this.AttendanceList.splice(0, this.AttendanceList.length);
    this.AttendanceList=[];
    this.spinnerService.show();
    this.formInput.StartDate=FromDate;    this.formInput.EndDate=ToDate;
    if (this.formInput.StartDate == null || this.formInput.StartDate == undefined || this.formInput.StartDate == "") {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = today.getDate().toString().padStart(2, '0');
      this.formInput.StartDate = `${year}-${month}-${day}`;
     
    } 
    if (this.formInput.EndDate == null || this.formInput.EndDate == undefined || this.formInput.EndDate == "") {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = today.getDate().toString().padStart(2, '0');
      this.formInput.EndDate = `${year}-${month}-${day}`;
     
    } 
 if(this.userselectedbranchid==undefined||this.userselectedbranchid==null||this.userselectedbranchid=='')
      {
        this.userselectedbranchid=0;
      }
    // if(this.selectedListType==undefined||this.selectedListType==null||this.selectedListType=='')
    // {
    //   this.ApiURL = "Performance/GetAttendance?AdminID=" + this.AdminID + "&BranchID=" + this.userselectedbranchid + "&Date=" + this.formInput.StartDate + "&ListType=All&DeptID=" + this.selectedDepartmentId;
  
    // }
    var json={
      ExpenseTypeID:this.userselectedheadid,
      BranchID:this.userselectedbranchid,
      AdminID:this.UserID,
      EmployeeID:0,
      FromDate:this.formInput.StartDate,
      ToDate:this.formInput.EndDate,
      
      Key:'en'
    }
    this._commonservice.ApiUsingPost("Admin/GetPendingExpenseList",json).subscribe((res: any) => {
      if(res.Status==true)
      {
        var table = $('#DataTables_Table_0').DataTable();
        table.destroy();
        console.log(res);
        this.AttendanceList = res.FilteredList;
        this.LocalAmount=res.LocalExpense;
        this.LodgeAmount=res.LodgeExpense;
        this.FoodAmount=res.DNSExpense;
        this.TravelAmount=res.TravelExpense;
        if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
          {
            var data = res.ExpenseList.filter((item:any) => item.ExpenseID ===parseInt(this.RecordID));
            if(data.length==1)
            {
              localStorage.removeItem("RecordID");this.RecordID=0;
              localStorage.removeItem("RecordDate");this.RecordDate=null;
              this.openDialog(data[0],"Pending");
            }
          }
          this.FinalExpenseList=[];var tmp=[];
          if(this.AttendanceList.length>0)
          {
            for(this.index=0;this.index<this.AttendanceList.length;this.index++)
              {
              
                tmp.push({"EmployeeID":this.AttendanceList[this.index].EmployeeID,"Branch":this.AttendanceList[this.index].Branch,"Department":this.AttendanceList[this.index].Department,"EmployeeName":this.AttendanceList[this.index].EmployeeName,"TotalRequested":this.AttendanceList[this.index].TotalRequested,"TotalApproved":this.AttendanceList[this.index].TotalApproved,"BillImages":this.AttendanceList[this.index].BillImages});
             
              }
          }
          this.FinalExpenseList=tmp.map((l: any, i: any) => { return { SLno: i + 1, ...l } });
        this.DatesArray=res.DateList;
        this.dtTrigger.next(null);
        this.spinnerService.hide();
      }
      else{
        this.toastr.warning(res.Message);
        this.spinnerService.hide();
      }
 
      
    }, (error) => {
      this.spinnerService.hide();
    });
  }

  onselectedTypeChangenew(event: any) {
    this.selectedListType=event;
    this.AttendanceList.splice(0, this.AttendanceList.length);
    this.GetExpenseList();this.FilterType=[event]; 
  }
  onselectedTypeChange(event: any) {
    this.selectedListType=event;
  }
  onDeselectedTypeChange(event: any) {
    this.selectedListType=0;this.FilterType=['All'];
  }

  onDeselectedHeadChange(event: any) {
    this.SelectedHeadID=0;this.userselectedheadid=0;
  }
  onselectedHeadChange(event: any) {
    this.SelectedHeadID=event.Value;this.userselectedheadid=event.Value
  }
  onDeselectedBranchesChange(event: any) {this.selectedBranchId=0;this.userselectedbranchid=0;  this.GetDepartments()}
  onselectedBranchesChange(event: any) { this.userselectedbranchid=event.id ; this.GetDepartments()}
  allCheck(event:any) {
    const checked = event.target.checked;
    this.AttendanceList.forEach((item: { checked: any; }) => item.checked = checked);
    if(checked==true)
      {
  this.EnableApprove=true;
      }
      else{ this.EnableApprove=false;}
      this.all_selected_values = this.AttendanceList.filter((item:any) => item !== true);
  }

  validateDate(date:any){
    if(date < this.formInput.StartDate){
      this.toastr.error("To Date Cannot Be Smaller Than From Date")
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = today.getDate().toString().padStart(2, '0');
      this.formInput.EndDate = `${year}-${month}-${day}`
    }
    else {
      return
    }
   }

   openImagesDialog(IL:any,Status:any){
    this.dialog.open(ViewimagesComponent,{
      data: {"BillImages":IL.BillImages}
    })
   }

   backToDashboard(){
  this._router.navigate(["appdashboard"]);
}

//common table
actionEmitter(data:any){
  if(data.action.name == "View Pending Expense"){
    this.openDialog(data.row,'Pending')
  }
  if(data.action.name == "View All Expense"){
    this.openDialog(data.row,'All')
  }
  if(data.action.name == "View All Images"){
    this.openImagesDialog(data.row,'All')
  }
}




 downloadReport() {
  let selectedColumns = this.displayedColumns
  this.commonTableChild.downloadReport(selectedColumns)
    }

    getFirstDateOfMonth(): string {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

        // Format to yyyy-MM-dd
        const yyyy = firstDay.getFullYear();
        const mm = String(firstDay.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(firstDay.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    }

    private load_branches() {

        let suborgid = this.selectedOrganization.map((res:any) => res.Value)[0] || 0
        this.ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID;
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
           
            console.log(data);
            if (data.List.length > 0) {
                this.AllBranchList = data.List;
                let tmp = [];

                if (this.AllBranchList.length > 0) {
                    for (let i = 0; i < this.AllBranchList.length; i++) {
                        tmp.push({ id: this.AllBranchList[i].Value, text: this.AllBranchList[i].Text });
                    }
                }
                this.Columns = tmp;


                this.OriginalBranchList = this.Columns;
                if (this.default_branch_id != -1) {
                    let default_branch = this.OriginalBranchList.find((i: any) => i.id == this.default_branch_id);
                    if (default_branch != null) {
                        this.selectedBranchId = [{ id: default_branch.id, text: default_branch.text }];
                        this.Search();
                    }

                }
            }
        }, (error) => {
            this.SelectedBranch = this.Columns;
            // this.toastr.error(error); 
            this.toastr.error(error, "error")
            console.log(error);
        });
    }

    private get_default_branch(): void {
        try {
         
            this.formInput.ToDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
            this.formInput.FromDate = this.getFirstDateOfMonth();
            console.log(this.formInput.ToDate);


            let api_url = "api/Settings/GetDefaultBranch?userId=" + this.UserID + "";
            this._commonservice.GetWithOneParam(api_url).subscribe({
                next: (result: any) => {
                    console.log(result);
                  
                    if (result.Status == true) {


                        let selected_org = this.OrgList.find(i => i.Value == result.SuborgID);
                        if (selected_org != null) {
                            this.selectedOrganization = [{ Value: selected_org.Value, Text: selected_org.Text }];
                            this.load_branches();
                            this.default_branch_id = result.DefaultBranchID;
                            this.selectedBranchId = result.DefaultBranchID;

                        }

                    }
                },
                error: (error: any) => {
                    this.toastr.error(error.message);
                }
            });
        } catch (exception) {
            if (exception instanceof Error) {
                this.toastr.error(exception.message);
            }
        }

    }
//ends here
}


