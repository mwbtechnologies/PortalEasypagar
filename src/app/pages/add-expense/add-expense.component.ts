import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { ApproveexpenseComponent } from './approveexpense/approveexpense.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewExpenseDetailsComponent } from './approveexpense/view-expense-details/view-expense-details.component';
import { CommonTableComponent } from '../common-table/common-table.component';
export class FormInput {
  ExpID:any;
  EmpID:any;
  ExpHeadID:any;
  ExpTypeID:any;
  SourceLocation:any;
  DestinationLocation:any;
  ExpenseDateTime:any;
  TravelDateTime:any;
  BillImages:any;
  CommentByEmployee:any;
  Amount:any;
  CommentByAdmin:any;
  HotelName:any;
  HotelDetails:any;
  LocationLatitude:any;
  LocationLongitude:any;
  BoardFromDate:any;
  BoardToDate:any;
  FromDate:any;
  ToDate:any;
}
export class BillImages
{
  BillImageUrl:any;
}

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit{
  formInput: FormInput|any;
  ImageClass :Array<BillImages> = [];
  public isSubmit: boolean;
  Editdetails: any;
  editid: any;
  Add = true;
  Edit = false;
  View = true;AdminID:any;UserID:any;
  ExpenseHeads:any; ExpenseTypes:any;ApiURL:any;
  selectedExpenseTypeId:string[]|any; selectedExpenseHeadId:string[]|any;filteredExpenseHeadId:string[]|any;
   institutionsList:any;
   dtExportButtonOptions: any = {};
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   file:File | any;ImageUrl:any;ShowImage=false; ShowHotel=false;ShowTravel=false;
   ExpenseHeadID:any;index:any; length:any;RecordID:any;RecordDate:any;

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

   AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;
  constructor(private dialog: MatDialog,private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
    this.isSubmit = false;

    //common table
    this.actionOptions = [{
      name: "View",
      icon: "fa fa-eye",
    }];

  this.displayColumns= {
    "SLno":"SL No",
    "ExpenseTypeName":"EXPENSE TYPE",
    "ApprovedAmount":"AMOUNT",
    "ExpenseDateTime":"DATE",
    "CommentByEmployee":"REASON",
    "Status":"ACTION",
    "Actions":"ACTIONS"
  },


  this.displayedColumns= [
    "SLno",
    "ExpenseTypeName",
    "ApprovedAmount",
    "ExpenseDateTime",
    "CommentByEmployee",
    "Status",
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
    this.formInput = {     
      ExpID:0,
      EmpID:0,
      ExpHeadID:0,
      ExpTypeID:0,
      SourceLocation:'',
      DestinationLocation:'',
      ExpenseDateTime:'',
      TravelDateTime:'',
      BillImages:'',
      CommentByEmployee:'',
      CommentByAdmin:'',
      HotelName:'',
      HotelDetails:'',
      LocationLatitude:'',
      LocationLongitude:'',
      BoardFromDate:'',
      BoardToDate:'',
      Amount:0,
      FromDate:'',
      ToDate:''
    };
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };
    this.RecordID=  localStorage.getItem("RecordID");
    this.RecordDate=  localStorage.getItem("RecordDate");
    if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
    {
      var ttoday=this.parseDateString(this.RecordDate); 
      const year = ttoday.getFullYear();
      const month = (ttoday.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = ttoday.getDate().toString().padStart(2, '0');
      this.formInput.StartDate= `${year}-${month}-${day}`;  this.formInput.EndDate= `${year}-${month}-${day}`;
      this.GetExpenseList();
    }
    else{
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const day = today.getDate().toString().padStart(2, '0');
      this.formInput.StartDate = `${year}-${month}-${day}`;
      this.formInput.EndDate=`${year}-${month}-${day}`;
      this.GetExpenseList();
    } 
    this._commonservice.ApiUsingGetWithOneParam("Employee/GetExpenseHeads/en").subscribe((data) => this.ExpenseHeads = data.ExpenseTypes, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }

  back(){
    this._router.navigate(['/mydashboard']);
  }

  
  Search()
  {
    this.RecordID=0;this.RecordDate=null;
    localStorage.removeItem("RecordID");
    localStorage.removeItem("RecordDate");
    this.GetExpenseList();
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

  openDialog(IL: any): void {
    this.dialog.open(ViewExpenseDetailsComponent,{
      data: { IL, fulldata: this.institutionsList }
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
      if(res){
        localStorage.removeItem("RecordID");this.RecordID=0;
        localStorage.removeItem("RecordDate");this.RecordDate=null;
        this.GetExpenseList();
      }
    })
  }
  UploadProof1Image1(event:any,form: NgForm) {
      const target = event.target as HTMLInputElement;
      this.ImageClass=[];
      this.length=target.files?.length;
      for(this.index=0;this.index<this.length;this.index++)
      {
        let cn=new BillImages();
      cn.BillImageUrl=(target.files as FileList)[this.index];
      this.file = (target.files as FileList)[this.index];
      var reader = new FileReader();
      reader.onload = (event: any) => {
     this.ImageUrl=cn.BillImageUrl;
      }
      reader.readAsDataURL(this.file);
    
      const fData: FormData = new FormData();
      fData.append('formdata', JSON.stringify(form.value));
      fData.append('FileType', "Image");
      if (this.file != undefined) { fData.append('File', this.file, this.file.name);
      this._commonservice.ApiUsingPost("Admin/FileUpload",fData).subscribe(data => { 
        this.ImageUrl=data.URL;
        if(data.URL!=null && data.URL!=""&& data.URL!=undefined)
        {
          let arr=new BillImages();
          arr.BillImageUrl=data.URL;
          this.ImageClass.push(arr);
          this.ShowImage = true;
        }
      });}        
      }
  

  }
  OnHeadChange(event:any)
  {
    this.ApiURL="Employee/GetExpenseTypes?HeadID="+event.Value;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.ExpenseTypes = data.SubExpenseTypes, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
    this.selectedExpenseHeadId=event.Value;
    if(event.Value==2)
    {
      this.ShowTravel=true;this.ShowHotel=false;
    }
   else if(event.Value==4)
    {
      this.ShowTravel=false;this.ShowHotel=true;
    }
    else{
      this.ShowTravel=false;this.ShowHotel=false;
    }
  }
  OnVisitChange(event:any)
  {
    this.selectedExpenseTypeId=event.Value;
   
  }

  GetExpenseList() {
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
    var json={
      ExpenseTypeID:0,
      BranchID:0,
      AdminID:this.AdminID,
      EmployeeID:this.UserID,
      FromDate:this.formInput.StartDate,
      ToDate:this.formInput.EndDate,
      Key:'en'
    }
    this._commonservice.ApiUsingPost("Admin/GetExpenseList",json).subscribe((res: any) => {
      if(res.Status==true)
      {
        var table = $('#DataTables_Table_0').DataTable();
        table.destroy();
        console.log(res);
        this.institutionsList = res.ExpenseList;
        this.institutionsList = this.institutionsList.filter((item: { EmployeeID: any; }) => this.UserID == item.EmployeeID).map((l: any, i: any) => { return { SLno: i + 1, ...l } });
        if(this.RecordDate!=null && this.RecordDate!=0 &&  this.RecordDate!=undefined &&  this.RecordDate!='' &&this.RecordID!=null && this.RecordID!=0 &&  this.RecordID!=undefined &&  this.RecordID!='')
          {
            this.institutionsList = res.ExpenseList.filter((item:any) => item.ExpenseID ===parseInt(this.RecordID));
            if(this.institutionsList.length==1)
            {
              localStorage.removeItem("RecordID");this.RecordID=0;
    localStorage.removeItem("RecordDate");this.RecordDate=null;
              this.openDialog(this.institutionsList[0]);
            }
          }

        this.dtTrigger.next(null);
        this.employeeLoading = false
        this.spinnerService.hide();
      }
      else{
        this.globalToastService.warning(res.Message);
        this.spinnerService.hide();
        this.employeeLoading = false
      }
 
      
    }, (error) => {
      this.spinnerService.hide();
    });
  }

  
    Update() {
      this.formInput.ExpID=this.editid;
      this.formInput.EmpID=this.UserID;
      if (this.selectedExpenseHeadId == ""||this.selectedExpenseHeadId ==undefined || this.selectedExpenseHeadId ==null) {
        this.globalToastService.warning("Please Select Expense Head...!");
        return false;
      }
      else  if (this.selectedExpenseTypeId == ""||this.selectedExpenseTypeId ==undefined || this.selectedExpenseTypeId ==null) {
        this.globalToastService.warning("Please Select Expense Type...!");
        return false;
      }
        if ((this.formInput.SourceLocation == ""||this.formInput.SourceLocation ==undefined || this.formInput.SourceLocation ==null)&&(this.ShowTravel==true)) {
          this.globalToastService.warning("Please Enter Source Location...!");
          return false;
        }
        else if ((this.formInput.DestinationLocation == ""||this.formInput.DestinationLocation ==undefined || this.formInput.DestinationLocation ==null)&&(this.ShowTravel==true)) {
          this.globalToastService.warning("Please Enter Destination Location");
          return false;
        } 
        else if (this.formInput.ExpenseDateTime == ""||this.formInput.ExpenseDateTime ==undefined || this.formInput.ExpenseDateTime ==null) {
          this.globalToastService.warning("Please Select ExpenseDateTime");
          return false;
        } 
        else if ((this.formInput.HotelName == ""||this.formInput.HotelName ==undefined || this.formInput.HotelName ==null)&&(this.ShowHotel==true)) {
          this.globalToastService.warning("Please Enter HotelName");
          return false;
        } 
        else if ((this.formInput.HotelDetails == ""||this.formInput.HotelDetails ==undefined || this.formInput.HotelDetails ==null)&&(this.ShowHotel==true)) {
          this.globalToastService.warning("Please Enter HotelDetails");
          return false;
        }
        else if (this.formInput.Amount == ""||this.formInput.Amount ==undefined || this.formInput.Amount ==null || this.formInput.Amount==0) {
          this.globalToastService.warning("Please Enter Valid Amount");
          return false;
        }     
        else{
          this.formInput.BoardFromDate=this.formInput.ExpenseDateTime;
          this.formInput.BoardToDate=this.formInput.ExpenseDateTime;
          this.formInput.TravelDateTime=this.formInput.ExpenseDateTime;
          this.formInput.BillImages=this.ImageClass;
          this._commonservice.ApiUsingPost("Employee/UpdateExpense",this.formInput).subscribe(
      
            (data: any) => {
              if(data.Status==true){
              this.spinnerService.hide();
              this.Add = false;
              this.Edit = false;
              this.View = true;
              this.globalToastService.success(data.Message);
                window.location.reload();
              }
              else
              {
                this.globalToastService.warning(data.Message);
                  this.spinnerService.hide();
              }
              
            }, (error: any) => {
              localStorage.clear();
      
              this.globalToastService.error(error.message);
              this.spinnerService.hide();
             }
          );
          return true;
        }
      }

      CheckDate(date:any)
      {
        if(this.formInput.FromDate==""||this.formInput.FromDate==null ||this.formInput.FromDate==undefined)
        {
          this.spinnerService.hide();
          this.globalToastService.warning("Please Select FromDate");
          this.formInput.ToDate='';
        }
        else
        {
          this.ApiURL="Admin/CheckDateRange?FromDate="+this.formInput.FromDate+"&ToDate="+date;
          this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
            if(data.Status==true){
             this.spinnerService.hide();
                return true;
             }
             else{
               this.spinnerService.hide();
               this.globalToastService.warning("ToDate should be greater than FromDate");
               this.formInput.FromDate='';              
                return false;
             }
          
          }, (error: any) => {
           this.spinnerService.hide();
           this.globalToastService.warning(error.message);
           return false;
          }
          );
        }
      
      }
       edit(ID: number): any {
     this.spinnerService.show();
      this.ApiURL="Admin/EditShift?Id="+ID;
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
        if(data.Status==true)
        {
          this.Editdetails = data.Data;
          this.spinnerService.hide();
          this.editid=ID;   
          // this.selectedBranchId=this.Editdetails.BranchID;
          // this.selectedDepartmentId=this.Editdetails.DeptID;
          this.formInput.ShiftName = this.Editdetails.ShiftName;
          this.formInput.FromTime= this.Editdetails.FromTime;
          this.formInput.ToTime = this.Editdetails.ToTime; 
          this.View= false;
          this.Add=false;
          this.Edit=true 
        }
      
        this.spinnerService.hide();  
       }, (error) => {
        this.spinnerService.hide();
      })  
    }  
    
