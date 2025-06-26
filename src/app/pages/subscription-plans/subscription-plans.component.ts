import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.css']
})
export class SubscriptionPlansComponent implements OnInit {
AdminID:any;
OrgID:any;
ApiURL:any;
PlanDetails:any
ImgURl:any
MainPage:boolean = true
DetailedPage:boolean = false
addonPacks:boolean = false
addontype:any
AddonListPlanName:any
AddonButton:any
RenewButton:any

renewPlan:boolean=false
constructor(private _router: Router, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
    this.ImgURl = environment.MasterUrl
 
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.AddonButton = localStorage.getItem("isAddonAvailable");
    this.RenewButton = localStorage.getItem("isRenewAvailable");
    if (this.AdminID==null||this.AdminID==""||this.OrgID==undefined||this.OrgID==null||this.OrgID==""||this.AdminID==undefined) {
      this._router.navigate(["auth/signin-v2"]);
    }
   this.GetCurrentPlan();
}


  GetCurrentPlan() {
    const json ={
    "plan": true,
    "SoftwareID": 8,
    "UserId": parseInt(this.AdminID)
    }
    this.ApiURL = environment.MasterUrl+'/subscription/get/currentplan/features/count/combined'
    this._commonservice.MasterPortalApi(this.ApiURL,json).subscribe((sec:any) => {
      this.PlanDetails = sec.data
      console.log(sec,"current plan");

      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      // 
    });
  }
  viewDetailedPlan(){
    // commented as payment gateway code is not added yet
    this.MainPage = false
    this.addonPacks = false
    this.renewPlan = false
    this.DetailedPage = true
  }
  addonAndPacks(name:any,plandetails:any){
     // commented as payment gateway code is not added yet
    // this.MainPage = false
    // this.DetailedPage = false
    // this.renewPlan = false
    // this.addonPacks = true
    // this.addontype = name
    // this.AddonListPlanName = plandetails
  }
  renewPlanPack(){
    this.MainPage = false
    this.addonPacks = false
    this.DetailedPage = false
    this.renewPlan = true
  }
  backToMainPage(){
    this.MainPage = true
    this.DetailedPage = false
    this.addonPacks = false
    this.renewPlan = false
  }
  backToDashboard(){
    this._router.navigate(["appdashboard"]);
  }

  }
