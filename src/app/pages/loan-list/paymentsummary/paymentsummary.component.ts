import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-paymentsummary',
  templateUrl: './paymentsummary.component.html',
  styleUrls: ['./paymentsummary.component.css']
})
export class PaymentsummaryComponent {
    PaymentType:any[]=['CASH','UPI','CHEQUE']
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
    constructor(
      public dialogRef: MatDialogRef<PaymentsummaryComponent>,private dialog:MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any,private toastr: ToastrService,
      private spinnerService: NgxSpinnerService, private globalToastService:ToastrService,
      private _commonservice:HttpCommonService
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
  
    ngOnInit(): void {
      const today = new Date();
      this.PaymentDate = today.toISOString().split('T')[0];
      this.AdminID = localStorage.getItem("AdminID");
      this.UserId = localStorage.getItem("UserID");
    }
  
    UploadProof1Image1(event:any,form: NgForm) {
      const target = event.target as HTMLInputElement;
      this.file = (target.files as FileList)[0];
    
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
      const json = {
        "AccountNumber":this.PaymentAccNo,
        "ChequeBankName":this.PaymentBank,
        "ChequeDate":this.PaymentDate,
        "ChequeNumber":this.Paymentcheque,
        "IFSCcode":this.PaymentIFSC,
        "ImageURL":this.ImageUrl,
        "PaidAmount":this.data.data.ApprovedAmount,
        "PaidFromID":parseInt(this.AdminID),
        "PaidToID":parseInt(this.data.data.EmpID),
        "PaymentDate":this.PaymentDate,
        "PaymentFor":"Salary",
        "PaymentID":"",
        "PaymentMode":this.selectedPayment[0],
        "PaymentTypeID":"",
        "ReferenceID":this.ReferenceID,
        "UPIBankName":this.PaymentUPIAPP,
        "UPINumber":this.PaymentUPINO
      }
      this._commonservice.ApiUsingPost("Admin/SavePaymentDetails",json).subscribe((res: any) => {
        if(res.Status == true){
          const json={
            LoanID:this.data.data.LoanID,
            PaymentID:res.PaymentId,
            AdminID:this.UserId,
            MonthlyDeduction:this.data.data.MonthlyDeduction,
            EmpID:this.data.data.EmpID,
            EmployeeId:this.data.data.EmpID,
            ApprovedAmount:this.data.data.ApprovedAmount,
            Key:'en',
            Comment:this.data.data.Comment
          }
          console.log(json);
          this._commonservice.ApiUsingPost("Admin/ApproveLoan",json).subscribe(data => {
            //  this.toastr.success(data.Message);
            if(res.Status == true){
              // this.toastr.success(data.Message);
              this.ShowAlert(data.Message,"success")
              this.spinnerService.hide();
            }
            else if(res.Status == false){
              // this.toastr.success(data.Message);
              this.ShowAlert(data.Message,"error")
              this.spinnerService.hide();
            }
             this.spinnerService.hide();
           }, (error: any) => {
             // this.toastr.error(error.message);
             this.spinnerService.hide();
           }
           
           );
        }
        else{
          this.ShowAlert(res.Message,"warning")
          this.spinnerService.hide();
        }
       
         this.dialogRef.close({paymentid :res.PaymentId}) 
      },(error: any) => {
        localStorage.clear();
        // this.globalToastService.error(error.message);
        this.ShowAlert(error.message,"error")
        this.spinnerService.hide();
       }
    );
    }
    Payslipdetails(){
  
  }

  closeTab(){
    this.dialogRef.close()
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
