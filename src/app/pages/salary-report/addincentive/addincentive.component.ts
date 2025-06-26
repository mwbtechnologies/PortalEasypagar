import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-addincentive',
  templateUrl: './addincentive.component.html',
  styleUrls: ['./addincentive.component.css']
})
export class AddincentiveComponent {
  IncentiveList:any[]=[]
  incentive:any
constructor( 
  private _router: Router,
  private _commonservice: HttpCommonService,private dialog:MatDialog,
  private globalToastService: ToastrService , @Inject(MAT_DIALOG_DATA) public data: any){
  }
  ngOnInit(){
    this.IncentiveList = this.data.report
  }

  saveIncentive(){
    this.dialog.closeAll()
    
  }

  applyToAll(){
    this.IncentiveList.forEach((element:any) => {
      element.Incentive = this.incentive
    });
  }
}
