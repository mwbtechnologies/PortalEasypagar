import { Component, Inject } from '@angular/core';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

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
  Amount:any
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
      console.log(this.data.row,"logged expense ids");
      
      const today = new Date();
      this.PaymentDate = today.toISOString().split('T')[0];
      this.AdminID = localStorage.getItem("AdminID");
      this.UserId = localStorage.getItem("UserID");
      this.getAmount()
    }

    getAmount(){
      let json = {
        "ExpenseID":this.data.row
      }
      this._commonservice.ApiUsingPost("Admin/GetPaymentdetailsExpense",json).subscribe((res: any) => {
        this.Amount = res.Amount || 0
      },(error)=>{

      })
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
      if(this.selectedPayment.length == 0){
        this.ShowAlert("Please Select Payment Type","warning")
      }else if(this.PaymentDate == "" || this.PaymentDate == undefined){
        this.ShowAlert("Please Select Payment Date","warning")
      }else if(this.selectedPayment[0] == 'UPI'){
        if(this.PaymentUPINO == "" || this.PaymentUPINO == undefined || this.PaymentUPINO == null){
          this.ShowAlert("Please Enter UPI Number","warning")
        }
        else if(this.PaymentUPIAPP == "" || this.PaymentUPIAPP == undefined || this.PaymentUPIAPP == null){
          this.ShowAlert("Please Enter UPI Name","warning")
        } 
      }
      else if(this.selectedPayment[0] == 'CHEQUE'){
        if(this.Paymentcheque == "" || this.Paymentcheque == undefined || this.Paymentcheque == null){
          this.ShowAlert("Please Enter Cheque Number","warning")
        }
        else if(this.PaymentBank == "" || this.PaymentBank == undefined || this.PaymentBank == null){
          this.ShowAlert("Please Enter Bank Name","warning")
        }
        if(this.PaymentAccNo == "" || this.PaymentAccNo == undefined || this.PaymentAccNo == null){
          this.ShowAlert("Please Enter Account Number","warning")
        }
        else if(this.PaymentIFSC == "" || this.PaymentIFSC == undefined || this.PaymentIFSC == null){
          this.ShowAlert("Please Enter IFSC","warning")
        }
        else{
          true
        }
      }
      else{
        this.ShowAlert("Success","success")
        const json = {
        }
        this._commonservice.ApiUsingPost("",json).subscribe((res: any) => { 
          
        });
      }
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

