import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-addlunchtimings',
  templateUrl: './addlunchtimings.component.html',
  styleUrls: ['./addlunchtimings.component.css']
})
export class AddlunchtimingsComponent {
  LunchList:any[]=[]
  ORGId:any
  timeFormat:any;
  timeFormat1:any
  constructor(private spinnerService: NgxSpinnerService,public dialogRef: MatDialogRef<AddlunchtimingsComponent>,
    private cdr :ChangeDetectorRef, private _commonservice: HttpCommonService, private globalToastService:ToastrService,private _httpClient:HttpClient){ 

  }


  ngOnInit(){
this.ORGId = localStorage.getItem('OrgID')
this.getLunchTimings()
this.getTimeFormat()
  }

  getTimeFormat(){
    this.timeFormat = 12;
    let LoggedInUserData:any  = localStorage.getItem("LoggedInUserData")
    if(LoggedInUserData?.TimeFormat == true){
      this.timeFormat = 24
    }
  }

  calculateDuration(IL: any) {
    setTimeout(() => {
    const fromTime = moment(IL.StartTime, 'h:mm A');
    const toTime = moment(IL.EndTime, 'h:mm A');
    let duration = toTime.diff(fromTime, 'minutes');
    if (duration < 0) {
      duration += 24 * 60; 
    }
    IL.Minutes = duration;
    if (IL.Minutes > 120) {
      this.globalToastService.warning("Total Hours Should Not be More than 2 Hours")
      IL.StartTime = ""
      IL.EndTime = ""
      IL.Minutes = IL.originalMinutes
      this.cdr.detectChanges();
    }
  },0)
  }

getLunchTimings(){
  const json = {
    "OrgID":this.ORGId,
  }
   this._commonservice.ApiUsingPost("Admin/AddLunchHour",json).subscribe((data:any) =>{
    this.LunchList = data.List.hours.map((item: any) => {
      return {
        ...item,
        originalMinutes: item.Minutes
      };
    });

   })
}


SubmitLunch(IL:any){
  const json = {
    "OrgID":this.ORGId,
    "hours":IL.map((d:any)=>{
      return {
        "branchid":d.branchid,
        "Minutes":d.Minutes,
        "StartTime":d.StartTime,
        "EndTime":d.EndTime
      }
    })
  }
  console.log(json,"lunch json");
  this._commonservice.ApiUsingPost("Admin/AddLunchHour",json).subscribe((data:any) =>{
    this.globalToastService.success("Lunch Timings Added Successfully")
  },(error)=>{
    this.globalToastService.error("Failed To Submit")
  })
}
}
