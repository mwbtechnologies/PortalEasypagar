import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { parse } from 'date-fns';
@Component({
  selector: 'app-approvepayslip',
  templateUrl: './approvepayslip.component.html',
  styleUrls: ['./approvepayslip.component.css']
})
export class ApprovepayslipComponent {
    dateError: string = '';
    minDate: string = '';
    maxDate: string = '';
    PaymentType:any[]=[ 
  { value: 1, label: 'CASH' },
  { value: 2, label: 'UPI' },
  { value: 3, label: 'CHEQUE' },
{ value: 4, label: 'PEPRO' }]
  PaymentSetting:IDropdownSettings={}
  selectedPayment:any;
  UserSelectedPayment:any[]=[];
  PaymentDate:any
 PaymentAmount:any
 Paymentcheque:any
PaymentBank:any
PaymentAccNo:any
PaymentIFSC:any
PaymentUPINO:any
PaymentUPIAPP:any
form: any;
AdminID:any
UserId:any
file:File | any;ImageUrl:any;ShowImage=false;
fileurl:any; 
ReferenceID:any
errorMessages : any = {};
selectedPayslips:any[]=[];
paysliparray:any[]=[];
netsalary:any;
  constructor(
    public dialogRef: MatDialogRef<ApprovepayslipComponent>,private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,private spinnerService: NgxSpinnerService,private _commonservice:HttpCommonService
  ) {
    this.PaymentSetting = {
      singleSelection: true,
      idField: 'value',
      textField: 'label',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
     
   
    }

    validateDate() {
        if (!this.PaymentDate) {
            this.dateError = '';
            return;
        }

        const selected = new Date(this.PaymentDate);
        const min = new Date(this.minDate);
        const max = new Date(this.maxDate);

        if (selected < min || selected > max) {
            this.dateError = `Date must be between ${this.minDate} and ${this.maxDate}`;
            this.PaymentDate = '';
        } else {
            this.dateError = '';
        }
    }

    formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    parseMonthRange(range: string) {
        const [startStr, endStr] = range.split(' - ');
        const [startDay, startMonth, startYear] = startStr.split('/').map(Number);
        const [endDay, endMonth, endYear] = endStr.split('/').map(Number);

        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);



        this.minDate = this.formatDate(endDate);
        this.maxDate = this.formatDate(new Date());

        // Optional: reset selected date if out of range

    }

  PaymentSelect(item:any){
this.selectedPayment=item.label;
  }
  PaymentDeselect(item:any){
this.selectedPayment=item.label;
  }

  ngOnInit(): void {
    const today = new Date();
    this.PaymentDate = today.toISOString().split('T')[0];
    this.AdminID = localStorage.getItem("AdminID");
    this.UserId = localStorage.getItem("UserID");
    console.log( this.data.IL,"il");
    this.selectedPayslips=this.data.IL;
     this.selectedPayment = 'CASH';
       this.UserSelectedPayment = [{value:1,label:"CASH"}]
      this.netsalary = 0;


      this.parseMonthRange(this.data.IL[0].DateRange);
     for(let i=0;i<this.selectedPayslips.length;i++)
    {
       
        this.netsalary=this.netsalary+parseFloat(this.selectedPayslips[i].NetSalary);
          
    }
    }

