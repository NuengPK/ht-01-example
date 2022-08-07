import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, Subject, tap } from 'rxjs';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsServiceService {
  loadedPosts:Post[] = [];
  isFetching:boolean = false
  error = new Subject<string>();
  url ="https://ng-http-example-5bd9c-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json"
  constructor(private http:HttpClient) {}
  createAndStorPost(title:string, content:string){
    const postData: Post = {title:title, content:content}
    this.http.post<{ name:string }>(this.url, postData,{
      observe: 'response'
    })
    return this.http.post(this.url,postData)
      .subscribe( {
      next: (responseData)=>{
        console.log("responseData : ",responseData)
      },
      error: (responseError)=>{
        this.error.next(responseError.message);
      }
    });
  }
  fetchPosts(){
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print','pretty');
    searchParams = searchParams.append('custom','key');
    return this.http.get<{[key: string]: Post }>(this.url, {
      headers: new HttpHeaders({'Custom-Headers' : 'Hello'}),
      params: searchParams//params:new HttpParams().set('print','pretty')
    })
    .pipe(
      map((responseData)=>{
        const postsArray:Post[] = [];
        console.log(responseData);
        let count = 0;
        for (let key in responseData) {
          if(responseData.hasOwnProperty(key)){
            if (responseData[key].title =="z"){
              throw postsArray;//
            } else {
              postsArray.push({...responseData[key], id:key});
              count++;
            }
            console.log("responseData[",count,"].title : ",responseData[key].title);
          }
        }
        return postsArray
      }),
      catchError(postsArray => {
        console.log("catchError in Map : ");
        throw of(postsArray);
      })
    )
    // .subscribe(posts=>{
    //   this.isFetching = false
    //   console.log(posts)
    //   this.loadedPosts = posts;
    // })
  }
  clearPosts() {
    return this.http.delete(this.url,
      {
        observe: 'events',
        responseType: 'text'
      }).pipe(
        tap(event =>{
          if(event.type == HttpEventType.Sent){
            console.log(HttpEventType.Sent)
          }
          if(event.type == HttpEventType.Response){
            console.log(event.body)
          }
        })
      );
  }
}
