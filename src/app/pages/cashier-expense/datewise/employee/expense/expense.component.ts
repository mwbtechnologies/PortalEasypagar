import { Component, Inject } from '@angular/core';
import { BillComponent } from './bill/bill.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
import { ConfirmationexpensewiseComponent } from '../../../confirmationexpensewise/confirmationexpensewise.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent {
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
private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ExpenseComponent>,){
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

viewExpenseImage(row:any){
    this.dialog.open(BillComponent, {
      data: {"BillImages":row.ImagePath,expensename:row.ExpenseType}
    })
}
toggleSelectAll() {
  this.ExpenseWise.forEach(ew => ew.selected = this.selectAll);
}

onRowSelectionChange() {
  this.selectAll = this.ExpenseWise.every(ew => ew.selected);
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
}
