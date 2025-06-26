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
import * as moment from "moment";
// import * as empListActions from 'src/app/Redux/actions/emp_list.actions'
// import * as branchListActions from 'src/app/Redux/actions/branch_list.actions'
// import * as DepartmentListActions from 'src/app/Redux/actions/department_list.actions'
// import {getEmpList} from 'src/app/Redux/reducer/emp_list.reducer'
// import { getBranchList } from "../Redux/reducer/branch_list.reducer";
// import { getDeptList } from "../Redux/reducer/department_list.reducer";

@Injectable({
  providedIn: "root",
})
export class DirectoryService {
  SessionDetails: any;

  SoftwareId: number = 8;
  // DepartmentList:any = []
  // EmployeeListKV:any = {}
  // EmployeeList:any = []
  // BranchList:any = []
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
      private store: Store<{}>,) {
    
    // this.EmpList$ = store.select(getEmpList);
    // this.BranchList$ = store.select(getBranchList);
    // this.DeptList$ = store.select(getDeptList);

    
    this.ORGId =     parseInt(localStorage.getItem('OrgID')   || "")
    this.AdminID =   parseInt(localStorage.getItem("AdminID") || "0")
    this.UserID =    parseInt(localStorage.getItem("UserID")  || "0")
    this.AdminName = localStorage.getItem('Name')    || "NA"

    // this.EmployeeListKV[this.AdminID] = this.AdminName

  }
  environmentSetup = `${environment.DirectoryUrl}`;

  allowedExtensions: any[] = ["JPG", "JPEG", "PNG", "PDF"];
  extensionTypes:any = {
    "jpg": 'image',
    "jpeg": 'image',
    "png": 'image',
    "pdf": 'pdf',
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
    const endpoint = this.environmentSetup + "api/dir/" + apiurl;
    return this._httpClient
      .post(endpoint, fData)
      .pipe(catchError(this.handleError));
  }
  getFile(url: string) {
    return this._httpClient.get(url, { responseType: "blob" });
  }

  // download(UserId: any, toastService: ToastrService,userDocId,) {
  //   try{
  //     let json:any = {
  //       mapping:{
  //         orgId:this.ORGId,
  //         userId: UserId,
  //       },
  //       SoftwareId: this.SoftwareId,
  //     };
  //     // if(userDoc){
  //       if(userDocId) json['userDocId'] = userDoc._id
  //       if(userDoc.docTypeId) json['docTypeId'] = userDoc.docTypeId
  //     // }
  //     // if(doc){
  //       if(doc.key) json['parameterId'] = doc.key
  //       if(doc._id) json['userDocParamId'] = doc._id
  //     // }
  download(UserId: any, toastService: ToastrService,docTypeId:any,userDocId:any,userDocParamId:any,parameterId:any,name:string,docName:string,userName:string) {
    try{
      let json:any = {
        mapping:{
          orgId:this.ORGId,
          userId: UserId,
        },
        SoftwareId: this.SoftwareId,
      };
      // if(userDoc){
        if(docTypeId) json['docTypeId'] = docTypeId
        if(userDocId) json['userDocId'] = userDocId
        if(userDocParamId ) json['userDocParamId'] = userDocParamId
        if(parameterId) json['parameterId'] = parameterId
      // }
      // if(doc){
      // }
    
      this.PostMethod("download/document/file", json).subscribe(
        (res: any) => {
          if (res.status === 200 && res.data?.status) {
            res.data.data.forEach((item: any) => {
              if (item) {
                // console.log(doc,userDoc);
                // Object.entries(documents).forEach(
                let date : string = moment().format('YYYYMMMDD_hhmm')
                let fileType = item.data.split('.').pop()
                let fileName :any = `${docName}_${userName}_${name}_${date}.${fileType}`
                
                  this.downloadImage(
                    item.data,
                    fileName
                  );
              }
            });
          }
        },
        (error) => {
          toastService.error(error.error.message);
        }
      );

    }catch(error){
      toastService.error("Something went wrong! Please try again later")
    }
  }

  delete(adminId:any, orgId: any, userId: any, toastService: ToastrService, doc:any=null,userDocumentId:any) {
    let json:any = {
      userParameterId: doc._id,
      SoftwareId: this.SoftwareId,
      createdBy: adminId,
      status: false,
      mapping: {
        orgId: orgId,
        userId
      },
      userDocumentId:userDocumentId
    };
    return this.PostMethod("submit/update/Param/Status", json)
  }

  downloadImage(imagePath: string, fileName: string) {
    const fullImageUrl = this.environmentSetup + imagePath; // Combine base URL with the image path
    fetch(fullImageUrl)
      .then((response) => response.blob()) // Convert to blob
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob); // Create URL for blob
        link.download = fileName; // Set filename
        document.body.appendChild(link);
        link.click(); // Trigger download
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading the image", error);
      });
  }


  
    
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
    //             this.BranchList = (data.List || []).map((item:any) => ({
    //               ID: item?.Value,
    //               Name: item?.Name,
    //               ...item
    //             }));
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
}
