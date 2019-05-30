import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'forum-grid',
  templateUrl: './forum-grid.component.html',
  styleUrls: ['./forum-grid.component.scss']
})
export class ForumGridComponent {
  @Input('params') params: any[];
  @Output() onClickItem = new EventEmitter();

  constructor(private router: Router, private route: ActivatedRoute) {}

  public onGoToProfile(authorId) {
    //TODO
  }
}
