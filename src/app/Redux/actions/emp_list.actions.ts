import { createAction, props } from '@ngrx/store';

export const loadEmpList = createAction('[List] Load Employee List', props<{ ApiURL:any, filters: any }>());  // Trigger API call
export const loadEmpListSuccess = createAction('[List] Load Employee List Success', props<{ data: any[],message:any,filters:any}>());
export const loadEmpListFailure = createAction('[List] Load Employee List Failure', props<{ message:any,error:any}>());
export const setEmpListLoading = createAction('[List] Load Employee List Loading', props<{ loading:boolean,loadingStatus:string}>());
export const clearEmpList = createAction('[List] Clear Employee List'); // Clear data when needed
