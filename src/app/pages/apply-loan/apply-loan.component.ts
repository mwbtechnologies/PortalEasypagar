import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ApproveLoanComponent } from './approve-loan/approve-loan.component';
import { CommonTableComponent } from '../common-table/common-table.component';

export class FormInput{
  Amount:any;
      Comment:any;
}

export class Dropdown{
  Text:any;
  Value:any;
}
@Component({
  selector: 'app-apply-loan',
  templateUrl: './apply-loan.component.html',
  styleUrls: ['./apply-loan.component.css']
})
export class ApplyLoanComponent implements OnInit {
  formInput: FormInput | any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiUrl:any;
  file:any;
  editid:any;
  EmployeeId:any;
  selectedLoanIds: string[] | any;
  OrgID:any;RecordID:any;
  LeaveList:any;
  LeaveURL:any;
  Add=true;Editdetails:any;
  Edit=false;View=true;ShowDay=true;
  index=0;LeaveTypes:any;UserID:any;FilteredList:any;
  LoanTypes:Array<Dropdown> = [];
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();RecordDate:any;
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

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
     //common table
     this.actionOptions = [{
      name: "View",
      icon: "fa fa-eye",
    }];

  this.displayColumns= {
    "SLno":"SL No",
    "RequestDate":"REQUESTED DATE",
    "LoanType":"LOAN TYPE",
    "RequestedAmount":"AMOUNT",
    "ReasonForLoan":"REASON",
    "ApproveStatus":"STATUS",
    "ApprovedAmount":"APPROVED AMOUNT",
    "Actions":"ACTIONS"
  },


