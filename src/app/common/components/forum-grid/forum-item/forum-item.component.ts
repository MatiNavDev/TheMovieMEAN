import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'forum-item',
  templateUrl: './forum-item.component.html',
  styleUrls: ['./forum-item.component.scss']
})
export class ForumItemComponent {
  @Input('params') params;
  @Output() onItemDetail = new EventEmitter();
  @Output() onEditOrDeleteItem = new EventEmitter();

  public onGoToProfile(authorId) {
    console.log(authorId);
  }
}
