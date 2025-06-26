import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssetService } from 'src/app/services/assets.service';
import { ReduxService } from 'src/app/services/redux.service';

@Component({
  selector: 'app-asset-inward-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class AssetInwardListComponent implements OnInit {
  commonTableName:any = "Asset_Stock_List"
  StockList: any = []
  Loading: any;
  actionOptions: any
  displayColumns: any
  displayedColumns: any
  editableColumns: any = []

  ORGId: any
  AdminID: any
  UserID: any
  AdminName: any
  EmployeeList: any

  paginatedData:any
  page:number = 1
  limit:number = 10


  constructor(private _route: Router, private spinnerService: NgxSpinnerService,
    private globalToastService: ToastrService,
    private _httpClient: HttpClient,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private assetService: AssetService,
    private reduxService: ReduxService,
  ) {
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye",
      }
    ]

    this.displayColumns = {
      "SLno": "Sl No",
      "supplierName": "SUPPLIER NAME",
      "purchasedByName": "PURCHASED BY",
      "invoiceNumber": "INVOICE",
      "referenceNumber": "REF NO",
      "returnTypeString": "Return Type",
      "createdByString": "CREATED BY",
      "CreatedDateTime": "CREATED ON",
      "Actions": "ACTIONS"
    }

    this.displayedColumns = [
      "SLno",
      "supplierName",
      "purchasedByName",
      "invoiceNumber",
      "referenceNumber",
      // "returnTypeString",
      "createdByString",
      "CreatedDateTime",
      "Actions"
    ]
  }

  ngOnInit(): void {

    this.loadStocks()
  }

  // loadStocks() {
  //   this.Loading = true
  //   this.spinnerService.show()
  //   let json = {
  //     "mapping": {
  //       "orgId": this.assetService.ORGId,
  //     },
  //     "createdBy": this.assetService.AdminID,
  //     "SoftwareId": 8,
  //   }
  //   this.assetService.PostMethod('assetMgnt/invoice/get', json).subscribe((res: any) => {
  //     this.StockList = res.data.map((d: any, i: any) => {
  //       return {
  //         "SLno": i + 1,
  //         ...d,
  //         CreatedDateTime: d.createdAt
  //       }
  //     })
  //     this.StockList = this.reduxService.mapUserToAssets(this.StockList)
  //     if (this.StockList.filter((sl: any) => sl.createdByString == 'NA').length > 0) this.getEmployeeList()

  //     this.Loading = false
  //     this.spinnerService.hide()
  //   }, (error) => {
  //     // this.globalToastService.error(error.error.message)
  //     this.Loading = false
  //     this.spinnerService.hide()
  //   })

  // }


  getEmployeeList() {

    // let branch = 0
    // let department = 0
    // this.reduxService.getAllEmployeeList().subscribe((res:any)=>{
    //   if(res && res.data && res.data.length>0){
    //     this.EmployeeList = res.data

    //     this.StockList = this.reduxService.mapUserToAssets(this.StockList)
    //     // this.AssignedList = this.processAssignedList(this.AssignedList)
    //   }else throw {}
    // },error=>{
    //   this.globalToastService.error("Failed to load Employees")
    // })

  }


  loadStocks(pageNumber:number = 1,changePageNumber:boolean = false){
    
    let json = {
      "mapping": {
        "orgId": this.assetService.ORGId,
      },
      // "createdBy": this.assetService.AdminID,
      "SoftwareId": 8,
      page:pageNumber,
      limit:this.limit,
    }
    this.assetService.PostMethod('assetMgnt/invoice/get', json).subscribe((res: any) => {
      if(res?.data && res?.data?.length>0){
        let tempData = res.data.map((item: any, i: any) => {
          return {
            "SLno": ((pageNumber-1) * this.limit) + i + 1,
            ...item,
            CreatedDateTime: item.createdAt
          }
        })
        this.StockList = tempData
        this.reduxService.getAllEmployeeList().subscribe(res=>{
          this.StockList = this.StockList.map((d:any)=>{
            return{
              ...d,
              createdByString:this.reduxService.EmployeeListKV[d.createdBy]?.Name,
            }
          })
        })

        this.paginatedData = {
          totalRecord: res.totalRecord,
          limit: res.limit,
          next_page: res.next_page,
          currentPage:pageNumber
        }
        
        // this.getEmployeeList()        
      }
      this.Loading = false
      this.spinnerService.hide();
    },
      (error) => {
        console.log(error);
        this.Loading = false
        this.spinnerService.hide();
      });
  }

  onPageNumberChange(event:any){
    console.log(event);
    this.limit = event.pageSize
    this.page = event.pageIndex+1
    this.loadStocks(this.page,true)
  }


  goToStockAdd() {
    const navigationExtras: NavigationExtras = {
      state: { type: "Create" }
    };
    this._route.navigate(["/Asset/stock/inward/add"], navigationExtras);
  }
  goToItems() {
    this._route.navigate(["/Asset/item/list"]);
  }
  goToAssign() {
    this._route.navigate(["/Asset/assign/list"]);
  }

  actionEmitter(data: any) {
    if (data.action.name == "View") {
      const navigationExtras: NavigationExtras = {
        state: {
          data: data.row,
          type: "Edit",
        }
      };
      this._route.navigate(["/Asset/stock/inward/edit"], navigationExtras);
    }
  }
}
