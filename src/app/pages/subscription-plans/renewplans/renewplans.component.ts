import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-renewplans',
  templateUrl: './renewplans.component.html',
  styleUrls: ['./renewplans.component.css']
})
export class RenewplansComponent {
  RenewDetails:any[]=[]
  AdminID:any
OrgID:any
PlanDetails:any
totalAmount:any= 0
isProceedClicked:boolean=false
 constructor(private toastService:ToastrService,private _router: Router, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
this.getRenewPlan();
}
getRenewPlan(){
  this._commonservice.ApiUsingGetWithOneParam("Plans/GetSubscriptionPlans?UserID="+this.AdminID+"").subscribe((sec:any) => {
       this.RenewDetails = sec.List[0].Plans
       console.log(sec,"current plan");
       this.spinnerService.hide();
     }, (error) => {
       this.spinnerService.hide();
     });
}

Proceed(planid:any){
  this._commonservice.ApiUsingGetWithOneParam("Plans/GetAddOnPlans?VersionID=3&UserID="+this.AdminID+"&PlanId="+planid+"&AddOnType=All").subscribe((sec:any) => {
    this.PlanDetails = sec.List
    this.isProceedClicked = true
    this.spinnerService.hide();
  }, (error) => {
    this.spinnerService.hide();
  });
}

addonCount(addon_i:any,count:any,addons:any){
  if(count <0 && addons[addon_i]['Count'] == 0){
    this.toastService.error(`Count cannot be less than 0`,`${addons[addon_i]['Title']}`);
    return
  }
  if(addons[addon_i]['minCount'] <= addons[addon_i]['Count'] && (addons[addon_i]['Count'] >0 || count == 1 )) 
    addons[addon_i]['Count'] = addons[addon_i]['Count'] + count

  if(addons[addon_i]['minCount'] > addons[addon_i]['Count']){
    // this.toast.showToastTimeOut({ title: `addons[addon_i]['Title']`, msg: `Count cannot be less than ${addons[addon_i]['minCount']}`, type: 'Error' })
    this.toastService.error(`Count cannot be less than ${addons[addon_i]['minCount']}`,`${addons[addon_i]['Title']}`);
    addons[addon_i]['Count'] = addons[addon_i]['minCount']
  }
  this.TotalAmount()
}
TotalAmount() {
 this.totalAmount = this.PlanDetails.reduce((sum:any, addon:any) => sum + (addon.Amount * addon.Count), 0);
}
}