  this.displayedColumns= [
    "SLno",
    "RequestDate",
    "LoanType",
    "RequestedAmount",
    "ReasonForLoan",
    "ApproveStatus",
    "ApprovedAmount",
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
    this.UserID = localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
    if (this.UserID==null) {

      this._router.navigate(["auth/signin"]);
    }
    this.formInput={
      Amount:'',
      Comment:'',
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
    
     this.RecordID=  localStorage.getItem("RecordID");
     this.RecordDate=  localStorage.getItem("RecordDate");
     if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
     {
       var ttoday=this.parseDateString(this.RecordDate); 
       const year = ttoday.getFullYear();
       const month = (ttoday.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
       const day = ttoday.getDate().toString().padStart(2, '0');
       this.formInput.FromDate= `${year}-${month}-${day}`;  this.formInput.ToDate= `${year}-${month}-${day}`;
       this.GetloanList();
     }
     else{
       const today = new Date();
       const year = today.getFullYear();
       const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
       const day = today.getDate().toString().padStart(2, '0');
       var currentdate = `${year}-${month}-${day}`;
       this.formInput.FromDate= `${year}-${month}-${day}`;  this.formInput.ToDate= `${year}-${month}-${day}`;
       this.GetloanList();
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

  back(){
    this._router.navigate(['/mydashboard']);
  }
  GetListTypes()
{
  let arr=new Dropdown();
  arr.Text="Loan";
  arr.Value="Loan";
  this.LoanTypes.push(arr);

  arr=new Dropdown();
  arr.Text="Advance";
  arr.Value="Advance";
  this.LoanTypes.push(arr);

}
  GetloanList()
  {
    this.employeeLoading = true
    this.spinnerService.show();
    if(this.formInput.FromDate==""||this.formInput.FromDate==null){
    this.toastr.warning("Please Select FromDate");
    this.spinnerService.hide();
    }
    else if(this.formInput.ToDate==""||this.formInput.ToDate==null){
      this.toastr.warning("Please Select ToDate");
      this.spinnerService.hide();
    }
    else
    {
      const json={
        BranchID:0,
        DeptId:0,
        FromDate:this.formInput.FromDate,
        ToDate:this.formInput.ToDate,
        AdminID:this.UserID
                }
          this._commonservice.ApiUsingPost("Admin/GetAllLoanRequests",json).subscribe((res:any) => {
            var table = $('#DataTables_Table_0').DataTable();
            table.destroy();
            this.LeaveList = res.Requests;
            this.FilteredList = this.LeaveList.filter((item: { EmpID: any; }) => this.UserID == item.EmpID).map((l: any, i: any) => { return { SLno: i + 1, ...l } });
            if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
              {
                this.FilteredList = res.Requests.filter((item:any) => item.LoanID ===parseInt(this.RecordID));
                if(this.FilteredList.length==1)
                {
                  localStorage.removeItem("RecordID");this.RecordID=0;
        localStorage.removeItem("RecordDate");this.RecordDate=null;
                  this.openDialog(this.FilteredList[0]);
                }
              }
            this.dtTrigger.next(null);
            this.employeeLoading = false
            this.spinnerService.hide();
          }, (error) => {
            // this.toastr.error(error.message);
            this.employeeLoading = false
            this.spinnerService.hide();
          });
    }

}

openDialog(IL: any): void {
  this.dialog.open(ApproveLoanComponent,{
    data: { IL }
     ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
    if(res){
      localStorage.removeItem("RecordID");this.RecordID=0;
  localStorage.removeItem("RecordDate");this.RecordDate=null;
      this.GetloanList();
    }
  })
}

  edit(ID: number): any {
    this.spinnerService.show();
     this.ApiUrl="Admin/GetLoanDetails?LoanID="+ID;
     this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
       this.Editdetails = data.Requests;
       this.spinnerService.hide();
       this.Edit = true;
       this.Add = false;
       this.View=false;
       this.editid=ID;   
       this.selectedLoanIds = this.Editdetails[0].LoanType;
       this.formInput.Amount= this.Editdetails[0].RequestedAmount;
       this.formInput.Comment = this.Editdetails[0].ReasonForLoan; 
       this.View= false;
       this.Add=false;
       this.Edit=true   
       this.spinnerService.hide();  
      }, (error) => {
       this.spinnerService.hide();
     })  
   }

   CheckNextDate(date:any)
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
   validateamount(event:any)
   {
     const inputChar = String.fromCharCode(event.keyCode || event.charCode);
     if (!/^\d+$/.test(inputChar)) {
     this.toastr.warning("Please Enter Valid Input")
     this.formInput.Amount.clear();
     }
   }

   Search()
   {
     this.RecordDate=null;this.RecordID=0;
     localStorage.removeItem("RecordID");
     localStorage.removeItem("RecordDate");
     this.GetloanList();
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
    this.ApiUrl="Admin/CheckLeaveDate?UserDate="+date;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
      if(data.Status==true){
       this.spinnerService.hide();
          return true;
       }
       else{
         this.spinnerService.hide();
         this.toastr.warning("Date should be greater than Current Date");
         this.formInput.ToDate='';
        
          return false;
       }
    
    }, (error: any) => {
     this.spinnerService.hide();
     this.toastr.warning(error.message);
     return false;
    }
    );
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
 
     if(this.selectedLoanIds==""||this.selectedLoanIds==undefined || this.selectedLoanIds==null){
     this.toastr.warning("Please Select Loan Type");

     }
     else if(this.formInput.Amount==""||this.formInput.Amount==undefined || this.formInput.Amount==null){
       this.toastr.warning("Please Enter Amount");

     }
    else if(this.formInput.Comment==""||this.formInput.Comment==null){
      this.toastr.warning("Please Enter Reason For Loan");

    }
     else
     {
      this.spinnerService.show();
       const json={
        LoanType:this.selectedLoanIds,
        EmpID:this.UserID,
        RequestedAmount:this.formInput.Amount,
        Comment:this.formInput.Comment,
                 }
           this._commonservice.ApiUsingPost("Employee/RequestLoan",json).subscribe((res:any) => {
            if(res.Status==true)
            {
              this.toastr.success(res.Message,"Successfull");
              window.location.reload();
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
  if(this.selectedLoanIds==""||this.selectedLoanIds==undefined || this.selectedLoanIds==null){
    this.toastr.warning("Please Select Loan Type");

    }
    else if(this.formInput.Amount==""||this.formInput.Amount==undefined || this.formInput.Amount==null){
      this.toastr.warning("Please Enter Amount");

    }
   else if(this.formInput.Comment==""||this.formInput.Comment==null){
     this.toastr.warning("Please Enter Reason For Loan");

   }
   else
   {
     const json={
      LoanType:this.selectedLoanIds,
        EmpID:this.UserID,
        RequestedAmount:this.formInput.Amount,
        Comment:this.formInput.Comment,
        LoanID:this.editid
               }
         this._commonservice.ApiUsingPost("Employee/UpdateLoan",json).subscribe((res:any) => {
          if(res.Status==true)
          {
            this.toastr.success(res.Message);
            window.location.reload();
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
