import { createFeatureSelector,  createSelector} from '@ngrx/store';
import { deptListState } from '../reducer/department_list.reducer';

export const selectDeptListState = createFeatureSelector<deptListState>('deptList')

export const getDeptList = createSelector(
  selectDeptListState,
  (state: deptListState) => (state)
);
export const getDeptListError = createSelector(
  selectDeptListState,
  (state: deptListState) => ({message:state.message,error:state.error})
);
export const getDeptListLoading = createSelector(
  selectDeptListState,
  (state: deptListState) => ({loading:state.loading})
);
