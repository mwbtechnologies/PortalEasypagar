import { createAction, props } from '@ngrx/store';

export const loadBranchList = createAction('[List] Load Branch List', props<{ ApiURL:any, filters: any }>());  // Trigger API call
export const loadBranchListSuccess = createAction('[List] Load Branch List Success', props<{ data: any[],message:any,filters:any}>());
export const loadBranchListFailure = createAction('[List] Load Branch List Failure', props<{ message:any,error:any}>());
export const setBranchListLoading = createAction('[List] Load Branch List Loading', props<{ loading:boolean}>());
export const clearBranchList = createAction('[List] Clear Branch List'); // Clear data when needed
