import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ExpensewiseComponent } from './expensewise/expensewise.component';
import { BillimagesComponent } from './billimages/billimages.component';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { CommonTableComponent } from 'src/app/pages/common-table/common-table.component';
import { PaymentsummaryComponent } from '../../paymentsummary/paymentsummary.component';

@Component({
  selector: 'app-datewise',
  templateUrl: './datewise.component.html',
  styleUrls: ['./datewise.component.css']
})
export class DatewiseComponent {
  dateWise:any[]=[]
  Branch:any
  Department:any
  FromDate:any
  Employee:any
  ToDate:any
  EmployeeID:any
    //common table
    actionOptions: any
    orginalValues: any = {}
    displayColumns: any
    displayedColumns: any
    Loading: any;
    editableColumns: any = []
    ReportTitles: any = {}
    selectedRows: any = [];
    commonTableOptions: any = {}
    tableDataColors: any;
    @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
    currentMonth: any;
    currentYear: any;
    dateWiseList:any[]=[]
    commonTableDataSource : any
    //ends here
    UserId:any
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private dialog:MatDialog,
private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<DatewiseComponent>,){
  this.Branch = this.data.branch
  this.Department = this.data.dept
  this.FromDate = this.data.fromdate
  this.ToDate = this.data.todate
  this.Employee = this.data.employee
  this.EmployeeID = this.data.empid

  //common table
  this.actionOptions = [
    {
      name: "View",
      icon: "fa fa-eye",
    },
    {
      name: "Pay",
      icon: "fa fa-money",
      filter: [
        { field:'IsPayable',value : true}
      ],
    },
    // {
    //   name: "View Bill",
    //   icon: "fa fa-image",
    // },
  ]
  this.displayColumns = {
    "SelectAll":"SELECT ALL",
    "SLno":"SL NO",
    "CreatedDate":"DATE",
    "Local":"LOCAL",
    "Travel":"TRAVEL",
    "Lodging":"LODGING",
    "DNS":"DNS",
    "Approved":"APPROVED",
    "Pending":"PENDING",
    "Rejected":"REJECTED",
    "Actions":"ACTIONS"
  },
    this.displayedColumns = [
    "SelectAll",
    "SLno",
    "CreatedDate",
    "Local",
    "Travel",
    "Lodging",
    "DNS",
    "Pending",
    "Approved",
    "Rejected",
    "Actions"
   ]

}
close(){
  this.dialogRef.close()
}
ngOnInit(){
  this.UserId = localStorage.getItem("UserID");
  this.getDateWise()
}

getDateWise(){
  this.Loading = true
  this.spinnerService.show();
  let json = {
    "Employeeid": [this.EmployeeID],
    "FromDate": this.FromDate,
    "Todate": this.ToDate,
    "UserID":this.UserId,
  }
  this._commonservice.ApiUsingPost("Admin/GetExpensesSubscreen",json).subscribe((res: any) => {
    this.dateWise = res.groupedExpenses.map((l: any, i: any) => {
      return { 
       SLno: i + 1, ...l ,
       "CreatedDate":l.Date
     } 
   });
   this.Loading = false
   this.spinnerService.hide();
  }, (error) => {
    this.Loading = false
    this.spinnerService.hide();
  });
}
viewExpense(row:any){
  this.dialog.open(ExpensewiseComponent, {
    data: {
      employee:this.Employee,
      branch:this.Branch,
      dept:this.Department,
      fromdate:row.Date,
      empid:this.EmployeeID
    }
  }).afterClosed().subscribe(res=>{
    if(res){
      this.getDateWise()
    }
  })
}
viewBillImages(row:any){
  this.dialog.open(BillimagesComponent, {
    data: {"BillImages":row.BillImages}
  })
}

updatedSelectedRows(data: any) {
  this.selectedRows = []; 
  let rows = data?.row;
  if (rows?.length > 0) {
      for (let i = 0; i < rows.length; i++) {
          const ri = rows[i];
              if (ri.isSelected === true) {
                  this.selectedRows.push(ri); 
              }
      }
  }
}

  //common table
  actionEmitter(data: any) {
     if(data.action.name == 'View'){
      this.viewExpense(data.row)
     } 
    //  if(data.action.name == 'View Bill'){
    //   this.viewBillImages(data.row)
    //  } 
    if (data.action.name == "updatedSelectedRows") {
       this.updatedSelectedRows(data)
    }
    if (data.action.name == 'Pay') {
          this.dialog.open(PaymentsummaryComponent, {
            data: { row: data.row.ExpenseIDs}
          }).afterClosed().subscribe(res => {
            if(res){
              this.getDateWise()
            }
          })
        }
  }
  //ends here

  clearSelect(){
    this.commonTableChild.clearSelectAll()
    this.selectedRows = []
    this.dateWise.forEach(element => {
      element.isSelected = false
    });
  }
approveExpense(){
  this.updatedSelectedRows
    this.dialog.open(ConfirmationComponent,{
      data:{row:this.selectedRows,type:'Approve'}
    }).afterClosed().subscribe(res=>{
      if(res){
        this.clearSelect()
        this.getDateWise()
      }
    })
  }
  rejectExpense(){
    this.updatedSelectedRows
    this.dialog.open(ConfirmationComponent,{
      data:{row:this.selectedRows,type:'Reject'}
    }).afterClosed().subscribe(res=>{
      if(res){
        this.clearSelect()
        this.getDateWise()
      }
    })
  }
}
