import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { HttpCommonService } from "./httpcommon.service";
import { Store } from "@ngrx/store";
// import * as empListActions from 'src/app/Redux/actions/emp_list.actions'
// import * as branchListActions from 'src/app/Redux/actions/branch_list.actions'
// import * as SubOrgListActions from 'src/app/Redux/actions/suborg_list.actions'
// import * as DepartmentListActions from 'src/app/Redux/actions/department_list.actions'
// import {getEmpList} from 'src/app/Redux/selectors/emp_list.selectors'
// import { getBranchList } from "../Redux/reducer/branch_list.reducer";
// import { getSubOrgList } from "../Redux/reducer/suborg_list.reducer";
// import { getDeptList } from "../Redux/reducer/department_list.reducer";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class ReduxService {
  // SessionDetails: any;

  // SoftwareId: number = 8;
  DepartmentList:any = []
  DepartmentListKV:any = {}
  EmployeeListKV:any = {}
  EmployeeList:any = []
  BranchList:any = []
  SubOrgList:any = []
  // EmpList$:  Observable<{ data: any[]}>
  // BranchList$:  Observable<{ data: any[]}>
  // SubOrgList$:  Observable<{ data: any[]}>
  // DeptList$:  Observable<{ data: any[]}>
  BranchListKV:any = {}
  SubOrgListKV:any = {}
  AdminName:any
  ORGId:any
  AdminID:any
  UserID:any

  constructor(private _httpClient: HttpClient,
      private _commonservice: HttpCommonService,
      private store: Store<{}>,
    ) {
    
    // this.EmpList$ = store.select(getEmpList);
    // this.BranchList$ = store.select(getBranchList);
    // this.SubOrgList$ = store.select(getSubOrgList);
    // this.DeptList$ = store.select(getDeptList);

    
    this.ORGId =     parseInt(localStorage.getItem('OrgID')   || "")
    this.AdminID =   parseInt(localStorage.getItem("AdminID") || "0")
    this.UserID =    parseInt(localStorage.getItem("UserID")  || "0")
    this.AdminName = localStorage.getItem('Name')    || "NA"

    this.EmployeeListKV[this.AdminID] = {Name: this.AdminName}

  }
    
  getSubOrgList(): Observable<any[]>{
      let url = "Admin/GetSuborgList?OrgID="+this.ORGId+"&AdminId="+this.AdminID
      if(this.SubOrgList.length>0){
        return this.SubOrgList
      }else{
        return this._commonservice.ApiUsingGetWithOneParam(url).pipe(
          map((data: any) => {
            this.SubOrgList = (data.List || []).map((item:any) =>{
              this.SubOrgListKV[item.Value] = {...item, Name:item.Text}
              return {
                ID: item?.Value,
                Name: item?.Name,
                ...item
              }
            });
            return this.SubOrgList; // Return processed data
          })
        );
      }
        
    }
    getBranchListByOrgId(suborgid:any): Observable<any[]>{
      let url = "Admin/GetBranchListupdated?OrgID="+this.ORGId+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
      if(this.BranchList.length>0){
        return this.BranchList
      }else{
        return this._commonservice.ApiUsingGetWithOneParam(url).pipe(
          map((data: any) => {
            this.BranchList = (data.List || []).map((item:any) =>{
              this.BranchListKV[item.Value] = {...item, Name:item.Text}
              return {
                ID: item?.Value,
                Name: item?.Name,
                ...item
              }
            });
            return this.BranchList; // Return processed data
          })
        )
      }
            
    }

    isTimeDifferenceInMinutes(date1:Date, date2:Date,timeDiff:number) {
      const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      return diffInMinutes <= timeDiff; //true if timediff in min is within range of difference
    }
  
    getAllEmployeeList(): Observable<any[]>{
    // this.spinnerService.show()
      let BranchID =0;
      let deptID = 0;
      let ApiURL = `Admin/GetMyEmployees?AdminID=${this.AdminID}&BranchId=${BranchID}&DeptId=${deptID}&ListType=All`;
      if(this.EmployeeList.length>0){
        return of(this.EmployeeList)
      }else{
        return this._commonservice.ApiUsingGetWithOneParam(ApiURL).pipe(
          map((data: any) => {
            this.EmployeeList = (data.List || []).map((item:any) => {
              this.EmployeeListKV[item.ID] = item
              return {
                ID: item?.ID,
                Name: item?.Name,
                ...item
              }
            });

            return this.EmployeeList; // Return processed data
          },(error:any)=>{
            return this.EmployeeList
          })
        );
      }
    }

    // filterCheck(currentFilter:any,reduxFilter:any):boolean{
    //   let currentFilterKeys = Object.keys(currentFilter)
    //   for (let i = 0; i < currentFilterKeys.length; i++) {
    //     const key = currentFilterKeys[i];
    //     if(reduxFilter[key] != currentFilter[key])
    //       return true
    //   }
    //   return false
    // }
  
    getDepartments(branch:any): Observable<any[]>{
      const json = {
        OrgID:this.ORGId,
        Branches: branch || []
      }
      let ApiURL = `Portal/GetEmployeeDepartments`;
      return this._commonservice.ApiUsingPost(ApiURL,json).pipe(
        map((data: any) => {
          this.DepartmentList = (data.List || []).map((item:any) => {
            this.DepartmentListKV[item.Value] = item
            return {
              ID: item?.id,
              Name: item?.text,
              ...item
            }
          });
          return this.DepartmentList; // Return processed data
        })
      );
    }
  
    // mapUserToAssets(list:any){
    //   return list.map((item:any)=>{
    //     const createdById = item.createdBy      
    //     if(this.EmployeeListKV.hasOwnProperty(createdById)){
    //       return {...item,createdByString:this.EmployeeListKV[createdById]?.Name || 'NA',}
    //     }else{
    //       return {...item,createdByString: "NA",}
    //     }
    //   })
    // }

    
  mapUserToAssets(list:any,key:any = ["createdBy"]){
    return list.map((item:any)=>{
      let data = {}
      if(key.includes("createdBy")){
        const createdById = item.createdBy 
        if(this.EmployeeListKV.hasOwnProperty(createdById)){
          item =  {...item,createdByString:this.EmployeeListKV[createdById]?.Name || '',}
        }else{
          item =  {...item,createdByString: "",}
        }
      }
      if(key.includes('userId')){
        if(this.EmployeeListKV.hasOwnProperty(item.userId)){
          item =  {...item,Name:this.EmployeeListKV[item.userId]?.Name || '',}
        }else{
          item =  {...item,Name: "",}
        }
      }
      if(key.includes('branchId')){
        if(this.BranchListKV.hasOwnProperty(item.branchId)){
          item =  {...item,Branch:this.BranchListKV[item.branchId]?.Text || '',}
        }else{
          item =  {...item,Branch: "",}
        }
      }
      return item
    })
  }
}