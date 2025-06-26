import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Subject } from 'rxjs';

export class FormInput{
  FromDate:any;
  ToDate:any;
  NoOfDays:any;
  Comment:any;
  IsDateWise:any;
}
 export class DynamicArray
 {
  Date:any;
  IsHalfDay:any;
  IsFullDay:any;
  LeaveType:any;
 }

@Component({
  selector: 'app-apply-leave-new',
  templateUrl: './apply-leave-new.component.html',
  styleUrls: ['./apply-leave-new.component.css']
})
export class ApplyLeaveNewComponent implements OnInit {
  formInput: FormInput | any;
  DateRange:Array<DynamicArray> = [];
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
  Add=false;Editdetails:any;
  Edit=false;View=true;ShowDay=true;
  index=0;LeaveTypes:any;UserID:any;FilteredList:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  length:any; LeaveData:any;ShowRange:any;
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private toastr:ToastrService,private dialog: MatDialog){ this.isSubmit=false}
  ngOnInit(): void {
    this.ShowRange=false;
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
    if (this.UserID==null) {

      this._router.navigate(["auth/signin"]);
    }
    this.formInput={
      FormDate:'',
      ToDate:'',
      NoOfDays:0,
      isHalfDay:false,
      Comment:'',
      isFullDay:true,
      IsDateWise:false
    }
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
    this.GetLeaveTypes();
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
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
  GetleaveList()
  {
    this.spinnerService.show();
    if(this.formInput.FromDate==""){
    this.toastr.warning("Please Select FromDate");
    this.spinnerService.hide();
    }
    else if(this.formInput.ToDate==""){
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
          this._commonservice.ApiUsingPost("Admin/GetAllLeaveRequests",json).subscribe((res:any) => {
          var table = $('#DataTables_Table_0').DataTable();
         table.destroy();
            this.LeaveList = res.List;
            this.dtTrigger.next(null);
            this.FilteredList = this.LeaveList.filter((item: { EmpID: any; }) => this.UserID == item.EmpID);
            this.spinnerService.hide();
          }, (error) => {
            // this.toastr.error(error.message);
            this.spinnerService.hide();
          });
          this.spinnerService.hide();
    }

}
Viewlist()
  {
  window.location.reload();
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
       this.formInput.ToDate= this.Editdetails[0].ToDateTime;
       this.formInput.NoOfDays = this.Editdetails[0].NoOfDays; 
       this.DateRange=[];
       this.LeaveData=this.Editdetails[0].LeaveDetails;
       this.length=this.LeaveData.length;
       this.formInput.NoOfDays=this.length;
  for(this.index=0;this.index<this.length;this.index++)
  {
let c=new DynamicArray()
{
 c.Date=this.LeaveData[this.index].Date;
 c.IsFullDay=this.LeaveData[this.index].IsFullDay;
 c.IsHalfDay=this.LeaveData[this.index].IsHalfDay;
 if(this.selectedLeaveIds!=null && this.selectedLeaveIds!=undefined && this.selectedLeaveIds!=""){
   c.LeaveType=this.selectedLeaveIds; }
 else{ c.LeaveType="Casual Leave";}};
this.DateRange.push(c);  } 

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
    this.ApiUrl="Admin/CheckLeaveDate?UserDate="+date;
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

   validatedays(event:any)
   {
     const inputChar = String.fromCharCode(event.keyCode || event.charCode);
     if (!/^\d+$/.test(inputChar)) {
     this.toastr.warning("Please Enter Valid Input")
     this.formInput.NoOfDays.clear();
     }
   }
   showdaterange()
   {
    if(this.formInput.FromDate==null||this.formInput.FromDate==""||this.formInput.FromDate==undefined)
      {
      this.toastr.warning("Please Select Leave StartDate");
      }
      else if(this.formInput.ToDate==null||this.formInput.ToDate==""||this.formInput.ToDate==undefined)
      {
        this.toastr.warning("Please Select Leave EndDate");
      }
      else{
        if(this.DateRange.length>0)
          {
            this.ShowRange=true;
          }

      }
   }
   CheckToDate(date:any)
   {
if(this.formInput.FromDate==null||this.formInput.FromDate==""||this.formInput.FromDate==undefined)
{
this.toastr.warning("Please Select Leave StartDate");
}
else if(date==null||date==""||date==undefined)
{
  this.toastr.warning("Please Select Leave EndDate");
}
else{
  this.ApiUrl="Admin/GetLeaveRange?FromDate="+this.formInput.FromDate+"&ToDate="+date;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
      if(data.Status==true){
        this.DateRange=[];
        this.length=data.List.length;
        this.formInput.NoOfDays=this.length;
   for(this.index=0;this.index<this.length;this.index++)
   {
let c=new DynamicArray()
{
  c.Date=data.List[this.index].Date;
  c.IsFullDay=data.List[this.index].IsFullDay;
  c.IsHalfDay=data.List[this.index].IsHalfDay;
  if(this.selectedLeaveIds!=null && this.selectedLeaveIds!=undefined && this.selectedLeaveIds!=""){
    c.LeaveType=this.selectedLeaveIds;
  }
  else{
    c.LeaveType="Casual Leave";
  }
};
this.DateRange.push(c);
   }      
     }
     this.spinnerService.hide();
    
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
  this.View=false;
    this.Edit=true;
    this.Add=false;
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
        isHalfDay:false,
        isFullDay:true,
        NoOfDays:this.formInput.NoOfDays,
        FromDateTime:this.formInput.FromDate,
        ToDateTime:this.formInput.ToDate,
        Comment:this.formInput.Comment,
        AdminID:this.AdminID,
        LeaveDetails:this.DateRange
                 }
           this._commonservice.ApiUsingPost("Employee/RequestLeave",json).subscribe((res:any) => {
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
      isHalfDay:false,
      isFullDay:true,
      NoOfDays:this.formInput.NoOfDays,
      FromDateTime:this.formInput.FromDate,
      ToDateTime:this.formInput.ToDate,
      Comment:this.formInput.Comment,
      AdminID:this.AdminID,
      LeaveDetails:this.DateRange,
      RequestID:this.editid
               }
         this._commonservice.ApiUsingPost("Employee/UpdateLeave",json).subscribe((res:any) => {
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
OnLeaveTypeChange(event:any)
{
this.length=this.DateRange.length;
if(this.length>0)
{
  for(this.index=0;this.index<this.length;this.index++)
  {
    if(event.Value==8||event.Value=="8")
    {
      this.DateRange[this.index].LeaveType="Paid Leave";
    }
   else if(event.Value==7||event.Value=="7")
    {
      this.DateRange[this.index].LeaveType="Sick Leave";
    }
  else
    {
      this.DateRange[this.index].LeaveType="Casual Leave";
    }
    
  } 
}
 
} 
Deleteleave(ID:any){

    this.spinnerService.show();
    this.ApiUrl="Admin/DeleteLeave?LeaveID="+ID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe(data => {
      if(data.Status==true){
       this.toastr.success(data.Message);
       this.spinnerService.hide();
         window.location.reload();
      }
      else{
       this.toastr.warning(data.Message);
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

