import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as branchListActions from '../actions/branch_list.actions';
import { catchError, map, switchMap, retryWhen, scan, tap, withLatestFrom, filter } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Store } from '@ngrx/store';
import { getBranchList } from '../selectors/branch_list.selectors';


@Injectable()
export class BranchListEffects {
  constructor(private actions$: Actions, private _commonservice: HttpCommonService, private store: Store<{}>,) {}

  loadBranchList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(branchListActions.loadBranchList),
      withLatestFrom(this.store.select(getBranchList)),
      filter(([action, branchList]) => {
        // console.log("loadBranchlist ",{action,branchList}, action.filters,branchList.filters ,this.filterCheck(action.filters,branchList.filters));
        return this.filterCheck(action.filters,branchList.filters)
      }),
      tap(() => branchListActions.setBranchListLoading({ loading: true })),
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
            map(data => branchListActions.loadBranchListSuccess({ data, message:"" ,filters:payload.filters})),
            catchError(error => of(branchListActions.loadBranchListFailure({ message:"", error:{} })))
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