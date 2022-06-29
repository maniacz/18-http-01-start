import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostService {
    error = new Subject<string>();

		constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
      const postData: Post = { title: title, content: content };
      this.http
        .post<{ name: string }>(
          'https://ng-complete-guide-b62e2-default-rtdb.europe-west1.firebasedatabase.app/posts.json', 
          postData
        )
        .subscribe(
          responseData => {
            console.log(responseData);
          },
          error => {
            this.error.next(error.message);
          }
        );
    }

    fetchPosts() {
      let searchParams = new HttpParams();
      searchParams = searchParams.append('print', 'pretty');
      searchParams = searchParams.append('custom', 'key');

			return this.http
      .get<{ [key: string]: Post }>(
        'https://ng-complete-guide-b62e2-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          // params: new HttpParams().set('print', 'pretty')
          params: searchParams
        }
      )
      .pipe(
        map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError(errorRes => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
    }

		deletePosts() {
			return this.http.delete('https://ng-complete-guide-b62e2-default-rtdb.europe-west1.firebasedatabase.app/posts.json');
		}
}