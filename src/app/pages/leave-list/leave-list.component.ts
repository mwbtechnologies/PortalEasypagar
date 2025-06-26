import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as moment from 'moment';
import { ApproveLoanComponent } from '../loan-list/approve-loan/approve-loan.component';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { DatePipe } from '@angular/common';
export interface DialogData
{

}
export class FormInput{
  FromDate:any;
  ToDate:any;
}
@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.css']
})
export class LeaveListComponent implements OnInit {
  BranchList:any;
  DepartmentList:any; 
  formInput: FormInput | any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  file:any;
  NewApiURL:any;
  EmployeeId:any;
  selectedDepartmentIds: string[] | any;
  OrgID:any;RecordID:any;
  LeaveList:any;approvedtype:any;
  LeaveURL:any;
  index=0;numberofdays:any;comment:any;LeaveTypes:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  length:any;
  ApproveList:any;
  editid:any;ShowDetails=false;ShowList=true;
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;
  SelectedLoanType:any="";
  ApplicationList:any=["All","Approved","Rejected","Pending"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  Columns: any[] = [];
  SelectedBranch: any = [];
  AllBranchList:  any[] = [];
  filterJson: any = {}
  selectedListTypeId:any;
  displayNames: any = {};
  OriginalBranchList: any; Branchstring: any; FilterType: any; selectedBranches: any; 
  selectedListType:any; UserListWithoutFilter: any[] = []; searchText: string = '';
  multiselectcolumns: IDropdownSettings = {};
  chips: any[] = [];selectedDepartments: any = [];
  DeptColumns:any;OriginalDepartmentList:any;CurrentDate:any
  listtypesettings:IDropdownSettings = {};UserID:any;
  selectedDepartmentId: any;
  selectedBranchId: any;userselectedbranchid:any;BranchID:any;BranchName:any;RecordDate:any;
  selectedLeaveIds: string[] | any;;   
  LoginTypes:any=["Paid Leave","UnPaid Leave","Sick Leave","POW"];
  leaveSettings:IDropdownSettings = {}
  ShowDay:boolean = true
  ApplyBranchList:any[]=[];
  ApplyDepartmentList:any; 
  EmployeeList:any; 
 selectedBranch:any[]=[];
branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
employeeSettings :IDropdownSettings = {}
 temparray:any=[]; tempdeparray:any=[];
 selectedDepartment:any[]=[];
 selectedEmployees:any[]=[];
 SelectDate:any
 NoOfDays:any
 isHalfDay:boolean = false
 Comment:any
 isFullDay:any
 selectedOrganization:any[]=[]
 ApplyOrgList:any[]=[]
 orgSettings:IDropdownSettings = {}

  selectedListOrganization:any[]=[]
  OrgList:any[]=[]
    orgListSettings: IDropdownSettings = {}

    default_branch_id = -1;

  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private toastr:ToastrService,private dialog: MatDialog,private datePipe:DatePipe){ this.isSubmit=false;
    this.listtypesettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.employeeSettings = {
      singleSelection: true,
      idField: 'ID',
      textField: 'Name',
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
    this.leaveSettings = {
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
    this.orgListSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
    }
    this.formInput={
      FormDate:'',
      ToDate:''
    }
    this.RecordID=  localStorage.getItem("RecordID");
    this.RecordDate=  localStorage.getItem("RecordDate");
    this.BranchID = localStorage.getItem("BranchID");
    this.userselectedbranchid=this.BranchID;
    this.BranchName = localStorage.getItem("BranchName");
    this.Branchstring = localStorage.getItem('selectedBranches');
    this.selectedBranches = JSON.parse(this.Branchstring);
    this.SelectedLoanType="All";
    if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
    {
      this.userselectedbranchid=0;this.BranchID =0;this.BranchName='';
      var ttoday=this.parseDateString(this.RecordDate); 
      const year = ttoday.getFullYear();
      const month = (ttoday.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = ttoday.getDate().toString().padStart(2, '0');
      this.formInput.FromDate= `${year}-${month}-${day}`;  this.formInput.ToDate= `${year}-${month}-${day}`;
      this.GetleaveList();
    }
    else{
      // const today = new Date();
      // const year = today.getFullYear();
      // const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      // const day = today.getDate().toString().padStart(2, '0');
      // var currentdate = `${year}-${month}-${day}`;
      // this.formInput.FromDate= `${year}-${month}-${day}`;  this.formInput.ToDate= `${year}-${month}-${day}`;
      // this.GetleaveList();
      const today = new Date();

const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
const day = today.getDate().toString().padStart(2, '0');

// FromDate as first day of current month
const fromDate = `${year}-${month}-01`;

// ToDate as today's date
const toDate = `${year}-${month}-${day}`;

// Assign to form fields
this.formInput.FromDate = fromDate;
this.formInput.ToDate = toDate;
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
     
  }

  dateValidation(date:any){
    if(date < this.formInput.FromDate){
      // this.toastr.error("To Date Cannot Be Smaller Than From Date")
      this.ShowAlert("To Date Cannot Be Smaller Than From Date","error")
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = today.getDate().toString().padStart(2, '0');
      this.formInput.ToDate = `${year}-${month}-${day}`
    }
    else{
      return
    }
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

  Search()
  {
    localStorage.removeItem("RecordID");this.RecordID=0;
    localStorage.removeItem("RecordDate");this.RecordDate=null;
    this.GetleaveList();
  }
  GetDepartments() {
    this.selectedDepartment=[];this.selectedDepartmentId=[];
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
      // this.toastr.error(error);
      this.ShowAlert(error,"error")
       console.log(error);
    });
  }

  onselectedListOrg(item:any){
    this.selectedBranchId = []
    this.selectedDepartmentId = []
    this.GetBranches()
  }
  onDeselectedListOrg(item:any){
    this.selectedBranchId = []
    this.selectedDepartmentId = []
    this.GetBranches()
  }

  GetOrganization() {
    this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List
        if (data.List.length == 1) {
            this.selectedListOrganization = [{ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text }]
            this.onselectedListOrg({ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text })
        } else {
          
            this.get_default_branch();
        }
       
    }, (error) => {
       console.log(error);
    });
    }

