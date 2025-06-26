import { createAction, props } from '@ngrx/store';

export const loadDeptList = createAction('[List] Load Department List', props<{ ApiURL:any, filters: any }>());  // Trigger API call
export const loadDeptListSuccess = createAction('[List] Load Department List Success', props<{ data: any[],message:any,filters:any}>());
export const loadDeptListFailure = createAction('[List] Load Department List Failure', props<{ message:any,error:any}>());
export const setDeptListLoading = createAction('[List] Load Department List Loading', props<{ loading:boolean}>());
export const clearDeptList = createAction('[List] Clear Department List'); // Clear data when needed
