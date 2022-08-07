import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from './post.model';
import { PostsServiceService } from './posts-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching: boolean = false;
  url =
    'https://ng-http-example-5bd9c-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json';
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private postsServiceService: PostsServiceService
  ) {}

  ngOnInit() {
    this.postsServiceService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });
  }
  ngOnDestroy(): void {
    this.postsServiceService.error.unsubscribe();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postsServiceService.createAndStorPost(postData.title,postData.content);
  }

  onFetchPosts() {
    this.isFetching = true;
    // Send Http request
    this.postsServiceService.fetchPosts().subscribe({
      next: (posts: any) => {
        this.loadedPosts = posts;
        this.isFetching = false;
      },
      error: (errorHTTP) => {
        console.log(errorHTTP);
        this.error = errorHTTP.message;
        this.isFetching = false;
      },
    });
  }

  onClearPosts() {
    this.isFetching = true;
    this.postsServiceService.clearPosts().subscribe(() => {
      this.isFetching = false;
      this.loadedPosts = [];
    });
    // this.isFetching = true
    // this.postsServiceService.clearPosts()
    // .subscribe((responseData)=>{
    //   this.isFetching = false
    //   console.log("responseData : ",responseData)
    //   this.loadedPosts = []
    // })
  }
  onHandleError() {
    this.error = null;
    this.isFetching = false;
  }
}
