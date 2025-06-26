import {  OnInit, Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subject } from 'rxjs';
export class FormInput {
  ExpID: any;
  SelectedDate:any;
  FromDate:any;
  ToDate:any;
}

import { ToastrService } from "ngx-toastr";
import { HttpCommonService } from "src/app/services/httpcommon.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import {environment} from "src/environments/environment";
import { ShowreportlistComponent } from "./showreportlist/showreportlist.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ShowEmployeeComponent } from "./show-employee/show-employee.component";
import { ShowBannerComponent } from "./show-banner/show-banner.component";
import { ShowUpdatePopupComponent } from "./show-update-popup/show-update-popup.component";
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css']
})
export class AppDashboardComponent implements OnInit {
  formInput: FormInput | any;
  AddPermission: any; EditPermission: any; ViewPermission: any; DeletePermission: any;
  AttendanceList: any;
  sortType: any;
  sortIndex: any;
  data: any; ShowAttendance = true;
  cca: any; CheckInList: any; ApiURL: any; BannerList: any=[]; ProfileDetails: any;
  UserName: any; DashboardCounts: any; DashboardData: any; LeaveList: any; LoanList: any; AttendanceAlerts: any;
  OrganizationName: any; TotalUsers: any;
  OverallResponse: any;
  tempbranches: any=[];
  tooltipTexts: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  CurrentDate: any; FormattedDate: any; Day: any; FromDate: any; ToDate: any;
  ApiExist: any;multiselectcolumns:IDropdownSettings | any;
  isSubmit: boolean; index: any
  UserListWithoutFilter: any[] = [];
  isScrolled: boolean = false;
  searchText: string = '';
  icon: string = 'default';
  displayedColumns: any
  editableColumns:any =[]
  selection: any;
  Columns: any 
  selectedBranches: any = [];
  displayColumns: any = {}
  OrgID: any;
  AdminID: any; 
  chips: any[] = [];OriginalDate:any;
  selectedbranchid:any;
  UserID:any;
  SingleSelectionSettings:any
  MultiSelectionSettings:any
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  actionOptions:any;
  OriginalAttendanceList:any = [];
  IsEmailLogin:any=false;
  branchLoading : any = undefined;
  lessBranch:boolean  = true
  moreBranch:boolean  = false
  dashboardItems:any[]=[];
  OverallEmployees=0;OverallAbsent=0;OverallPresent=0;OverallEfficency=0;
  //bar graph 
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  constructor(private spinnerService: NgxSpinnerService,private globalToastService: ToastrService, public dialog: MatDialog, private _router: Router, private toastr: ToastrService, private _commonservice: HttpCommonService) {
    this.isSubmit = false;
    this.SingleSelectionSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.MultiSelectionSettings = {
      singleSelection: false,
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
    this.actionOptions = [{
      name:"View Details",
      icon:"fa fa-eye"
    }]
    this.displayColumns= {
      "SLno":"SL NO",
      "Branch":"BRANCH",
      "Present":"PRESENT",
      "Absent":"ABSENT",
      "Total":"TOTAL",
      "Efficiency":"EFFICIENCY (%)",
      "Actions":"ACTION",
    },
    this.displayedColumns= [ "SLno",
      "Branch",
      "Present",
      "Absent",
      "Total",
      "Efficiency",
      "Actions",
    ]
    this.editableColumns = {}

    this.dashboardItems = [
  {
    title: 'My Employees',
    icon: './assets/images/Banner/Icons/createmployee.png',
    onClick: () => this.openDialog('Employee'),
  },
  {
    title: 'Leave Master',
    icon: './assets/images/Banner/Icons/leave.png',
    onClick: () => this.GetAccessStatus('Leave'),
  },
  {
    title: 'Reports Master',
    icon: './assets/images/Banner/Icons/Reports.png',
    onClick: () => this.openDialog('Reports'),
  },
  {
    title: 'Expense Master',
    icon: './assets/images/Banner/Icons/expense.png',
    onClick: () => this.GetAccessStatus('Expense'),
  },
  {
    title: 'Loan/Advance',
    icon: './assets/images/Banner/Icons/loan.png',
    onClick: () => this.GetAccessStatus('loan'),
  },
  {
    title: 'Messages / Banner',
    icon: './assets/images/Banner/Icons/message.png',
    onClick: () => this.openDialog('Banner'),
  },
];
  }

  ngOnInit(): void {
    this.formInput = {
      FromDate: '',
      ToDate: '',
      SelectedDate:''
    };
    this.selectedbranchid=0;
    this.BannerList=[];
    // this.CheckDate(this.CurrentDate);
    this.OrgID = localStorage.getItem("OrgID");
     this.UserID = localStorage.getItem("UserID");
    this.AdminID = localStorage.getItem("AdminID");
    this.IsEmailLogin=localStorage.getItem("LoginStatus");    
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); 
    const day = today.getDate().toString().padStart(2, '0');
    this.formInput.SelectedDate = `${year}-${month}-${day}`;
    this.CheckAppUpdates();
    this.GetDashboardBanners();   
    this.GetOrganization()
    this.GetBranches();   
    this.ViewPermission = true;
    this.GetBranchwiseCounts();
  }
  onselectedOrg(item:any){
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
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
      // this.ShowToast(error,"error")
       console.log(error);
    });
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      console.log(data);
      if (data.List.length > 0) {
        this.Columns = data.List;
        this.getData();

      }
    }, (error) => {
      this.Columns = this.displayColumns;
      this.selectedBranches = this.Columns;
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error")
       console.log(error);
    });
  }

  ViewAttendance(BranchID: any,BranchName:any) {
    localStorage.setItem("BranchID", BranchID);
    localStorage.setItem("BranchName", BranchName);
    localStorage.setItem("Date",this.formInput.SelectedDate);
    localStorage.removeItem("RecordID");
    localStorage.removeItem("RecordDate");
    this._router.navigate(['/AttendanceMaster']);
  }

  CheckAppUpdates() {
    this._commonservice.ApiUsingGetWithOneParam("Helper/CheckUpdateStatus?UserID="+this.UserID+"&Status=false").subscribe(
      (res: any) => {
        if(res.Status==true)
          {
      this.dialog.open(ShowUpdatePopupComponent,{
        data: {res}
         ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
        if(res){
        }
      })
    }
    }, (error) => {});
  }


  GetDashboardBanners() {
    this._commonservice.ApiUsingGetWithOneParam("Settings/GetBanners?UserID="+this.UserID+"&IsEmail="+this.IsEmailLogin).subscribe(
      (res: any) => {
        console.log(res);
        if(res.Status==true)
        {          
          if(res.List.length>0)
          {
            for(this.index=0;this.index<res.List.length;this.index++)
              {
                this.BannerList.push({ImageURL:res.List[this.index].BannerImage});
              }
          }
        }
    }, (error) => {});
  }

  // GetBanners() {
  //   this.ApiURL = "https://wbtechindia.com/apis/masterportallin/promotions/get/banner";
  //   const json={"SoftwareID":8,"UserId":this.AdminID,"Version":""}
  //   this._commonservice.MasterApiUsingPost(this.ApiURL,json).subscribe(
  //     (res: any) => {
  //       console.log(res);
  //       if(res.status==200)
  //       {
  //         var banners = res.data;
  //         // this.BannerList = []
          
  //         if(banners.length>0)
  //         {
    
  //           for(this.index=0;this.index<banners.length;this.index++)
  //           {
              
  //             banners[this.index].BannerImage=environment.MasterUrl+banners[this.index].BannerImage;
          
  //             this.BannerList.push({
  //               ImageURL:banners[this.index].BannerImage
  //             });
  //           }
  //         }
  //       }
      

  //   }, (error) => {
  //     // // this.toastr.error(error.message);

  //   });

  // }


  UpdateNotificationStatus(ID: any) {
    this.ApiURL = "Portal/UpdateNotificationStatus?NotificationID=" + ID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
      window.location.reload();

    }, (error) => {});

  }

  Navigate(path: any) {
    localStorage.setItem("AddPermission",'true');
    localStorage.setItem("EditPermission",'true');
    localStorage.setItem("ViewPermission",'true');
    localStorage.setItem("DeletePermission",'true');
    localStorage.setItem("DownloadPermission",'true');
    localStorage.setItem("FromDate", this.formInput.FromDate);
    localStorage.setItem("ToDate", this.formInput.ToDate);
    localStorage.setItem("FilterType","All");
    localStorage.setItem("selectedBranches", JSON.stringify(this.tempbranches));
    this._router.navigate([path]);
  }

  getData(): void {
    let tmp = [];
    for (let i = 0; i < this.Columns.length; i++) {
      tmp.push({ id: this.Columns[i].Value, text: this.Columns[i].Text });
    }
    this.Columns = tmp;
  }

  showattendancedetails(Type:any)
  {
    this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=AttendanceMaster&editType=view";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if(data.Status==true)
        {
   localStorage.setItem("Date", this.formInput.StartDate);
   localStorage.setItem("FilterType",Type);
  //  localStorage.setItem("SelectedBranch", JSON.stringify(this.tempbranches));
  localStorage.setItem("SelectedBranch", this.selectedbranchid)
   this._router.navigate(["/EmployeeAttendance"]);
  }
  else
  {
// this.globalToastService.warning(data.Message);
this.ShowAlert(data.Message,"warning")
  }
}, (error: any) => {
    this.spinnerService.hide();
    // this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");
    this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again","error")
   
  });
  }

  onselectedBranchesDeSelectAll() {
    // this.selectedbranchid=0;
    this.selectedBranches=[]
    // this.GetBranchwiseCounts();
    this.filterAttendanceList()
  }
  onselectedBranchesSelectAll(event: any) {
    // this.selectedbranchid=[];
    this.selectedBranches=[]
    // this.GetBranchwiseCounts();
    this.filterAttendanceList()
  }

  onDeselectedBranchesChange(event: any) {
    // this.selectedbranchid=[];
    // this.GetBranchwiseCounts();
    this.filterAttendanceList()
  }
  onselectedBranchesChange(event: any) {
    // this.selectedbranchid=event.id;
    // this.GetBranchwiseCounts();
    this.filterAttendanceList()
  }

  filterAttendanceList(){
    console.log(this.selectedBranches);
    console.log(this.AttendanceList);
    console.log(this.OriginalAttendanceList)
    if(this.selectedBranches.length>0)
    this.AttendanceList = this.OriginalAttendanceList.filter((ol:any)=>this.selectedBranches.filter((sb:any)=>sb.id == ol.BranchID).length>0)
    else this.AttendanceList = JSON.parse(JSON.stringify(this.OriginalAttendanceList))
  }
