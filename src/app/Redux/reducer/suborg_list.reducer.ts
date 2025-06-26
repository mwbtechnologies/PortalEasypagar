import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as subOrgListActions from '../actions/suborg_list.actions';

export interface subOrgListState {
  data: any[];
  lastLoadDate:Date;
  count:number,
  filters:any,
  loading:boolean,
  message:string;
  error:any;
}

const initialState: subOrgListState = {
  data: [],
  lastLoadDate: new Date(),
  count: 0,
  filters:{},
  loading:false,
  message:"",
  error:{}
};
export const selectSubOrgListState = createFeatureSelector<subOrgListState>('subOrgList')

export const subOrgListReducer = createReducer(
  initialState,
  on(subOrgListActions.loadSubOrgListSuccess, (state, { data, filters }) => ({
    ...state,
    data,
    filters,
    lastLoadDate: new Date(),
    count:state.count + 1,
    loading:false
  })),

  on(subOrgListActions.setSubOrgListLoading, (state, { loading }) => ({
    ...state,
    loading:loading
  })),

  on(subOrgListActions.clearSubOrgList, () => ({
    ...initialState
  }))
);