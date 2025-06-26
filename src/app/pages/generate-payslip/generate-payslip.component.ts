import { Router } from '@angular/router';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { Component, ViewChild,  TemplateRef, OnInit, Inject, Input, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter,} from '@angular/core';
import {  startOfDay,  endOfDay,  subDays,  addDays,  endOfMonth,  isSameDay,  isSameMonth,  addHours} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  CalendarEvent, CalendarEventAction,  CalendarEventTimesChangedEvent,  CalendarView} from 'angular-calendar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
export class Emp{
  EmployeeID:any;
}
export class LoanClass{
  LoanAmount:any;
  Deduction:any;
  Balance:any;
}
export interface DialogData {
  LoanList:any;
}

export class eventclass{
  start:any;
  end:any;
  title:any;
  color:any;
  allDay:any;
  draggable:any;
  actions:any;
  comment:any;
}

@Component({
  selector: 'app-generate-payslip',
  templateUrl: './generate-payslip.component.html',
  styleUrls: ['./generate-payslip.component.css']
})
export class GeneratePayslipComponent implements OnInit, OnChanges {

  @Input() employeeDetail: any
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | any;

  @Output() updateValues: EventEmitter<any> = new EventEmitter();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  CalendarEvents:CalendarEvent[] = [];
  EmptyCalendarEvents:[]|any;
  viewDate: Date = new Date();

  presentHover: any = false
  absentHover:any = false
  leaveHover: any = false
  weekoffHover: any = false
  holidayHover: any = false
  refresh = new Subject<void>();
  
  comment:any
  SalaryDetails:any;
events:any;
  activeDayIsOpen: boolean = false;
  edited:any = {}
  EmployeeList:any;
  EmpClass:Array<Emp> = [];
  YearList:any;MonthList:any;
  public isSubmit: boolean | any;
  LoginUserData:any;
  AdminID: any;
  ApiURL:any;
  file:any;
  EmployeeId:any;
  ReportsList:any;
  selectedReportIds: string[] | any;
  selectedDepartmentIds: string[] | any;
  selectedBranchId: string[] | any;
  selectedYearId: string[] | any;
  selectedMonthId: string[] | any;
  selectedEmployeeId: string[] | any;
  OrgID:any;
  LoanList:any;
  SalaryList:any;
  DownloadURL:any;
  NewApiURL:any;
  index=0;
  pdfSrc:any; ShowCalendar=false;ShowDownload=true;
  PayslipURL: any;
  DatewiseList: any;
  DatewiseListKV: any;
  OldLoanDeduction:any;TotalLoanDeduction:any;OldNetSalary:any;NewNetSalary:any;
  OldLoanList: any;
  EmployeeName: any;
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;
  AdminProfile :any
  calendarData:any = []
  Earnings:any = {}
  Deductions:any = {}
  dateWiseStatus : any = {}
  DeductionData:any=[]
  showbonus:any=false;showdeduction:any=false;
  constructor(public dialog: MatDialog,private modal: NgbModal,private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService, private downlodfileservice:DownloadFileService, private toastr: ToastrService,
    private http: HttpClient
  ){ 
    this.isSubmit=false
    this.Earnings = [
      {
        title:'CalcBasicSalary',
        displayText:"Basic Salary"
      },
      {
        title:'CalcHRA',
        displayText:"House Rent Allowance (HRA)"
      },
      {
        title:'CalcDA',
        displayText:"Dearness Allowance (DA)"
      },
      {
        title:'CalcTA',
        displayText:"Travel Allowance (TA)"
      },
      {
        title:'CalcMA',
        displayText:"Medical Allowance (MA)"
      },
       {
        title:'CalcLTA',
        displayText:"Leave Travel Allowance (LTA)"
      },
       {
        title:'CalcConveyance',
        displayText:"Conveyance"
      },
      {
        title:'Earningsothers',
        displayText:"Other Earnings"
      },
       {
        title:'PSA',
        displayText:"PSA"
      },
      {
        title:'FixedIncentive',
        displayText:"Fixed Incentive"
      },
      {
        title:'ShiftAmount',
        displayText:"Shift Amount"
      },
      {
        title:'OTAmount',
        displayText:"OT Amount"
      },
      {
        title:'Bonus',
        displayText:"Bonus"
      },
        {
        title:'Attendance Bonus',
        displayText:"Attendance Bonus"
      },
        {
        title:'Fuel Allowance',
        displayText:"FuelAllowance"
      },

        {
        title:'Washing Allowance',
        displayText:"washingAllowance"
      },
        {
        title:'Performance Incentive',
        displayText:"PerformanceIncentive"
      },
        {
        title:'Last Month Incentive',
        displayText:"LastMonthIncentive"
      },
      {
        title:'Incentive',
        displayText:"Incentive"
      },
    ]
    this.Deductions = [
      {
        title:"CalcEPF",
        displayText:"Employee Provident Fund (EPF)",
      },
      {
        title:"CalcESI",
        displayText:"Employees' State Insurance (ESI)",
      },
      {
        title:"CalcPT",
        displayText:"Professional Tax (PT)",
      },
      {
        title:"TDS",
        displayText:"TDS",
      },
      {
        title:"Penalty",
        displayText:"Penalty",
      }, {
        title:"FinePoints",
        displayText:"Fine Points",
      },
      {
        title:"SecurityDeposit",
        displayText:"Security Deposit",
      },
      {
        title:"Deductionsothers",
        displayText:"Other Deductions",
      },
      {
        title:"LoanDeduction",
        displayText:"Loan",
      },
      {
        title:"AdvanceDeduction",
        displayText:"Advances",
      },
      {
        title:"Deduction",
        displayText:"Deduction",
      },

      ]

      console.log(this.getMonthName());
  }
  ngOnInit(): void {
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}   
    this.AdminID = localStorage.getItem("AdminID");
    this.EmployeeName = localStorage.getItem("EmployeeName");
    this.selectedMonthId = localStorage.getItem("Month");
    this.selectedYearId = localStorage.getItem("Year");
    this.selectedBranchId = localStorage.getItem("Branch");
    this.selectedEmployeeId = localStorage.getItem("Employee");
    
