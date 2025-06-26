import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { BillComponent } from './bill/bill.component';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
import { ConfirmationexpensewiseComponent } from '../../../confirmationexpensewise/confirmationexpensewise.component';
import { PaymentsummaryComponent } from '../../../paymentsummary/paymentsummary.component';

@Component({
  selector: 'app-expensewise',
  templateUrl: './expensewise.component.html',
  styleUrls: ['./expensewise.component.css']
})
export class ExpensewiseComponent {
  ExpenseWise:any[]=[]
  Branch:any
  Department:any
  FromDate:any
  Employee:any
  fromdate:any
  ToDate:any
  EmployeeID:any
  UserId:any
  selectAll = false;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private _commonservice: HttpCommonService,private dialog:MatDialog,
private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ExpensewiseComponent>,){
  this.Branch = this.data.branch
  this.Department = this.data.dept
  this.FromDate = this.data.fromdate
  this.fromdate = this.formatDate(this.data.fromdate)
  this.Employee = this.data.employee
  this.EmployeeID = this.data.empid
}
close(){
  this.dialogRef.close()
}
ngOnInit(){
  console.log(this.data.fromdate,"sdsdsddsd");
  this.UserId = localStorage.getItem("UserID");
  this.getExpenseWise()
}
formatDate(dateString: string): string {
  if (!dateString) return '';
  return dateString.split('T')[0]; // Extracts only the 'YYYY-MM-DD' part
}
getExpenseWise(){
  this.spinnerService.show();
  let json = {
    "Employeeid": [this.EmployeeID],
    "FromDate": this.FromDate,
    "Todate": this.FromDate,
    "UserID":this.UserId,
  }
  this._commonservice.ApiUsingPost("Admin/GetExpensesThirdscreen",json).subscribe((res: any) => {
    this.ExpenseWise = res.expenses
    this.spinnerService.hide();
  }, (error) => {
    this.spinnerService.hide();
  });
}


toggleSelectAll() {
  this.ExpenseWise.forEach(ew => ew.selected = this.selectAll);
}

onRowSelectionChange() {
  this.selectAll = this.ExpenseWise.every(ew => ew.selected);
}
viewExpenseImage(row:any){
    this.dialog.open(BillComponent, {
      data: {"BillImages":row.ImagePath,expensename:row.ExpenseType}
    })
}

areAllSelected(): boolean {
  return this.ExpenseWise.length > 0 && this.ExpenseWise.some(ew => ew.selected);
}
validateApprovedAmount(ew: any) {
  if (ew.ApprovedAmount > ew.Amount) {
    ew.ApprovedAmount = ew.Amount;
  } else if (ew.ApprovedAmount < 0 || ew.ApprovedAmount == null) {
    ew.ApprovedAmount = 0;
  }
}

approveExpense(){
  const selectedRows = this.ExpenseWise.filter(ew => ew.selected);
    this.dialog.open(ConfirmationexpensewiseComponent,{
      data:{row:selectedRows,type:'Approve'}
    }).afterClosed().subscribe(res=>{
      if(res){
        this.dialogRef.close({res})
      }
    })
  }
  rejectExpense(){
    const selectedRows = this.ExpenseWise.filter(ew => ew.selected);
    this.dialog.open(ConfirmationexpensewiseComponent,{
      data:{row:selectedRows,type:'Reject'}
    }).afterClosed().subscribe(res=>{
      if(res){
        this.dialogRef.close({res})
      }
    })
  }
  payNow(row:any){
    this.dialog.open(PaymentsummaryComponent, {
      data: { row: [row.ExpenseId]}
    }).afterClosed().subscribe(res => {
      if(res){
        this.getExpenseWise()
      }
    })
  }

  handleAmount(ew:any){
 if (ew.ApprovedAmount > ew.Amount) {
    ew.ApprovedAmount = ew.Amount;
  }
  }
}
