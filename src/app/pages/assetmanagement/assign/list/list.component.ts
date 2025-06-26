import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonTableComponent } from '../../../common-table/common-table.component';
import { NavigationExtras, Router } from '@angular/router';
import { AssetService } from 'src/app/services/assets.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Store } from '@ngrx/store';
import * as ListActions from 'src/app/Redux/actions/emp_list.actions'
import { Observable } from 'rxjs';
import { ReduxService } from 'src/app/services/redux.service';
import { HierarchyComponent } from 'src/app/pages/hierarchy/hierarchy.component';
// import { AssetService } from 'src/app/services/assets.service';

@Component({
  selector: 'app-assignlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class AssignListComponent {
  commonTableName:string="Asset_user_assignment_list"
  AssignedList: any[] = []
  totalItems:any
  topHeaders:any = []
  totalQuantityAssigned:any
  totalUser:any
  EmployeeList: any[] = [];
  ApiURL:any
  BranchList: any[] = []; UserID: any
  DepartmentList: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  selectedDepartment: any[] = [];
  selectedEmployees: any[] = []
  selectedBranch: any[] = []
  temparray: any = []; tempdeparray: any = [];
  headerInfo: any = {};
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
  listData$!: Observable<any[]>;
  // UserID: any
  public isDrawerOpen: boolean = false;
  AdminName: any
  drawerOpened: boolean = false;
  selectedOrganization:any[]=[]
  SubOrgList:any[]=[]
  orgSettings:IDropdownSettings = {}

  
  selectedFilterData:any
  hirearchyActions:any[] = []
  dropDownExtras:any

  showAssign : boolean = false
  showAssignType:any;
  showUserAssign:any;
  showUserAssignData:any;
  @ViewChild(HierarchyComponent) hierarchyChild!: HierarchyComponent;

  constructor(private _route: Router, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService,
    private globalToastService: ToastrService, private _httpClient: HttpClient,private store: Store<{ list: any }>,
    private dialog: MatDialog, private cdr: ChangeDetectorRef, private assetService: AssetService, private reduxService : ReduxService) {
    this.branchSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.employeeSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      enableCheckAll: false
    };
    this.departmentSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    // common table
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye",
      },
    ]
    this.displayColumns = {
      "SLno":"SL NO",
      "Name":"USER NAME",
      "Branch":"BRANCH",

      "quantityOfItems":"T",
      "totalAmount":"T",
      "returnableQty":"RTNBL",
      "returnableAmount":"RTNBL",
      "nonReturnableQty":"N-RTNBL",
      "nonReturnableAmount":"N-RTNBL",
      "returnQuantity":"RTN",
      "returnAmount":"RTN",
      "damage":"DMG",
      "damageAmount":"DMG",
      "Actions": "ACTIONS"
    }
    this.displayedColumns = [
        "SLno",
        "Name",
        "Branch",
        "quantityOfItems",
        "returnableQty",
        "nonReturnableQty",
        "returnQuantity",
        "damage",
        "totalAmount",
        "returnableAmount",
        "nonReturnableAmount",
        "returnAmount",
        "damageAmount",
        "Actions",
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
        colspan:5
      },
      {
        id:"amount",
        name:"AMOUNT",
        colspan:5
      },
      {
        id:"blank2",
        name:"",
        colspan:1
      },
    ]

    this.headerInfo = {
      quantityOfItems:{text:"TOTAL QUANTITY : Total Quantity of assets assigned to employee"},
      totalAmount:{text:"TOTAL AMOUNT : Total Amount of assets assigned to employee"},
      returnableQty:{text:"RETURNABLE QUANTITY : Number of assets yet to be returned by employee"},
      returnableAmount:{text:"RETURNABLE AMOUNT : Amount of number of assets yet to be returned by employee"},
      nonReturnableQty:{text:"NON-RETURNABLE QUANTITY : Number of Non-Returnable assets assigned to employee"},
      nonReturnableAmount:{text:"NON-RETURNABLE AMOUNT : Amount of number of Non-Returnable assets assigned to employee"},
      returnQuantity:{text:"RETURNED QUANTITY : Number of assets returned by employee"},
      returnAmount:{text:"RETURNED AMOUNT : Amount of number of assets returned by employee"},
      damage:{text:"RETURNED DAMAGE QUANTITY : Number of assets returned by employee in damage state"},
      damageAmount:{text:"RETURNED DAMAGE AMOUNT : Amount of number of assets returned by employee in damage state"},
    }
    // common table ends here

    
    this.hirearchyActions = ['Search']
  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.AdminName = localStorage.getItem('Name')
    // this.getAssignedList()
    this.loadFilterData()
  }
  @ViewChild('drawer') drawer: any;
  drawerOpen() {
    this.drawer.open();
    this.drawerOpened = true;
  }
  closeDrawer() {
    this.drawer.close();
    this.drawerOpened = false;
  }

  getAssignedList() {
    let branch = this.selectedBranch.map(res => res.Value)[0] || 0
    let dept = this.selectedDepartment.map(res => res.id)[0] || 0

    let userId = this.hierarchyChild?.getAllSelectedData()?.employee?.map((emp:any)=>emp.ID)
    let json: any = {
      // "SoftwareId": 8,
      // "orgId": parseInt(this.ORGId),
      "mapping":{
        "orgId": parseInt(this.reduxService.ORGId),
        // "branchId": branch,
      },
      assignmentMapping:["orgId","userId"],
      // "createdBy": [],
      "SoftwareId": 8,
    }
    
    if(userId?.length>0){
      json.mapping['userId'] = userId
    }else{
      this.hierarchyChild.dropDownData.employee.errorString="Please select minimum one employee"
      this.hierarchyChild.dropDownData.organization.errorString="Please select organization"
      this.globalToastService.warning("Please select employee")
      return
    }
    
    this.Loading = true
    this.spinnerService.show()  
    // if (this.selectedBranch.length > 0) {
    //   json.mapping["branchId"] = branch
    // }
    // if (this.selectedDepartment.length > 0) {
    //   json.mapping["departmentId"] = dept
    // }
    this.assetService.PostMethod('assetMgnt/assign/asset/assignment/count', json).subscribe((res: any) => {
      this.AssignedList = userId.map((id:any, i: any)=>{
        let filteredAssetData = res.data.data.filter((assetData: any) => assetData.userId.userId == id)
        
        return {
          "SLno": i + 1,
          // Name:res.userId,
          // Branch:res.branchId,
          "nonReturnableQty": 0,
          "nonReturnableAmount": 0,
          "returnQuantity": 0,
          "returnableQty": 0,
          "totalQty": 0,
          "returnableAmount": 0,
          "returnAmount": 0,
          "totalAmount": 0,
          "damage": 0,
          "damageAmount": 0,
          "userId": {
              "userId": id
          },
          "itemCount": 0,
          "quantityOfItems": 0,
          "noOfAssignments": 0,
          ...filteredAssetData[0]
        }
      })
      // this.AssignedList = res.data.data.map((res: any, i: any) => {
      //   return {
      //     "SLno": i + 1,
      //     // Name:res.userId,
      //     // Branch:res.branchId,
      //     ...res
      //   }
      // })
      this.reduxService.getAllEmployeeList().subscribe(res=>{
        this.AssignedList = this.AssignedList.map((d:any)=>{
          return{
            ...d,
            Name:this.reduxService.EmployeeListKV[d.userId.userId]?.Name,
            Branch:this.reduxService.EmployeeListKV[d.userId.userId]?.Branch,
          }
        })
      })
      // setTimeout(() => {
      //   this.AssignedList = this.reduxService.mapUserToAssets(this.AssignedList,['userId',"branchId"])
      // }, 100);
      this.totalItems = res.data.count.totalItemsAssigned
      this.totalQuantityAssigned = res.data.count.totalQuantityAssigned
      this.totalUser = res.data.count.totalAssignedUsers
      this.Loading = false
      this.spinnerService.hide()

  
    }, (error) => {
      // this.globalToastService.error(error.error.message)
      this.AssignedList = []
      this.Loading = false
      this.spinnerService.hide()
    })
  }

  //common table
  actionEmitter(data: any) {
    if(data.action.name == 'View'){
      // localStorage.setItem("empid",data.row.userId)
      // localStorage.setItem("empname",data.row.user)
      // this._route.navigate(["/Asset/assign/list/user"]);
      
      // const navigationExtras: NavigationExtras = {
      //   state: { 
      //     data: data.row
      //   }
      // };
      // this._route.navigate(["/Asset/assign/list/user"], navigationExtras);

      this.showUserAssign = true
      this.showUserAssignData = { 
        data: data.row
      }

    }
  }
  //ends here


  goToStock() {
    this._route.navigate(["/Asset/stock/inward/list"]);
  }
  goToItems() {
    this._route.navigate(["/Asset/item/list"]);
  }
  goToUserAssign() {
    // const navigationExtras: NavigationExtras = {
    //   state: { type: "Create" }
    // };
    // this._route.navigate(["/Asset/assign/add"], navigationExtras);
    this.showAssignType = "Create"
    this.showAssign = true
  }
  
  backtolist(){
    this.showAssignType = ""
    this.showAssign = false
    this.showUserAssignData = ""
    this.showUserAssign = false

  }
  getBranchWise(){
    this._route.navigate(["/Asset/assign/branchwise"])
  }
  goToAnalytics(){
    this._route.navigate(["/Asset/analytics"])
  }
  getDepartmentWise(){
    this._route.navigate(["/Asset/assign/departmentwise"])
  }


  loadFilterData(){
    // let temp = localStorage.getItem('HirearchyAssetData')
    // if(temp){
    //   this.selectedFilterData = JSON.parse(temp)
    // }
  }


  triggerHierarchyAction(event:any){
    if(event.action == 'Search'){
      // localStorage.setItem('HirearchyAssetData',JSON.stringify(event.data))
      this.getAssignedList()
    }
    
  }

}
