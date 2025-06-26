import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, switchMap } from 'rxjs';
import * as empListSelectors from 'src/app/Redux/selectors/emp_list.selectors';
import * as deptListSelectors from 'src/app/Redux/selectors/department_list.selectors';
import * as branchListSelectors from 'src/app/Redux/selectors/branch_list.selectors';
import * as subOrgListSelectors from 'src/app/Redux/selectors/suborg_list.selectors';
import * as empListActions from 'src/app/Redux/actions/emp_list.actions';
import * as deptListActions from 'src/app/Redux/actions/department_list.actions';
import * as branchListActions from 'src/app/Redux/actions/branch_list.actions';
import * as subOrgListActions from 'src/app/Redux/actions/suborg_list.actions';
import { ReduxService } from 'src/app/services/redux.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css']
})
export class HierarchyComponent implements OnInit,OnChanges,AfterViewInit,OnDestroy {

  @Input() actions:any
  @Input() selectedFilterData:any
  @Input() dropDownExtras:any
  @Output() actionEmitter: EventEmitter<any> = new EventEmitter()

  dropDownData:any;
  dropDownOrder:any;


  SubOrgList$:  Observable<{ data: any[]}>
  SubOrgListError$:  Observable<{ message: string}>
  SubOrgListLoading$:  Observable<{ loading:boolean}>

  BranchList$:  Observable<{ data: any[]}>
  BranchListError$:  Observable<{ message: string}>
  BranchListLoading$:  Observable<{ loading:boolean}>

  DeptList$:  Observable<{ data: any[]}>
  DeptListError$:  Observable<{ message: string}>
  DeptListLoading$:  Observable<{ loading:boolean}>

  EmpList$:  Observable<{ data: any[]}>
  EmpListError$:  Observable<{ message: string}>
  EmpListLoading$:  Observable<{ loading:boolean}>

  loadingStatus:number = 0

