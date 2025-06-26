import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonTableComponent } from 'src/app/pages/common-table/common-table.component';
import { AssetService } from 'src/app/services/assets.service';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { AddComponent } from '../add/add.component';

@Component({
  selector: 'app-asset-categorywise',
  templateUrl: './categorywise.component.html',
  styleUrls: ['./categorywise.component.css']
})
export class CategorywiseComponent {

 CategoryList: any[] = []
  UserID:any
  UserName:any
//common table
  commonTableName:string = "Asset_Category_Analytics"
    topHeaders:any = []
actionOptions: any
orginalValues: any = {}
displayColumns: any
displayedColumns: any
Loading: any;
ReportTitles: any = {}
selectedRows: any = [];
editableColumns: any = []
commonTableOptions: any = {}
tableDataColors: any;
@ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
//ends here
  ORGId: any
  AdminID: any
  constructor(private _route: Router, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService,
      private globalToastService: ToastrService, private _httpClient: HttpClient,
      private dialog: MatDialog, private cdr: ChangeDetectorRef, private assetService: AssetService) {

          // common table
    this.actionOptions = [
      {
        name: "Edit",
        icon: "fa fa-edit",
      },
    ]
    this.displayColumns = {
      "SLno":"SL NO",
      "name":"CATEGORY",
      "dynamicFieldCount":"BRANCH",
      "numberOfItems":"ITEMS",
      "assignedUsers":"USERS",
      "totalQuantity":"TOTAL",
      "stockQuantity":"STOCK",
      "assignedQuantity":"ASSIGNED",
      "totalAmount":"TOTAL",
      "stockAmount":"STOCK",
      "assignedAmount":"ASSIGNED",
      "totalItems":"TOTAL",
      "stockItems":"STOCK",
      "assignedItems":"ASSIGNED",
    }
    this.displayedColumns = [
      "SLno",
      "name",
      "dynamicFieldCount",
      // "assignedTotalQuantity",
      // "totalUsersAssigned",
      "assignedUsers",
      "totalQuantity",
      "assignedQuantity",
      "stockQuantity",
      "totalItems",
      "assignedItems",
      "stockItems",
      "totalAmount",
      "assignedAmount",
      "stockAmount",
    ]

    
    this.topHeaders = [
      {
        id:"blank1",
        name:"",
        colspan:4
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
        id:"items",
        name:"ITEMS",
        colspan:3
      }
    ]
    // common table ends here
   
  }

  ngOnInit() {
    this.UserID = localStorage.getItem('empid')
    this.UserName = localStorage.getItem('empname')
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    console.log(this.UserName,"username");
    
    this.getCategoryList()
  }

  getCategoryList() {
    this.Loading = true
    this.spinnerService.show()
    let json: any = {
      // "groupBy":"branchId",
      "SoftwareId": 8,
      "assignmentUserField": "userId",
      "mapping":{
        "orgId": this.assetService.ORGId,
      },
      columns:"branchId"
    }
    this.assetService.PostMethod('assetMgnt/category/categoryList', json).subscribe((res: any) => {
      this.CategoryList = res.data.map((res: any, i: any) => {
        return {
          "SLno": i + 1,
          ...res
        }
      })
      this.Loading = false
      this.spinnerService.hide()
    }, (error) => {
      this.globalToastService.error(error.error.message)
      this.Loading = false
      this.spinnerService.hide()
    })
  }

    //common table
    actionEmitter(data: any) {
    }
    //ends here
    backtolist(){
      this._route.navigate(['Asset/item/list'])
    }

    openAdd(){
      this.dialog.open(AddComponent,{
            data:{
              CategoryList:this.CategoryList
            }
          }).afterClosed().subscribe(res =>{
            if(res){
              this.getCategoryList()
            }
          })
    }
    addCategory(){

    }


}
