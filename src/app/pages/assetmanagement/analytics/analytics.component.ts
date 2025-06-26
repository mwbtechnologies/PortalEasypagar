import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AssetAnalyticsComponent implements OnInit {
  tab:any
  constructor(private _route: Router,){
    this.tab={
      itemAnalytics :true,
      categoryAnalytics :false,
      branchAnalytics :false,
      departmentAnalytics :false,
    }
  }

  ngOnInit(): void {
    
  }

  backtolist(){
    this._route.navigate(['Asset/assign/list'])
  }

  onTabChange(event: MatTabChangeEvent) {
    if(event.index == 1) this.tab['categoryAnalytics'] = true
    if(event.index == 2) this.tab['branchAnalytics'] = true
    if(event.index == 3) this.tab['departmentAnalytics'] = true
    
  }
  
}