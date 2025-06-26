import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as DeptListActions from '../actions/department_list.actions';
import { catchError, map, switchMap, retryWhen, scan, tap, withLatestFrom, filter } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Store } from '@ngrx/store';
import { getDeptList } from '../selectors/department_list.selectors';


@Injectable()
export class DeptListEffects {
  constructor(private actions$: Actions, private _commonservice: HttpCommonService, private store: Store<{}>,) {}

  loadDeptList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeptListActions.loadDeptList),
      withLatestFrom(this.store.select(getDeptList)),
      filter(([action, deptList]) => {
        // console.log("loadDeptlist ",{action,deptList}, action.filters,deptList.filters ,this.filterCheck(action.filters,deptList.filters));
        return this.filterCheck(action.filters,deptList.filters)
      }),
      tap(() => DeptListActions.setDeptListLoading({ loading: true })),
      switchMap((data:any) =>{
        let payload = data[0]
        return this._commonservice.ApiUsingPost(payload.ApiURL,payload.filters).pipe(
            retryWhen(errors =>
              errors.pipe(
                scan((retryCount, error) => {
                  if (retryCount >= 3) {
                    throw error;
                  }
                  return retryCount + 1;
                }, 0)
              )
            ),
            map(data => DeptListActions.loadDeptListSuccess({ data:this.getFormattedData(data), message:"" ,filters:payload.filters})),
            catchError(error => of(DeptListActions.loadDeptListFailure({ message:"", error:{} })))
        )
      })
    )
  );

  getFormattedData(data:any){
    if(data?.DepartmentList?.length>0){
      data.DepartmentList = (data.DepartmentList || []).map((item:any) => {
        // this.DepartmentListKV[item.ID] = item
        return {
          ID: item?.id,
          Name: item?.text,
          ...item
        }
      });
    }

    return data
  }

  filterCheck(currentFilter:any,reduxFilter:any):boolean{
    let currentFilterKeys = Object.keys(currentFilter)
    for (let i = 0; i < currentFilterKeys.length; i++) {
      const key = currentFilterKeys[i];
      if(reduxFilter[key] != currentFilter[key])
        return true
    }
    return false
  }




}