    private load_branches() {
       
        let suborgid = this.selectedListOrganization.map(res => res.Value)[0] || 0
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
                    let default_branch = this.OriginalBranchList.find((i:any) => i.id == this.default_branch_id);
                    if (default_branch != null) {
                        this.selectedBranchId = [{ id: default_branch.id, text: default_branch.text }];
                        this.Search();
                     }
                  
                }
            }
        }, (error) => {
            this.SelectedBranch = this.Columns;
            // this.toastr.error(error); 
            this.ShowAlert(error, "error")
            console.log(error);
        });
    }
  GetBranches() {
    this.AllBranchList = [];this.selectedBranch=[];this.selectedBranchId=[];
    let suborgid = this.selectedListOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      console.log(data);
      if (data.List.length > 0) {
        this.AllBranchList = data.List;
        if(this.AllBranchList.length==1)
{
        this.selectedBranchId = [{id:this.AllBranchList[0].Value,text:this.AllBranchList[0].Text}]
     this.userselectedbranchid=this.AllBranchList[0].Value;
}
        let tmp = [];

        if (this.AllBranchList.length > 0) 
          {
          for (let i = 0; i < this.AllBranchList.length; i++) {
            tmp.push({ id: this.AllBranchList[i].Value, text: this.AllBranchList[i].Text });
          }
        }
        this.Columns = tmp;
        if(this.BranchName!=null && this.BranchName!=''&& this.BranchName!=undefined)
        {
          this.selectedBranchId=[this.BranchName];
          this.userselectedbranchid=this.BranchID;
        }
       
        this.OriginalBranchList = this.Columns;
      }
    }, (error) => {
      this.SelectedBranch = this.Columns;
      // this.toastr.error(error); 
      this.ShowAlert(error,"error")
      console.log(error);
    });
  }

Approve(IL:any){
    this.spinnerService.show();
    const json={
      RequestID:IL.RequestID,
      Comment:"",
      AdminID:this.UserID,
      ApprovedLeaveType:IL.LeaveType,
      ApprovedDays:IL.NoOfDays
    }
    console.log(json);
    this.spinnerService.show();
    this._commonservice.ApiUsingPost("Admin/ApproveLeave",json).subscribe(data => {
      if(data.Status==true){
      //  this.toastr.success("Leave Reject Successfull");
      // this.ShowAlert("Leave Reject Successfull","success")
        this.ShowAlert("Leave Reject Successfull","success")
  this.ShowAlert("Failed to Reject Leave","error")
       this.spinnerService.hide();
       this.GetleaveList();
      }
      else{
      //  this.toastr.warning("Failed to Reject Leave");
      // this.ShowAlert("Failed to Reject Leave","error")
        this.ShowAlert("Leave Reject Successfull","success")
  this.ShowAlert("Failed to Reject Leave","error")
       this.spinnerService.hide();
      }
     
     }, (error: any) => {
       // this.toastr.error(error.message);
       this.spinnerService.hide();
      
     }
     
     );
     this.spinnerService.hide();
 
}

