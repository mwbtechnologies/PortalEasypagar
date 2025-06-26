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
  selector: 'app-asset-department-analytics',
  templateUrl: './departmentwise.component.html',
  styleUrls: ['./departmentwise.component.css']
})
export class AssetDepartmentAnalyticsComponent {
  commonTableName:string = "Asset_Department_Analytics"
  DepartmentWiseList:any[]=[]
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
    ORGId: any
    AdminID: any
    BranchList: any[] = [];
    DepartmentList:any[]=[]
    selectedBranch: any[] = []
    branchSettings: IDropdownSettings = {}

  constructor(private _route: Router, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService,
    private globalToastService: ToastrService, private _httpClient: HttpClient,private assetService: AssetService,private reduxService:ReduxService) {
      this.branchSettings = {
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
      "Department":"DEPARTMENT",
      "TotalItems":"ITEMS",
      "TotalQuantity":"QUANTITY",
      "TotalAmount":"AMOUNT",
      "stockItems":"ITEMS",
      "QuantityRemaining":"QUANTITY",
      "AmountRemaining":"AMOUNT",
      "AssignedItems":"ITEMS",
      "AssignedQuantity":"QUANTITY",
      "AssignedAmount":"AMOUNT",
      "AssignedUsers":"USERS",
    }
    this.displayedColumns = [
        "SLno",
        "Department",
        "TotalItems",
        "TotalQuantity",
        "TotalAmount",
        "stockItems",
        "QuantityRemaining",
        "AmountRemaining",
        "AssignedItems",
        "AssignedQuantity",
        "AssignedAmount",
        "AssignedUsers",
      ]
      
      
      this.topHeaders = [
        {
          id:"blank1",
          name:"",
          colspan:2
        },
        {
          id:"inward",
          name:"INWARD",
          colspan:3
        },
        {
          id:"instock",
          name:"IN STOCK",
          colspan:3
        },
        {
          id:"assigned",
          name:"ASSIGNED",
          colspan:4
        }
      ]
      // common table ends here
  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.GetBranches()
    this.getDepartmentWise()
  }
  
  GetBranches() {
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetBranchList?OrgID=" + this.ORGId + "&AdminId=" + this.AdminID).subscribe((data) => {
      this.BranchList = data.List;
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });

  }
  GetDepartments() {
    const json = {
      OrgID: this.ORGId,
      Branches: this.selectedBranch.map((br: any) => {
        return {
          "id": br.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
      }
    }, (error) => {
      this.globalToastService.error(error); console.log(error);
    });
  }

  onBranchSelect(item: any) {
    // this.GetDepartments();
  }
  onBranchDeSelect(item: any) {
    // this.GetDepartments();
  }
  getDepartmentWise(){
    this.Loading = true
    this.spinnerService.show()
    let branch = this.selectedBranch.map(res => res.Value)[0] || 0
    let json: any = {
      "SoftwareId": 8,
      "groupBy" : "departmentId",
      "assignmentUserField": "userId",
      "mapping": {
          "orgId": parseInt(this.ORGId)
      }
    }

    if(branch && branch != 0)json.mapping["branchId"] = branch
    this.assetService.PostMethod('assetMgnt/item/mappingList', json).subscribe((res: any) => {
      this.DepartmentWiseList = res.data.data.map((res: any, i: any) => {
        return {
          "SLno": i + 1,
          // "Department":this.getDeptName(res._id),
          ...res
        }
      })
      this.Loading = false
      this.spinnerService.hide()
      this.loadDepartmentNames()
    }, (error) => {
      this.globalToastService.error(error.error.message)
      this.Loading = false
      this.spinnerService.hide()
    })
  }

  
  loadDepartmentNames(){
    
    let branch = this.selectedBranch.map(res => res.Value)[0] || 0
    this.reduxService.getDepartments(branch).subscribe(res=>{
      this.DepartmentWiseList = this.DepartmentWiseList.map((d:any)=>{
        return{
          ...d,
          Department:d._id ? this.reduxService.DepartmentListKV[d._id]?.Text : "NA",
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

  getDeptName(deptId: any) {
    const dept = this.DepartmentList.find(b => b.Value === deptId);
    return dept ? dept.Text : deptId;
  }
  //common table
  actionEmitter(data: any) {

  }
  //ends here
  backtolist(){
    this._route.navigate(['Asset/assign/list'])
  }
}