    allowOnlyLetters(event: KeyboardEvent): void {
        const inputChar = event.key;

        // Allow letters and space only
        const pattern = /^[A-Za-z ]$/;

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    allowOnlyNumbers(event: KeyboardEvent): void {
        const inputChar = event.key;

        // Allow navigation keys like Backspace, Tab, Arrow keys, etc.
        if (
            ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(inputChar)
        ) {
            return;
        }

        // Allow digits only (0-9)
        const pattern = /^[0-9]$/;
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    validateIfscKeyPress(event: KeyboardEvent): boolean {
        const input = event.target as HTMLInputElement;
        const currentValue = input.value;
        const inputChar = event.key.toUpperCase();

        // Allow navigation/control keys
        if (
            ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(event.key)
        ) {
            return true;
        }

        // Allow only A-Z and 0-9
        const isValidChar = /^[A-Z0-9]$/.test(inputChar);
        if (!isValidChar) {
            event.preventDefault();
            return false;
        }

        // Block input if already 11 characters
        if (currentValue.length >= 11) {
            event.preventDefault();
            return false;
        }

        // Specific rule: 5th character must be 0
        if (currentValue.length === 4 && inputChar !== '0') {
            event.preventDefault();
            return false;
        }

        return true;
    }


  UploadProof1Image1(event:any,form: NgForm) {
    const target = event.target as HTMLInputElement;
      this.file = (target.files as FileList)[0];
    
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

     if (!allowedTypes.includes(this.file.type)) {
      
         this.ShowToast(`File "${this.file.name}" is not a valid image. Only JPG, JPEG, and PNG are allowed.`, 'warning');
         this.file = null;
         if (target.value) {
             target.value = '';
         }
          return; // Stop processing further
    }
  
  var reader = new FileReader();
  reader.onload = (event: any) => {
  this, this.ImageUrl = event.target.result;
  this.fileurl=this.ImageUrl;
  }
  reader.readAsDataURL(this.file);
  this.ShowImage = true;
  const fData: FormData = new FormData();
  fData.append('formdata', JSON.stringify(form.value));
  fData.append('FileType', "Image");
  if (this.file != undefined) { fData.append('File', this.file, this.file.name);
  this._commonservice.ApiUsingPost("Admin/UploadFile?ImageType=Notification",fData).subscribe((data: { URL: any; }) => { this.ImageUrl=data.URL;});}
  }

  submitSummary()
  {
    if(!this.validate()) return
    this.spinnerService.show();
    if(this.UserSelectedPayment.length>0)
    {
   let msg="";
    const paymentjson = {
      "AccountNumber":this.PaymentAccNo,
      "ChequeBankName":this.PaymentBank,
      "ChequeDate":this.PaymentDate,
      "ChequeNumber":this.Paymentcheque,
      "IFSCcode":this.PaymentIFSC,
      "ImageURL":this.ImageUrl,
      // "PaidAmount":this.TotalSalary,
      "PaidFromID":parseInt(this.AdminID),
      // "PaidToID":parseInt(this.selectedPayslips[i].EmployeeID),
      "PaymentDate":this.PaymentDate,
      "PaymentFor":"Salary",
      "PaymentID":"",
      "PaymentMode":this.selectedPayment[0],
      "PaymentTypeID":"",
      "ReferenceID":this.ReferenceID,
      "UPIBankName":this.PaymentUPIAPP,
      "UPINumber":this.PaymentUPINO
    }
    for(let i=0;i<this.selectedPayslips.length;i++)
    {
        var temp={
          "IsPayslipExist":false,
          "AdminAmount":this.selectedPayslips[i].AdminAmount,
          "BasicSalary":this.selectedPayslips[i].CalcBasicSalary,
          "HRA":this.selectedPayslips[i].CalcHRA,
          "DA":this.selectedPayslips[i].CalcDA,
          "TA":this.selectedPayslips[i].CalcTA,
          "MA":this.selectedPayslips[i].CalcMA,
          "ShiftAmount":this.selectedPayslips[i].ShiftAmount,
          "OTAmount":this.selectedPayslips[i].OTAmount,
          "Others":this.selectedPayslips[i].Others,
          "TotalOtherEarnings":this.selectedPayslips[i].Earningsothers,
          "Incentive":this.selectedPayslips[i].Incentive,
          "leaveDeduction":this.selectedPayslips[i].leaveDeduction,
          "LoanDeduction":this.selectedPayslips[i].LoanDeduction,
          "AdvanceDeduction":this.selectedPayslips[i].AdvanceDeduction,
          "Penalty":this.selectedPayslips[i].Penalty,
          "Deductionsothers":this.selectedPayslips[i].Deductionsothers,
          "ESI":this.selectedPayslips[i].CalcESI,
          "PF":this.selectedPayslips[i].CalcEPF,
          "ProfessionalTax":this.selectedPayslips[i].CalcPT,
          "TDS":this.selectedPayslips[i].TDS,
          "CalculatedLeaves":this.selectedPayslips[i].CalculatedLeaves,
          "Comment":this.ReferenceID,
          "DateWiseInfo":[],
          "Employee":this.selectedPayslips[i].Employee,
          "EmployeeID":this.selectedPayslips[i].EmployeeID,
          "EmployeeLeaves":this.selectedPayslips[i].EmployeeLeaves,
          "FromDate":this.selectedPayslips[i].FromDate,
          "Key":"en",
          "MonthID":this.selectedPayslips[i].MonthID,
          "Month":this.selectedPayslips[i].MonthID,
          "NetSalary":this.selectedPayslips[i].NetSalary,
          "NewLoanBalance":this.selectedPayslips[i].NewLoanBalance,
          "NewSalaryBalance":this.selectedPayslips[i].NewSalaryBalance,
          "OfficialHolidays":this.selectedPayslips[i].OfficialHolidays,
          "OldLoanBalance":this.selectedPayslips[i].OldLoanBalance,
          "OldSalaryBalance":this.selectedPayslips[i].OldSalaryBalance,
          "PaidAmount":this.selectedPayslips[i].PaidAmount,
          "PaidLeave":this.selectedPayslips[i].PaidLeave,
          "PayableSalary":this.selectedPayslips[i].PayableSalary,
            "PaymentID":0,
          "PayslipDate":this.selectedPayslips[i].PayslipDate,
          "PerDaySalary":this.selectedPayslips[i].PerDaySalary,
          "PresentDays":this.selectedPayslips[i].NoOfPresentDays,
          // "ProfessionalTax":this.selectedPayslips[i].ProfessionalTax,
          "SickLeave":this.selectedPayslips[i].SickLeave,
          "ToDate":this.selectedPayslips[i].ToDate,
          "TotalDays":this.selectedPayslips[i].TotalDays,
          "TotalLoanDeduction":this.selectedPayslips[i].TotalLoanDeduction,
          "TotalWokingDays":this.selectedPayslips[i].TotalWokingDays,
          "Type":'Pay',
          "WeekOffDays":this.selectedPayslips[i].WeekOffDays,
          "WeekOffDeduction":this.selectedPayslips[i].WeekOffDeduction,
          "Year":this.selectedPayslips[i].Year,
          "Bonus":this.selectedPayslips[i].Bonus,
          "Deduction":this.selectedPayslips[i].Deduction,
          "bonusdata":this.selectedPayslips[i].bonusdata,
          "Gross":this.selectedPayslips[i].Gross,
          "FinalGross":this.selectedPayslips[i].CalcGross,
          "LoanList":this.selectedPayslips[i].LoanList,
          "FixedIncentive":this.selectedPayslips[i].FixedIncentive,
          "SecurityDeposit":this.selectedPayslips[i].SecurityDeposit,
          "PT":this.selectedPayslips[i].CalcPT,
          "PerformanceIncentive":this.selectedPayslips[i].PerformanceIncentive,
          "MonthlyIncentive":this.selectedPayslips[i].MonthlyIncentive,
          "FinePoints":this.selectedPayslips[i].FinePoints,
          "AttendanceBonus":this.selectedPayslips[i].AttendanceBonus,
          "WashingAllowance":this.selectedPayslips[i].WashingAllowance,
          "FuelAllowance":this.selectedPayslips[i].FuelAllowance,
          "PSA":this.selectedPayslips[i].PSA,
    }
    this.paysliparray.push(temp);
  }
var AdminID=localStorage.getItem("AdminID");
    const json={
      PaymentJson:paymentjson,
      Payslips:this.paysliparray,
      AdminID:AdminID
      }

      let server_response;
      this._commonservice.ApiUsingPost("Payslip/BulkPayslipApprove", json).subscribe((data: any) => {
          server_response = data;
         
      if(data.Status==true){  
        msg=data.Message;
     }
      else
      {
     msg=data.Message;
        // this.ShowToast(data.Message,"warning")
          this.spinnerService.hide();
          }


          this.dialogRef.close({ server_response });
      }, (error: any) => {
        
          server_response = error;
          this.dialogRef.close({ server_response });
       msg=error.Message;
      // this.ShowToast(error.Message,"error")
      this.spinnerService.hide();
     }
  );
     
this.spinnerService.hide();
    }
    else{
      this.ShowToast("Please select Payment Mode","warning")
      this.spinnerService.hide();
      return;
    }
 
  }
  Payslipdetails(){
}

cancelSummary(){
  this.dialogRef.close()
}

validate():boolean{
  this.errorMessages = {}
  let status = true
  if(this.selectedPayment == 'CHEQUE'){
    if(!this.Paymentcheque || this.Paymentcheque.length<=0){
      this.errorMessages['chequeno'] = {message:"Please enter a valid Cheque Number"}
      status = false
    }
    if(!this.PaymentBank || this.PaymentBank.length<=0){
      this.errorMessages['bankname'] = {message:"Please enter Bank Name"}
      status = false
    }
    if(!this.PaymentAccNo || this.PaymentAccNo.length<=0){
      this.errorMessages['accno'] = {message:"Please enter Account Number"}
      status = false
    }
    if(!this.PaymentIFSC || this.PaymentIFSC.length<=0){
      this.errorMessages['ifsccode'] = {message:"Please enter a valid IFSC Code"}
      status = false
    }else{
      let ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      let ifscStatus =  ifscPattern.test(this.PaymentIFSC);
      if(!ifscStatus){
        this.errorMessages['ifsccode'] = {message:"Please enter a valid IFSC Code"}
        status = false
      }
    }
  }
  if(this.selectedPayment == 'UPI'){
    if(!this.PaymentUPINO || this.PaymentUPINO.length<=0){
      this.errorMessages['upino'] = {message:"Please enter a valid UPI Number"}
      status = false
    }
  }
  
  return status

}
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

OnDateSelected(event: any)
 {
  let monthid=this.data.Month;
  let year=this.data.Year;
  // Parse the selected date to ensure it's in the correct format
  const selectedDate = parse(event.value, 'yyyy-MM-dd', new Date());
  const json = {
    "SelectedDate": selectedDate.toISOString().split('T')[0], // Format the date as needed  
    "AdminID": this.AdminID,
    "Month": monthid,
    "Year": year
    }
   this._commonservice.ApiUsingPost("Salary/ValidateDate",json).subscribe((data: any) => {
      if(data.Status!=true){  
     this.PaymentDate='';
      this.ShowToast(data.Message,"warning")
     }
     }, (error: any) => { this.spinnerService.hide();}
  );

}
}