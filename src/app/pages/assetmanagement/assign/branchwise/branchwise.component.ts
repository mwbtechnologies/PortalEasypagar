import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonTableComponent } from 'src/app/pages/common-table/common-table.component';
import { AssetService } from 'src/app/services/assets.service';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ReduxService } from 'src/app/services/redux.service';

@Component({
  selector: 'app-asset-branch-analytics',
  templateUrl: './branchwise.component.html',
  styleUrls: ['./branchwise.component.css']
})
export class AssetBranchAnalyticsComponent {
  
  commonTableName:string = "Asset_Branch_Analytics"
  BranchWiseList:any[]=[]
    //common table
    actionOptions: any
    orginalValues: any = {}
    displayColumns: any
    displayedColumns: any
    Loading: any;
    topHeaders:any = []
    editableColumns: any = []
    ReportTitles: any = {}
    selectedRows: any = [];
    commonTableOptions: any = {}
    tableDataColors: any;
    @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
    //ends here
    ORGId: any
    AdminID: any
    BranchList: any[] = [];
     selectedOrganization:any[]=[]
     SubOrgList:any[]=[]
      orgSettings:IDropdownSettings = {}
  constructor(private _route: Router, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService,
    private globalToastService: ToastrService, private _httpClient: HttpClient,private assetService: AssetService,private reduxService:ReduxService) {
      this.orgSettings = {
        singleSelection: true,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
    // common table
    this.actionOptions = [
    ]
    this.displayColumns = {
      "SLno":"SL NO",
      "Branch":"BRANCH",
      // "totalItemsAssigned":"ITEMS",
      // "stockPendingQuantity":"QUANTITY",
      // "totalUsersAssigned":"USERS",
      // "assignedTotalQuantity":"ASSIGNED QUANTITY",
      // "totalStockQuantity":"IN STOCK",
      
      "TotalItems":"TOTAL",
      "TotalQuantity":"TOTAL",
      "TotalAmount":"TOTAL",
      "stockItems":"STOCK",
      "QuantityRemaining":"STOCK",
      "AmountRemaining":"STOCK",
      "AssignedItems":"ASSIGNED",
      "AssignedQuantity":"ASSIGNED",
      "AssignedAmount":"ASSIGNED",
      "AssignedUsers":"ASSIGNED",
    }
    this.displayedColumns = [
        "SLno",
        "Branch",
        "AssignedUsers",
        "TotalQuantity",
        "AssignedQuantity",
        "QuantityRemaining",
        "TotalItems",
        "AssignedItems",
        "stockItems",
        "TotalAmount",
        "AssignedAmount",
        "AmountRemaining",
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
          id:"items",
          name:"ITEMS",
          colspan:3
        },
        {
          id:"amount",
          name:"AMOUNT",
          colspan:3
        }
      ]
  
      // common table ends here
  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    // this.GetOrganization()
    // this.getBranches()
    this.getBranchWise()
  }

  // GetOrganization() {
  //   this.reduxService.getSubOrgList().subscribe((res:any)=>{
  //     if(res && res.data && res.data.length>0){
  //       this.SubOrgList = res.data
  //     }else throw {}
  //   },error=>{
  //     this.globalToastService.error("Failed to load SubOrganization")
  //   })
  // }
  // getBranches() {
  //   let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
  //   this.reduxService.getBranchList(suborgid).subscribe((res:any)=>{
  //     if(res && res.data && res.data.length>0){
  //       this.BranchList = res.data
  //       this.BranchWiseList = this.BranchWiseList.map((b:any)=>{
  //         console.log(this.reduxService.BranchListKV[b._id]);
  //         return  {...b,Branch:this.reduxService.BranchListKV[b._id]?.Name}
  //       })
  //       console.log(this.BranchWiseList);
        
  //     }else throw {}
  //   },error=>{
  //     this.globalToastService.error("Failed to load Branches")
  //   })
  // }

  getBranchWise(){
    this.Loading = true
    this.spinnerService.show()
    let json: any = {
      "SoftwareId": 8,
      "groupBy" : "branchId",
      "assignmentUserField": "userId",
      "mapping": {
          "orgId": parseInt(this.ORGId),
      }
  }
    this.assetService.PostMethod('assetMgnt/item/mappingList', json).subscribe((res: any) => {
      this.BranchWiseList = res.data.data.map((res: any, i: any) => {
        return {
          "SLno": i + 1,
          "Branch":this.reduxService.BranchListKV[res._id]?.Name,
          ...res
        }
      })

      this.Loading = false
      this.spinnerService.hide()
      this.loadBranchNames()
    }, (error) => {
      this.globalToastService.error(error.error.message)
      this.Loading = false
      this.spinnerService.hide()
    })
  }

  loadBranchNames(){
    this.reduxService.getBranchListByOrgId(0).subscribe(res=>{
      this.BranchWiseList = this.BranchWiseList.map((d:any)=>{
        return{
          ...d,
          Branch:d._id ? this.reduxService.BranchListKV[d._id]?.Text : "NA",
          // branchName:this.reduxService.EmployeeListKV[d._id].Branch
        }
      })

      
    this.Loading = false
    this.spinnerService.hide()
      
    },err=>{
      this.spinnerService.hide()
      this.Loading = false
    })
  }

  getbranchname(branchId: any) {
    const branch = this.BranchList.find(b => b.Value === branchId);
    return branch ? branch.Text : branchId;
  }
  //common table
  actionEmitter(data: any) {

  }
  //ends here
  backtolist(){
    this._route.navigate(['Asset/assign/list'])
  }
}