Reject(IL:any){
  if(IL.AdminComment==''||IL.AdminComment==" "||IL.AdminComment==undefined||IL.AdminComment==null||IL.AdminComment=='0')
    {
      // this.toastr.warning("Please Enter Comment");
      this.ShowAlert("Please Enter Comment","warning")
    }
    else{
    this.spinnerService.show();
    const json={
      RequestID:IL.RequestID,
      Comment:IL.AdminComment,
      AdminID:this.UserID
    }
    this.spinnerService.show();
    console.log(json);
    this._commonservice.ApiUsingPost("Admin/RejectLeave",json).subscribe(data => {
      if(data.Status==true){
      //  this.toastr.success("Leave Reject Successfull");
        this.ShowAlert("Leave Reject Successfull","success")
       this.spinnerService.hide();
       this.GetleaveList();
      }
      else{
      //  this.toastr.warning("Failed to Reject Leave");
  this.ShowAlert("Failed to Reject Leave","error")
       this.spinnerService.hide();
      }
     
     }, (error: any) => {
       // this.toastr.error(error.message);
       this.spinnerService.hide();
      
     }
     
     );
     this.spinnerService.hide();
    }
 
}

  GetleaveList()
  {
    if(this.selectedListOrganization.length>0)
    {

      if(this.selectedBranchId.length>0)
        {

      if(this.userselectedbranchid==undefined||this.userselectedbranchid==null||this.userselectedbranchid=='')
        {
          this.userselectedbranchid=0;
        }
        if(this.selectedDepartmentId==undefined||this.selectedDepartmentId==null||this.selectedDepartmentId=='')
          {
            this.selectedDepartmentId=0;
          }
      const json = {
        BranchID: this.userselectedbranchid,
        // Type: this.SelectedLoanType,
        // ListType: this.selectedListType,
        FromDate: this.formInput.FromDate,
        ToDate:this.formInput.ToDate,
        AdminID: this.UserID,
        DeptID: this.selectedDepartmentId,
        Key:'en'
      }
        this._commonservice.ApiUsingPost("Admin/GetAllLeaveRequests",json).subscribe((res:any) => {
          var table = $('#DataTables_Table_0').DataTable();
          table.destroy();
          this.LeaveList = res.List;
            if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
              {
                this.LeaveList = res.List.filter((item:any) => item.RequestID ===parseInt(this.RecordID));
                if(this.LeaveList.length==1)
                {
                  localStorage.removeItem("RecordID");this.RecordID=0;
                  localStorage.removeItem("RecordDate");this.RecordDate=null;
                  this.openDialog(this.LeaveList[0]);
                }
              }
          this.dtTrigger.next(null);
          this.spinnerService.hide();
        }, (error) => {
          // this.toastr.error(error.message);
          this.spinnerService.hide();
        });
    
      }
      else{
        this.ShowAlert("Please select branch","warning")
      }  }
    else{
      this.ShowAlert("Please select organization","warning")
    }

  }
  onDeselectedDepartmentsChange(event: any) {
    this.selectedDepartmentId=0;
  }
  onselectedDepartmentsChange(event: any) {
    this.selectedDepartmentId=event.id;
  }
  onDeselectedBranchesChange(event: any) {this.selectedBranchId=0;this.userselectedbranchid=0;this.GetDepartments(); }
  onselectedBranchesChange(event: any) { this.userselectedbranchid=event.id; this.GetDepartments();}
  onselectedTypeChangenew(event: any) {
    this.selectedListType=event;
    // this.GetAttendanceList();
    this.FilterType=[event];
    //  this.GetAttendanceCount();
  }
  onDeselectedTypeChange(event: any) {
    this.selectedListType=0;
    this.FilterType=['All'];
  }
  openDialog(IL: any): void {
    this.dialog.open(ApproveLeaveComponent,{
      data: { IL }
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
      if(res){
        localStorage.removeItem("RecordID");this.RecordID=0;
        localStorage.removeItem("RecordDate");this.RecordDate=null;
        this.GetleaveList();
      }
    })
  }
  ApplyLeave(){
    this.ShowList = false
    this.GetApplyLeaveOrganization()
    this.GetApplyLeaveBranches()
    this.GetApplyLeaveDepartments()
    this.GetLoginTypes()
  }
  back(){
    this.ShowList = true
    this.selectedBranch = []
    this.selectedDepartment = []
    this.selectedEmployees = []
  }
  onleaveSelect(item:any){

  }
  onleaveDeSelect(item:any){

  }
  ShowDays()
  {
  //  if(this.ShowDay==true)
  //  {
  //    this.ShowDay=false;
  //    this.isFullDay=false;
  //    this.isHalfDay=true;
  //    this.NoOfDays=0;
  //  }
  //  else if(this.ShowDay == false){
  //    this.ShowDay=true;
  //    this.isFullDay=true;
  //    this.isHalfDay=false;
  //  }
  if(this.isHalfDay == false){
    this.ShowDay = false
    this.isFullDay=false;
  }
  else if(this.isHalfDay == true){
    this.ShowDay = true
    this.isFullDay=true;
  }
  }
  validatedays(event:any)
  {
    const inputChar = String.fromCharCode(event.keyCode || event.charCode);
    if (!/^\d+$/.test(inputChar)) {
    this.toastr.warning("Please Enter Valid Input")
    this.formInput.NoOfDays.clear();
    }
  }
  GetLoginTypes(){
  this.spinnerService.show();
  this._commonservice.ApiUsingGetWithOneParam("Admin/GetLoginTypes/Leave/en").subscribe((res:any) => {
    this.LeaveTypes = res.List;
    this.spinnerService.hide();
  }, (error) => {
    // this.toastr.error(error.message);
    this.spinnerService.hide();
  });
  this.spinnerService.hide();
  
}
  CheckDate(date:any)
  {
   this._commonservice.ApiUsingGetWithOneParam("Admin/CheckDate?UserDate="+date+"").subscribe(data => {
     if(data.Status==false){
      this.spinnerService.hide();
         return true;
      }
      else{
        this.spinnerService.hide();
        // this.toastr.warning("Date should be greater than Current Date");
        this.ShowAlert("Date should be greater than Current Date","warning")
        this.formInput.FromDate='';
       
         return false;
      }
   }, (error: any) => {
    this.spinnerService.hide();
    // this.toastr.warning(error.error.message);
    this.ShowAlert(error.error.message,"warning")
    return false;
   }
   );
  }
  CreateRequest()
   {
     if(this.selectedLeaveIds==""||this.selectedLeaveIds==undefined || this.selectedLeaveIds==null){
    //  this.toastr.warning("Please Select Leave Type");
    this.ShowAlert("Please Select Leave Type","warning")
     }
     else if(this.SelectDate==""||this.SelectDate==undefined || this.SelectDate==null){
      //  this.toastr.warning("Please Select Date");
      this.ShowAlert("Please Select Date","warning")

     }
     else if(this.isHalfDay==false && (this.NoOfDays==0 || this.NoOfDays=="")){
      // this.toastr.warning("Please Enter NoOfDays");
      this.ShowAlert("Please Enter NoOfDays","warning")

    }
    else if(this.Comment=="" && this.Comment == undefined){
      // this.toastr.warning("Please Enter Reason For Leave");
      this.ShowAlert("Please Enter Reason For Leave","warning")

    }
    else if(this.selectedEmployees.length==0){
      // this.toastr.warning("Please select Employee");
      this.ShowAlert("Please select Employee","warning")
    }
     else
     {
       const json={
        LeaveType:this.selectedLeaveIds.map((e:any)=>e.Text)[0],
        EmpID:this.selectedEmployees.map((e:any) => e.ID)[0],
        isHalfDay:this.isHalfDay,
        isFullDay:this.isFullDay,
        NoOfDays:this.NoOfDays,
        FromDateTime:this.SelectDate,
        ToDateTime:this.SelectDate,
        Comment:this.Comment,
        AdminID:this.AdminID
                 }
              console.log(json,"apply leave")
           this._commonservice.ApiUsingPost("Portal/ApplyLeave",json).subscribe((res:any) => {
            if(res.Status==true)
            {
              // this.toastr.success(res.Message);
              this.ShowAlert(res.Message,"success")
            this.GetleaveList()
            }
            else{
              // this.toastr.warning(res.Message);
              this.ShowAlert(res.Message,"warning")
            }
             this.spinnerService.hide();
           }, (error) => {
             // this.toastr.error(error.message);
             this.spinnerService.hide();
           });
     }
 
 }
 onselectedOrg(item:any){
  this.SelectedBranch = []
  this.selectedDepartment = []
  this.GetApplyLeaveBranches()
}
onDeselectedOrg(item:any){
  this.SelectedBranch = []
  this.selectedDepartment = []
  this.GetApplyLeaveBranches()
}

