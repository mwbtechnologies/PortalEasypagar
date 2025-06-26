import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonTableComponent } from 'src/app/pages/common-table/common-table.component';
import { AssetService } from 'src/app/services/assets.service';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-asset-item-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AssetItemAnalyticsComponent {
  commonTableName:string = "Asset_Item_Analytics"
  ItemAnalytics:any[]=[]
  BranchList: any[] = [];
  UserID:any
  ORGId:any
  AdminID:any
  //common table
  topHeaders:any = []
  actionOptions: any
  orginalValues: any = {}
  displayColumns: any
  displayedColumns: any
  Loading: any;
  editableColumns: any = []
  ReportTitles: any = {}
  selectedRows: any = [];
  commonTableOptions: any = {}
  tableDataColors: any;
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here
  constructor(
 private spinnerService: NgxSpinnerService,
    private _commonservice: HttpCommonService,
    private globalToastService: ToastrService,
  private assetService :AssetService,
  ){
   this.actionOptions = [
    ]
  this.displayColumns = {
    "name":"ITEM",
    "branch":"BRANCH",
    "categoryName":"Category",
    "totalQuantity":"TOTAL",
    "totalAmount":"TOTAL",
    "stockQuantity":"STOCK",
    "stockAmount":"STOCK",
    "assignedQuantity":"ASSIGNED",
    "assignedAmount":"ASSIGNED",
    "assignedUsers":"ASSIGNED",
  },
  this.displayedColumns = [
    "name",
    "branch",
    "categoryName",
    "totalQuantity",
    "assignedQuantity",
    "stockQuantity",
    "totalAmount",
    "assignedAmount",
    "stockAmount",
    "assignedUsers"
  ]
  
  this.topHeaders = [
    {
      id:"blank1",
      name:"",
      colspan:3
    },
    {
      id:"quantity",
      name:"QUANTITY",
      colspan:3
    },
    {
      id:"amount",
      name:"AMOUNT",
      colspan:3
    },
    {
      id:"users",
      name:"USERS",
      colspan:1
    }
  ]


 }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.GetBranches()
    this.getAssets()
  }
  GetBranches() {
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetBranchList?OrgID=" + this.ORGId + "&AdminId=" + this.UserID).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });

  }
  getAssets() {
    this.Loading = true
    this.spinnerService.show()
    let json = {
      // "createdBy": parseInt(this.AdminID),
      "SoftwareId": 8,
      "groupBy" : "branchId",
      "assignmentUserField": "userId",
      "mapping":{
        "orgId": parseInt(this.ORGId),
      },
      // "createdBy":parseInt(this.AdminID)
    }
    this.assetService.PostMethod('assetMgnt/item/itemList',json).subscribe((res:any)=>{
      this.ItemAnalytics = res.data.map((item: any, i: any) => {
        return {
          "SLno": i + 1,
          "branch":this.getBranchNames(item.groupValues) || '',
          ...item}
      })
      this.Loading = false
      this.spinnerService.hide()
    },(error)=>{
      this.globalToastService.error(error.error.message)
      this.Loading = false
      this.spinnerService.hide()
    })

  }

  getBranchNames(branchIds: any[]): string {
    if (!branchIds || branchIds.length === 0) return '';
    
    return branchIds
      .map(branchId => {
        const branch = this.BranchList.find(b => b.Value === branchId);
        return branch ? branch.Text : '';
      })
      .join(', ');
  }
  //common table
  actionEmitter(data: any) {

  }
  //ends here
  
}
