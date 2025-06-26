import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DirectoryService } from 'src/app/services/directory.service';
import { CommonTableComponent } from '../../../common-table/common-table.component';
import { AssetService } from 'src/app/services/assets.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AssetItemAddComponent } from '../add/add.component';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-assetmanagement',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class AssetItemListComponent {
  commonTableName:any = "Asset_Item_List"
  ItemList:any[]=[]

  //common table
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
  ORGId: any
  AdminID: any
  UserID: any
  AdminName: any
  EmployeeListKV:any;
  
  paginatedData:any
  page:number = 1
  limit:number = 10

  constructor(
    private spinnerService: NgxSpinnerService,
    private docservice: DirectoryService,
    private _commonservice: HttpCommonService,
    private globalToastService: ToastrService,
    private _httpClient: HttpClient,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private assetService :AssetService,
    private _route: Router
  ){
    //common table
      this.actionOptions = [
        {
          name: "Edit",
          icon: "fa fa-eye",
        },
    ]
    this.displayColumns = {
      "SLno":"Sl No",
      "name": "ITEM NAME",
      "categoryName":"Category",
      // "AssetType": "ASSET TYPE",
      "measurementString": "UNIT",
      "returnTypeString": "Return Type",
      "createdByString": "CREATED BY",
      "CreatedDateTime": "CREATED ON",
       "Actions":"ACTIONS"
    },
      this.displayedColumns = [
        "SLno",
        "name",
        "categoryName",
        // "AssetType",
        "measurementString",
        "returnTypeString",
        "createdByString",
        "CreatedDateTime",
        "Actions"
      ]
      this.tableDataColors = {
        "returnTypeString": [
          { styleClass: "asset-chip1-blue", filter: [{col:"returnType",value:assetService.returnTypes[0].id}] },
          { styleClass: "asset-chip1-red", filter: [{col:"returnType",value:assetService.returnTypes[1].id}] }
        ]
  }
  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.AdminName = localStorage.getItem('Name')
    this.getAssets()
  }

  getEmployeeList() {
    let BranchID = 0;
    let deptID = 0;
    let ApiURL = `Admin/GetMyEmployees?AdminID=${this.AdminID}&BranchId=${BranchID}&DeptId=${deptID}&ListType=All`;
    this._commonservice.ApiUsingGetWithOneParam(ApiURL).subscribe(response => {
      this.EmployeeListKV = response.List.reduce((acc:any,item:any)=>{
        acc[item.ID] = {
          Name:item.Name
        }
        return acc
      },{})
      this.EmployeeListKV[this.AdminID] = {
        Name:this.AdminName
      }

      this.mapUserToAssets()
    });
  }

  mapUserToAssets(){
    // for (let i = 0; i < this.ItemList.length; i++) {
      
    //   this.ItemList[i].createdByString = this.EmployeeListKV[createdById].Name || ''
    // }
    this.Loading = true
    this.ItemList = this.ItemList.map(item=>{
      const createdById = item.createdBy;
      return {
        createdByString:this.EmployeeListKV[createdById]?.Name || '',
        ...item
      }
    })
    this.Loading = false
  }

  // getAssets() {
  //   this.Loading = true
  //   this.spinnerService.show()
  //   let json = {
  //     "createdBy": parseInt(this.AdminID),
  //     "SoftwareId": 8,
  //     "mapping":{
  //       "orgId": parseInt(this.ORGId),
  //     },
  //     page:1,

  //     // "createdBy":parseInt(this.AdminID)
  //   }
  //   this.assetService.PostMethod('assetMgnt/item/get',json).subscribe((res:any)=>{
  //     this.ItemList = res.data.map((item: any, i: any) => {
  //       let measurementString = ''
  //       if(item.measurement){
  //         measurementString += item.measurement
  //         if(item.measurementType) measurementString += ' - ' + item.measurementType
  //       } 
  //       else measurementString += item.measurementType
  //       return {
  //         "SLno": i + 1,
  //         measurementString,
  //         "CreatedDateTime":item.createdAt,
  //         "returnTypeString":this.assetService.returnTypesKV[item.returnType],
  //         // "CreatedBy":"",
  //         ...item}
  //     })
  //     this.Loading = false
  //     this.spinnerService.hide()
  //     this.getEmployeeList()
  //   },(error)=>{
  //     console.log(error);
      
  //     this.globalToastService.error(error?.error?.message)
  //     this.Loading = false
  //     this.spinnerService.hide()
  //   })

  // }
  stockList(){
    this._route.navigate(["/Asset/Stock"])
  }
  addAsset(isEdit: boolean,row?:any){
    this.dialog.open(AssetItemAddComponent,{
      data:{isEdit, row}
    }).afterClosed().subscribe(res =>{
      if(res){
        this.getAssets()
      }
    })
  }
  //common table
  actionEmitter(data: any) {
    if(data.action.name == "Edit"){
      this.addAsset(true,data.row);
    }
    // if(data.action.name == "searchUpdate"){
    //   applySearchFilter()
    // }
  }
  //ends here


  
  getAssets(pageNumber:number = 1,changePageNumber:boolean = false){
    
    let json = {
      // "createdBy": parseInt(this.AdminID),
      "SoftwareId": 8,
      "mapping":{
        "orgId": parseInt(this.ORGId),
      },
      page:pageNumber,
      limit:this.limit,
    }

    this.assetService.PostMethod('assetMgnt/item/get', json).subscribe((res: any) => {
      if(res?.data && res?.data?.length>0){
        let tempData = res.data.map((item: any, i: any) => {
          let measurementString = ''
          if(item.measurement){
            measurementString += item.measurement
            if(item.measurementType) measurementString += ' - ' + item.measurementType
          } 
          else measurementString += item.measurementType
          return {
            "SLno": ((pageNumber-1) * this.limit) + i + 1,
            measurementString,
            "CreatedDateTime":item.createdAt,
            "returnTypeString":this.assetService.returnTypesKV[item.returnType],
            ...item}
        })

        this.ItemList = tempData
        this.paginatedData = {
          totalRecord: res.totalRecord,
          limit: res.limit,
          next_page: res.next_page,
          currentPage:pageNumber
        }
        
        this.getEmployeeList()        
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
    this.getAssets(this.page,true)
  }
  
  goToStock(){
    this._route.navigate(["/Asset/stock/inward/list"]);
  }
  goToItemAdd(){
    this._route.navigate(["/Asset/item/add"]);
  }
  goToAssign(){
    this._route.navigate(["/Asset/assign/list"]);
  }  
  goToAnalytics(){
    this._route.navigate(["/Asset/analytics"])
  }
  categoryListing(){
    this._route.navigate(["/Asset/category/list"]);
  }
}
