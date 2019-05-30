import { Component, Input } from '@angular/core';

@Component({
  selector: 'comments-ghosts',
  templateUrl: './comments-ghosts.component.html',
  styleUrls: ['./comments-ghosts.component.scss']
})
export class CommentsGhostsComponent {
  @Input('ghosts') ghosts: any[];
}
