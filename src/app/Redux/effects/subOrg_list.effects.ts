import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as SubOrgListActions from '../actions/suborg_list.actions';
import { catchError, map, switchMap, retryWhen, scan, tap, withLatestFrom, filter } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Store } from '@ngrx/store';
import { getSubOrgList } from '../selectors/suborg_list.selectors';

@Injectable()
export class SubOrgListEffects {
  constructor(private actions$: Actions, private _commonservice: HttpCommonService, private store: Store<{}>,) {}

  loadSubOrgList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubOrgListActions.loadSubOrgList),
      withLatestFrom(this.store.select(getSubOrgList)),
      filter(([action, subOrgList]) => {
        // console.log("loadSubOrglist ",{action,subOrgList}, action.filters,subOrgList.filters ,this.filterCheck(action.filters,subOrgList.filters));
        return this.filterCheck(action.filters,subOrgList.filters)
      }),
      tap(() => SubOrgListActions.setSubOrgListLoading({ loading: true })),
      switchMap((data:any) =>{
        let payload = data[0]
        return this._commonservice.ApiUsingGetWithOneParam(payload.ApiURL).pipe(
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
            map(data => SubOrgListActions.loadSubOrgListSuccess({ data, message:"" ,filters:payload.filters})),
            catchError(error => of(SubOrgListActions.loadSubOrgListFailure({ message:"", error })))
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