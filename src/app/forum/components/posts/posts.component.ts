import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnChanges {
  @Input('posts') posts;
  constructor() {}

  ngOnChanges() {
    console.log(this.posts);
  }
}