GetApplyLeaveOrganization() {
  this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.UserID
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
    this.ApplyOrgList = data.List
    if(data.List.length == 1){
      this.selectedOrganization = [{Value:this.ApplyOrgList[0].Value,Text:this.ApplyOrgList[0].Text}]
      this.onselectedOrg({Value:this.ApplyOrgList[0].Value,Text:this.ApplyOrgList[0].Text})
    }
  }, (error) => {
     console.log(error);
  });
}
 GetApplyLeaveBranches() {
  let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
    this.ApplyBranchList = data.List;
  }, (error) => {
    // this.toastr.error(error);
    this.ShowAlert(error,"error")
     console.log(error);
  });

}
GetApplyLeaveDepartments() {
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
      this.ApplyDepartmentList = data.List;
    }
  }, (error) => {
    // this.toastr.error(error);
    this.ShowAlert(error,"error")
     console.log(error);
  });
}

getEmployeeList(){
  const json:any = {
      ReportType:"leave",
      AdminID:this.AdminID
  }
  if (this.selectedBranch) {
    json["BranchID"] =  this.selectedBranch.map((br:any)=>{return br.Value})
   }
  if (this.selectedDepartment) {
    json["DepartmentID"] =  this.tempdeparray.map((br:any)=>{ return br.id})
   }
this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch",json).subscribe((data) => {
this.EmployeeList = data.List
}
,(error) => {
console.log(error);this.spinnerService.hide();
});
}
 onDeptSelect(item:any){
  console.log(item,"item");
  this.tempdeparray.push({id:item.Value, text:item.Text });
  if(this.tempdeparray.length  == this.ApplyDepartmentList.length) this.onDeptDeSelectAll()
  this.selectedEmployees = []
  this.getEmployeeList()
 }
