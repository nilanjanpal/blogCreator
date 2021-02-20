import { createFeatureSelector, createSelector } from "@ngrx/store";
import { BlogState } from "./blog.reducer";

export const getBlogState = createFeatureSelector<BlogState>('blog');
export const getisEditMode = createSelector(getBlogState, state => state.isEditMode);
export const getBlogs = createSelector(getBlogState, state => state.blog);
export const getRecordCount = createSelector(getBlogState, state => state.recordCount);
export const getPageSize = createSelector(getBlogState, state => state.pageSize);
export const getCurrentPageIndex = createSelector(getBlogState, state => state.currentPageIndex);