    this.OrgID = localStorage.getItem("OrgID");
    if (this.AdminID==null||this.OrgID==null) {

      this._router.navigate(["auth/signin"]);
    }
    this.GetReport()
    this.GetUserProfile()
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if(
      changes['employeeDetail']&& 
      changes['employeeDetail']['currentValue']&& 
      changes['employeeDetail']['currentValue']['bonusdata']
    )
    this.DeductionData = changes['employeeDetail']['currentValue']['bonusdata']
  }

  GetUserProfile() {
    this.ApiURL = "Portal/GetAdminProfile?AdminID=" + this.AdminID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
      this.AdminProfile = res.List[0];
    }, (error) => { });

  }
  getTotal(titles:any, salary:any){
    let value = 0
    titles.forEach((t:any) => {
      value += Number(salary[t.title]) || 0
    });
    return value
  }

  getAttendanceTypeCount(types:any){
    return (this.DatewiseList?.filter((d:any)=>types.includes(d.Comment)).length || 0) + ((this.DatewiseList?.filter((d:any)=>this.checkHalfDayType(d.Comment,types)).length || 0)/2)
  }
  checkHalfDayType(input:any, types:any){
    if(types.includes(input)) return false
    let splitInput = input.split('/')
    if(types.includes(splitInput[0])) return true
    else if(types.includes(splitInput[1])) return true
    else return false
  }

  GetReport() {
    this.spinnerService.show()
    this.ApiURL = "Performance/GetPayslipDetails?EmployeeID=" + this.selectedEmployeeId + "&Month=" + this.selectedMonthId + "&Year=" + this.selectedYearId;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res: any) => {
      this.SalaryDetails = res.SalaryDetails;
      this.ShowCalendar = true;
      this.LoanList = this.SalaryDetails && this.SalaryDetails.length>0 ? this.SalaryDetails[0].LoanList : [];
      this.DatewiseList = this.SalaryDetails && this.SalaryDetails.length>0 ? this.SalaryDetails[0].DateWiseInfo : [];
      this.showbonus= this.DeductionData.length>0 ? this.DeductionData.Details.length>0? this.DeductionData.Details.filter((record: { ActionType: any; }) => record.ActionType == "Bonus")? true:false:false:false;
      this.showdeduction= this.DeductionData.length>0 ? this.DeductionData.Details.length>0? this.DeductionData.Details.filter((record: { ActionType: any; }) => record.ActionType == "Deduction")? true:false:false:false;
      this.dateWiseStatus['holiday'] = this.getAttendanceTypeCount(['H'])

      this.dateWiseStatus['present'] =this.getAttendanceTypeCount(['P'])

      this.dateWiseStatus['absent'] = this.getAttendanceTypeCount(['A','LOP'])

      this.dateWiseStatus['leave'] = this.getAttendanceTypeCount(['PL','SL','POW'])
      this.dateWiseStatus['weekoff'] = this.getAttendanceTypeCount(['WO'])
      this.spinnerService.hide();
      console.log({SalaryDetails:this.SalaryDetails,employeeDetail:this.employeeDetail});
      this.generateCalendarData()
    }, (error) => {
      this.spinnerService.hide();
      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
    });
  }
  

  generateCalendarData(){
    this.DatewiseListKV = {}
    this.DatewiseList.forEach((item:any) => {
      item.dateObject = new Date(item.Date);
      this.DatewiseListKV [item.dateObject] = item
    });


    this.DatewiseList.sort((a:any, b:any) => a.dateObject - b.dateObject);
    let i = 0
    let minDate = new Date(this.DatewiseList[i].dateObject.toISOString())
    let maxDate = new Date(this.DatewiseList[this.DatewiseList.length-1].dateObject.toISOString())
    this.calendarData = []
    let week = []
    if(minDate.getDay()>0)
    week = Array(minDate.getDay()-1).fill(null)
    if(minDate.getDay()==0)
      week = Array(6).fill(null)
    while (minDate <= maxDate) {
      week.push(new Date(minDate))
      if(week.length>=7){
        this.calendarData.push(week);
        week = []
      }

      minDate.setDate(minDate.getDate() + 1);  // Move to the next day
    }
    if(week.length>0){
      this.calendarData.push(week)
    }
    console.log(this.calendarData);
    
  }
  onIncentiveChanged(newIncentive:any,IL:any){
    const difference = (newIncentive || 0) - (IL.Incentive || 0);

    IL.NetSalary += difference;
  
    // Update the incentive to the new value
    IL.Incentive = newIncentive;
  }

  DownloadSlip()
  {
    this.ApiURL=`Reports/GeneratePay?Employee=${this.selectedEmployeeId}&Month=${this.selectedMonthId}&Year=${this.selectedYearId}`;
    
    let res = this.http.get(`${environment.Url}/${this.ApiURL}`, {responseType: 'text'})
    console.log(res);
    res.subscribe((sucRes:string)=>{
      window.open(sucRes,"_blank");
    },(error)=>{
      console.log(error);
    })
  }
  Pay(IL:any){
    if(!this.comment){
      this.ShowToast("Please Add Comment","error")
    }
   else{
      this.dialog.open(PaymentSummary,{
        data:{IL}
      })
   }
  }

  getMonthName(){
    return moment(this.selectedMonthId
      , 'MM').format('MMMM')
  }

  
