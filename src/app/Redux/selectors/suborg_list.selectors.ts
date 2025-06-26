import { createFeatureSelector,  createSelector} from '@ngrx/store';
import { subOrgListState } from '../reducer/suborg_list.reducer';

export const selectSubOrgListState = createFeatureSelector<subOrgListState>('subOrgList')

export const getSubOrgList = createSelector(
  selectSubOrgListState,
  (state: subOrgListState) => (state)
);
export const getSubOrgListError = createSelector(
  selectSubOrgListState,
  (state: subOrgListState) => ({message:state.message,error:state.error})
);
export const getSubOrgListLoading = createSelector(
  selectSubOrgListState,
  (state: subOrgListState) => ({loading:state.loading})
);
