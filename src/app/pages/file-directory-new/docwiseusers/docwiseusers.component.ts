import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DirectoryService } from 'src/app/services/directory.service';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import { ReduxService } from 'src/app/services/redux.service';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { HierarchyComponent } from '../../hierarchy/hierarchy.component';
import { UseradddocComponent } from '../userdoclist/useradddoc/useradddoc.component';

@Component({
  selector: 'app-docwiseusers',
  templateUrl: './docwiseusers.component.html',
  styleUrls: ['./docwiseusers.component.css']
})
export class DocwiseusersComponent {
    commonTableName:string = "UserWise_Document_List"
  EmployeeList: any[]=[];
  BranchList: any[] = []; UserID: any
  DepartmentList: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  selectedDepartment: any[] = [];
  selectedEmployees: any[] = []
  selectedBranch: any[] = []
  temparray: any = []; tempdeparray: any = [];
  ORGId: any
  AdminID: any
  ApiURL: any
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
  currentMonth: any;
  currentYear: any;
  paginatedData:any
  //ends here
 UserData: any
  listData$!: Observable<any[]>;
  docWiseUsers:any[]=[]
  totalUsers:any
  DocumentGroups: any[] = []
  DocSettings:IDropdownSettings = {}
  SelectedDocGroup:any[]=[]
  SubDocList: any[] = []
  SubDocSettings:IDropdownSettings = {}
  SelectedSubDoc:any[] = []
  AdminName:any
  selectedOrganization:any[]=[]
  SubOrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  hirearchyActions:any[] = []
  selectedFilterData:any
  @ViewChild(HierarchyComponent) hierarchyChild!: HierarchyComponent;
  dropDownExtras:any
  StatusList:any[]=[]
  SelectedStatus:any
  StatusSettings:IDropdownSettings = {}
  page:number = 1
  limit:number = 10

constructor(private pdfExportService: PdfExportService, private spinnerService: NgxSpinnerService,
    private _route: Router, private directoryService: DirectoryService, private _commonservice: HttpCommonService,
    private globalToastService: ToastrService, private _httpClient: HttpClient,
    private dialog: MatDialog, private store: Store<{ list: any }>,private cdr: ChangeDetectorRef, private reduxService : ReduxService) {
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
 };
 this.departmentSettings = {
  singleSelection: true,
  idField: 'id',
  textField: 'text',
  itemsShowLimit: 1,
  allowSearchFilter: true,
};
    this.DocSettings = {
      singleSelection: true,
      idField: 'docGroupId',
      textField: 'groupTypeName',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    this.SubDocSettings = {
      singleSelection: true,
      idField: '_id',
      textField: 'name',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

//common table
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye",
        rowClick: true,
      },
      {
        name: "Print",
        icon: "fa fa-print",
        rowClick: true,
      },
    ]
    this.displayColumns = {
      "SLno":"SL NO",
      "Name":"EMPLOYEE NAME",
      "CreatedBy":"UPLOADED BY",
      "CreatedDate":"UPLOADED DATE",
      "approvalStatus":"APPROVAL STATUS",
      "approvedBy":"APPROVED BY",
      "approvedDate":"APPROVED DATE",
      "Actions":"ACTIONS"
},
      this.displayedColumns = [
        "SLno",
        "Name",
        "CreatedBy",
        "CreatedDate",
        "approvalStatus",
        "approvedBy",
        "approvedDate",
        "Actions"
]

 // this.hirearchyActions = ['Search']
   this.dropDownExtras = {
    employee:{
      isActive:false,
      settings:{
        singleSelection: true
      }
    }
  }


  }

  ngOnInit() {
    this.StatusList = [
      { id: 'All', text: 'All' },
      { id: 'approved', text: 'Approved' },
      { id: 'rejected', text: 'Rejected' },
      { id: 'pending', text: 'Pending' }
    ];

    this.StatusSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    this.SelectedStatus = [{ id: 'All', text: 'All' }]

    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.AdminName = localStorage.getItem('Name')
    this.getGroupsDoc()
    this.loadFilterData()
    
 }

 loadFilterData(){
   let temp = localStorage.getItem('HirearchyData')
   if(temp) this.selectedFilterData = JSON.parse(temp)

    let docWiseUserFilter:any = localStorage.getItem('docWiseUserFilter')
    docWiseUserFilter = JSON.parse(docWiseUserFilter)
    if(docWiseUserFilter.SelectedDocGroup){
      this.SelectedDocGroup = docWiseUserFilter.SelectedDocGroup
    }
    if(docWiseUserFilter.SelectedSubDoc){
      this.SelectedSubDoc = docWiseUserFilter.SelectedSubDoc

    }
 }
 triggerHierarchyAction(event:any){
  if(event.action == 'Search'){
    localStorage.setItem('HirearchyData',JSON.stringify(event.data))
  }
}

 onDocGroupSelect(event: any) {
   this.SelectedSubDoc = []
  const fullGroup = this.DocumentGroups.find(g => g.docGroupId === event.docGroupId);
  this.SubDocList = fullGroup?.documentTypes || [];
}
onDocGroupDeSelect(event: any) {
  this.SelectedSubDoc = []
  this.SubDocList = [];
}
onSubDocGroupSelect(event:any){

}
onSubDocGroupDeSelect(event:any){

}
getGroupsDoc() {
  this.spinnerService.show()
  let json = {
    "SoftwareId": 8,
    mapping: {
      orgId: this.directoryService.ORGId,
    },
    docMapping: {
      orgId: this.directoryService.ORGId,
    }
  }
  this.directoryService.PostMethod('document/get/group', json).subscribe((res: any) => {
    this.DocumentGroups = res.data.documentList?.data || [];
    this.spinnerService.hide()
  }, (error) => {
    this.globalToastService.error(error.error.message)
    this.spinnerService.hide()
  })
}



