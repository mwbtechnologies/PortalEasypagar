import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../common-table/common-table.component';

export class FormInput{
  FromDate:any;
  ToDate:any;
  NoOfDays:any;
      isHalfDay:any;
      Comment:any;
      isFullDay:any;
}

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent  implements OnInit {
  formInput: FormInput | any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiUrl:any;
  file:any;
  editid:any;
  EmployeeId:any;
  selectedLeaveIds: string[] | any;
  OrgID:any;RecordID:any;
  LeaveList:any;
  LeaveURL:any;
  Add=true;Editdetails:any;
  Edit=false;View=true;ShowDay=true;
  index=0;LeaveTypes:any;UserID:any;FilteredList:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
  RecordDate:any;LoginTypes:any=["Paid Leave","UnPaid Leave","Sick Leave","POW"];
  leaveSettings:IDropdownSettings = {}
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
      @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
      //ends here
  
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private toastr:ToastrService,private dialog: MatDialog){ 
    this.isSubmit=false

    this.leaveSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

     //common table
     this.actionOptions = [{
        name: "View",
        icon: "fa fa-eye",
      }];

    this.displayColumns= {
      "SLno":"SL No",
      "RequestDate":"REQUESTED DATE",
      "LeaveType":"LEAVE TYPE",
      "NoOfDays":"DAYS",
      "ReasonForLeave":"REASON",
      "ApproveStatus":"STATUS",
      "Actions":"ACTIONS"
    },


    this.displayedColumns= [
      "SLno",
      "RequestDate",
      "LeaveType",
      "NoOfDays",
      "ReasonForLeave",
      "ApproveStatus",
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
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };  this.dtOptions = 
    {
      pagingType: 'full_numbers',
       pageLength: 10
    };
      this.AdminID = localStorage.getItem("AdminID");
      this.UserID = localStorage.getItem("UserID");
      this.OrgID = localStorage.getItem("OrgID");
    this.formInput={
      FormDate:'',
      ToDate:'',
      NoOfDays:0,
      isHalfDay:false,
      Comment:'',
      isFullDay:true
    }
    this.formInput={
      FormDate:'',
      ToDate:''
    }
    this.RecordID=  localStorage.getItem("RecordID");
    this.RecordDate=  localStorage.getItem("RecordDate");
    if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
    {
      var ttoday=this.parseDateString(this.RecordDate); 
      const year = ttoday.getFullYear();
      const month = (ttoday.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = ttoday.getDate().toString().padStart(2, '0');
      this.formInput.FromDate= `${year}-${month}-${day}`;  this.formInput.ToDate= `${year}-${month}-${day}`;
      this.GetleaveList();
    }
    else{
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = today.getDate().toString().padStart(2, '0');
      var currentdate = `${year}-${month}-${day}`;
      this.formInput.FromDate= `${year}-${month}-${day}`;  this.formInput.ToDate= `${year}-${month}-${day}`;
    }
 
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   this.GetLoginTypes();
  }
  public GetLoginTypes()
{
  https://easypagar.com/easypagar/api/Admin/GetCheckInTypes/Session/0/en
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
back(){
  this._router.navigate(['/mydashboard']);
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

  onleaveSelect(item:any){

  }
  onleaveDeSelect(item:any){

  }
  GetLeaveTypes()
  {
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
  Search()
  {
    localStorage.removeItem("RecordID");this.RecordID=0;
    localStorage.removeItem("RecordDate");this.RecordDate=null;
    this.GetleaveList();
  }
  GetleaveList()
  {
    this.employeeLoading = true
    const json = {
      BranchID: 0,
      FromDate: this.formInput.FromDate,
      ToDate:this.formInput.ToDate,
      AdminID: this.AdminID,
      DeptID: 0,
      Key:'en'
    }
      this._commonservice.ApiUsingPost("Admin/GetAllLeaveRequests",json).subscribe((res:any) => {
        var table = $('#DataTables_Table_0').DataTable();
        table.destroy();
        this.LeaveList = res.List;
        this.FilteredList = this.LeaveList.filter((item: { EmpID: any; }) => this.UserID == item.EmpID).map((l: any, i: any) => { return { SLno: i + 1, ...l } });
          if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
            {
              this.FilteredList = res.List.filter((item:any) => item.RequestID ===parseInt(this.RecordID));
              if(this.FilteredList.length==1)
              {
                localStorage.removeItem("RecordID");this.RecordID=0;
                localStorage.removeItem("RecordDate");this.RecordDate=null;
                this.openDialog(this.FilteredList[0]);
              }
            }
            this.employeeLoading = false
        this.dtTrigger.next(null);
        this.spinnerService.hide();
      }, (error) => {
        // this.toastr.error(error.message);
        this.employeeLoading = false
        this.spinnerService.hide();
      });
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

  validatedays(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.toastr.warning("Please Enter Valid Input")
  this.formInput.NoOfDays.clear();
  }
}

  edit(ID: number): any {
    this.spinnerService.show();
     this.ApiUrl="Admin/GetLeaveDetails?RequestID="+ID;
     this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
       this.Editdetails = data.List;
       this.spinnerService.hide();
       this.Edit = true;
       this.Add = false;
       this.editid=ID;   
       this.selectedLeaveIds = this.Editdetails[0].LeaveType;
       this.formInput.FormDate= this.Editdetails[0].FromDateTime;
       this.formInput.NoOfDays = this.Editdetails[0].NoOfDays; 
       this.formInput.isHalfDay = this.Editdetails[0].IsHalfDay; 
       if(this.formInput.isHalfDay==true) {this.formInput.isFullDay =false; }
       else{this.formInput.isFullDay =true; }
       this.formInput.Comment = this.Editdetails[0].ReasonForLeave; 
       this.View= false;
       this.Add=false;
       this.Edit=true   
       this.spinnerService.hide();  
      }, (error) => {
       this.spinnerService.hide();
     })  
   }
   CheckDate(date:any)
   {
    this.ApiUrl="Admin/CheckDate?UserDate="+date;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
      if(data.Status==true){
       this.spinnerService.hide();
          return true;
       }
       else{
         this.spinnerService.hide();
         this.toastr.warning("Date should be greater than Current Date");
         this.formInput.FromDate='';
        
          return false;
       }
    
    }, (error: any) => {
     this.spinnerService.hide();
     this.toastr.warning(error.message);
     return false;
    }
    );
   }
   CheckToDate(date:any)
   {
    if(this.formInput.FromDate==""||this.formInput.FromDate==null ||this.formInput.FromDate==undefined)
        {
          this.spinnerService.hide();
          this.toastr.warning("Please Select FromDate");
          this.formInput.ToDate='';
        }
        else
        {
          this.ApiUrl="Admin/CheckDateRange?FromDate="+this.formInput.FromDate+"&ToDate="+date;
          this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
            if(data.Status==true){
             this.spinnerService.hide();
                return true;
             }
             else{
               this.spinnerService.hide();
               this.toastr.warning("ToDate should be greater than FromDate");
               this.formInput.FromDate='';              
                return false;
             }
          
          }, (error: any) => {
           this.spinnerService.hide();
           this.toastr.warning(error.message);
           return false;
          }
          );
        }
   }
  
   ShowAdd()
   {
    this.View=false;
    this.Edit=false;
    this.Add=true;
   }
   ShowEdit(ID:any)
   {
this.editid=ID;
this.View=true;
    this.Edit=true;
    this.Add=false;
   }
   ShowDays()
   {
    if(this.ShowDay==true)
    {
      this.ShowDay=false;
      this.formInput.isFullDay=false;
      this.formInput.isHalfDay=true;
      this.formInput.NoOfDays=0;
    }
    else{
      this.ShowDay=true;
      this.formInput.isFullDay=true;
      this.formInput.isHalfDay=false;
    }
   }
   CreateRequest()
   {
     this.spinnerService.show();
     if(this.selectedLeaveIds==""||this.selectedLeaveIds==undefined || this.selectedLeaveIds==null){
     this.toastr.warning("Please Select Leave Type");
     this.spinnerService.hide();
     }
     else if(this.formInput.FromDate==""||this.formInput.FromDate==undefined || this.formInput.FromDate==null){
       this.toastr.warning("Please Select Date");
       this.spinnerService.hide();
     }
     else if(this.formInput.isHalfDay==false && (this.formInput.NoOfDays==0 || this.formInput.NoOfDays=="")){
      this.toastr.warning("Please Enter NoOfDays");
      this.spinnerService.hide();
    }
    else if(this.formInput.Comment==""){
      this.toastr.warning("Please Enter Reason For Leave");
      this.spinnerService.hide();
    }
     else
     {
       const json={
        LeaveType:this.selectedLeaveIds,
        EmpID:this.UserID,
        isHalfDay:this.formInput.isHalfDay,
        isFullDay:this.formInput.isFullDay,
        NoOfDays:this.formInput.NoOfDays,
        FromDateTime:this.formInput.FromDate,
        ToDateTime:this.formInput.FromDate,
        Comment:this.formInput.Comment,
        AdminID:this.AdminID
                 }
           this._commonservice.ApiUsingPost("Employee/RequestLeave",json).subscribe((res:any) => {
            if(res.Status==true)
            {
              this.toastr.success(res.Message);
            this.GetleaveList()
            }
            else{
              this.toastr.warning(res.Message);
            }
             this.spinnerService.hide();
           }, (error) => {
             // this.toastr.error(error.message);
             this.spinnerService.hide();
           });
           this.spinnerService.hide();
     }
 
 }
 UpdateRequest()
 {
   this.spinnerService.show();
   if(this.selectedLeaveIds==""||this.selectedLeaveIds==undefined || this.selectedLeaveIds==null){
   this.toastr.warning("Please Select Leave Type");
   this.spinnerService.hide();
   }
   else if(this.formInput.FromDate==""||this.formInput.FromDate==undefined || this.formInput.FromDate==null){
     this.toastr.warning("Please Select Date");
     this.spinnerService.hide();
   }
   else if(this.formInput.isHalfDay==false && (this.formInput.NoOfDays==0 || this.formInput.NoOfDays=="")){
    this.toastr.warning("Please Enter NoOfDays");
    this.spinnerService.hide();
  }
  else if(this.formInput.Comment==""){
    this.toastr.warning("Please Enter Reason For Leave");
    this.spinnerService.hide();
  }
   else
   {
     const json={
      LeaveType:this.selectedLeaveIds,
      EmpID:this.UserID,
      isHalfDay:this.formInput.isHalfDay,
      isFullDay:this.formInput.isFullDay,
      NoOfDays:this.formInput.NoOfDays,
      FromDateTime:this.formInput.FromDate,
      ToDateTime:this.formInput.FromDate,
      Comment:this.formInput.Comment,
      AdminID:this.AdminID,
      RequestID:this.editid
               }
         this._commonservice.ApiUsingPost("Employee/UpdateLeave",json).subscribe((res:any) => {
          if(res.Status==true)
          {
            this.toastr.success(res.Message);
          this.GetleaveList()
          }
          else{
            this.toastr.warning(res.Message);
          }
           this.spinnerService.hide();
         }, (error) => {
           // this.toastr.error(error.message);
           this.spinnerService.hide();
         });
         this.spinnerService.hide();
   }

}

 //common table
 actionEmitter(data:any){
  if(data.action.name == "View"){
    this.openDialog(data.row);
  }
  
}

//ends here
} 
