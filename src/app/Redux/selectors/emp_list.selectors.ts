import { createFeatureSelector,  createSelector} from '@ngrx/store';
import { empListState } from '../reducer/emp_list.reducer';

export const selectEmpListState = createFeatureSelector<empListState>('empList')

export const getEmpList = createSelector(
  selectEmpListState,
  (state: empListState) => (state)
);
export const getEmpListError = createSelector(
  selectEmpListState,
  (state: empListState) => ({message:state.message,error:state.error})
);
export const getEmpListLoading = createSelector(
  selectEmpListState,
  (state: empListState) => ({loading:state.loading,loadingStatus:state.loadingStatus})
);