getList(pageNumber:number = 1,changePageNumber:boolean = false){
  let selectedData = this.hierarchyChild.getAllSelectedData()
  let subOrg = selectedData['organization'].length>0 ? selectedData['organization'].map((d:any)=>d.Value) : undefined
  let branch = selectedData['branch'].length>0 ? selectedData['branch'].map((d:any)=>d.Value) : undefined
  let dept = selectedData['department'].length>0 ? selectedData['department'].map((d:any)=>d.Value) : undefined
  // let emp =   this.hierarchyChild.getDropdownSelected('employee') ? this.hierarchyChild.getDropdownSelected('employee')[0]?.ID : undefined
  this.Loading = true
  this.spinnerService.show();
  let selecteddoc = this.SelectedDocGroup.map(res=>res.docGroupId)[0]
  let selectedsubdoc = this.SelectedSubDoc.map(res=>res._id)[0]
  let json:any = {
    "SoftwareId":8,
    "groupBy":"userId",
    "mapping": {
        "orgId": this.directoryService.ORGId,
        "SubOrgId":subOrg,
        // "userId": emp,
        "branchId": branch,
        "departmentId": dept,
    },
   "docGroupId": selecteddoc,
    "docTypeId": selectedsubdoc,
    page:pageNumber,
    limit:this.limit,
  }
  
  if (this.SelectedStatus && this.SelectedStatus[0].id !== "All") {
    json.approvalStatus = this.SelectedStatus[0].id;
  }
  this.directoryService.PostMethod('submit/getAllUsers', json).subscribe((res: any) => {
    if(res?.data?.list?.data && res?.data?.list?.data?.data?.length>0){
      let tempData = res.data.list.data.data.map((doc: any, i: any) => {
        return {
          SLno : ((pageNumber-1) * this.limit) + i + 1,
          CreatedBy:this.AdminName,
          CreatedDate:doc.createdAt,
          ...doc
        }
      })
      this.docWiseUsers = tempData
      this.paginatedData = {
        totalRecord: res.data.list.data.totalRecord,
        limit: res.data.list.data.limit,
        next_page: res.data.list.data.next_page,
        currentPage:pageNumber
      }
      // if(changePageNumber){
      //   this.docWiseUsers = [...this.docWiseUsers, ...tempData]
      // }else{
      // }
      this.reduxService.getAllEmployeeList().subscribe(res=>{
        this.docWiseUsers = this.docWiseUsers.map((d:any)=>{
          return{
            ...d,
            Name:this.reduxService.EmployeeListKV[d.mapping.userId].Name,
          }
        })
      })
  
      this.totalUsers = res.data.summary
      this.page+=1
      let filterData = {
        selectedData,
        SelectedDocGroup:this.SelectedDocGroup,
        SelectedSubDoc:this.SelectedSubDoc
      }
      localStorage.setItem('docWiseUserFilter',JSON.stringify(filterData))
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
getemployeename(empid: any) {
  console.log(this.EmployeeList,"sasas");
  
  const emp = this.EmployeeList.find(d => d.ID === empid);
  return emp ? emp.Name : empid;
}

UploadDoc(row:any,edit:boolean = false){
  let selectedsubdoc = this.SelectedSubDoc.map(res=>res._id)[0]
  this.Loading = true
  let json = {
    "SoftwareId":8,
    "docTypeId":selectedsubdoc,
    mapping:{
      orgId:this.directoryService.ORGId
    }
  }
  this.directoryService.PostMethod('document/get',json).subscribe((res:any)=>{
    let fulldata:any[] = []
    if(res.data.data){
      for (let res_data_i = 0; res_data_i < res.data.data.length; res_data_i++) {
        const docDataRes = res.data.data[res_data_i];
        let paramData = docDataRes.parameters
        let parameters:any[] = []
        Object.keys(paramData).forEach((key:any)=>{
          parameters.push({
            key,
            ...paramData[key],
          })
        })
        fulldata.push({...docDataRes,parameters,paramData})
      }
      this.UserData = {
        UserId:row.mapping.userId
      }
      this.dialog.open(UseradddocComponent,{
        data: {
          fulldata,
          userdata:this.UserData.data,
          branch:row.mapping.branchId,
          suborg:row.mapping.SubOrgId,
          dept:row.mapping.departmentId,
          uploadstatus:row.uploadedStatus,
          edit
        },
        disableClose: true,
      }).afterClosed().subscribe(res => {
        // if(res){
          this.getList()  
        // }
      })
    }
  },(error)=>{
    this.globalToastService.error(error.error.message)
  })
  }
//common table
actionEmitter(data: any) {
  if (data.action.name == "View") {
    this.UploadDoc(data.row)
    }
}

backToList(){
  this._route.navigate(["/Directory"])
}

onPageNumberChange(event:any){
  console.log(event);
  this.limit = event.pageSize
  this.page = event.pageIndex+1
  this.getList(this.page,true)
}
}
