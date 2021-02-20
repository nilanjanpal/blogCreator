import { Action, UPDATE } from "@ngrx/store";
import { Blog } from "src/app/model/blog.model";

export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
export const SET_RECORDCOUNT = 'SET_RECORDCOUNT';
export const REFRESH_BLOG = 'REFRESH_BLOG';
export const UPDATEPAGESIZEANDINDEX = 'UPDATEPAGESIZEANDINDEX';

export class SetEditMode implements Action {
    readonly type = SET_EDIT_MODE;
    constructor(public payload: boolean) {}
}

export class SetRecordCount implements Action {
    readonly type = SET_RECORDCOUNT;
    constructor(public payload: number) {}
}

export class RefreshBlog implements Action {
    readonly type = REFRESH_BLOG;
    constructor(public payload: Blog[]) {}
}

export class UpdatePageSizeandIndex implements Action {
    readonly type = UPDATEPAGESIZEANDINDEX;
    constructor(public payload:{pageSize: number, currentIndex: number}) {}
}

export type BlogActions = SetEditMode | RefreshBlog | UpdatePageSizeandIndex |SetRecordCount;