// openDialog(LoanList:any,TotalLoanDeduction:any, NetSalary:any): void {
//   this.OldLoanDeduction=TotalLoanDeduction;
//   this.OldNetSalary=NetSalary;
//   this.OldLoanList=LoanList;

//   const dialogRef = this.dialog.open(LoanDetails, {
//     data: {LoanList:LoanList,netsalary:NetSalary},
//     disableClose: true,
//   });

//   dialogRef.afterClosed().subscribe((result: any) => {
    
//     if(result && result.loanList){
//       let LoanDeduction:any[] = result.loanList.filter((ll:any)=>ll.LoanType == "Loan")
//       let LoanDeductionSum = LoanDeduction.reduce((sum,l)=>{
//         sum = sum + l.Deduction
//         return sum
//       },0)
//       let AdvanceDeduction:any[] = result.loanList.filter((ll:any)=>ll.LoanType == "Advance")
//       let AdvanceDeductionSum = AdvanceDeduction.reduce((sum,l)=>{
//         sum = sum + l.Deduction
//         return sum
//       },0)
//       this.updateValues.emit({
//         column:'LoanDeduction',
//         data:this.employeeDetail,
//         value:LoanDeductionSum
//       });
//       this.updateValues.emit({
//         column:'AdvanceDeduction',
//         data:this.employeeDetail,
//         value:AdvanceDeductionSum
//       });
//     }
//   });
// }

