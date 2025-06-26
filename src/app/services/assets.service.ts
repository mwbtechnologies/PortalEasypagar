import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { HttpCommonService } from "./httpcommon.service";
// import { Store } from '@ngrx/store';
// import * as empListActions from 'src/app/Redux/actions/emp_list.actions'
// import * as branchListActions from 'src/app/Redux/actions/branch_list.actions'
// import * as DepartmentListActions from 'src/app/Redux/actions/department_list.actions'
// import {getEmpList} from 'src/app/Redux/reducer/emp_list.reducer'
// import { getBranchList } from "../Redux/reducer/branch_list.reducer";
// import { getDeptList } from "../Redux/reducer/department_list.reducer";

@Injectable({
  providedIn: "root",
})
export class AssetService {
  SessionDetails: any;
  environmentSetup = `${environment.AssetUrl}`;

  returnTypes : any[] = [
    {
      id: "returnable",
      text: "Returnable",
    },
    {
      id: "non-returnable",
      text: "Non Returnable",
    },
  ];
  returnTypesKV: any;
  SoftwareId: number = 8;
  // DepartmentList:any = []
  // EmployeeListKV:any = {}
  // EmployeeList:any = []
  // BranchList:any = []
  statusTypes : any[] = [
    {
      id:'assigned',
      text:'Assigned'
    },
    {
      id:'returned',
      text:'Returned'
    },
    {
      id:'damaged',
      text:'Damaged'
    }
  ]
  statusTypesKV : any
  
  // EmpList$:  Observable<{ data: any[]}>
  // BranchList$:  Observable<{ data: any[]}>
  // DeptList$:  Observable<{ data: any[]}>
  // BranchListKV:any = []
  AdminName:any
  ORGId:any
  AdminID:any
  UserID:any