validateamount(event:any)
{
  const inputChar = String.fromCharCode(event.keyCode || event.charCode);
  if (!/^\d+$/.test(inputChar)) {
  this.globalToastService.warning("Please Enter Valid Input")
  this.formInput.Amount.clear();
  }
}
    
   CreateShift() {
    this.formInput.EmpID=this.UserID;
    if (this.selectedExpenseHeadId == ""||this.selectedExpenseHeadId ==undefined || this.selectedExpenseHeadId ==null) {
      this.globalToastService.warning("Please Select Expense Head...!");
      return false;
    }
    else if ((this.selectedExpenseTypeId == ""||this.selectedExpenseTypeId ==undefined || this.selectedExpenseTypeId ==null) && (this.ShowHotel==false && this.ShowTravel==false)) {
      this.globalToastService.warning("Please Select Expense Type...!");
      return false;
    }
      if ((this.formInput.SourceLocation == ""||this.formInput.SourceLocation ==undefined || this.formInput.SourceLocation ==null)&&(this.ShowTravel==true)) {
        this.globalToastService.warning("Please Enter Source Location...!");
        return false;
      }
      else if ((this.formInput.DestinationLocation == ""||this.formInput.DestinationLocation ==undefined || this.formInput.DestinationLocation ==null)&&(this.ShowTravel==true)) {
        this.globalToastService.warning("Please Enter Destination Location");
        return false;
      } 
      else if (this.formInput.ExpenseDateTime == ""||this.formInput.ExpenseDateTime ==undefined || this.formInput.ExpenseDateTime ==null) {
        this.globalToastService.warning("Please Select ExpenseDateTime");
        return false;
      } 
      else if ((this.formInput.HotelName == ""||this.formInput.HotelName ==undefined || this.formInput.HotelName ==null)&&(this.ShowHotel==true)) {
        this.globalToastService.warning("Please Enter HotelName");
        return false;
      } 
      else if ((this.formInput.HotelDetails == ""||this.formInput.HotelDetails ==undefined || this.formInput.HotelDetails ==null)&&(this.ShowHotel==true)) {
        this.globalToastService.warning("Please Enter HotelDetails");
        return false;
      }
      else if (this.formInput.Amount == ""||this.formInput.Amount ==undefined || this.formInput.Amount ==null || this.formInput.Amount==0) {
        this.globalToastService.warning("Please Enter Valid Amount");
        return false;
      }     
      else{
        if(this.selectedExpenseTypeId == ""||this.selectedExpenseTypeId ==undefined || this.selectedExpenseTypeId ==null)
        {
this.selectedExpenseTypeId=0;
        }
        this.formInput.BoardFromDate=this.formInput.ExpenseDateTime;
        this.formInput.BoardToDate=this.formInput.ExpenseDateTime;
        this.formInput.TravelDateTime=this.formInput.ExpenseDateTime;
        this.formInput.BillImages=this.ImageClass;
        this.formInput.ExpHeadID=this.selectedExpenseHeadId;
        this.formInput.ExpTypeID=this.selectedExpenseTypeId;
        this._commonservice.ApiUsingPost("Employee/AddExpense",this.formInput).subscribe(
    
          (data: any) => {
            if(data.Status==true){
            this.spinnerService.hide();
            this.Add = false;
            this.Edit = false;
            this.View = true;
            this.globalToastService.success(data.Message);
              window.location.reload();
            }
            else
            {
              this.globalToastService.warning(data.Message);
                this.spinnerService.hide();
            }
            
          }, (error: any) => {
            localStorage.clear();
    
            this.globalToastService.error(error.message);
            this.spinnerService.hide();
           }
        );
        return true;
      }
        
    }
    AddNewModule()
    {
      this.spinnerService.show();
      this.View=false;
      this.Add=true;
      this.Edit=false;
      this.spinnerService.hide();this.selectedExpenseHeadId="";this.selectedExpenseTypeId="";
    }

    SearchExpense() {
      if(this.formInput.FromDate==''||this.formInput.FromDate ==undefined || this.formInput.FromDate ==null)
      {
        this.globalToastService.warning("Please select From Date");
      }
      else if(this.formInput.ToDate==''||this.formInput.ToDate ==undefined || this.formInput.ToDate ==null)
      {
        this.globalToastService.warning("Please select ToDate");
      }
      else{
        if(this.filteredExpenseHeadId==''||this.filteredExpenseHeadId ==undefined || this.filteredExpenseHeadId ==null)
        {
          this.ExpenseHeadID=0;
        }
        else
        {
          this.ExpenseHeadID=this.filteredExpenseHeadId;
        }

        const json={
          ExpenseTypeID:this.ExpenseHeadID,
          BranchID:0,
          EmployeeID:this.UserID,
          AdminID:this.AdminID,
          FromDate:this.formInput.FromDate,
          ToDate:this.formInput.ToDate
        }
        this.spinnerService.show();
        this._commonservice.ApiUsingPost("Admin/GetExpenseList",json).subscribe((sec) => {
          if(sec.Status==true)
          {  var table = $('#DataTables_Table_0').DataTable();
            table.destroy();      
            this.institutionsList = sec.ExpenseList;
            this.dtTrigger.next(null);
            this.Edit = false;this.Add = false;
          }
          this.spinnerService.hide();
        }, (error) => {
          this.spinnerService.hide();
          this.globalToastService.error("Error Occured");
        });
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
