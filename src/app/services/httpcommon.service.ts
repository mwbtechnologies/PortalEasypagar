import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpCommonService {
  SessionDetails: any;

  constructor(private _httpClient: HttpClient) { }
  environmentSetup = `${environment.Url}`;


  private getHeaders(): HttpHeaders {
   var token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  GetWithOneParam(apiurl: any): Observable<any> {
    return this._httpClient.get<any>(this.environmentSetup + "/" + apiurl, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  GetWithOneParamResponseText(apiurl: any): Observable<any> {
    return this._httpClient.get(this.environmentSetup + "/" + apiurl, {
      headers: this.getHeaders().set('responseType', 'text')
    }).pipe(catchError(this.handleError));
  }

  PostWithOneParam(apiurl: any): Observable<any> {
    return this._httpClient.post<any>(this.environmentSetup + "/" + apiurl, {}, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  GetWithTwoParams(apiurl: any, fData: any): Observable<any> {
    const endpoint = this.environmentSetup + `/${apiurl}=${fData}`;
    return this._httpClient.get<any>(endpoint, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  GetWithThreeParams(apiurl: any, variable: any, fData: any): Observable<any> {
    const endpoint = this.environmentSetup + `/${apiurl}?${variable}=${fData}`;
    return this._httpClient.get<any>(endpoint, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  Postwithjson(apiurl: any, fData: any): Observable<any> {
    const endpoint = this.environmentSetup + '/' + apiurl;
    return this._httpClient.post(endpoint, fData, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
    }



  ApiUsingGetWithOneParam(apiurl: any): Observable<any> {
    return this._httpClient.get<any>(this.environmentSetup + "/api/" + apiurl, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  ApiUsingPostWithOneParam(apiurl: any): Observable<any> {
    return this._httpClient.post<any>(this.environmentSetup + "/api/" + apiurl, {}, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  ApiUsingGetWithTwoParams(apiurl: any, fData: any): Observable<any> {
    const endpoint = this.environmentSetup + `/api/${apiurl}=${fData}`;
    return this._httpClient.get<any>(endpoint, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  assignform(array: any, roleid: any): Observable<any> {
    return this._httpClient.post<any>(this.environmentSetup + "/api/SuperAdmin/assignform?roleid=" + roleid, array, {
      headers: this.getHeaders()
    });
  }

  removeform(array: any): Observable<any> {
    return this._httpClient.post<any>(this.environmentSetup + "/api/SuperAdmin/removeform", array, {
      headers: this.getHeaders()
    });
  }

  ApiUsingGetWithThreeParams(apiurl: any, variable: any, fData: any): Observable<any> {
    const endpoint = this.environmentSetup + `/api/${apiurl}?${variable}=${fData}`;
    return this._httpClient.get<any>(endpoint, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  ApiUsingPost(apiurl: any, fData: any): Observable<any> {
    const endpoint = this.environmentSetup + '/api/' + apiurl;
    return this._httpClient.post(endpoint, fData, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  MasterApiUsingPost(apiurl: any, fData: any): Observable<any> {
    const endpoint = apiurl;
    return this._httpClient.post(endpoint, fData).pipe(catchError(this.handleError));
  }

  ApiUsingPostNew(apiurl: any, fData: any, options?: any): Observable<any> {
    const endpoint = this.environmentSetup + '/' + apiurl;
    return this._httpClient.post(endpoint, fData, options).pipe(catchError(this.handleError));
  }

  ApiUsingGetNew(apiurl: any, options?: any): Observable<any> {
    const endpoint = this.environmentSetup + '/' + apiurl;
    return this._httpClient.get(endpoint, options).pipe(catchError(this.handleError));
  }

  ApiUsingPostForDelete(apiurl: any): Observable<any> {
    return this._httpClient.post<any>(this.environmentSetup + "/api/" + apiurl, {}, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  ApiUsingPut(apiurl: any, id: number, fData: any): Observable<any> {
    return this._httpClient.put<any>(this.environmentSetup + "/api/" + apiurl + "/" + id, fData, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  ApiUsingPutNew(apiurl: any, fData: any): Observable<any> {
    const endpoint = this.environmentSetup + '/api/' + apiurl;
    return this._httpClient.put(endpoint, fData, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  ApiUsingDelete(apiurl: any, id: number): Observable<any> {
    const endpoint = this.environmentSetup + `/api/${apiurl}/${id}`;
    return this._httpClient.delete<any>(endpoint, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.log('Client Side Error', errorResponse.error.message);
    } else {
      console.log('Server Side Error', errorResponse);
    }
    return throwError(errorResponse);
  }

  getUserDataUsingBearer(apiurl: any, responseToken: any): Observable<any> {
    return this._httpClient.get<any>(this.environmentSetup + "/api/" + apiurl, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${responseToken}`,
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Connection': 'keep-alive',
      })
    }).pipe(catchError(this.handleError));
  }

  public getToken() {
    localStorage.setItem("DeviceToken","IDDauS6G8yxB3qViwYwet366CGya_59K7LVlFKL157fBp6urJJHn6Fo_xFmByS8TNZSfei3Cib19MecTEg93Ul30cLKlWPPqRh37g-AXHz5NIWzK3_p7M5YEZzoonkgOGarGr8yt2lgQahVSVJRoF4qGOwl9tVvZvC_1BsEPPjxjXnSORynrpP3K8WAc5uDXywJLyS6klcLryAKTyWWLwLJ0XtGbPU0D5JVULiRpo81j8d7xkaEedgEG6YoDk_81X06TWFe3lDJVECCS-_jNZcDXV-CjGjRdd5y48CTvL-ZKLWUHDx_moJABktyu7v1o6t3Si-MLIdOvIji9bm-Jt_F-2DyIR4v5S3CmWN693x8SwoNn45EeevTrl_l5FGbxgfvQVLctcheh4lJ_nxQKy3DYMllRzhmcqmuc-WwhloAoL9cMoAlBaMxdewkAe-edVkdiBN4vz_7TA0srEm4upwdd6OxYaSM546QTos_nb-o")
    this.SessionDetails = localStorage.getItem("Token");
    if (this.SessionDetails) {
    } else {
     return this.SessionDetails = "";
    }
    return this.SessionDetails;
  }

  PostForLogout(apiurl: any): Observable<any> {
    // localStorage.clear();
    return this._httpClient.post<any>(this.environmentSetup + "/api/" + apiurl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(catchError(this.handleError));
  }
  postSignInData(RBM: any): any {
    const body = new HttpParams()
      .set('username', RBM.username)
      .set('password', RBM.password)
      .set('grant_type', 'password');
  
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  
    return this._httpClient.post(
      `${this.environmentSetup}/Token`,
      body.toString(),
      { headers: reqHeader }
    );
  }

  ApiUsingPostMultipart(apiurl: any, fData: any, headers?: HttpHeaders): Observable<any> {
    const endpoint = this.environmentSetup + '/api/' + apiurl;
    let httpOptions = {
      headers: headers || new HttpHeaders()
    };
    httpOptions.headers = httpOptions.headers.delete('Content-Type');
    return this._httpClient.post(endpoint, fData, httpOptions)
      .pipe(catchError(this.handleError));
  }

  MasterPortalApi(url: any, val: any) {
    return this._httpClient.post(url, val);
  }
}
