import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'forum-grid',
  templateUrl: './forum-grid.component.html',
  styleUrls: ['./forum-grid.component.scss']
})
export class ForumGridComponent {
  @Input('items') items: any[];
  @Input('type') type: string;
  @Output() onClickItem = new EventEmitter();
  @Output() onEditOrDeleteItem = new EventEmitter();

  constructor(private router: Router, private route: ActivatedRoute) {}
}
