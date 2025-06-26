import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detailedplan',
  templateUrl: './detailedplan.component.html',
  styleUrls: ['./detailedplan.component.css']
})
export class DetailedplanComponent {
  AdminID:any;
OrgID:any;
ApiURL:any;
CurrentPlanDetails:any
ImgURl:any
  constructor(private _router: Router, private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService) {
    this.ImgURl = environment.MasterUrl
 
  }
  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
this.GetCurrentPlan();
}
    GetCurrentPlan() {
      const json ={
      "SoftwareID": 8,
      "UserId": parseInt(this.AdminID)
      }
      this.ApiURL = environment.MasterUrl+'/subscription/get/currentplan/features/count'
      this._commonservice.MasterPortalApi(this.ApiURL,json).subscribe((sec:any) => {
        this.CurrentPlanDetails = sec.data
        console.log(sec,"current plan");
  
        this.spinnerService.hide();
      }, (error) => {
        this.spinnerService.hide();
        // 
      });
    }
}
