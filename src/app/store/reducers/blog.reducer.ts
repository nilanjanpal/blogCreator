import { Blog } from 'src/app/model/blog.model';
import * as BlogActions from './../actions/blog.action';

export interface BlogState {
    blog: Blog[];
    isEditMode: boolean;
    recordCount: number;
    pageSize: number;
    currentPageIndex: number;
}

const initialState: BlogState = {
    blog: null,
    isEditMode: false,
    recordCount: 0,
    currentPageIndex: 0,
    pageSize: 2
};

export function BlogReducer(state = initialState, action: BlogActions.BlogActions) {
    switch(action.type) {
        case BlogActions.SET_EDIT_MODE:
            return {
                ... state,
                isEditMode: action.payload
            };
        case BlogActions.SET_RECORDCOUNT:
            return {
                ... state,
                recordCount: action.payload
            };
        case BlogActions.REFRESH_BLOG:
            return {
                ... state,
                blog: [...action.payload]
            };
        case BlogActions.UPDATEPAGESIZEANDINDEX:
            return {
                ... state,
                currentPageIndex: action.payload.currentIndex,
                pageSize: action.payload.pageSize
            };
        default:
            return state;
    }
}