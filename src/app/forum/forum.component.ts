import { Route, ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { PaginatorService } from '../common/services/paginator.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {
  private urlFromPosts = environment.url + 'posts';
  private pageNumber = 0;
  private posts: any = {};
  private lastPage: number;
  public forumHeaderParams: any;
  public postsToShow: any[];
  public addButtonParams: any;
  public actualPage: number = 0;
  public postPages: number[];
  public pagesRange: number[];
  public paginatorParams: any;

  constructor(
    private paginatorSrvc: PaginatorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.actualPage = 1;

    this.forumHeaderParams = {
      title: 'titulo hardcodeado',
      lastPostUpdated: 'Tambien hardcodeado'
    };

    this.addButtonParams = { label: 'aniadir button, hardcodeado' };

    this.onChangePostPage(1);
  }

  /**
   * Maneja llamar al paginator cada vez que hay un cambio de pagina, el cual maneja la logica de la misma
   * @param pageNumber
   */
  public async onChangePostPage(pageNumber) {
    const paginatorResponse = await this.paginatorSrvc.handlePageChanged(
      this.posts,
      this.pageNumber,
      this.urlFromPosts
    );
    this.posts = paginatorResponse.posts;
    this.lastPage = paginatorResponse.lastPage;
    this.actualPage = pageNumber;
    this.postsToShow = this.posts[this.actualPage];
    this.paginatorParams = {
      actualPage: this.actualPage,
      elements: this.posts,
      lastPage: this.lastPage
    };
  }

  /**
   * Navega hacia el aniadir post
   */
  public onAddButtonClick() {
    this.router.navigate(['../home/foro/anadir-post/', { relativeTo: this.route }]);
  }
}
