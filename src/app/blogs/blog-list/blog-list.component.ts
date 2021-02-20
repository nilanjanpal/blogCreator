import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Blog } from 'src/app/model/blog.model';
import { BlogService } from 'src/app/services/blog.service';
import { BlogState } from 'src/app/store/reducers/blog.reducer';
import * as appReducer from './../../store/reducers/app.reducer';
import * as BlogActions from './../../store/actions/blog.action';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit, OnDestroy {

  blogs: Blog[] = [];
  blogSubscription: Subscription;
  countSubscription: Subscription;
  pageSize: number = 2;
  pagesizeOptions: number[] = [1, 2, 5];
  length: number = 0;
  currentPage: number = 0;
  authStatus: boolean = false;
  userId: string = '';

  constructor(private blogService: BlogService,
              private store: Store<BlogState>,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.blogService.refreshBlogState().then(
      () => {
        this.blogSubscription = this.store.select(appReducer.getBlogs)
        .subscribe(
          blogs => {this.blogs = blogs;}
        );
        this.countSubscription = this.store.select(appReducer.getRecordCount)
        .subscribe(
          count => this.length = count
        );
      }
    );
    this.userId = this.authService.getUserId();
    this.authStatus = this.authService.getAuthStatus();
    this.authService.getAuthStatusEvent().subscribe(
      authData => {
        this.authStatus = authData.authStatus;
        this.userId = authData.userId;
      }
    );
  }

  ngOnDestroy(): void {
    this.blogSubscription.unsubscribe();
    this.countSubscription.unsubscribe();
  }

  onEdit(id: string) {
    this.store.dispatch(new BlogActions.SetEditMode(true));
    this.router.navigate(['/edit',id]);
  }

  onDelete(id: string) {
    this.blogService.deleteBlog(id);
  }

  onPageChange(event) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.store.dispatch(new BlogActions.UpdatePageSizeandIndex({pageSize: this.pageSize, currentIndex: this.currentPage}));
    this.blogService.refreshBlogState();
  }

}
