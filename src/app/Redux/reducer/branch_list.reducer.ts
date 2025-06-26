import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as branchListActions from '../actions/branch_list.actions';

export interface branchListState {
  data: any[];
  lastLoadDate:Date;
  count:number,
  filters:any,
  loading:boolean,
  message:string;
  error:any;
}

const initialState: branchListState = {
  data: [],
  lastLoadDate: new Date(),
  count: 0,
  filters:{},
  loading:false,
  message:"",
  error:{}
};
export const selectBranchListState = createFeatureSelector<branchListState>('branchList')

export const branchListReducer = createReducer(
  initialState,
  on(branchListActions.loadBranchListSuccess, (state, { data, filters }) => ({
    ...state,
    data,
    filters,
    lastLoadDate: new Date(),
    count:state.count + 1,
    loading:false
  })),

  on(branchListActions.setBranchListLoading, (state, { loading }) => ({
    ...state,
    loading:loading
  })),

  on(branchListActions.clearBranchList, () => ({
    ...initialState
  }))
);