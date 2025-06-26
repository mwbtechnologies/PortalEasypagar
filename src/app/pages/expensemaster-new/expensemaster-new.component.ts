import { Component, ViewChild } from '@angular/core';
import { AddlimitComponent } from './addlimit/addlimit.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { PdfExportService } from 'src/app/services/pdf-export.service';

@Component({
  selector: 'app-expensemaster-new',
  templateUrl: './expensemaster-new.component.html',
  styleUrls: ['./expensemaster-new.component.css']
})
export class ExpensemasterNewComponent {
 ExpensLimitList:any[]=[]
  //common table
  actionOptions: any
  displayColumns: any
  displayedColumns: any
  employeeLoading: any;
  editableColumns: any = []
  topHeaders: any = []
  headerColors: any = []
  smallHeaders: any = []
  ReportTitles: any = {}
  selectedRows: any = []
  commonTableOptions: any = {}
  ShowBtn: boolean = false
  selectedOrganization: any[] = []
  OrgList: any[] = []
  orgSettings: IDropdownSettings = {}
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here
  AdminID:any
  ApiURL:any
  ORGId:any
  constructor(private pdfExportService:PdfExportService,private spinnerService: NgxSpinnerService,private _route: Router,private _commonservice: HttpCommonService,private globalToastService: ToastrService,private dialog: MatDialog
  ) {

 this.actionOptions = [
    ]

this.displayColumns = {
  "BranchName":"BRANCH",
  "DepartmentName":"DEPARTMENT",
  "DesignationName":"DESIGNATION",
  "Limit":"LIMIT",
 }

this.displayedColumns = [
  "BranchID",
  "DepartmentID",
  "DesignationID",
  "Limit",
]

  }
 ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.getExpenseLimitList()
  }

  getExpenseLimitList(){
    this._commonservice.ApiUsingGetWithOneParam("Employee/getExpenselimit?orgid="+this.ORGId).subscribe((res:any)=>{
      this.ExpensLimitList  = res.Explimits.map((item:any) => ({
        ...item,
        isEditing: false,
        isActive:item.isActive == 1 ? 'Active' : 'InActive',
        originalLimit: item.Limit
      }));
    },(error)=>{
      this.ShowAlert("Something Went wrong Please Try Again Later","error")
    })
    
  }

  assignLimit(){
     this.dialog.open(AddlimitComponent, {
     }).afterClosed().subscribe(res=>{
      if(res){
        this.getExpenseLimitList()
      }
     })
  }

  update(row:any){
    let json:any =  {
      "Limit":row.Limit,
      "limitid":row.ID
   }
   console.log(json,"json");
   this._commonservice.ApiUsingPost("Employee/setExpenselimit",json).subscribe((res) => {
    this.ShowAlert(res.Message,"success")
    this.getExpenseLimitList()
  }, (error) => {
    this.ShowAlert("Something Went wrong!..","error")
  });
  }

  activatDeactivate(id:any){
    this._commonservice.ApiUsingGetWithOneParam("Employee/Expenselimitstatus?id="+id).subscribe((res) => {
      this.ShowAlert(res.Message,"success")
      this.getExpenseLimitList()
    }, (error) => {
      this.ShowAlert("Something Went wrong!..","error")
    });
  }

 //common table
  actionEmitter(data: any) {
 }
 downloadReport(){
  let columns = ['BranchName','DepartmentName','DesignationName','Limit','isActive']
  const header = ''
  const title = 'Expense Limi List'
  let data = this.ExpensLimitList.map((item:any) => {
    const rowData: any[] = [];
    for (let column of columns) {
      rowData.push(item[column]);
    }
    return rowData;
  });
  console.log(data,"data");
  this.pdfExportService.generatePDF(header, title, columns, data);
}
  //ends here

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
    edit(item:any){
      item.isEditing = true;
    }
    cancel(item:any){
      item.isEditing = false;
      item.Limit = item.originalLimit; 
    }
}
