import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
export class FormInput {
  FromDate:any;
  ToDate:any;
}
export class BillImages
{
  BillImageUrl:any;
}

export class Dropdown{
  Text:any;
  Value:any;
}

export class ExpenseList{
  ExpenseID:any;
  CommentByAdmin:any;
  ApprovedAmount:any;
  ApproveStatus:any;
}

@Component({
  selector: 'app-view-employee-expense',
  templateUrl: './view-employee-expense.component.html',
  styleUrls: ['./view-employee-expense.component.css']
})
export class ViewEmployeeExpenseComponent implements OnInit{
  formInput: FormInput|any;
  ImageClass :Array<BillImages> = [];
  SelectedList :Array<ExpenseList> = [];
  ListTypes:Array<Dropdown>=[];
  public isSubmit: boolean;
  Editdetails: any;
  editid: any;
  Add = false;
  Edit = false;
  SingleSelectionSettings:any;
  View = true;AdminID:any;UserID:any;
  ExpenseHeads:any; ExpenseTypes:any;ApiURL:any;
filteredExpenseHeadId:string[]|any;
   institutionsList:any;
   dtExportButtonOptions: any = {};
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   index:0 | any;
   file:File | any;ImageUrl:any;ShowImage=false; ShowHotel=false;ShowTravel=false; selectedStatusType:string[]|any;
   ExpenseHeadID:any; AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any; 
   ApplicationList:any=["All","Approved","Rejected","Pending"];
   dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
   Columns: any[] = [];AllBranchList: any[] = [];
   SelectedBranch: any = [];
   filterJson: any = {}
   selectedListTypeId:any;
   statusFilter: any;
   filterJsonDisplayName: any = {}
   selectedChips: string[] = [];
   filtersSelected: boolean = false;
   filterBarVisible: boolean = true;
   displayNames: any = {};OrgID:any;
   isScrolled: boolean = false;
   selectedDepartmentId: any;
   selectedBranchId: any;TypeSelectionSettings:any;
   OriginalBranchList: any; Branchstring: any; FilterType: any; selectedBranches: any; 
   selectedListType:any; UserListWithoutFilter: any[] = []; searchText: string = '';
   multiselectcolumns: IDropdownSettings = {};  ExpenseList:any;CurrentDate:any;
   chips: any[] = [];selectedDepartments: any = [];
   DeptColumns:any;OriginalDepartmentList:any;ShowShareButton:any;
   userselectedbranchid:any;
LocalExpense:any;TravelExpense:any;LodgeExpense:any;DNSExpense:any;ShowLocalExpense:any;ShowTravelExpense:any;ShowLodgeExpense:any;ShowDNSExpense:any;
selectedOrganization:any[]=[]
OrgList:any[]=[]
orgSettings:IDropdownSettings = {}
  constructor(private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
    this.isSubmit = false;
    this.SingleSelectionSettings = {
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
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }
  ngOnInit(): void {
    if (localStorage.getItem('LoggedInUserData') == null) {
  
      this._router.navigate(["auth/signin-v2"]);
    }
    this.userselectedbranchid=0;
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.selectedListType = "All";    
    this.Branchstring = localStorage.getItem('SelectedBranches');
    this.selectedBranches = JSON.parse(this.Branchstring);
    this.ShowShareButton=false;
    this.formInput = {     
      FromDate:'',
      ToDate:''
    };
    this.selectedBranchId = 0; this.selectedDepartmentId = 0;
    this.GetOrganization()
    this.GetBranches();

    this.selectedListType="All";
    var currentdate = new Date();
    this.formInput.FromDate=currentdate;
    this.formInput.ToDate=currentdate; 
  this.filteredExpenseHeadId=0; 
    // this.formInput.FromDate = localStorage.getItem("FromDate");
    // this.formInput.ToDate = localStorage.getItem("ToDate");
    if(this.formInput.FromDate==null || this.formInput.FromDate==undefined){ this.formInput.FromDate=currentdate;}
    if(this.formInput.ToDate==null || this.formInput.ToDate==undefined){ this.formInput.ToDate=currentdate;}
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };
    this.GetExpenseList();
    this._commonservice.ApiUsingGetWithOneParam("Employee/GetExpenseHeads/en").subscribe((data) => this.ExpenseHeads = data.ExpenseTypes, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   
  }
  
  Viewlist()
  {
  window.location.reload();
  }

  OnTypeChange(event:any)
  {
    this.selectedStatusType=event.Value;
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
          EmployeeID:0,
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
            if(this.selectedStatusType=="Pending")
            {
              this.institutionsList = this.institutionsList.filter((a:any)=>a.Status=='Pending');
            }
            if(this.selectedStatusType=="Approved")
            {
              this.institutionsList = this.institutionsList.filter((a:any)=>a.Status=='Approved');
            }
            if(this.selectedStatusType=="Rejected")
            {
              this.institutionsList = this.institutionsList.filter((a:any)=>a.Status=='Rejected');
            }
            this.dtTrigger.next(null);
            this.Edit = false;this.Add = false;
          }
          this.spinnerService.hide();
        }, (error) => {
          this.spinnerService.hide();
          
        });
      }
   
    }

    GetListTypes()
{
  let arr=new Dropdown();
  arr.Text="All";
  arr.Value="All";
  this.ListTypes.push(arr);

  arr=new Dropdown();
  arr.Text="Pending";
  arr.Value="Pending";
  this.ListTypes.push(arr);

  arr=new Dropdown();
  arr.Text="Approved";
  arr.Value="Approved";
  this.ListTypes.push(arr);

  arr=new Dropdown();
  arr.Text="Rejected";
  arr.Value="Rejected";
  this.ListTypes.push(arr);
}

