import { ShareDataService } from './../../services/share-data.service';
import { PaginatorService } from './../../../common/services/paginator.service';
import { ForumService } from './../../services/forum.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { LoadingService } from 'src/app/common/services/loading.service';
import { environment } from 'src/environments/environment';
import { trigger } from '@angular/animations';
import { fadeIn, fadeOut } from '../../../../utils/animations/fade-animations';
import { takeUntil } from 'rxjs/operators';

@Component({
  animations: [trigger('fadeOut', fadeOut()), trigger('fadeIn', fadeIn())],
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  private id: string;
  private urlFromComments;
  private comments: any = {};
  private lastPage: number;
  private fromNew: string;
  private destroy$ = new Subject();
  public commentsToShow: any[] = [];
  public addButtonParams: any;
  public actualPage: number = 0;
  public pagesRange: number[];
  public paginatorParams: any;
  public ghosts: any[] = new Array(5);
  public latestPosts: any[] = [];
  public fullPostParams = {};

  constructor(
    private route: ActivatedRoute,
    private forumSrvc: ForumService,
    private paginatorSrvc: PaginatorService,
    private router: Router,
    private shareForumSrvc: ShareDataService
  ) {}

  ngOnInit() {
    /**
     * TODO-SIX: fijarse de setear el titulo etc del post cuando va a agregar un nuevo comentario
     */

    /**
     * TODO-FIVE: Fijarse de actualizar solo los comentarios cuando vuelve del anadir un comentario. Fijarse que seguramente
     * implique guardar cosas en el localStorage (o ver de que manera hacerlo)
     */

    /**
     * TODO-Cuarto: Fijarse con el nuevo enfoque de la animacion el tema del error. Es decir cuando ocurre un error, entonces
     * que pasa ?
     */

    /**
     * TODO-Tercero: desarrollar y verificar el poder editar un comment y eliminar un comment.
     * Eliminar un post (con los comentarios asociados), y editar un post. Fijarse si hay que desarrollar el perfil
     * para editar y eliminar; en ese caso, dejarlo como TODO y fijarse de poder ir agregando comments y posts, para poder probar el
     * TODO 1) y el 4). Por ultimo acordarse del css y de como agregarle toodos los estilos por parte de un usuario, a un coment o post
     */

    /**
     * TODO-Primero: para lo ultimo
     * - (FRONT) verificar que ande bien el getFullPost.
     * (por ahora anda bien, desp cuando haga el agregar comentarios, le agrego 100 para ver que funcione bien, varias paginas y eso)
     */
    this.id = this.route.snapshot.params.id;
    this.fromNew = this.route.snapshot.queryParams.fromNew;
    this.urlFromComments = environment.url + `comments/${this.id}`;
    this.shareForumSrvc
      .getCommentLastPage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lastPage => (this.lastPage = lastPage));

    this.addButtonParams = {
      label: 'Responder / Comentar'
    };
    this.getInitialData();
  }

  /**
   * Obtiene la data inicial compuesta por el post con todos sus datos, y los comentarios asociados.
   * Se tiene que manejar la paginacion en los comentarios
   */
  private getInitialData() {
    this.onChangeCommentPage(1);

    if (!this.fromNew) {
      this.forumSrvc.getFullPost(this.id).subscribe(fullPost => (this.fullPostParams = fullPost));
      this.getLastestPosts(3);
      this.getMostCommentedPosts(3);
    }
  }

  /**
   * Maneja el obtener los comentarios del servidor, a traves del paginador, de manera exitosa
   * @param comments
   */
  private handleGetComments(comments) {
    this.ghosts = [];
    const paginatorResponse = comments.result;
    this.comments = paginatorResponse.items || {};
    if (paginatorResponse.lastPage) {
      this.lastPage = paginatorResponse.lastPage;
      this.shareForumSrvc.setCommentLastPage(this.lastPage);
    }
    this.commentsToShow = this.comments[this.actualPage] ? this.comments[this.actualPage] : [];
    this.paginatorParams = {
      actualPage: this.actualPage,
      elements: this.comments,
      lastPage: this.lastPage
    };
  }

  /**
   * Obtiene los ultimos posts
   * @param amount
   */
  private getLastestPosts(amount: number) {
    this.forumSrvc.getLastestPosts(amount).subscribe(posts => (this.latestPosts = posts));
  }

  /**
   * Obtiene los posts mas comentados
   * @param amount
   */
  private getMostCommentedPosts(amount: number) {
    this.forumSrvc.getMostCommentedPosts(amount).subscribe(posts => (this.latestPosts = posts));
  }

  /**
   * Maneja llamar al paginator cada vez que hay un cambio de pagina, el cual maneja la logica de la misma
   * @param pageNumber
   */
  public onChangeCommentPage(pageNumber) {
    this.actualPage = this.fromNew ? this.lastPage : pageNumber;
    this.paginatorSrvc
      .handlePageChanged(this.comments, pageNumber, this.urlFromComments)
      .subscribe(comments => this.handleGetComments(comments));
  }

  /**
   * Navega hacia agregar un nuevo comentario
   */
  public onGoToNewComment() {
    this.shareForumSrvc.setPostRelatedToComment(this.fullPostParams);
    this.router.navigate(['new-comment'], {
      relativeTo: this.route,
      queryParams: {
        type: 'comments',
        postId: this.id
      }
    });
  }
}
