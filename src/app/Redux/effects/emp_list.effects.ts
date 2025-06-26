import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as EmpListActions from '../actions/emp_list.actions';
import { catchError, map, switchMap, retryWhen, scan, tap, withLatestFrom, filter } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Store } from '@ngrx/store';
import { getEmpList } from '../selectors/emp_list.selectors';


@Injectable()
export class EmpListEffects {
  constructor(private actions$: Actions, private _commonservice: HttpCommonService, private store: Store<{}>,) {}

  loadEmpList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmpListActions.loadEmpList),
      withLatestFrom(this.store.select(getEmpList)),
      filter(([action, empList]) => {
        if(empList && empList.loading == true) return false
        // console.log("loadEmplist ",{action,empList}, action.filters,empList.filters ,this.filterCheck(action.filters,empList.filters));
        return this.filterCheck(action.filters,empList.filters)
      }),
      tap(() => EmpListActions.setEmpListLoading({ loading: true,loadingStatus:"Loading from effects" })),
      switchMap((data:any) =>{
        let payload = data[0]
        return this._commonservice.ApiUsingGetWithOneParam(payload.ApiURL).pipe(
            retryWhen(errors =>
              errors.pipe(
                scan((retryCount, error) => {
                  // console.log("Retrying employee loading");
                  
                  if (retryCount >= 3) {
                    throw error;
                  }
                  return retryCount + 1;
                }, 0)
              )
            ),
            map(data => EmpListActions.loadEmpListSuccess({ data, message:"" ,filters:payload.filters})),
            catchError(error => of(EmpListActions.loadEmpListFailure({ message:"", error:{} })))
        )
      })
    )
  );

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
