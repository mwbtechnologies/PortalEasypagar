import { createAction, props } from '@ngrx/store';

export const loadSubOrgList = createAction('[List] Load SubOrg List', props<{ ApiURL:any, filters: any }>());  // Trigger API call
export const loadSubOrgListSuccess = createAction('[List] Load SubOrg List Success', props<{ data: any[],message:any,filters:any}>());
export const loadSubOrgListFailure = createAction('[List] Load SubOrg List Failure', props<{ message:any,error:any}>());
export const setSubOrgListLoading = createAction('[List] Load SubOrg List Loading', props<{ loading:boolean}>());
export const clearSubOrgList = createAction('[List] Clear SubOrg List'); // Clear data when needed
