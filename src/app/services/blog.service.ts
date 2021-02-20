import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blog } from './../model/blog.model'
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as BlogActions from './../store/actions/blog.action';
import * as appReducer from './../store/reducers/app.reducer';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    constructor(private http: HttpClient,
                private store: Store,
                private authService: AuthService) {}

    addBlog(newBlog: Blog, image: File) {
        const blogData = new FormData();
        blogData.append('title', newBlog.title);
        blogData.append('content', newBlog.content);
        blogData.append('image', image);
        this.http
        .post<{message: string, blog: {title: string, content: string, _id: string, imagePath: string}}>(
            environment.apiUrl + 'blogs', blogData)
        .subscribe(
            (data) => {
                newBlog.id = data.blog._id;
                newBlog.imagePath = data.blog.imagePath;
                // this.store.dispatch(new BlogActions.AddBlog(newBlog));
                this.refreshBlogState().then(
                    () => {}
                );
            }
        );
    }

    private getBlogs(currentPage: number, pageSize: number) {
        return new Promise<void>(
            (resolve) => {
                const queryParams = `pageSize=${pageSize}&currentPage=${currentPage}`;
                this.http.get<{message: string, blogs: {title: string, content: string, _id: string, imagePath: string, userId: string}[], totalCount: number}>
                (environment.apiUrl + 'blogs?'+queryParams)
        .pipe(
            map((data) => {
                return {
                    totalCount: data.totalCount, 
                    blogs: data.blogs.map(postData => {
                    return {
                        ... postData,
                        id: postData._id
                    }
                })};
            })
        )
        .subscribe(
            (data) => {
                const initBlog: Blog[] = [];
                data.blogs.map(
                    blog => {
                        initBlog.push({
                            title: blog.title,
                            content: blog.content,
                            id: blog.id,
                            imagePath: blog.imagePath,
                            userId: blog.userId
                        })
                    }
                );
                this.store.dispatch(new BlogActions.RefreshBlog([... initBlog]));
                this.store.dispatch(new BlogActions.SetRecordCount(data.totalCount));
                this.store.dispatch(new BlogActions.UpdatePageSizeandIndex({pageSize:pageSize, currentIndex:currentPage}));
                resolve();
            }
        );
            }
        );
    }

    updateBlog(blog: Blog) {
        const postData = new FormData();
        postData.append('title', blog.title);
        postData.append('content', blog.content);
        postData.append('id', blog.id)
        if(typeof(blog.imagePath) === 'object') {
            postData.append('image', blog.imagePath);
        }
        else {
            postData.append('image', null);
        }
        this.http.put(environment.apiUrl + 'blogs',postData)
        .subscribe(
            (data: {message: string, imagePath: string}) => {
                if(data.imagePath !== null) {
                    blog.imagePath = data.imagePath;
                }
                this.refreshBlogState().then(
                    () => {}
                );
            }
        );
    }

    deleteBlog(id: string) {
        this.http.delete(environment.apiUrl + 'blogs/'+id)
        .subscribe(
            (data) => {
                this.refreshBlogState().then(
                    () => {}
                );
            }
        );
    }

    refreshBlogState() {
        return new Promise<void>(
            (resolve) => {
                let currentPageIndex;
                this.store.select(appReducer.getCurrentPageIndex)
                .pipe(take(1))
                .subscribe(
                    currentIndex => {
                        currentPageIndex = currentIndex;
                        this.store.select(appReducer.getPageSize)
                        .pipe(take(1))
                        .subscribe(
                            pageSize => {
                                this.getBlogs(currentPageIndex, pageSize);
                            }
                        );
                    }
                );
                resolve();
            }
        );
    }
}