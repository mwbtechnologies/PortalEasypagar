import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AddthreesholdsComponent } from './addthreesholds/addthreesholds.component';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { AllocateotforemployeeComponent } from './allocateotforemployee/allocateotforemployee.component';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { CommonTableComponent } from '../common-table/common-table.component';
import { DeleteconfirmationComponent } from 'src/app/layout/admin/deleteconfirmation/deleteconfirmation.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';


@Component({
  selector: 'app-otconfig',
  templateUrl: './otconfig.component.html',
  styleUrls: ['./otconfig.component.css']
})
export class OtconfigComponent {
  OtList:any[]=[]
  OriginalOtList:any[]=[]
  AllocatedOtEmpList:any[]=[]
  AdminID:any
  branchId:any
  DeleteThresholds:any
  OrgID:any;
  BranchList:any;
  ApiURL:any;
  displayedColumns:any
  displayColumns:any
  editableColumns:any =[]
  topHeaders:any = []
  headerColors:any = []
  smallHeaders:any = []
  selectedBranchId:string[]|any;
  branchSettings:IDropdownSettings = {}
  OTId:any;
  Otsettings:any[]=[
    {
      Name:"General Settings"
    }
]
selectedTab: string = this.Otsettings[0].Name;
dtExportButtonOptions: any = {};
dtTrigger: Subject<any> = new Subject();
dtExportButtonOptions1: any = {};
dtTrigger1: Subject<any> = new Subject();
ReportTitles:any = {};UserID:any
@ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
OTLoading :any = undefined
actionOptions:any;
selectedOrganization:any[]=[]
OrgList:any[]=[]
orgSettings:IDropdownSettings = {}
constructor(public dialog: MatDialog,
  private globalToastService:ToastrService,
  private _commonservice: HttpCommonService,private toastr:ToastrService,private pdfExportService : PdfExportService){
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
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
    
    this.actionOptions = [
      {
        name:"Edit",
        icon:"fa fa-pencil"
      },
      {
        name:"View",
        icon:"fa fa-eye"
      },
      {
        name:"Delete",
        icon:"fa fa-trash",
        filter: [
          { field:'IsDeletable',value : true}
        ],
      },

    ]
    this.editableColumns = {
      // "HRA":{
      //   filters:{}
      // },
    }
    this.displayColumns= {
      // SelectAll: "SelectAll",
      "SLno":"Sl No",
      "OtType": "OT Type",
      "OTName":"OT Name",
      "BranchName":"Branch",
      "DepartmentName":"Department",
      "Amount":"Amount",
      "MinWorkingHours":"Min Minutes",
      "DailyOTHours":"Max Hours",
      "grace_time":"Grace-In",
      "Times":"OT Rate",
      "Status":"Status",
      "CreatedDate":"Created Date",
      "Actions": "Actions"
    },
    this.displayedColumns= [
      // "SelectAll",
      "SLno",
      "OtType",
      "OTName",
      "BranchName",
      "DepartmentName",
      "Amount",
      "MinWorkingHours",
      "DailyOTHours",
      "grace_time",
      "Times",
      "Status",
      "CreatedDate",
      "Actions"
    ]
    this.topHeaders = [
      // {
      //   id:"blank1",
      //   name:"",
      //   colspan:5
      // }
    ]
    this.headerColors ={
      // Deductions : {text:"#ff2d2d",bg:"#fff1f1"},
    }

    // SL No
    // OT Type
    // OTName
    // Branch
    // Department
    // Amount
    // Status
    // Min Minutes
    // CreatedDate
    // Actions

  }

ngOnInit(){
  this.AdminID = localStorage.getItem("AdminID");
  this.OrgID = localStorage.getItem("OrgID");
  this.UserID=localStorage.getItem("UserID");
  this.branchId = 0
  this.dtExportButtonOptions = {
    dom: 'Bfrtip',
    buttons: [
      'copy',
      'print',
      'excel',
      'csv'
    ]
  };
  this.dtExportButtonOptions1 = {
    dom: 'Bfrtip',
    buttons: [
      'copy',
      'print',
      'excel',
      'csv'
    ]
  };
  this.getOtList()
  // this.getAllocatedEmpList()
  this.GetOrganization();
  this.loadBranches()


  
}
onselectedOrg(item:any){
  this.selectedBranchId = []
  this.loadBranches()
}
onDeselectedOrg(item:any){
  this.selectedBranchId = []
  this.loadBranches()
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

loadBranches(){
  let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
  this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
     this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => this.BranchList = data.List, (error) => {
      //  this.globalToastService.error(error);
      this.ShowAlert(error,"error")
        console.log(error);
     });
}

OnBranchSelect(event:any){
  this.branchId = event.Value
  this.OtList = this.OriginalOtList.filter(l=>l.BranchID == this.branchId)
  // this.getOtList();
}
onBranchDeSelect(event:any){
  // this.getOtList();
  
  this.OtList = JSON.parse(JSON.stringify(this.OriginalOtList))
}


setOTId(id:any){
  this.OTId = id
}
getAllocatedEmpList(){
  this.AllocatedOtEmpList=[];
  this._commonservice.ApiUsingGetWithOneParam("Portal/getAllocatedOT?OTID="+this.OTId+"&userid="+this.AdminID+"&isactive=false").subscribe((data:any) => {
    var table = $('#DataTables_Table_0').DataTable();
    table.destroy();
    // console.log(data);
    if (data.List.length > 0) {
      this.AllocatedOtEmpList = data.List
      this.dtTrigger.next(null);
    }
    else{
      // this.toastr.warning("None of the employees are allocated to this OT")
      this.ShowAlert("None of the employees are allocated to this OT","warning")
    }
  }, (error:any) => {
    // this.globalToastService.error(error);
     console.log(error);
  })
}

getOtList(){
  this.OTId = 0
  this._commonservice.ApiUsingGetWithOneParam("Portal/GetAllOTList?AdminID="+this.AdminID+"&BranchID="+this.branchId).subscribe((data:any) => {
    var table = $('#DataTables_Table_1').DataTable();
    table.destroy();
    // console.log(data);
    if (data.List.length > 0) {
      this.OtList = data.List.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
      // this.OtList = this.OtList;
      this.OriginalOtList = JSON.parse(JSON.stringify(this.OtList))

      this.dtTrigger1.next(null);
    }
    
    this.OTLoading = false
  }, (error:any) => {
    // this.globalToastService.error(error); 
    
    this.OTLoading = false
    console.log(error);
  });
}

selectTab(tabName: string) {
  this.selectedTab = tabName;
  if(this.selectedTab == 'General Settings'){
    this.getOtList();this.loadBranches();
  }
  if(this.selectedTab == 'Allocated OT For Employees'){
    this.getAllocatedEmpList()
  }
}

addthresholds(isEdit:boolean,row?:any){
  this.dialog.open(AddthreesholdsComponent,{
    data: { isEdit, row, fulldata: this.OtList }
     ,panelClass: 'custom-dialog',
      disableClose: true }).afterClosed().subscribe((res:any)=>{
    this.getOtList()
  })
}
allocateOtForEmployee(row?:any){
  this.dialog.open(AllocateotforemployeeComponent,{
    data: {row} 
  })
  .afterClosed().subscribe(()=>{
      this.getOtList()
  })
}



deletethresholds(row:any){
  this.DeleteThresholds = "Portal/UpdateOTStatus?Id="+ row.OTID
    this._commonservice.ApiUsingGetWithOneParam(this.DeleteThresholds).subscribe((res:any)=>{
      if(res.Status==true)
      {
        // this.toastr.success(res.Message);
        this.ShowAlert(res.Message,"success")
        this.OtList = this.OtList.map(l=>{
          if(l.OTID == row.OTID){
            l.Status = !l.Status
          }
          return l
        })
      }
      else{
        // this.toastr.warning(res.Message);
        this.ShowAlert(res.Message,"warning")
      }
     
   
    })
}
Removethresholds(allotid:any){
  this.DeleteThresholds = "Portal/RemoveOT?AllotID="+allotid+"&AdminID="+this.AdminID;
    this._commonservice.ApiUsingGetWithOneParam(this.DeleteThresholds).subscribe((res:any)=>{
      if(res.Status==true)
      {
        // this.toastr.success(res.Message);
        this.ShowAlert(res.Message,"success")
        this.AllocatedOtEmpList = this.AllocatedOtEmpList.map(l=>{
          if(l.allotid == allotid){
            l.Status = !l.Status
          }
          return l
        })
        this.getAllocatedEmpList()
      }
      else{
        // this.toastr.warning(res.Message);
        this.ShowAlert(res.Message,"warning")
      }
     
   
    })
}

exportAllocateOtPDF() {
  let columns = ['employeename', 'OTname', 'Branch', 'Department', 'startdate', 'enddate'];
  const header = '';
  const title = 'Allocated OT';
  let data = this.AllocatedOtEmpList.map((item: any) => {
    const rowData: any[] = [];
    for (let column of columns) {
      if (column.toLowerCase().split('date').length > 1) {
        rowData.push(moment(item[column]).format('MMMM Do YYYY'));
      } else if (column.toLowerCase() === 'branch' || column.toLowerCase() === 'department') {
        // Handle nested objects
        rowData.push(item[column]?.text || '');
      } else {
        rowData.push(item[column]);
      }
    }
    return rowData;
  });

  console.log(data, "data");
  
  this.pdfExportService.generatePDF(header, title, columns, data);
}

// exportPDF() {
//   // let columns = ['OTName','BranchName','Departments','Amount','MinWorkingHours','CreatedDate']
//   let columns:any = Object.values(this.displayColumns)
//   const header = ''
//   const title = 'OT'
//   let data = this.OtList.map((item:any) => {
//     const rowData: any[] = [];
//     for (let column of columns) {
//       if (column.toLowerCase().split('date').length > 1) {
//         rowData.push(moment(item[column]).format('MMMM Do YYYY'));
//       }
//       else rowData.push(item[column]);
//     }
//     return rowData;
//   });
//   console.log(data,"data");
  
//   this.pdfExportService.generatePDF(header, title, columns, data);
// }
// exportexcel(){
//   // let columns = ['OtType','OTName','BranchName','Departments','Amount','MinWorkingHours','CreatedDate']
//   let columns = Object.keys(this.displayColumns)
//   let fileName = 'OTList.xlsx'
//   let data = this.OtList.map((item:any) => {
//     const rowData: any[] = [];
//     for (let column of columns) {
//       if (column.toLowerCase().split('date').length > 1) {
//         rowData.push(moment(item[column]).format('MMMM Do YYYY'));
//       }
//       else rowData.push(item[column]);
//     }
//     return rowData;
//   });
//     data.unshift(columns);
//   const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'OT List');
//   XLSX.writeFile(wb, fileName);
// }
exportAllocateOtexcel(){
  let columns = ['employeename', 'OTname', 'Branch', 'Department', 'startdate', 'enddate'];
  let fileName = 'Allocated OT.xlsx'
  let data = this.AllocatedOtEmpList.map((item: any) => {
    const rowData: any[] = [];
    for (let column of columns) {
      if (column.toLowerCase().split('date').length > 1) {
        rowData.push(moment(item[column]).format('MMMM Do YYYY'));
      } else if (column.toLowerCase() === 'branch' || column.toLowerCase() === 'department') {
        // Handle nested objects
        rowData.push(item[column]?.text || '');
      } else {
        rowData.push(item[column]);
      }
    }
    return rowData;
  });
    data.unshift(columns);
  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Allocated OT');
  XLSX.writeFile(wb, fileName);
}
// deleteOT(otid:any){
// this._commonservice.ApiUsingGetWithOneParam("Portal/DeleteOT?OTID="+otid+"&AdminID="+this.AdminID+"").subscribe((res:any)=>{
//   this.globalToastService.show(res.Message)
// },(error)=>{
//   this.globalToastService.show(error.Message)
// })
// }
deleteOT(row:any){
  const dialogRef = this.dialog.open(DeleteconfirmationComponent, {
    data: row,
  });
  dialogRef.componentInstance.confirmClick.subscribe(() => {
    this.confirmed(row);
    dialogRef.close();

  },(error):any=>{
    // this.globalToastService.error(error.message)
    this.ShowAlert(error.message,"error")
  });
}

confirmed(row:any){
  this._commonservice.ApiUsingGetWithOneParam("Portal/DeleteOT?OTID="+row.OTID+"&AdminID="+this.AdminID+"").subscribe((res:any)=>{
      // this.globalToastService.success(res.Message)
      this.ShowAlert(res.Message,"success")
      this.getOtList()
    },(error)=>{
      // this.globalToastService.error(error.Message)
      this.ShowAlert(error.Message,"error")
    })
}

actionEmitter(data:any){
  if(data.action.name == "Edit"){
    this.addthresholds(true,data.row)
  }else if(data.action.name == "View"){
    this.setOTId(data.row.OTID);
    this.selectTab('Allocated OT For Employees')
  }else if(data.action.name == "Delete"){
    this.deleteOT(data.row);
  }
}
downloadReport(){
  let selectedColumns = this.displayedColumns
  this.commonTableChild.downloadReport(selectedColumns)
}
    ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
      this.dialog.open(ShowalertComponent, {
        data: { message, type },
        panelClass: 'custom-dialog',
        disableClose: true  
      }).afterClosed().subscribe((res) => {
        if (res) {
          console.log("Dialog closed");
        }
      });
    }

}