UpdateStatus(Type:any): any {
  this.institutionsList = this.institutionsList.filter((en: { checked: any; }) => en.checked);
  for(this.index=0;this.index<this.institutionsList.length;this.index++)
  {
     let arr=new ExpenseList();
    arr.ApproveStatus=Type
    arr.ApprovedAmount=this.institutionsList[this.index].Amount;
    arr.CommentByAdmin=Type;
    arr.ExpenseID=this.institutionsList[this.index].ExpenseID;
    this.SelectedList.push(arr);
  }
  this.spinnerService.show();
   this._commonservice.ApiUsingPost("Admin/ApproveExpenseNew",this.SelectedList).subscribe(data => {
    if(data.Status==true)
    {
      this.spinnerService.hide();
      this.globalToastService.success(data.Message);
        window.location.reload();
    }
    else{
      this.globalToastService.warning(data.Message);
      this.spinnerService.hide(); 
    }        
    }, (error) => {
      this.globalToastService.error(error);
     this.spinnerService.hide();
   })  
 }  

 ApproveByID(ID:number, Amount:any): any {
const json={
  ExpenseID:ID,
  ApprovedAmount:Amount,
  CommentByAdmin:"Approved"
}
  this.spinnerService.show();
   this._commonservice.ApiUsingPost("Admin/ApproveExpense",json).subscribe(data => {
    if(data.Status==true)
    {
      this.spinnerService.hide();
      this.globalToastService.success(data.Message);
        window.location.reload();
    }
    else{
      this.globalToastService.warning(data.Message);
      this.spinnerService.hide(); 
    }        
    }, (error) => {
      this.globalToastService.error(error);
     this.spinnerService.hide();
   })  
 }   
 RejectByID(ID:number): any {
  const json={
    ExpenseID:ID,
    ApprovedAmount:0,
    CommentByAdmin:"Rejected"
  }
    this.spinnerService.show();
     this._commonservice.ApiUsingPost("Admin/RejectExpense",json).subscribe(data => {
      if(data.Status==true)
      {
        this.spinnerService.hide();
        this.globalToastService.success(data.Message);
          window.location.reload();
      }
      else{
        this.globalToastService.warning(data.Message);
        this.spinnerService.hide(); 
      }        
      }, (error) => {
        this.globalToastService.error(error);
       this.spinnerService.hide();
     })  
   } 
 allCheck(event:any) {
  const checked = event.target.checked;
  this.institutionsList.forEach((item: { checked: any; }) => item.checked = checked);
}


GetExpenseList()
{
  if (this.formInput.FromDate == null || this.formInput.FromDate == undefined || this.formInput.FromDate == "") {
    var currentdate = new Date();
    this.formInput.FromDate=currentdate;
  }
  if (this.formInput.ToDate == null || this.formInput.ToDate == undefined || this.formInput.ToDate == "") {
    var currentdate = new Date();
    this.formInput.ToDate=currentdate;
  }
  if (this.SelectedBranch.length >= 1) {
    this.SelectedBranch.splice(this.SelectedBranch.indexOf({ id: 0, text: 'All Branch' }), 0);
  }
  const json = {
    BranchID: this.userselectedbranchid,
    listType: this.selectedListType,
    FromDate: this.formInput.FromDate,
    ToDate:this.formInput.ToDate,
    AdminID: this.AdminID,
    HeadID:this.filteredExpenseHeadId,
    ExpenseTypeID:0,
    DeptIDs: this.selectedDepartmentId,
    Key:'en',
    EmployeeID:0,

  }
    this._commonservice.ApiUsingPost("Admin/GetExpenseList",json).subscribe((res:any) => {
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();
      this.ExpenseList = res.ExpenseList;
      this.dtTrigger.next(null);
      this.Edit = false;this.Add = false;
      this.dtTrigger.next(null);
      this.spinnerService.hide();
    }, (error) => {
      this.globalToastService.error(error.message);
      this.spinnerService.hide();
    });
}

