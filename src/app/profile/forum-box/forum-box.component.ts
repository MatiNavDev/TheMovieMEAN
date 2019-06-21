import { ForumCommonService } from './../../common/services/forum-common.service';
import { PaginatorService } from './../../common/services/paginator.service';
import { LoadingService } from './../../common/services/loading.service';
import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { trigger } from '@angular/animations';
import { fadeIn, fadeOut } from '../../../utils/animations/fade-animations';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  animations: [trigger('fadeOut', fadeOut()), trigger('fadeIn', fadeIn())],
  selector: 'forum-box',
  templateUrl: './forum-box.component.html',
  styleUrls: ['./forum-box.component.scss']
})
export class ForumBoxComponent implements OnInit {
  @Input('params') params;
  private urlFromitems: string;
  private items: any = {
    posts: {},
    comments: {}
  };
  private lastPage: number;
  public actualPage: number = 0;
  public ghosts = [];
  public itemsToShow = [];
  public paginatorParams: any;
  public itemsType: 'comments' | 'posts' = 'posts';

  constructor(
    private loadingSrvc: LoadingService,
    private paginatorSrvc: PaginatorService,
    private forumCommonSrvc: ForumCommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * TODO: fijarse que funcione bien con varias paginas
   */

  ngOnInit() {
    debugger;
    let commentPage = Number(this.route.snapshot.queryParams.page);
    if (commentPage) {
      this.itemsType = 'comments';
    } else {
      commentPage = 1;
    }

    this.urlFromitems = `${environment.url}/${this.itemsType}/user/`;

    this.onChangeItemPage(commentPage);
  }

  /**
   * Maneja llamar al paginator cada vez que hay un cambio de pagina, el cual maneja la logica de la misma.
   * Tener en cuenta que tanto los posts como los comentarios, va a buscar los pertenecientes al usuario, no los generales
   * como funciona en la seccion foro
   * @param pageNumber
   */
  public onChangeItemPage(pageNumber) {
    this.ghosts = new Array(environment.pageSize);
    this.itemsToShow = [];
    this.paginatorSrvc
      .handlePageChanged(this.items[this.itemsType], pageNumber, this.urlFromitems)
      .subscribe(data => {
        this.loadingSrvc.hide();
        this.ghosts = [];
        const paginatorResponse = data.result;
        this.items[this.itemsType] = paginatorResponse.items;
        if (paginatorResponse.lastPage) this.lastPage = paginatorResponse.lastPage;
        this.actualPage = pageNumber;
        this.itemsToShow = this.items[this.itemsType][this.actualPage] || [];
        this.paginatorParams = {
          actualPage: this.actualPage,
          elements: this.items[this.itemsType],
          lastPage: this.lastPage
        };
      });
  }

  /**
   *
   * @param type
   */
  public onSetForumGridType(type: 'comments' | 'posts') {
    this.itemsType = type;
    this.urlFromitems = environment.url + type + '/user/';
    this.onChangeItemPage(1);
  }

  //TODO
  public onGoToItemDetail(itemId) {
    console.log(itemId);
  }

  public onEditOrDeleteItem(params) {
    switch (params.type) {
      case 'edit':
        this.router.navigate([`../../foro/${params.postId}/edit-comment/${params.commentId}`], {
          relativeTo: this.route,
          queryParams: {
            page: this.actualPage
          }
        });
        break;
      case 'delete':
        this.forumCommonSrvc.deletePostOrComment(params.id, this.itemsType).subscribe(data => {
          this.items[this.itemsType] = [];
          this.onChangeItemPage(1);
        });
        break;
      default:
        break;
    }
  }
}
