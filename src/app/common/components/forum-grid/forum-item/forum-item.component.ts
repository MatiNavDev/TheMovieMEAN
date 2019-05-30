import { Component, Input } from '@angular/core';

@Component({
  selector: 'forum-item',
  templateUrl: './forum-item.component.html',
  styleUrls: ['./forum-item.component.scss']
})
export class ForumItemComponent {
  @Input('params') params;
}
