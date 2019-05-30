import { Component, Input } from '@angular/core';

@Component({
  selector: 'posts-ghosts',
  templateUrl: './posts-ghosts.component.html',
  styleUrls: ['./posts-ghosts.component.scss']
})
export class PostsGhostsComponent {
  @Input('ghosts') ghosts: any[];
}