  constructor(private _httpClient: HttpClient,
    private _commonservice: HttpCommonService,
    // private store: Store<{}>,
  ){
    // this.EmpList$ = store.select(getEmpList);
    // this.BranchList$ = store.select(getBranchList);
    // this.DeptList$ = store.select(getDeptList);
    // console.log("Asset Service init")
    this.returnTypesKV  = this.returnTypes.reduce((acc,item)=>{
      acc[item.id] = item.text
      return acc
    },{})
    this.statusTypesKV  = this.statusTypes.reduce((ac,item)=>{
      ac[item.id] = item.text
      return ac
    },{})
    // console.log(this.returnTypesKV,"returnTypesKV");
    // console.log(this.statusTypesKV,"statusTypesKV");
    
    this.ORGId =     parseInt(localStorage.getItem('OrgID')   || "")
    this.AdminID =   parseInt(localStorage.getItem("AdminID") || "0")
    this.UserID =    parseInt(localStorage.getItem("UserID")  || "0")
    this.AdminName = localStorage.getItem('Name')    || "NA"

    // this.EmployeeListKV[this.AdminID] ={Name: this.AdminName}
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.log("Client Side Error", errorResponse.error.message);
    } else {
      console.log("Server Side Error", errorResponse);
    }
    return throwError(errorResponse);
  }

    PostMethod(apiurl: any, fData: any): Observable<any> {
    const endpoint = this.environmentSetup + "api/" + apiurl;
    return this._httpClient
      .post(endpoint, fData)
      .pipe(catchError(this.handleError));
      }

      getFile(url: string) {
    return this._httpClient.get(url, { responseType: "blob" });
      }

  // GetBranches(): Observable<any[]> {
  //   return this._commonservice.ApiUsingGetWithOneParam("Admin/GetBranchList?OrgID=" + this.assetService.ORGId+ "&AdminId=" + this.assetService.UserID).subscribe((data) => {
  //     this.BranchList = data.List;
  //     console.log(this.BranchList, "branchlist");
  //   }, (error) => {
  //     this.globalToastService.error(error); console.log(error);
  //   });

  // }
  
  // getBranchList(): Observable<any[]>{
  //   let url = "Admin/GetBranchList?OrgID=" + this.ORGId+ "&AdminId=" + this.UserID
  //   return this.BranchList$.pipe(
  //     switchMap((existingData: any[] | null |any) => {
  //       if (existingData && existingData.data  && existingData.data.length > 0) {
  //         this.BranchList = existingData
  //         return of(existingData); // Return cached data
  //       } else {
  //         return this._commonservice.ApiUsingGetWithOneParam(url).pipe(
  //           map((data: any) => {
  //             this.BranchList = (data.List || []).map((item:any) => {
  //               this.BranchListKV[item.Value] = item
  //               return{
  //                 ID: item?.Value,
  //                 Name: item?.Text,
  //                 ...item
  //               }
  //             });
              
  //             this.store.dispatch(branchListActions.loadBranchListSuccess({ data: this.BranchList }));
  //             return this.BranchList; // Return processed data
  //           })
  //         );
  //       }
  //     })
  //   );
  // }

  // getEmployeeList(branch:any, department:any): Observable<any[]>{
  //   let BranchID = branch || 0;
  //   let deptID = department || 0;
  //   let ApiURL = `Admin/GetMyEmployees?AdminID=${this.AdminID}&BranchId=${BranchID}&DeptId=${deptID}&ListType=All`;
  //   return this.EmpList$.pipe(
  //     switchMap((existingData: any[] | null | any) => {
  //       if (existingData && existingData.data  && existingData.data.length > 0) {
  //         this.EmployeeList = existingData
  //         return of(existingData); // Return cached data
  //       } else {
  //         return this._commonservice.ApiUsingGetWithOneParam(ApiURL).pipe(
  //           map((data: any) => {
  //             this.EmployeeList = (data.List || []).map((item:any) => {
  //               this.EmployeeListKV[item.ID] = item
  //               return {
  //                 ID: item?.ID,
  //                 Name: item?.Name,
  //                 ...item
  //               }
  //             });
  //             this.store.dispatch(empListActions.loadEmpListSuccess({ data: this.EmployeeList }));
              
  //             return this.EmployeeList; // Return processed data
  //           })
  //         );
  //       }
  //     })
  //   );
  // }

  // getDepartments(branch:any): Observable<any[]>{
  //   const json = {
  //     OrgID:this.ORGId,
  //     Branches: branch || []
  //   }
  //   let ApiURL = `Portal/GetEmployeeDepartments`;
  //   return this.DeptList$.pipe(
  //     switchMap((existingData: any[] | null | any) => {
  //       if (existingData && existingData.data  && existingData.data.length > 0) {
  //         this.DepartmentList = existingData
  //         return of(existingData); // Return cached data
  //       } else {
  //         return this._commonservice.ApiUsingPost(ApiURL,json).pipe(
  //           map((data: any) => {
  //             this.DepartmentList = (data.List || []).map((item:any) => {
  //               // this.DepartmentListKV[item.ID] = item
  //               return {
  //                 ID: item?.ID,
  //                 Name: item?.Name,
  //                 ...item
  //               }
  //             });
  //             this.store.dispatch(DepartmentListActions.loadDeptListSuccess({ data: this.DepartmentList }));
              
  //             return this.DepartmentList; // Return processed data
  //           })
  //         );
  //       }
  //     })
  //   );
  // }

  // mapUserToAssets(list:any,key:any = ["createdBy"]){

  //   return list.map((item:any)=>{
  //     let data = {}
  //     if(key.includes("createdBy")){
  //       const createdById = item.createdBy 
  //       if(this.EmployeeListKV.hasOwnProperty(createdById)){
  //         item =  {...item,createdByString:this.EmployeeListKV[createdById]?.Name || '',}
  //       }else{
  //         item =  {...item,createdByString: "",}
  //       }
  //     }
  //     if(key.includes('userId')){
  //       if(this.EmployeeListKV.hasOwnProperty(item.userId)){
  //         item =  {...item,Name:this.EmployeeListKV[item.userId]?.Name || '',}
  //       }else{
  //         item =  {...item,Name: "",}
  //       }
  //     }
  //     if(key.includes('branchId')){
  //       if(this.BranchListKV.hasOwnProperty(item.branchId)){
  //         item =  {...item,BranchName:this.BranchListKV[item.branchId]?.Text || '',}
  //       }else{
  //         item =  {...item,BranchName: "",}
  //       }
  //     }
  //     return item
  //   })
  // }

}
