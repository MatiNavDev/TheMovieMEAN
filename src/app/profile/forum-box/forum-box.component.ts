import { ForumCommonService } from './../../common/services/forum-common.service';
import { PaginatorService } from './../../common/services/paginator.service';
import { LoadingService } from './../../common/services/loading.service';
import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { trigger } from '@angular/animations';
import { fadeIn, fadeOut } from '../../../utils/animations/fade-animations';

@Component({
  animations: [trigger('fadeOut', fadeOut()), trigger('fadeIn', fadeIn())],
  selector: 'forum-box',
  templateUrl: './forum-box.component.html',
  styleUrls: ['./forum-box.component.scss']
})
export class ForumBoxComponent implements OnInit {
  @Input('params') params;
  private urlFromitems = environment.url + 'posts/user/';
  private items: any = {
    posts: {},
    comments: {}
  };
  private lastPage: number;
  public actualPage: number = 0;
  public ghosts = [];
  public itemsToShow = [];
  public paginatorParams: any;
  public itemType = 'posts';

  constructor(
    private loadingSrvc: LoadingService,
    private paginatorSrvc: PaginatorService,
    private forumCommonSrvc: ForumCommonService
  ) {}

  ngOnInit() {
    this.onChangeItemPage(1);
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
      .handlePageChanged(this.items[this.itemType], pageNumber, this.urlFromitems)
      .subscribe(data => {
        this.loadingSrvc.hide();
        this.ghosts = [];
        const paginatorResponse = data.result;
        this.items[this.itemType] = paginatorResponse.items;
        if (paginatorResponse.lastPage) this.lastPage = paginatorResponse.lastPage;
        this.actualPage = pageNumber;
        this.itemsToShow = this.items[this.itemType][this.actualPage] || [];
        this.paginatorParams = {
          actualPage: this.actualPage,
          elements: this.items[this.itemType],
          lastPage: this.lastPage
        };
      });
  }

  /**
   *
   * @param type
   */
  public onSetForumGridType(type: string) {
    this.itemType = type;
    this.urlFromitems = environment.url + type + '/user/';
    this.onChangeItemPage(1);
  }

  public onGoToItemDetail(itemId) {
    console.log(itemId);
  }

  public onEditOrDeleteItem(params) {
    switch (params.type) {
      case 'edit':
        this.editItem(params.id);
        break;
      case 'delete':
        this.forumCommonSrvc.deletePostOrComment(params.id, this.itemType).subscribe(data => {
          this.items[this.itemType] = [];
          this.onChangeItemPage(1);
        });
        break;
      default:
        break;
    }
  }
}

/**
 * TODO: hacer que los comentarios y los posts sean del usuario en cuestion. Una vez que este eso, fijarse de armar la estructura
 * del cuadrado, para poder agregarle el boton editar/eliminar (fijarse como hacerlo), y desp fijarse que se haya borrado correctamente
 * el post o el comentario.
 */
