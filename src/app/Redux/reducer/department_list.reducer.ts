import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as deptListActions from '../actions/department_list.actions';

export interface deptListState {
  data: any[];
  lastLoadDate:Date;
  count:number,
  filters:any,
  loading:boolean,
  message:string;
  error:any;
}

const initialState: deptListState = {
  data: [],
  lastLoadDate: new Date(),
  count: 0,
  filters:{},
  loading:false,
  message:"",
  error:{}
};
export const selectDeptListState = createFeatureSelector<deptListState>('deptList')

export const deptListReducer = createReducer(
  initialState,
  on(deptListActions.loadDeptListSuccess, (state, { data, filters }) => ({
    ...state,
    data,
    filters,
    lastLoadDate: new Date(),
    count:state.count + 1,
    loading:false
  })),

  on(deptListActions.setDeptListLoading, (state, { loading }) => ({
    ...state,
    loading:loading
  })),

  on(deptListActions.clearDeptList, () => ({
    ...initialState
  }))
);