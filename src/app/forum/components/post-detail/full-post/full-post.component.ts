import { Component, Input } from '@angular/core';

@Component({
  selector: 'full-post',
  templateUrl: './full-post.component.html',
  styleUrls: ['./full-post.component.scss']
})
export class FullPostComponent {
  @Input('params') params: any;
}
