import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import { CommonTableComponent } from '../common-table/common-table.component';
import { DirectoryService } from 'src/app/services/directory.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ListActions from 'src/app/Redux/actions/emp_list.actions';
import { ReduxService } from 'src/app/services/redux.service';
import { HierarchyComponent } from '../hierarchy/hierarchy.component';

@Component({
  selector: 'app-file-directory-new',
  templateUrl: './file-directory-new.component.html',
  styleUrls: ['./file-directory-new.component.css']
})
export class FileDirectoryNewComponent {
  commonTableName:string = "Directory_User_List"
  EmployeeList: any[]=[];
  BranchList: any[] = []; UserID: any
  DepartmentList: any;
  DocumentList: any
  temparray: any = []; tempdeparray: any = [];
  selectedDepartment: any[] = [];
  // selectedEmployees: any[] = []
  selectedBranch: any[] = []
  selectedDocuments: any[] = []
  ORGId: any
  AdminID: any
  ApiURL: any

  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  documentSettings: IDropdownSettings = {}
  orgSettings:IDropdownSettings = {}

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
  //ends here
  userDocumentList: any
  ShowUserWise: boolean = false
  ShowUserTimeline: boolean = false
  UserData: any
  listData$!: Observable<any[]>;
  selectedOrganization:any[]=[]
  SubOrgList:any[]=[]
  hirearchyActions:any[] = []
  selectedFilterData:any
  @ViewChild(HierarchyComponent) hierarchyChild!: HierarchyComponent;
  Total:any
  dropDownExtras:any
  usersIds:any = []
  ListData:boolean = false
  loadingStatus:number = 0
  employeeId:any;
  searchType:any;
  constructor(private pdfExportService: PdfExportService, private spinnerService: NgxSpinnerService,
    private _route: Router, private directoryService: DirectoryService, private _commonservice: HttpCommonService,
    private globalToastService: ToastrService, private _httpClient: HttpClient,
    private dialog: MatDialog, private store: Store<{ list: any }>,private cdr: ChangeDetectorRef, private reduxService : ReduxService) {
      
    this.hirearchyActions = ['Search']
    this.searchType = localStorage.getItem('DocManagerUserSearchType') || 'filters' 
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
      // enableCheckAll: false
    };
    this.departmentSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.documentSettings = {
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

    //common table
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye",
        rowClick: true,
      },
      {
        name: "Timeline",
        icon: "fa fa-history",
        rowClick: true,
      },
    ]
    this.displayColumns = {
      "SLno": "Sl No",
      // "UserId":"USERID",
      "UserName": "USER NAME",
      "Branch": "BRANCH",
      "Department": "DEPARTMENT",
      "Documents": "DOCUMENTS",
      "MandatoryDocuments": "MANDATORY DOCUMENTS",
      "Actions": "ACTIONS"
    },
      this.displayedColumns = [
        "SLno",
        // "UserId",
        "UserName",
        "Branch",
        "Department",
        "Documents",
        "MandatoryDocuments",
        "Actions"
      ]

      // this.dropDownExtras = {
      //   employee:{
      //     // isActive:false,
      //     settings:{
      //       singleSelection: true
      //     }
      //   }
      // }

  }

  ngOnInit() {
    this.loadEmployees()
    this.loadFilterData()
    
  }

  loadEmployees(){
    this.setSpinner(true)
    this.reduxService.getAllEmployeeList().subscribe(res=>{
      this.setSpinner(false)
    },err=>{
      this.setSpinner(false)
    })
  }

  loadFilterData(){
    let temp = localStorage.getItem('HirearchyData')
    if(temp) this.selectedFilterData = JSON.parse(temp)
  }
  getDepartments() {
    let branch = this.selectedBranch?.map((y: any) => y.Value)
    this.reduxService.getDepartments(branch).subscribe((res:any)=>{
      if(res && res.data && res.data.length>0){
        this.DepartmentList = res.data
      }else throw {}
    },error=>{
      this.globalToastService.error("Failed to load Department")
    })
  }

  createDoc() {
    this._route.navigate(["/Directory/Document"]);

  }
  getList(selectedData:any) {
    let empid = selectedData['employee'].map((se: any) => se.ID) || []
    this.usersIds = empid
    this.ListData = true
  }

  ViewUserDocuments(data:any) {
    this.ShowUserWise = true
    this.ShowUserTimeline = false
    
    this.getUserData(data)
  }
  backToList() {
    this.ShowUserWise = false
    this.ShowUserTimeline= false
  }


  getUserData(data:any){
    if(this.searchType == 'filters'){
      let suborg = this.hierarchyChild.getDropdownSelected('organization')? this.hierarchyChild.getDropdownSelected('organization')[0]: undefined
      let branch = this.hierarchyChild.getDropdownSelected('branch') ? this.hierarchyChild.getDropdownSelected('branch')[0] : undefined
      let dept =   this.hierarchyChild.getDropdownSelected('dept') ? this.hierarchyChild.getDropdownSelected('dept')[0] : undefined
      this.UserData = {data:data.row,dept:dept?.Value,branch:branch?.Value,suborg:suborg?.Value,branchDetails:branch,suborgDetails:suborg,deptDetails:dept}
    }
    if(this.searchType == 'employeeId'){
      let emp = this.reduxService.EmployeeListKV[data.row._id]
      this.UserData = {
        data:data.row,
        dept:emp.DeptId,
        branch:emp.BranchID,
        suborg:0,
        branchDetails:[emp.BranchID],
        suborgDetails:[0],
        deptDetails:[emp.DeptId]
      }
    }

  }

  chipsEmmitter(event:any){
    this.Total = event
  }
  //common table
  actionEmitter(data: any) {
    if (data.action.name == "View") {
      this.ViewUserDocuments(data)
   
    }
    if (data.action.name == "Timeline") {
      this.getUserData(data)
      this.showTimeline()
    }
  }

  showTimeline(){
    this.ShowUserWise = false
    this.ShowUserTimeline = true
  }
  
  showUserWiseList(){
    this.ShowUserWise = true
    this.ShowUserTimeline = false
  }
  DocUsers(){
    this._route.navigate(["/Directory/Document/Users"]);
  }

  //ends here

  triggerHierarchyAction(event:any){
    if(event.action == 'Search'){
      localStorage.setItem('HirearchyData',JSON.stringify(event.data))
      this.getList(event.data)
    }
    
  }

  goToAnalytics(){
    this._route.navigate(["/Directory/Analytics"])
  }  
  goToGlobalSearch(){
    this._route.navigate(["/Directory/SearchByData"])
  }  

  setSpinner(status:any){
    if(status == true){
      this.loadingStatus+=1
      this.spinnerService.show()
    }
    if(status == false){
      if(this.loadingStatus > 0) this.loadingStatus-=1
      if(this.loadingStatus==0)this.spinnerService.hide()
    }
  }

  searchByEmpId(){
    let userId:any[] = []
    let empList = this.employeeId.split(',')
    let empMatchedCount = 0
    for (let i = 0; i < empList.length; i++) {
      for (let empI = 0; empI < this.reduxService.EmployeeList.length; empI++) {
        const matchEmp = this.reduxService.EmployeeList[empI];
        if(matchEmp && matchEmp.MappedEmpId  && matchEmp.MappedEmpId != 0  && matchEmp.MappedEmpId != "0" && !userId.includes(matchEmp.MappedEmpId) && empList.includes(matchEmp.MappedEmpId)){
          empMatchedCount++
          userId.push(matchEmp.ID)
        }
      }
    }
    if(empMatchedCount >0){
      this.globalToastService.success(empMatchedCount +" employees matched")
      this.usersIds = userId
      this.ListData = true
    }
    if(empMatchedCount==0){
      this.usersIds = []
      this.ListData = false
      this.globalToastService.warning("No employees matched")
    }
  }

  switchSearch(type:string){
   this.searchType = type
   localStorage.setItem('DocManagerUserSearchType', type) 
  }

}
