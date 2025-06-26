import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-addonpacks',
  templateUrl: './addonpacks.component.html',
  styleUrls: ['./addonpacks.component.css']
})
export class AddonpacksComponent {
  @Input() addontype:any
  @Input() PlanAddons:any
  AdminID:any
  OrgID:any
  currentPlanAddons:any[]=[]
  totalAmount:any = 0
constructor(private _router: Router, private toastService:ToastrService,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
 
 
  }
  ngOnInit():void{
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.getAddons()
    console.log(this.PlanAddons,"what are coming here");
    this.TotalAmount()
  }

  getAddons(){
   this._commonservice.ApiUsingGetWithOneParam("Plans/GetAddOnPlans?VersionID=3&UserID="+this.AdminID+"&PlanId=&AddOnType="+this.addontype+"").subscribe((sec:any) => {
     this.currentPlanAddons = sec.List
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
   this.totalAmount = this.currentPlanAddons.reduce((sum, addon) => sum + (addon.Amount * addon.Count), 0);
  }
  
}
