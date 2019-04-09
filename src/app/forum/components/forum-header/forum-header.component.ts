import { Component, Input } from '@angular/core';

@Component({
  selector: 'forum-header',
  templateUrl: './forum-header.component.html',
  styleUrls: ['./forum-header.component.scss']
})
export class ForumHeaderComponent {
  @Input('params') params: any;
  constructor() {}
}
