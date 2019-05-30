import { LoadingService } from 'src/app/common/services/loading.service';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { PaginatorService } from '../common/services/paginator.service';
import { trigger } from '@angular/animations';
import { fadeIn, fadeOut } from '../../utils/animations/fade-animations';

@Component({
  animations: [trigger('fadeOut', fadeOut()), trigger('fadeIn', fadeIn())],
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {
  private urlFromPosts = environment.url + 'posts';
  private posts: any = {};
  private lastPage: number;
  public forumHeaderParams: any;
  public postsToShow: any[] = [];
  public addButtonParams: any;
  public actualPage: number = 0;
  public postPages: number[];
  public pagesRange: number[];
  public paginatorParams: any;
  public ghosts: any[] = new Array(environment.pageSize);

  constructor(
    private paginatorSrvc: PaginatorService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingSrvc: LoadingService
  ) {}

  ngOnInit() {
    this.actualPage = 1;

    this.forumHeaderParams = {
      title: 'titulo hardcodeado',
      lastPostUpdated: 'Tambien hardcodeado'
    };

    this.addButtonParams = { label: 'Nuevo Tema' };

    this.onChangePostPage(1);
  }

  /**
   * Maneja llamar al paginator cada vez que hay un cambio de pagina, el cual maneja la logica de la misma
   * @param pageNumber
   */
  public onChangePostPage(pageNumber) {
    this.ghosts = new Array(environment.pageSize);
    this.postsToShow = [];
    this.paginatorSrvc
      .handlePageChanged(this.posts, pageNumber, this.urlFromPosts)
      .subscribe(data => {
        this.ghosts = [];
        this.loadingSrvc.hide();
        const paginatorResponse = data.result;
        this.posts = paginatorResponse.items;
        if (paginatorResponse.lastPage) this.lastPage = paginatorResponse.lastPage;
        this.actualPage = pageNumber;
        this.postsToShow = this.posts[this.actualPage] || [];
        this.paginatorParams = {
          actualPage: this.actualPage,
          elements: this.posts,
          lastPage: this.lastPage
        };
      });
  }

  /**
   * Navega hacia el aniadir post
   */
  public onAddButtonClick() {
    this.router.navigate(['anadir-post'], {
      relativeTo: this.route
    });
  }
}
