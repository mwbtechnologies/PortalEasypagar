import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  constructor(private globalToastService:ToastrService,
    public dialogRef: MatDialogRef<HistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,private commonService : HttpCommonService
  ) {
    
  }

  generatePDF(){
    const now = new Date(); 
    const currentYear = now.getFullYear();
    const year = this.data.year || currentYear
    this.commonService.ApiUsingGetNew("ReportsNew/GetLoanLedgerReport?EmployeeID="+this.data.row.EmployeeID+"&Year="+year+"&LoanID="+this.data.row.LoanID+"&Month=0&LoanType="+this.data.row.LoanType+"",{ responseType: 'text' }).subscribe((res:any)=>{
      if(res){
        window.open(res,'_blank')
     }
    else{
     this.globalToastService.error("Something went wrong");
    }
    },(error)=>{
      this.globalToastService.error(error.Message)
    })
  }
}
