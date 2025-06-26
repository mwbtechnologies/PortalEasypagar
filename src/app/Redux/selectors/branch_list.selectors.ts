import { createFeatureSelector,  createSelector} from '@ngrx/store';
import { branchListState } from '../reducer/branch_list.reducer';

export const selectBranchListState = createFeatureSelector<branchListState>('branchList')

export const getBranchList = createSelector(
  selectBranchListState,
  (state: branchListState) => (state)
);
export const getBranchListError = createSelector(
  selectBranchListState,
  (state: branchListState) => ({message:state.message,error:state.error})
);
export const getBranchListLoading = createSelector(
  selectBranchListState,
  (state: branchListState) => ({loading:state.loading})
);
