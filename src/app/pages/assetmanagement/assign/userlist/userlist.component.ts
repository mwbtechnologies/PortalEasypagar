import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonTableComponent } from 'src/app/pages/common-table/common-table.component';
import { AssetService } from 'src/app/services/assets.service';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ReturnComponent } from './return/return.component';
import { ReduxService } from 'src/app/services/redux.service';

@Component({
  selector: 'app-asset-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnChanges {

  @Input() showUserAssignData:any
  AssignedUserList: any[] = []
  AssigneddData: any[] = []
  UserID:any
  UserName:any
  userData:any
//common table
actionOptions: any
orginalValues: any = {}
displayColumns: any
displayedColumns: any
employeeLoading: any;
ReportTitles: any = {}
selectedRows: any = [];
editableColumns: any = []
commonTableOptions: any = {}
tableDataColors: any
totalItemsAssigned:any
totalQuantityAssigned:any
lastAssignedDate:any
chipsData:any;

showAssign : boolean = false
showAssignType:any;
showAssignData:any;

@ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
//ends here
  ORGId: any
  AdminID: any
  constructor(private _route: Router, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService,
      private globalToastService: ToastrService, private _httpClient: HttpClient,
      private dialog: MatDialog, private cdr: ChangeDetectorRef, private assetService: AssetService, private reduxService:ReduxService) {

          // common table
    this.actionOptions = [
      // {
      //   name: "Edit",
      //   icon: "fa fa-edit",
      //   filter: [
      //     { field:'status',value : 'Assigned'}
      //   ],
      // },
      {
        name: "Return",
        icon: "fa fa-undo",
        filter: [
          { field:'status',value : 'Assigned'}
        ],
      },
    ]
    this.displayColumns = {
      "SLno":"SL NO",
      "assignedDate":"ASSIGNED DATE",
      "returnDate":"RETURNED DATE",
      "returnTypeString":"RETURN TYPE",
      "StatusTypeString":"STATUS",
      // "damageStatus":"DAMAGE STATUS",
      "name":"ITEM",
      "quantity":"QUANTITY",
      "modelNumber":"MODEL NUMBER",
      "serialNumber":"SERIAL NUMBER",
      "assignedBy":"ASSIGNED BY",
      "receivedBy":"RECEIVED BY",
       "Actions":"ACTIONS",
    }
    this.displayedColumns = [
        "SLno",
        "assignedDate",
        "returnDate",
        "returnTypeString",
        "StatusTypeString",
        // "damageStatus",
        "name",
        "quantity",
        "modelNumber",
        "serialNumber",
        "assignedBy",
        "receivedBy",
         "Actions",
    ]
    this.tableDataColors = {
      returnTypeString: [
        { styleClass: "asset-chip1-blue", filter: [{col:"returnType",value:assetService.returnTypes[0].id}] },
        { styleClass: "asset-chip1-red", filter: [{col:"returnType",value:assetService.returnTypes[1].id}] }
      ],
      StatusTypeString: [
        { styleClass: "asset-chip1-yellow", filter: [{col:"status",value:'Assigned'}] },
        { styleClass: "asset-chip1-green", filter: [{col:"status",value:'Returned'}] },
        { styleClass: "asset-chip1-red", filter: [{col:"status",value:'Return Damaged'}] }
      ]
    }
    console.log(this.displayColumns,"check response");

    // common table ends here
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['showUserAssignData'].currentValue){
      this.userData = changes['showUserAssignData'].currentValue?.data
      this.UserID = this.userData?.userId?.userId
    }
  }

  ngOnInit() {

    this.prepareChips()
    
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    console.log(this.UserName,"username");
    this.getAssignedUserList()
  }

  prepareChips(){

    this.chipsData = [
      { 
        key:"quantityOfItems",
        text: "Total Quantity" 
      },
      { 
        key:"returnableQty",
        text: "Returnable Quantity" 
      },
      { 
        key:"nonReturnableQty",
        text: "Non-Returnable Quantity" 
      },
      { 
        key:"returnQuantity",
        text: "Returned Quantity" 
      },
      { 
        key:"damage",
        text: "Returned Damage Quantity" 
      },
      { 
        key:"totalAmount",
        text: "Total Amount" 
      },
      { 
        key:"returnableAmount",
        text: "Returnable Amount" 
      },
      { 
        key:"nonReturnableAmount",
        text: "Non-Returnable Amount" 
      },
      { 
        key:"returnAmount",
        text: "Returned Amount" 
      },
      { 
        key:"damageAmount",
        text: "Return Damage Amount" 
      },
    ];

  }

  getAssignedUserList() {
    this.employeeLoading = true
    this.spinnerService.show()
    let json: any = {
      "SoftwareId": 8,
      "mapping":{
        "orgId": parseInt(this.reduxService.ORGId),
        "userId":parseInt(this.UserID)
      },
    }
    this.assetService.PostMethod('assetMgnt/assign/asset/user/items/info', json).subscribe((res: any) => {
      this.AssignedUserList = []
      res.data.data.forEach((resElement:any) => {
        resElement.assignments.forEach((assignment:any) => {
          assignment.itemDetails.forEach((item: any, i: any) => {
            console.log(assignment);
            
            this.AssignedUserList.push({
              "SLno": i + 1,
              "modelNumber":item.details.modelNumber,
              "serialNumber":item.details.serialNumber,
              "StatusTypeString":item.status,
              "returnTypeString":this.assetService.returnTypesKV[item.returnType],
              "returnDate":item.returnDate,
              ...item,
              "assignedBy":this.reduxService?.EmployeeListKV[item.assignedBy]?.Name,
              "receivedBy":this.reduxService?.EmployeeListKV[item.receivedBy]?.Name,
            })
            console.log(this.reduxService?.EmployeeListKV[item.assignedBy]?.Name);
            console.log(this.reduxService?.EmployeeListKV[item.assignedBy]);
            
          })

          
        
        });
      });
      // res.data.data[0].assignments[0].i
      // console.log(this.AssignedUserList,"res");
      this.AssigneddData = res.data.data
      this.totalItemsAssigned = res.data.totalSummary.totalItemsAssigned
      this.totalQuantityAssigned = res.data.totalSummary.totalQuantityAssigned
      this.lastAssignedDate = res.data.totalSummary.lastAssignedDate
      this.employeeLoading = false
      this.spinnerService.hide()
    }, (error) => {
      this.globalToastService.error(error.error.message)
      this.employeeLoading = false
      this.spinnerService.hide()
    })
  }

    //common table
    actionEmitter(data: any) {
      if (data.action.name == "Edit") {
        let assignedData:any = this.AssigneddData[0]
        this.showAssignType = "Create"
        this.showAssignData ={
          data: data.row,
          type: "Edit",
          suborg:assignedData?.mapping?.SubOrgId,
          userid:assignedData?.mapping?.userId,
          branchid:assignedData?.mapping?.branchId,
          department:assignedData?.mapping?.departmentId,
          assignmentId:data.row.assignmentId
        }
        this.showAssign = true
      }
      if(data.action.name == "Return"){
        let assignedData:any = this.AssigneddData.filter((a:any)=>a.assignments.filter((asmts:any)=>asmts.assignmentId == data.row.assignmentId).length>0)[0]
         this.dialog.open(ReturnComponent,{
          data:{
            data:data.row,
            suborg:assignedData?.mapping?.SubOrgId,
            userid:assignedData?.mapping?.userId,
            branchid:assignedData?.mapping?.branchId,
            department:assignedData?.mapping?.departmentId
          }
         }).afterClosed().subscribe(res =>{
          if(res){
            this.getAssignedUserList()
          }
         })
      }
    }
    //ends here
    backtolist(){
      this._route.navigate(['Asset/assign/list'])
    }
    backtoAssignlist(){
      this.showAssign = false
      this.showAssignData = {}
      this.showAssignType = ""
    }

}
