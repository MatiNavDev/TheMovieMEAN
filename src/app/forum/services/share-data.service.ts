import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  private postSource = new BehaviorSubject({});
  postRelatedToComment = this.postSource.asObservable();
  private commentLastPageSource = new BehaviorSubject(1);
  commentLastPage = this.commentLastPageSource.asObservable();
  private postLastPageSource = new BehaviorSubject(1);
  postLastPage = this.postLastPageSource.asObservable();

  getPostRelatedToComment() {
    return this.postSource;
  }

  getCommentLastPage() {
    return this.commentLastPage;
  }

  getPostLastPage() {
    return this.commentLastPage;
  }

  setPostRelatedToComment(postRelatedToComment: any) {
    this.postSource.next(postRelatedToComment);
  }

  setCommentLastPage(commentLastPage: any) {
    this.commentLastPageSource.next(commentLastPage);
  }

  setPostLastPage(postLastPage: any) {
    this.postLastPageSource.next(postLastPage);
  }
}
