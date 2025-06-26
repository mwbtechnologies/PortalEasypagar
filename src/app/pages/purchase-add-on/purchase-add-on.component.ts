import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
//@ts-ignore
// let cf = new window.Cashfree(session_id)
@Component({
  selector: 'app-purchase-add-on',
  templateUrl: './purchase-add-on.component.html',
  styleUrls: ['./purchase-add-on.component.css']
})
export class PurchaseAddOnComponent implements OnInit {
  AdminID:any;
  OrgID:any;
  ApiURL:any;
  index:any;
  file:File | any;
  ImageUrl:any;
  ShowImage=false;
  fileInput:any;  
  AddonList:any;
  PlanDetails:any;
  PlanId:any;Version:any;Amount:any;
  AddonAmount:any;TotalAmount:any;
  PlanAmount:any;
  SubPlanId:any;
//order details
OrderID:any;OrderToken:any;PaymentLink:any;PaymentSessionId:any;
ShowPayment=false;
//@ts-ignore
const cashfree = Cashfree({
  mode:"sandbox" //or production
});


  constructor(private _router: Router,private globalToastService: ToastrService, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {}
  ngOnInit(): void
   {
    this.AddonAmount=0;this.TotalAmount=0;this.PlanAmount=0;
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    if (this.AdminID==null||this.AdminID==""||this.OrgID==undefined||this.OrgID==null||this.OrgID==""||this.AdminID==undefined) {
      this._router.navigate(["auth/signin-v2"]);
    }
    this.SubPlanId=localStorage.getItem('SubPlanId');
    this.Version=localStorage.getItem('Version');
    this.PlanId=localStorage.getItem('PlanId');
    this.GetBranchList();
    this.TotalAmount=this.AddonAmount+this.PlanAmount;
    if(this.TotalAmount>0) {  this.ShowPayment=true;}else{this.ShowPayment=false;}
  }
 
  purchaseOrder()
{
  const json={
    UserID:this.AdminID,
    PlanID:this.PlanId,
    SubPlanId:this.SubPlanId,
    AddOnList:this.AddonList
  }
  this.spinnerService.show();
  this._commonservice.ApiUsingPost("Plans/UpgradeUser", json).subscribe((sec) => {
    if(sec.Status==true)
    {
  this.globalToastService.success(sec.Message);
    }
    else{
      this.globalToastService.warning(sec.Message);
    }
    this.spinnerService.hide();
  }, (error) => {
    this.spinnerService.hide();
  });
}
  GetBranchList() {
    this.spinnerService.show();
    this.ApiURL="Plans/GetAddOnPlans?VersionID="+this.Version+"&UserID="+this.AdminID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
      if(sec.Status==true)
      {
        this.AddonList = sec.List;
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
    });
  }

OnAddOnSelect(event:any)
{
  this.AddonAmount=0;
  for(this.index=0;this.index<this.AddonList.length; this.index++)
  {
    this.Amount=this.AddonList[this.index].Count*this.AddonList[this.index].Amount;
    this.AddonAmount=this.AddonAmount+this.Amount;
  }
  this.TotalAmount=parseFloat(this.PlanAmount+this.AddonAmount);
  if(this.TotalAmount>0) {  this.ShowPayment=true;}else{this.ShowPayment=false;}
}

CreateOrder()
{
  this.spinnerService.show();
  this.ApiURL="Plans/CreateOrder";
  this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
    if(sec.Status==true)
    {
      var data=sec.Order;
      this.OrderID=data[0].OrderId;
      this.OrderToken=data[0].OrderToken;
      this.PaymentLink=data[0].PaymentLink;
      this.PaymentSessionId=data[0].PaymentSessionId;

      if(this.PaymentSessionId!=null && this.PaymentSessionId!=""&& this.PaymentSessionId!=undefined)
      {
        let checkoutOptions = {
          paymentSessionId: this.PaymentSessionId,
          returnUrl: "https://test.cashfree.com/pgappsdemos/v3success.php?myorder="+this.OrderID,
          
      }
      //@ts-ignore
      cashfree.checkout(checkoutOptions).then(function(result){
          if(result.error){
              alert(result.error.message)
          }
          if(result.redirect){
              console.log("Redirection")
          }
      });
      }
    }
    this.spinnerService.hide();
  }, (error) => {
    this.spinnerService.hide();
  });
  this.spinnerService.hide();
}
  }


