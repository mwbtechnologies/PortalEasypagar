import { createReducer, on } from '@ngrx/store';
import * as empListActions from '../actions/emp_list.actions';

export interface empListState {
  data: any[];
  lastLoadDate:Date;
  count:number,
  filters:any,
  loading:boolean,
  loadingStatus:string,
  message:string;
  error:any;
}

const initialState: empListState = {
  data: [],
  lastLoadDate: new Date(),
  count: 0,
  filters:{},
  loading:false,
  loadingStatus:"initial status",
  message:"",
  error:{}
};

export const empListReducer = createReducer(
  initialState,
  on(empListActions.loadEmpListSuccess, (state, { data, filters }) => ({
    ...state,
    data,
    filters,
    lastLoadDate: new Date(),
    count:state.count + 1,
    loading:false,
    loadingStatus:"success"
  })),
  
  on(empListActions.loadEmpListFailure, (state, { message,error }) => ({
    ...initialState,
    count:state.count + 1,
    loading:false,
    loadingStatus:"Failed",
    error:error
  })),

  on(empListActions.setEmpListLoading, (state, { loading,loadingStatus }) => ({
    ...state,
    loading:loading,    
    loadingStatus:loadingStatus,
    error:state.error
  })),

  on(empListActions.clearEmpList, () => ({
    ...initialState
  }))
);