openDialog(LoanList:any,TotalLoanDeduction:any): void {
  this.OldLoanDeduction=TotalLoanDeduction;
  // this.OldNetSalary=NetSalary;
  this.OldLoanList=LoanList;

  const dialogRef = this.dialog.open(LoanDetails, {
    data: {LoanList:LoanList,employeeDetail:this.employeeDetail,Earnings:this.Earnings, Deductions:this.Deductions},
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe((result: any) => {

    if(result && result.loanList){
      let LoanDeduction:any[] = result.loanList.filter((ll:any)=>ll.LoanType == "Loan")
      let LoanDeductionSum = LoanDeduction.reduce((sum,l)=>{
        sum = sum + l.Deduction
        return sum
      },0)
      let AdvanceDeduction:any[] = result.loanList.filter((ll:any)=>ll.LoanType == "Advance")
      let AdvanceDeductionSum = AdvanceDeduction.reduce((sum,l)=>{
        sum = sum + l.Deduction
        return sum
      },0)
      this.edited['LoanDeduction'] = true
      this.edited['AdvanceDeduction'] = true
      this.updateValues.emit({
        column:'LoanDeduction',
        data:this.employeeDetail,
        value:LoanDeductionSum
      });
      this.updateValues.emit({
        column:'AdvanceDeduction',
        data:this.employeeDetail,
        value:AdvanceDeductionSum
      });
    }
  });
}

shiftSummary(row:any){
  this.dialog.open(ShiftSummary,{data:{row}})
}
otSummary(row:any){
  this.dialog.open(OtSummary,{data:{row}})
}

viewDeductions(type:any){
  this.dialog.open(DeductionHistory,{
    data:{banddtype:type,deduction:this.DeductionData,fulldata:this.SalaryDetails}
  })
}

  getPaySlipDuration(month:any){
    let monthString = []
    if(month.length >0){
      month = month.toString()
      let dates = month.split('-')
      if(dates.length>0){
        if(dates[0]){
          monthString.push(moment(dates[0], 'DD/MM/YYYY').format('DD MMM YYYY'))
        }
        if(dates[1]){
          monthString.push(moment(dates[1], 'DD/MM/YYYY').format('DD MMM YYYY'))
        }
      }
    }
    return monthString.join(' - ').toString()

  }


  calendarHover(type:any,status:any){
    console.log(type);
    
    if(type=='present') this.presentHover = !!status
    if(type=='absent') this.absentHover = !!status
    if(type=='leave') this.leaveHover = !!status
    if(type=='weekoff') this.weekoffHover = !!status
    if(type=='holiday') this.holidayHover = !!status
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
}


@Component({
  selector: 'loandetails',
  templateUrl: 'loandetails.html',
})
export class LoanDetails {
  // @Output()
  UserInput : any = "ABCD";
  TotalAmount:any
  TotalBalance:any
    TotalDeducted: any

    minDate: string = '';
    maxDate: string = '';
    selectedDate: string = '';
  constructor(
    public dialogRef: MatDialogRef<LoanDetails>,private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private globalToastService:ToastrService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.TotalAmount = this.data.LoanList.reduce((sum:any, item:any) => sum + item.OldBalance, 0);
    this.TotalBalance = this.data.LoanList.reduce((sum:any, item:any) => sum + item.RemainingBalance, 0);
  }

  onDeducted(newDeducted: number, IL: any) {
    const oldDeduction = IL.Deduction || 0;
    const difference = (newDeducted || 0) - oldDeduction;

    IL.RemainingBalance = (IL.OldBalance || 0) - (newDeducted || 0);

    IL.Deduction = newDeducted;

    this.updateTotalDeducted();
  }
  
  updateTotalDeducted() {
    this.TotalDeducted = this.data.LoanList.reduce((sum: number, item: any) => sum + (item.Deduction || 0), 0);
    this.TotalAmount = this.data.LoanList.reduce((sum:any, item:any) => sum + item.OldBalance, 0);
    this.TotalBalance = this.data.LoanList.reduce((sum:any, item:any) => sum + item.RemainingBalance, 0);
  }
  submit(){
    this.updateTotalDeducted();
    let netsalary = this.data.netsalary
    if( netsalary < this.TotalDeducted){
      this.ShowToast("Your Deductions are Higher than Net Salary..!!!","error")
    }
    else{
      this.dialogRef.close({loanList:this.data.LoanList});
    }
  }
  Close(){
    this.dialogRef.close({});
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

}
@Component({
  selector: 'paymentsummary',
  templateUrl: 'paymentsummary.html',
  styleUrls: ['./generate-payslip.component.css']
})
export class PaymentSummary {
    minDate: string = '';
    maxDate: string = '';
    selectedDate: string = '';
  PaymentType:any[]=['CASH','UPI','CHEQUE', 'PEPRO']
  PaymentSetting:IDropdownSettings={}
  selectedPayment:any
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
    errorMessages: any = {}
    dateError: string = '';
  constructor(
    public dialogRef: MatDialogRef<PaymentSummary>,private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,private spinnerService: NgxSpinnerService, private globalToastService:ToastrService,private _commonservice:HttpCommonService
  ) {
    this.PaymentSetting = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.selectedPayment = ['CASH']
  }
  PaymentSelect(item:any){

  }
  PaymentDeselect(item:any){

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


  ngOnInit(): void {
    const today = new Date();
    this.PaymentDate = today.toISOString().split('T')[0];
    this.AdminID = localStorage.getItem("AdminID");
    this.UserId = localStorage.getItem("UserID");
     console.log(this.data.IL, "il");
      this.parseMonthRange(this.data.IL.Month);

    
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
  this._commonservice.ApiUsingPost("Admin/UploadFile?ImageType=Notification",fData).subscribe(data => { this.ImageUrl=data.URL;});}
  }

  submitSummary(){
    if(!this.validate()) return
    if(this.selectedPayment.length==0){
      this.ShowToast("Please Select Payment Mode","error")
      return
    }
    this.spinnerService.show()
    const json = {
      "AccountNumber":this.PaymentAccNo,
      "ChequeBankName":this.PaymentBank,
      "ChequeDate":this.PaymentDate,
      "ChequeNumber":this.Paymentcheque,
      "IFSCcode":this.PaymentIFSC,
      "ImageURL":this.ImageUrl,
      "PaidAmount":this.data.IL.NetSalary,
      "PaidFromID":parseInt(this.AdminID),
      "PaidToID":parseInt(this.data.IL.EmployeeID),
      "PaymentDate":this.PaymentDate,
      "PaymentFor":"Salary",
      "PaymentID":"",
      "PaymentMode":this.selectedPayment[0],
      "PaymentTypeID":"",
      "ReferenceID":this.ReferenceID,
      "UPIBankName":this.PaymentUPIAPP,
      "UPINumber":this.PaymentUPINO
    }
    debugger
    this._commonservice.ApiUsingPost("Admin/SavePaymentDetails",json).subscribe((data: any) => {
      if(data.Status==true){
      const json={
          "IsPayslipExist":false,
          "AdminAmount":this.data.IL.AdminAmount,
          "BasicSalary":this.data.IL.CalcBasicSalary,
          "HRA":this.data.IL.CalcHRA,
          "DA":this.data.IL.CalcDA,
          "TA":this.data.IL.CalcTA,
          "MA":this.data.IL.CalcMA,
           "LTA":this.data.IL.CalcLTA,
            "Conveyance":this.data.IL.CalcConveyance,
          "ShiftAmount":this.data.IL.ShiftAmount,
          "OTAmount":this.data.IL.OTAmount,
          "Others":this.data.IL.Others,
          "TotalOtherEarnings":this.data.IL.Earningsothers,
          "Incentive":this.data.IL.Incentive,
          "leaveDeduction":this.data.IL.leaveDeduction,
          "LoanDeduction":this.data.IL.LoanDeduction,
          "AdvanceDeduction":this.data.IL.AdvanceDeduction,
          "Penalty":this.data.IL.Penalty,
          "Deductionsothers":this.data.IL.Deductionsothers,
          "ESI":this.data.IL.CalcESI,
          "PF":this.data.IL.CalcEPF,
          "ProfessionalTax":this.data.IL.CalcPT,
          "TDS":this.data.IL.TDS,
          "CalculatedLeaves":this.data.IL.CalculatedLeaves,
          "Comment":this.ReferenceID,
          "DateWiseInfo":[],
          "Employee":this.data.IL.Employee,
          "EmployeeID":this.data.IL.EmployeeID,
          "EmployeeLeaves":this.data.IL.EmployeeLeaves,
          "FromDate":this.data.IL.FromDate,
          "Key":"en",
          "MonthID":this.data.IL.MonthID,
          "Month":this.data.IL.MonthID,
          "NetSalary":this.data.IL.NetSalary,
          "NewLoanBalance":this.data.IL.NewLoanBalance,
          "NewSalaryBalance":this.data.IL.NewSalaryBalance,
          "OfficialHolidays":this.data.IL.OfficialHolidays,
          "OldLoanBalance":this.data.IL.OldLoanBalance,
          "OldSalaryBalance":this.data.IL.OldSalaryBalance,
          "PaidAmount":this.data.IL.PaidAmount,
          "PaidLeave":this.data.IL.PaidLeave,
          "PayableSalary":this.data.IL.PayableSalary,
          "PaymentID":data.PaymentId,
          "PayslipDate":this.data.IL.PayslipDate,
          "PerDaySalary":this.data.IL.PerDaySalary,
          "PresentDays":this.data.IL.NoOfPresentDays,
          // "ProfessionalTax":this.data.IL.ProfessionalTax,
          "SickLeave":this.data.IL.SickLeave,
          "ToDate":this.data.IL.ToDate,
          "TotalDays":this.data.IL.TotalDays,
          "TotalLoanDeduction":this.data.IL.TotalLoanDeduction,
          "TotalWokingDays":this.data.IL.TotalWokingDays,
          "Type":'Pay',
          "WeekOffDays":this.data.IL.WeekOffDays,
          "WeekOffDeduction":this.data.IL.WeekOffDeduction,
          "Year":this.data.IL.Year,
          "Bonus":this.data.IL.Bonus,
          "Deduction":this.data.IL.Deduction,
          "bonusdata":this.data.IL.bonusdata,
          "Gross":this.data.IL.Gross,
          "FinalGross":this.data.IL.CalcGross,
          "LoanList":this.data.IL.LoanList,
          "FixedIncentive":this.data.IL.FixedIncentive,
          "SecurityDeposit":this.data.IL.SecurityDeposit,
          "PT":this.data.IL.CalcPT,
          "PerformanceIncentive":this.data.IL.PerformanceIncentive,
          "MonthlyIncentive":this.data.IL.MonthlyIncentive,
          "FinePoints":this.data.IL.FinePoints,
          "AttendanceBonus":this.data.IL.AttendanceBonus,
          "WashingAllowance":this.data.IL.WashingAllowance,
          "FuelAllowance":this.data.IL.FuelAllowance,
          "PSA":this.data.IL.PSA,
          
      }
      this._commonservice.ApiUsingPost("SalaryCalculation/SavePaySlipDetails",json).subscribe((data: any) => {
        // this.globalToastService.success("Payslip generated Successfully");
        this.spinnerService.hide();
        if(!data.Message || data.Message == ""){
          data['Message']= "Payslip generated Successfully"
        }
        this.dialogRef.close({data,json})
      }, (error: any) => {
        localStorage.clear();
  
        // this.globalToastService.error(error.message);
        this.ShowToast(error.message,"error")
        this.spinnerService.hide();
       }
    )
      }
      else
      {
        // this.globalToastService.warning(data.Message);
        this.ShowToast(data.Message,"warning")
          this.spinnerService.hide();
      }
      
    }, (error: any) => {
      localStorage.clear();

      // this.globalToastService.error(error.message);
      this.ShowToast(error.message,"error")
      this.spinnerService.hide();
     }
  );
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



}

@Component({
  selector: 'shiftsummary',
  templateUrl: 'shiftsummary.html',
})
export class ShiftSummary {
  AdminID:any
  UserId:any
  EmpshiftSummary:any[]=[]
  ShiftList: any;
  constructor(
    public dialogRef: MatDialogRef<ShiftSummary>,
    @Inject(MAT_DIALOG_DATA) public data: any,private spinnerService: NgxSpinnerService, private globalToastService:ToastrService,private _commonservice:HttpCommonService
  ) {
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.getShiftsummary()
  }
getShiftsummary(){
  let employee = parseInt(this.data.row.MappedEmpId)
  let month = this.data.row.Month
  let year = this.data.row.Year
  this._commonservice.ApiUsingGetWithOneParam("ShiftMaster/GetEmployeeShiftReport?EmployeeID="+employee+"&Month="+month+"&Year="+year+"").subscribe((data:any)=>{
    this.EmpshiftSummary = data.SalaryDetails;
    this.ShiftList=data.ShiftList;
  })
}

}

@Component({
  selector: 'otsummary',
  templateUrl: 'otsummary.html',
})
export class OtSummary {
  AdminID:any
  UserId:any
  EmpOtSummary:any[]=[]
  constructor(
    public dialogRef: MatDialogRef<OtSummary>,
    @Inject(MAT_DIALOG_DATA) public data: any,private spinnerService: NgxSpinnerService, private globalToastService:ToastrService,private _commonservice:HttpCommonService
  ) {
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.getotsummary()
  }
getotsummary(){
  let employee = parseInt(this.data.row.MappedEmpId)
  let month = this.data.row.Month
  let year = this.data.row.Year
  this._commonservice.ApiUsingGetWithOneParam("SalaryCalculation/GetOTDetails?EmployeeID="+employee+"&Month="+month+"&Year="+year+"").subscribe((data:any)=>{
    this.EmpOtSummary = data.Details
  })
}


}
@Component({
  selector: 'deductionhistory',
  templateUrl: 'deductionhistory.html',
})
export class DeductionHistory {
  AdminID:any
  UserId:any
  EmpOtSummary:any[]=[]
  SalaryData:any[]=[]
  DeductionData:any
  Type:any
  constructor(
    public dialogRef: MatDialogRef<OtSummary>,
    @Inject(MAT_DIALOG_DATA) public data: any,private spinnerService: NgxSpinnerService, private globalToastService:ToastrService,private _commonservice:HttpCommonService
    ,private cdr: ChangeDetectorRef) {
    // this.DeductionData = this.data.deduction.Details
    this.SalaryData = this.data.fulldata
    this.Type = this.data.banddtype
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
   if(this.Type === 'Bonus'){
    this.DeductionData = this.data.deduction.Details.filter((at:any)=> at.ActionType == 'Bonus')
   }
   if(this.Type === 'Deduction'){
    this.DeductionData = this.data.deduction.Details.filter((at:any)=> at.ActionType == 'Deduction')
   }
    
  }

  SaveData(){
    this.cdr.detectChanges();
    let data : any = {}
    this.DeductionData.forEach((d:any) => {
      data[d.ActionID] = d
    })
    this.dialogRef.close({DeductionData:data})
    // this._commonservice.ApiUsingPost("SalaryCalculation/SavePaySlipDetails",this.SalaryData).subscribe((data: any) => {
    //   if(data.Status == true){
    //     this.globalToastService.success("Payslip Saved Successfully")
    //     this.dialogRef.close()
    //   }
    //   else if(data.status == false){
    //     this.globalToastService.error(data.Message)
    //   }
    //   else{
    //     this.globalToastService.error("An error occurred.Please try later")
    //   }
    // },(error)=>{
    //   this.globalToastService.error(error.error.Message)
    //   this.dialogRef.close()
    // })
  }



}
