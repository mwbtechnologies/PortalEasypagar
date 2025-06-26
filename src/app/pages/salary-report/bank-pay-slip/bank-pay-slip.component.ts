import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bank-pay-slip',
  templateUrl: './bank-pay-slip.component.html',
  styleUrls: ['./bank-pay-slip.component.css']
})
export class BankPaySlipComponent {
@Input()
BankPaySlipList:any[]=[]
AdminId:any
totalAmount:any
  //common table
  actionOptions: any
  displayColumns: any
  displayedColumns: any
  employeeLoading:any=undefined;
  editdata: any
  editableColumns: any = []
  topHeaders: any = []
  headerColors: any = []
  smallHeaders: any = []
  ReportTitles: any = {}
  selectedRows: any = []
  commonTableOptions: any = {}
  tableDataColors: any = {}
  showReportWise: boolean = false
  BankSlip:any[]=[]

  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here
constructor( 
  private _router: Router,
  private _commonservice: HttpCommonService,private dialog:MatDialog,
  private globalToastService: ToastrService){
    //common table
    this.actionOptions = [
      {
        name: "Save details",
        icon: "fa fa-check",
      },
    ]

    this.displayColumns = {
      // "SelectAll":"SelectAll",
      "Slno":"SL No",
      "Employee":"Employee",
      "NetSalary":"Net Salary",
      "Bank":"Bank Name",
      "AccountHolderName":"Account Holder Name",
      "AccountNumber":"Account Number",
      "IFSCCode":"IFSC Code",
      "BankBranch":"Bank Branch",
      "UPIID":"UPI",
      "Actions":"Actions"
    },


    this.displayedColumns= [
      // "SelectAll",
      "Slno",
      "Employee",
      "NetSalary",
      "Bank",
      "AccountHolderName",
      "AccountNumber",
      "IFSCCode",
      "BankBranch",
      "UPIID",
      "Actions"
    ]

    this.editableColumns = {
      // NetSalary: {
      //   filters: {IsPayslipExist:false},
      // },
      AccountHolderName: {
        regex:'^[a-zA-Z\\s]{1,20}$', 
        errorMessage:'Account Holder Name Must Be In Alphabets And Below 20 Characters',
        filters: {IsPayslipExist:false},
      },
      AccountNumber: {
        regex:'^\\d{9,18}$', 
        errorMessage:'Account Number Must Be Between 9-18 Digits',
        // type:'Number',
        filters: {IsPayslipExist:false},
      },
      IFSCCode: { 
      regex:'^[A-Z]{4}[0-9]{7}$', 
      errorMessage:'IFSC Must Be In Correct Format',
      // type:'Number',
      filters: {IsPayslipExist:false},
      },
      Bank: {
        regex:'^[a-zA-Z\\s]{1,20}$',
        errorMessage:'Bank Name Must Be In Alphabets Only And Below 20 Characters',
        filters: {IsPayslipExist:false},
      },
      UPIID: { 
        regex: '^(?!\\.)(?:[a-zA-Z0-9._-]+|\d{10})@[a-zA-Z0-9.-]+$',
        errorMessage:'IFSC Must Be In Correct Format  ',
        // type:'Number',
        filters: {IsPayslipExist:false},
      },
      BankBranch: { 
       regex:'^[a-zA-Z\\s]{1,20}$',
        errorMessage:'Bank Branch Must Be In Alphabets Only And Below 20 Characters',
        // type:'Text',
        filters: {IsPayslipExist:false},
      },
    }

    this.topHeaders = [
      // {
      //   id:"blank1",
      //   name:"",
      //   colspan:2
      // }
    ]

    this.headerColors = {
      // Deductions : {text:"#ff2d2d",bg:"#fff1f1"},
    }
    this.tableDataColors = {

    }
    //ends here
   

}
ngOnInit(){
  this.getBankData()
  this.AdminId = localStorage.getItem("AdminID")
}

editColumn(row: any) {
  let data = row.data;
  let column = row.column;
  let value = row.value;
  let index = this.BankSlip.findIndex(
    (e: any) => e.EmployeeID == data.EmployeeID
  );
  this.BankSlip[index][column] = value;
  this.calculate()
}

getBankData(){
  this.employeeLoading = true
  
  this.BankSlip = this.BankPaySlipList.map((l: any, i: any) => { 
    return {
     Slno: i + 1, ...l,
     "Bank":l.BankDetails?.BankAddress,
     "AccountHolderName":l.BankDetails?.AccountHolderName,
     "AccountNumber":l.BankDetails?.AccountNumber,
     "IFSCCode":l.BankDetails?.IFSCCode,
     "BankBranch":l.BankDetails?.BankBranch,
     "UPIID":l.BankDetails?.UPIID,
    } })
    
  this.clearSelect()
  this.calculate()
  this.employeeLoading = false
}
calculate(){
  const total = this.BankSlip.reduce((accumulator, bs: any) => accumulator + Number(bs.NetSalary), 0);
  this.totalAmount = total;
}

clearSelect(){
  this.selectedRows = []
  this.BankSlip.forEach(element => {
    element.isSelected = false
  });
}
SaveDetails(row:any){
 const json = {
  "AdminID": this.AdminId,
  "EmployeeID":   row.EmployeeID,
  "AccountHolderName":   row.AccountHolderName,
  "AccountNumber":   row.AccountNumber,
  "IFSCCode":   row.IFSCCode,
  "BankBranch":   row.BankBranch,
  "UPI_ID":   row.UPIID,
  "BankAddress":   row.Bank
 }
console.log(json,"json")
 this._commonservice.ApiUsingPost("Admin/UpdateBankDetails",json).subscribe(data => {
  if(data.Status == true){
    // this.globalToastService.success(data.Message)
    this.ShowToast(data.Message,"success")
  }else if(data.Status == false){
    // this.globalToastService.error(data.message)
    this.ShowToast(data.message,"error")
  }else{
    // this.globalToastService.error("An Error Occured.Please Try Again later")
    this.ShowToast("An Error Occured.Please Try Again later","error")
  }
 },(error)=>{
  //  this.globalToastService.error(error.error.Message)
  this.ShowToast(error.error.Message,"error")
 })
  
}

  //common table
  actionEmitter(data: any) {
    if (data.action.name == "Save details") {
      this.SaveDetails(data.row);
    }
    if (data.action.name == "editColumn") {
      this.editColumn(data.row);
    }
  }
  downloadReport(){
    let selectedColumns = this.displayedColumns
    this.commonTableChild.downloadReport(selectedColumns)
   }
  // ShowShiftDetails(row:any){
  // }
  //ends here

      ShowToast(message: string, type: 'success' | 'warning' | 'error'): void {
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