CheckDate(Value:any)
{
  this.GetBranchwiseCounts();
}

  GetBranchwiseCounts() {
    this.branchLoading = true
    this.lessBranch = true
    this.moreBranch = false
    this.AdminID = localStorage.getItem("AdminID");
        this.ApiURL = "Admin/GetDashboardData?AdminID="+this.AdminID+"&Date="+this.formInput.SelectedDate+"&BranchID=0&isdefaultBranch=true";
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
      if(res.Status==true)
      {
        this.OverallResponse =res.Dashboard;
        this.AttendanceList=this.OverallResponse[0].Branches;
        this.OverallEmployees=this.OverallResponse[0].Total;
        this.OverallAbsent=this.OverallResponse[0].Absent;
        this.OverallPresent=this.OverallResponse[0].Present;
        this.OverallEfficency=this.OverallResponse[0].Efficiency;
        this.AttendanceList = this.AttendanceList.map((l:any,i:any)=>{return {SLno:i+1,...l}})
        this.OriginalAttendanceList = JSON.parse(JSON.stringify(this.AttendanceList))
      }
      this.branchLoading = false
    }, (error) => {
      this.branchLoading = false
      // this.toastr.error(error.message);

    });

  }
  moreBranches()
  {
    this.branchLoading = true
    this.moreBranch = true
    this.lessBranch = false
    this.GetBranches();
    this.AdminID = localStorage.getItem("AdminID");
        this.ApiURL = "Admin/GetDashboardData?AdminID="+this.AdminID+"&Date="+this.formInput.SelectedDate+"&BranchID=0&isdefaultBranch=false";
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
      if(res.Status==true)
      {
        this.OverallResponse =res.Dashboard;
        this.AttendanceList=this.OverallResponse[0].Branches;
        this.OverallEmployees=this.OverallResponse[0].Total;
        this.OverallAbsent=this.OverallResponse[0].Absent;
        this.OverallPresent=this.OverallResponse[0].Present;
        this.OverallEfficency=this.OverallResponse[0].Efficiency;
        this.AttendanceList = this.AttendanceList.map((l:any,i:any)=>{return {SLno:i+1,...l}})
        this.OriginalAttendanceList = JSON.parse(JSON.stringify(this.AttendanceList))
      }
      this.branchLoading = false
    }, (error) => {
      this.branchLoading = false
      // this.toastr.error(error.message);

    });
  }
  GetAccessStatus(value:any)
  {
    localStorage.removeItem("RecordID");
    localStorage.removeItem("RecordDate");
    localStorage.removeItem("BranchID");
    localStorage.removeItem("BranchName");
    this.spinnerService.show();
    this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=employee&editType=view";
    if(value=='Leave'){ this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=LeaveMaster&editType=view";}
    if(value=='Expense'){this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=ExpenseMaster&editType=view";}
      if(value=='Banner'){this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=banner&editType=view";}
        if(value=='Message'){this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=messages&editType=view";}
        if(value=='loan'){this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=LoanMaster&editType=view";}
       
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
          if(data.Status==true)
            {
   
    if(value=='Employee')
    {
      this._router.navigate(["/EmployeeMaster"]);
    }
    if(value=='Leave')
      {
        this._router.navigate(["/LeaveMaster"]);
      }
      if(value=='Expense')
        {
          this._router.navigate(["/expense"]);
          // this._router.navigate(["/AdminExpense"]);
        }
        if(value=='Banner')
          {
            this._router.navigate(["/banner"]);
          }
          if(value=='Message')
            {
              this._router.navigate(["/chat"]);
            }
          if(value=='loan')
            {
              this._router.navigate(["/LoanMaster"]);
            }
            this.spinnerService.hide();
          }
          else
          {
        // this.globalToastService.warning(data.Message);
        this.ShowAlert(data.Message,"warning")
        this.spinnerService.hide();
          }
        }, (error: any) => {
            this.spinnerService.hide();
            // this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");
            this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again","error")
           
          });  
  }

  openDialog(modulename:any): void 
  {
    localStorage.removeItem("RecordID");
    localStorage.removeItem("RecordDate");
    localStorage.removeItem("BranchID");
    localStorage.removeItem("BranchName");
    if(modulename=='Reports')
    {
      this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=ReportsMaster&editType=view";
      this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
        if(data.Status==true)
          {
      this.dialog.open(ShowreportlistComponent,{
        data: {}
         ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
        if(res){
        }
      })
    }
    else
    {
  // this.globalToastService.warning(data.Message);
  this.ShowAlert(data.Message,"warning")
    }
  }, (error: any) => {
      this.spinnerService.hide();
      // this.globalToastService.error("Faild to Validate the Access. Please Refresh page and try again");
      this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again","error")
     
    });
    }
    if(modulename=='Employee')
      {
        this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=employee&editType=view";
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
          if(data.Status==true)
            {
        this.dialog.open(ShowEmployeeComponent,{
          data: {}
           ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
          if(res){
          }
        })
      }
      else
      {
    // this.globalToastService.warning(data.Message);
    this.ShowAlert(data.Message,"warning")
      }
    }, (error: any) => {
        this.spinnerService.hide();
        // this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");
        this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again","error")
       
      });
      }
      if(modulename=='Banner')
        {
          this.ApiURL="Admin/GetAccessStatusRole?UserID="+this.UserID+"&feature=messages&editType=view";
          this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
            if(data.Status==true)
              {
          this.dialog.open(ShowBannerComponent,{
            data: {}
             ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
            if(res){
            }
          })
        }
        else
        {
      // this.globalToastService.warning(data.Message);
      this.ShowAlert(data.Message,"warning")
        }
      }, (error: any) => {
          this.spinnerService.hide();
          // this.globalToastService.error("Failed to Validate the Access. Please Refresh page and try again");
          this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again","error")
        });
        }

  }

  actionEmitter(data:any){
    if(data.action.name == "View Details"){
      this.ViewAttendance(data.row.BranchID,data.row.Branch)
    }
  }

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


