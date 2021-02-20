import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { BlogService } from 'src/app/services/blog.service';
import { BlogState } from 'src/app/store/reducers/blog.reducer';
import { Blog } from '../../model/blog.model';
import * as appReducer from './../../store/reducers/app.reducer';

@Component({
  selector: 'app-blog-creator',
  templateUrl: './blog-creator.component.html',
  styleUrls: ['./blog-creator.component.css']
})
export class BlogCreatorComponent implements OnInit, OnDestroy {

  newBlogForm: FormGroup;
  fileName: string;
  imagePreview: string;

  constructor(public blogService: BlogService,
              public router: Router,
              public store: Store<BlogState>,
              public route: ActivatedRoute) { }

  blog: Blog = {title: '', content: '', id: '', imagePath: '', userId: null};
  blogId: string;
  isEditMode: boolean = false;
  subscription: Subscription[] = [];
  pageSize: number;

  ngOnInit(): void {
    this.newBlogForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      content: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required])
    });

    this.route.paramMap
    .subscribe(
      params => {
        this.blogId = params.get('id');
        this.subscription.push(this.store.select(appReducer.getisEditMode)
        .subscribe(
          (isEditMode) => {
            if(isEditMode) {
              this.isEditMode = true;
              this.store.select(appReducer.getPageSize)
              .pipe(take(1))
              .subscribe((pagesize) => {
                this.pageSize = pagesize;
                this.store.select(appReducer.getCurrentPageIndex)
                .subscribe(
                  (currentIndex) => {
                    this.blogService.refreshBlogState().then(
                      () => {
                        this.subscription.push(this.store.select(appReducer.getBlogs)
                        .subscribe(
                          blogs => {
                            blogs.map(
                              (blog) => blog.id === this.blogId ? this.blog = {...blog} : null
                            );
                            this.imagePreview = this.blog.imagePath as string;
                            this.newBlogForm.setValue({title: this.blog.title, 
                                                       content: this.blog.content,
                                                       image: this.blog.imagePath});
                          }
                        ));
                      }
                    );
                  }
                ); 
              })   
            }
          }
        ));
      }
    );
  }

  ngOnDestroy() {
    this.subscription.map(subscription => subscription.unsubscribe());
  }

  onSubmit() {
    if(this.isEditMode) {
      const newBlog: Blog = {id: this.blog.id, 
                             title: this.newBlogForm.get('title').dirty ? this.newBlogForm.value.title : this.blog.title, 
                             content: this.newBlogForm.get('content').dirty ? this.newBlogForm.value.content: this.blog.content, 
                             imagePath: this.newBlogForm.get('image') ? this.newBlogForm.value.image : null,
                            userId: null};
      this.blogService.updateBlog(newBlog);
    }
    else {
      const newBlog: Blog = {id: '', title: this.newBlogForm.value.title, content: this.newBlogForm.value.content, imagePath: null, userId: null};
      this.blogService.addBlog(newBlog, this.newBlogForm.value.image);
    }
    this.newBlogForm.reset();
    this.router.navigate(['/']);
  }

  onClear() {
    this.newBlogForm.reset();
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.fileName = file.name;
    this.newBlogForm.patchValue({image: file});
    this.newBlogForm.updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
    }
    fileReader.readAsDataURL(file);
  }

}