onDeptSelectAll(){
   this.tempdeparray = [...this.ApplyDepartmentList]
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
    this.tempdeparray = this.ApplyDepartmentList.map((dl:any)=>{return {id:dl.Value, text:dl.Text }}).filter((dl:any)=>dl.id != item.Value && dl.text != item.Text)
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
 this.ApplyDepartmentList = []
 this.GetDepartments();
 this.selectedEmployees = []
 this.getEmployeeList()
}
OnEmployeesChange(_event:any){
}
OnEmployeesChangeDeSelect(event:any){ 
}

    ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
      this.dialog.open(ShowalertComponent, {
        data: { message, type },
        panelClass: 'custom-dialog',
        disableClose: true  // Prevents closing on outside click
      }).afterClosed().subscribe((res:any) => {
        if (res) {
          console.log("Dialog closed");
        }
      });
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
    

    private get_default_branch(): void {
        
        this.formInput.ToDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
        this.formInput.FromDate = this.getFirstDateOfMonth();
        console.log(this.formInput.ToDate);

      
        let api_url = "api/Settings/GetDefaultBranch?userId=" + this.UserID + "";
        this._commonservice.GetWithOneParam(api_url).subscribe({
            next: (result: any) => {
                console.log(result);
                
                if (result.Status==true) {
                    
                    
                    let selected_org = this.OrgList.find(i => i.Value == result.SuborgID);
                    if (selected_org != null) {
                        this.selectedListOrganization = [{ Value: selected_org.Value, Text: selected_org.Text }];
                        this.load_branches();
                        this.default_branch_id = result.DefaultBranchID;
                        this.selectedBranchId = result.DefaultBranchID;
                       
                    }

                }
            },
            error: (error:any) => {
                this.toastr.error(error.message);
            }
        });
    }
}