OnDeselectedHeadChange(event:any){this.filteredExpenseHeadId=0;this.GetExpenseList();}
OnHeadChange(event:any){this.filteredExpenseHeadId=event.Value;this.GetExpenseList();}


ShowLog(event:any)
{
  this.selectedListType=event;
  this.GetExpenseList();
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

GetOrganization() {
  this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.UserID
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
    this.OrgList = data.List
    if(data.List.length == 1){
      this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
    }
  }, (error) => {
     console.log(error);
  });
}
GetBranches() {
  let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
  this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
    console.log(data);
    if (data.List.length > 0) {
      this.AllBranchList=data.List;
      let tmp=[];
      
      if (this.AllBranchList.length > 0) {

        for (let i = 0; i < this.AllBranchList.length; i++) {
          tmp.push({ id: this.AllBranchList[i].Value, text: this.AllBranchList[i].Text });
        }
      }
      this.Columns = tmp;
      this.OriginalBranchList=this.Columns;
      
      this.getData();

    }
  }, (error) => {
    this.SelectedBranch = this.Columns;
    this.globalToastService.error(error); console.log(error);
  });
}

getData(): void {
  let tmp = [];
  if (this.selectedBranches.length > 0) {

    for (let i = 0; i < this.selectedBranches.length; i++) {
      tmp.push({ id: this.selectedBranches[i].id, text: this.selectedBranches[i].text });
    }
    this.selectedBranches = [];
  }
  this.SelectedBranch = tmp;
  this.GetDepartments();
this.GetExpenseList();
}


onselectedDepartmentsDeSelectAll() {
  this.selectedDepartments=[];
  this.GetExpenseList();
}
onselectedDepartmentsSelectAll(event: any) {
  this.selectedDepartments=this.OriginalDepartmentList;
  this.GetExpenseList();
}
getData1(): void {
  let tmp = [];
  for (let i = 0; i < this.DeptColumns.length; i++) {
    tmp.push({ id: this.DeptColumns[i].id, text: this.DeptColumns[i].text });
  }
  this.OriginalDepartmentList = tmp;
  this.DeptColumns = tmp;
}
onselectedBranchesDeSelectAll() {
  this.selectedBranches=[];
  this.chips=[];
  this.GetDepartments();
  this.GetExpenseList();
}
GetDepartments() {
  this.selectedDepartmentId=[];
  var loggedinuserid=localStorage.getItem("UserID");
  this.selectedDepartments=[];
  const json={
    "OrgID":this.OrgID,
    "Branches":this.selectedBranches,
    "AdminID":loggedinuserid
  }
  this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments",json).subscribe((data) => {
    console.log(data);
    if (data.DepartmentList.length > 0) {
      this.DeptColumns = data.DepartmentList;
      this.getData1();
    }
  }, (error) => {
    this.globalToastService.error(error); console.log(error);
  });
}
onselectedBranchesSelectAll(event: any) {
  this.selectedBranches=this.OriginalBranchList;
  this.GetDepartments();
  this.GetExpenseList();
}

onDeselectedDepartmentsChange(event: any) {
  this.selectedDepartmentId=0;
}
onselectedDepartmentsChange(event: any) {
  this.selectedDepartmentId=event.id;
}
onDeselectedBranchesChange(event: any) {this.selectedBranchId=0;this.userselectedbranchid=0; }
onselectedBranchesChange(event: any) {this.selectedBranchId=[event.text];  this.userselectedbranchid=event.id}
onselectedTypeChange(event: any) {
  this.selectedListType=event;
  if(this.selectedListType=="DNS")
  {
    this.ShowTravelExpense=false;this.ShowDNSExpense=true;this.ShowLocalExpense=false;this.ShowLodgeExpense=false;

  }
  if(this.selectedListType=="Travel")
    {
      this.ShowTravelExpense=true;this.ShowDNSExpense=false;this.ShowLocalExpense=false;this.ShowLodgeExpense=false;
    }
    if(this.selectedListType=="Lodge")
      {
        this.ShowTravelExpense=false;this.ShowDNSExpense=false;this.ShowLocalExpense=false;this.ShowLodgeExpense=true;
      }
      if(this.selectedListType=="Local")
        {
          this.ShowTravelExpense=false;this.ShowDNSExpense=false;this.ShowLocalExpense=true;this.ShowLodgeExpense=false;
        }
     
  this.GetExpenseList();
}
}