  constructor(private reduxService:ReduxService, private globalToastService: ToastrService,private cdr: ChangeDetectorRef, private store: Store<{}>, private spinnerService: NgxSpinnerService,){

    this.SubOrgList$ = store.select(subOrgListSelectors.getSubOrgList);
    this.SubOrgListError$ = this.store.select(subOrgListSelectors.getSubOrgListError);
    this.SubOrgListLoading$ = this.store.select(subOrgListSelectors.getSubOrgListLoading);

    this.BranchList$ = store.select(branchListSelectors.getBranchList);
    this.BranchListError$ = this.store.select(branchListSelectors.getBranchListError);
    this.BranchListLoading$ = this.store.select(branchListSelectors.getBranchListLoading);

    this.DeptList$ = store.select(deptListSelectors.getDeptList);
    this.DeptListError$ = this.store.select(deptListSelectors.getDeptListError);
    this.DeptListLoading$ = this.store.select(deptListSelectors.getDeptListLoading);

    this.EmpList$ = store.select(empListSelectors.getEmpList);
    this.EmpListError$ = this.store.select(empListSelectors.getEmpListError);
    this.EmpListLoading$ = this.store.select(empListSelectors.getEmpListLoading);

    this.dropDownData={
      organization:{
        label:"Organization",
        placeholder:"Select Organization",
        data:[],
        selected:[],
        settings:{
          singleSelection: true,
          idField: 'Value',
          textField: 'Text',
          itemsShowLimit: 1,
          allowSearchFilter: true,
        },
        isActive:true,
        clearAll:false,
      },
      branch:{
        label:"Branch",
        placeholder:"Select Branch",
        data:[],
        selected:[],
        settings:{
          singleSelection: true,
          idField: 'Value',
          textField: 'Text',
          itemsShowLimit: 1,
          allowSearchFilter: true,
        },
        isActive:true,
        clearAll:false,
      },
      department:{
        label:"Department",
        placeholder:"Select Department",
        data:[],
        selected:[],
        settings:{
          singleSelection: true,
          idField: 'id',
          textField: 'text',
          itemsShowLimit: 1,
          allowSearchFilter: true,
        },
        isActive:true,
        clearAll:false,
      },
      employee:{
        label:"Employee",
        placeholder:"Select Employee",
        data:[],
        selected:[],
        settings:{
          singleSelection: false,
          idField: 'ID',
          textField: 'Name',
          itemsShowLimit: 1,
          allowSearchFilter: true,
          // enableCheckAll: false
        },
        isActive:true,
        clearAll:false,
      }
    }
    this.dropDownOrder = ["organization","branch","department","employee"]
  }
  ngOnDestroy(): void {
    this.store.dispatch(branchListActions.clearBranchList())
    this.store.dispatch(deptListActions.clearDeptList())
    this.store.dispatch(empListActions.clearEmpList())
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.GetOrganization();
      this.setSubOrgSelectors()
      this.setBranchSelectors()
      this.setDeptSelectors()
      this.setEmployeeSelectors()
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedFilterData'] && changes['selectedFilterData'].currentValue ){
      let tempData = changes['selectedFilterData'].currentValue
      if(tempData['organization'] && tempData['organization'].length>0){
        this.setDropdownSelected('organization',tempData['organization'])
        this.onOrganizationSelect({})
      }
      if(tempData['branch'] && tempData['branch'].length>0){
        this.setDropdownSelected('branch',tempData['branch'])
        this.onBranchSelect({})
      }
      if(tempData['department'] && tempData['department'].length>0){
        this.setDropdownSelected('department',tempData['department'])
        this.onDepartmentSelect({})
      }
      if(tempData['employee'] && tempData['employee'].length>0){
        this.setDropdownSelected('employee',tempData['employee'])
      }
      // this.triggerAction('Search')
    }
    if(changes['dropDownExtras'] && changes['dropDownExtras'].currentValue ){
      this.updateDropdownExtras()
    }
  }

  ngOnInit(): void {
    
  }


  setdropDownData(key:string,data:any){
    if(this.dropDownData.hasOwnProperty(key))
    this.dropDownData[key].data = data
    else console.log("Failed to update dropdown data of ", key);
    
  }
  
  setDropdownSelected(key:string,data:any){
    if(this.dropDownData.hasOwnProperty(key))
    this.dropDownData[key].selected = data
    else console.log("Failed to update dropdown selected of ", key);
  }

  getDropdownSelected(key:string){
    return this.dropDownData[key]?.selected
  }

  getdropDownData(key:string){
    return this.dropDownData[key]?.data
  }
  
  GetOrganization() {
    // this.reduxService.getSubOrgList().subscribe((res:any)=>{
    //   if(res && res.data && res.data.length>0){
    //     this.setdropDownData('organization',res.data)
    //   }else throw {}
    // },error=>{
    //   this.globalToastService.error("Failed to load SubOrganization")
    // })
    let ApiURL = "Admin/GetSuborgList?OrgID="+this.reduxService.ORGId+"&AdminId="+this.reduxService.AdminID
    // let ApiURL = `Admin/GetMyEmployees?AdminID=${this.reduxService.AdminID}&BranchId=${branch}&DeptId=${deptId}&ListType=All`;
    let filters = {AdminId:this.reduxService.AdminID}
    
    this.store.dispatch(subOrgListActions.setSubOrgListLoading({ loading: true }));
    this.store.dispatch(subOrgListActions.loadSubOrgList({ApiURL, filters}));
  }
  getBranches() {
    // this.reduxService.getBranchList(suborgid).subscribe((res:any)=>{
    //   if(res && res.data && res.data.length>0){
    //     this.setdropDownData('branch',res.data)
    //   }else throw {}
    // },error=>{
    //   this.globalToastService.error("Failed to load Branches")
    // })

    let suborgid = this.getDropdownSelected('organization')?.map((res:any) => res.Value)[0] || 0
    let ApiURL = "Admin/GetBranchListupdated?OrgID="+this.reduxService.ORGId+"&SubOrgID="+suborgid+"&AdminId="+this.reduxService.AdminID
    // let ApiURL = `Admin/GetMyEmployees?AdminID=${this.reduxService.AdminID}&BranchId=${branch}&DeptId=${deptId}&ListType=All`;
    let filters = {
      OrgID:this.reduxService.ORGId,
      SubOrgID:suborgid,
      AdminId:this.reduxService.AdminID
    }
    
    this.store.dispatch(branchListActions.setBranchListLoading({ loading: true }));
    this.store.dispatch(branchListActions.loadBranchList({ApiURL, filters}));
  }

  getDepartments() {
    // let branch = this.getDropdownSelected('branch')?.map((y: any) => y.Value)
    // this.reduxService.getDepartments(branch).subscribe((res:any)=>{
    //   if(res && res.data && res.data.length>0){
    //     this.setdropDownData('department',res.data)
    //     // this.AssignedList = this.processAssignedList(this.AssignedList)
    //   }else throw {}
    // },error=>{
    //   this.globalToastService.error("Failed to load Department")
    // })
    let branch = this.getDropdownSelected('branch')?.map((res:any)=>({id:res.Value})) || 0

    let ApiURL = `Portal/GetEmployeeDepartments`;
    
    let filters = {
      OrgID:this.reduxService.ORGId,
      Branches: branch || [],
      AdminID:this.reduxService.AdminID
    }
    
    this.store.dispatch(deptListActions.setDeptListLoading({ loading: true }));
    this.store.dispatch(deptListActions.loadDeptList({ApiURL, filters}));
  }

  getEmployeeList() {
    let branch = this.getDropdownSelected('branch')?.map((res:any)=>res.Value)[0] || 0
    let deptId = this.getDropdownSelected('department')?.map((res:any)=>res.id)[0] || 0

    let ApiURL = `Admin/GetMyEmployees?AdminID=${this.reduxService.AdminID}&BranchId=${branch}&DeptId=${deptId}&ListType=All`;
    let filters = {branch,deptId}
    setTimeout(() => {
      this.store.dispatch(empListActions.loadEmpList({ApiURL, filters}));
    }, 1)
    // setTimeout(() => {
    //   this.store.dispatch(empListActions.setEmpListLoading({ loading: true, loadingStatus:"loading set in hierarchy comp" }));
    // }, 1)
  }

  triggerAction(action:any){
    let data:any = this.getAllSelectedData()
    this.actionEmitter.emit({action,data})
  }

  getAllSelectedData(){
    let data:any = {
      organization:this.getDropdownSelected('organization'),
      branch:this.getDropdownSelected('branch'),
      department:this.getDropdownSelected('department'),
      employee:this.getDropdownSelected('employee'),
    }
    return data
  }

  onDropDownSelect(event:any,key:string){
    if(key == 'organization') this.onOrganizationSelect(event)
    if(key == 'branch') this.onBranchSelect(event)
    if(key == 'department') this.onDepartmentSelect(event)
    if(key == 'employee') this.onEmployeeSelect(event)
  }
  onDropDownDeSelect(event:any,key:string){
    if(key == 'organization') this.onOrganizationDeSelectAll()
    if(key == 'branch') this.onBranchDeSelectAll()
    if(key == 'department') this.onDepartmentDeSelectAll()
    if(key == 'employee') this.onEmployeeDeSelectAll()
  }

  onDropDownClearAll(event:any,key:string){
    this.dropDownData[key].clearAll = true
    this.setDropdownSelected(key,[])
    this.onDropDownDeSelect(event,key)
  }



  onOrganizationSelect(event:any){
    if(this.dropDownData.organization.selected.length>0){
      this.dropDownData.organization['errorString']=""
    }
    this.getBranches()  
    this.onOrganizationDeSelectAll()
  }
  onBranchSelect(event:any){
    
    this.getDepartments()
    // this.getEmployeeList()

    this.onDepartmentDeSelectAll()
  }
  onDepartmentSelect(event:any){
    this.getEmployeeList()
    this.onEmployeeDeSelectAll()
  }
  onEmployeeSelect(event:any){
    if(this.dropDownData.employee.selected.length>0){
      this.dropDownData.employee['errorString']=""
    }
  }

  onOrganizationDeSelectAll(){
    this.setDropdownSelected('branch',[])
    this.setdropDownData('branch',[])
    
    this.onBranchDeSelectAll()
    this.onDepartmentDeSelectAll()
    this.setDropdownSelected('employee',[])

  }
  onBranchDeSelectAll(){
    this.setDropdownSelected('department',[])
    this.setdropDownData('employee',[])
    this.setDropdownSelected('employee',[])

    this.onDepartmentDeSelectAll()
    this.getDepartments()
  }
  onDepartmentDeSelectAll(){
    this.setdropDownData('department',[])
    this.setdropDownData('employee',[])
    this.setDropdownSelected('employee',[])
    this.getEmployeeList()
  }
  onEmployeeDeSelectAll(){
    
  }


  updateDropdownExtras(){
    Object.keys(this.dropDownExtras).forEach(key => {
      let dropDownObj = this.dropDownExtras[key]
      Object.keys(dropDownObj).forEach(obj_key => {
        if(obj_key == 'settings'){
          Object.keys(dropDownObj['settings']).forEach(setting_key => {
            this.dropDownData[key]['settings'][setting_key] = dropDownObj[obj_key][setting_key]
          })
        }else{
          if(this.dropDownData[key].hasOwnProperty(obj_key)){
            this.dropDownData[key][obj_key] = dropDownObj[obj_key]
          }
        }
      })
    });
  }

  setSpinner(status:any,type:any){
    // console.log(status,type);
    if(status == true){
      // this.loadingStatus+=1
      this.spinnerService.show()
    }
    if(status == false){
      // if(this.loadingStatus > 0) this.loadingStatus-=1
      // if(this.loadingStatus==0)
        this.spinnerService.hide()
    }
  }


  

  setSubOrgSelectors(){
    this.SubOrgList$.subscribe((res:any)=>{
      if(res.data?.List){
        this.setdropDownData('organization',res.data.List)
        
        this.dropDownData.organization.selected = this.dropDownData.organization.selected.map((s:any)=>{
          // console.log(this.dropDownData.organization.data.filter((od:any)=>od.Value == s.Value)[0]?.Text);
          return {
            Value:s.Value,
            Text:this.dropDownData.organization.data.filter((od:any)=>od.Value == s.Value)[0]?.Text
          }
        })
      }
    },error=>{
      console.log("SubOrgList selector error", error);
    })

    this.SubOrgListError$.subscribe(res=>{
      // this.globalToastService.error("Failed to load Organization")
      // console.log("SubOrgList Error selector result", res);
    },error=>{
      console.log("SubOrgList Error selector error", error);
    })

    this.SubOrgListLoading$.subscribe((res:any)=>{
      this.setSpinner(res.loading,"organization",)
      // console.log("SubOrgList Loading selector result", res);
    },error=>{
      console.log("SubOrgList Loading selector error", error);
    })

  }
  setBranchSelectors(){
    this.BranchList$.subscribe((res:any)=>{
      if(res.data?.List){
        this.setdropDownData('branch',res.data.List)

        this.dropDownData.branch.selected = this.dropDownData.branch.selected.map((s:any)=>{
          // console.log(this.dropDownData.branch.data.filter((od:any)=>od.Value == s.Value)[0]?.Text);
          return {
            Value:s.Value,
            Text:this.dropDownData.branch.data.filter((od:any)=>od.Value == s.Value)[0]?.Text
          }
        })
        this.onDepartmentDeSelectAll()
      }
    },error=>{
      this.globalToastService.error("Failed to load Branch")
      console.log("Branchlist selector error", error);
    })

    this.BranchListError$.subscribe(res=>{
      // this.globalToastService.error("Failed to load Branch")
      // console.log("Branchlist Error selector result", res);
    },error=>{
      console.log("Branchlist Error selector error", error);
    })

    this.BranchListLoading$.subscribe((res:any)=>{
      this.setSpinner(res.loading,"branch")
      // console.log("Branchlist Loading selector result", res);
    },error=>{
      console.log("Branchlist Loading selector error", error);
    })

  }
  setDeptSelectors(){
    this.DeptList$.subscribe((res:any)=>{
      if(res.data?.DepartmentList){
        this.setdropDownData('department',res.data.DepartmentList)
        this.dropDownData.department.selected = this.dropDownData.department.selected.map((s:any)=>{
          // console.log(this.dropDownData.department.data.filter((od:any)=>od.Value == s.Value)[0]?.Text);
          return {
            Value:s.Value,
            Text:this.dropDownData.department.data.filter((od:any)=>od.Value == s.Value)[0]?.Text
          }
        })

      }
    },error=>{
      console.log("Deptlist selector error", error);
    })

    this.DeptListError$.subscribe(res=>{
      // console.log("Deptlist Error selector result", res);
    },error=>{
      console.log("Deptlist Error selector error", error);
    })

    this.DeptListLoading$.subscribe((res:any)=>{
      this.setSpinner(res.loading,"department")
      // console.log("Deptlist Loading selector result", res);
    },error=>{
      console.log("Deptlist Loading selector error", error);
    })

  }
  setEmployeeSelectors(){
    this.EmpList$.subscribe((res:any)=>{
      if(res.data?.List){
        this.setdropDownData('employee',res.data.List)
        if(this.dropDownData['employee'].clearAll == false){
          if(this.selectedFilterData && this.selectedFilterData['employee'] && res.data.List && res.data.List.length>0){
            let temp:any[] = []
            this.selectedFilterData['employee'].forEach((sd:any) => {
              if(res.data.List.filter((d:any)=>sd.ID == d.EmployeeId).length>0){
                temp.push(sd)
              }
            });
            this.setDropdownSelected('employee',temp)
            this.dropDownData['employee'].clearAll = true
            this.triggerAction('Search')
          }
        }
      }
    },error=>{
      console.log("Emplist selector error", error);
    })

    this.EmpListError$.subscribe(res=>{
      // console.log("Emplist Error selector result", res);
    },error=>{
      console.log("Emplist Error selector error", error);
    })

    this.EmpListLoading$.subscribe((res:any)=>{
      this.setSpinner(res.loading,"employee "+res.loadingStatus +" , "+ res.error)
      // console.log("Emplist Loading selector result", res);
    },error=>{
      console.log("Emplist Loading selector error", error);
    })

  }

  getWidth(){
    let count = 0
    if(this.dropDownData['organization'].isActive == true) count++
    if(this.dropDownData['branch'].isActive == true) count++
    if(this.dropDownData['department'].isActive == true) count++
    if(this.dropDownData['employee'].isActive == true) count++

    return `${count * 23}%`
  }
}
