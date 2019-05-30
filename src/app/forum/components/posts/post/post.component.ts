import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  @Input('params') params: any[];
  constructor(private router: Router, private route: ActivatedRoute) {}

  /**
   * Navega hacia el detalle de un post
   * @param id
   */
  public onGoToPostDetail(postId) {
    this.router.navigate([`../${postId}`], { relativeTo: this.route });
  }

  public onGoToProfile(authorId) {
    //TODO
  }
}
